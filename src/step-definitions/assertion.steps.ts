import { Then } from '@cucumber/cucumber';
import { ApiWorld } from '../support/world';
import { expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import Ajv from 'ajv';

/**
 * Verifies the response status code matches the expected value
 *
 * @example
 * Then the response status code should be 200
 */
Then(
  'the response status code should be {int}',
  function (this: ApiWorld, statusCode: number) {
    expect(this.response?.status()).toBe(statusCode);
  }
);

/**
 * Verifies the response body matches a JSON schema from a file
 *
 * @example
 * Then the response should match schema from file "schemas/user.json"
 */
Then(
  'the response should match schema from file {string}',
  function (this: ApiWorld, schemaPath: string) {
    const absolutePath = path.resolve(process.cwd(), `src/${schemaPath}`);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    const schemaString = fs.readFileSync(absolutePath, 'utf-8');
    const schema = JSON.parse(schemaString);
    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    const valid = validate(this.responseBody);

    if (!valid) {
      throw new Error(
        `Schema validation failed: ${JSON.stringify(validate.errors)}`
      );
    }
  }
);

/**
 * Verifies the response body exactly matches the expected JSON
 *
 * @example
 * Then the response body should exactly match:
 * """
 * {
 *   "id": 1,
 *   "name": "John"
 * }
 * """
 */
Then(
  'the response body should exactly match:',
  function (this: ApiWorld, expectedJson: string) {
    const expected = JSON.parse(expectedJson);
    expect(this.responseBody).toEqual(expected);
  }
);

/**
 * Verifies specific fields in the response match expected values
 *
 * @example
 * Then the response body should contain fields:
 * | field    | value         |
 * | name     | John Doe      |
 * | isActive | true          |
 */
Then(
  'the response body should contain fields:',
  function (this: ApiWorld, dataTable) {
    const fields = dataTable.hashes();

    for (const { field, value } of fields) {
      const fieldParts = field.split('.');
      let actualValue = this.responseBody;

      // Traverse nested object paths
      for (const part of fieldParts) {
        actualValue = actualValue[part];
        expect(actualValue).not.toBeUndefined();
      }
      // Handle different value types
      if (value === 'true') {
        expect(actualValue).toBe(true);
      } else if (value === 'false') {
        expect(actualValue).toBe(false);
      } else if (!isNaN(Number(value))) {
        expect(actualValue).toBe(Number(value));
      } else {
        expect(actualValue).toBe(value);
      }
    }
  }
);

/**
 * Verifies the response body partially matches the expected JSON
 *
 * @example
 * Then the response body should partially match:
 * """
 * {
 *   "id": 1,
 *   "isDeleted": true
 * }
 * """
 */
Then(
  'the response body should partially match:',
  function (this: ApiWorld, expectedJson: string) {
    const expected = JSON.parse(expectedJson);

    for (const [key, value] of Object.entries(expected)) {
      expect(this.responseBody).toHaveProperty(key);
      expect(this.responseBody[key]).toEqual(value);
    }
  }
);

/**
 * Stores a field from the response for later use
 *
 * @example
 * And I store the response field "accessToken" as "authToken"
 */
Then(
  'I store the response field {string} as {string}',
  function (this: ApiWorld, field: string, variableName: string) {
    expect(this.responseBody).toHaveProperty(field);
    this.apiContext.storeValue(variableName, this.responseBody[field]);
  }
);
