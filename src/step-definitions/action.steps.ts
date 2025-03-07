import { When } from '@cucumber/cucumber';
import { ApiWorld } from '../support/world';
import { HttpMethod } from '../types';
import { replaceVariables, sendRequest } from '../utils/request-helper';

/**
 * Sends an HTTP request with the specified method and body to the given endpoint.
 * Supports dynamic values from stash using {} syntax in both endpoint and body.
 *
 * @example
 * When I send a POST request to "/users" with body:
 * """
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com"
 * }
 * """
 */
When(
  'I send a {word} request to {string} with body:',
  async function (
    this: ApiWorld,
    method: HttpMethod,
    endpoint: string,
    body: string
  ) {
    const resolvedEndpoint = replaceVariables(endpoint);
    const resolvedBody = replaceVariables(body);

    this.response = await sendRequest({
      method,
      endpoint: resolvedEndpoint,
      body: resolvedBody,
    });

    if (this.response) {
      try {
        this.responseBody = await this.response.json();
      } catch (e) {
        console.warn('Could not parse response body as JSON');
      }
    }
  }
);

/**
 * Sends an HTTP request with the specified method to the given endpoint without a body.
 * Supports dynamic values from stash using {} syntax in the endpoint.
 *
 * @example
 * When I send a GET request to "/users/{userId}"
 * When I send a DELETE request to "/users/{userId}"
 */
When(
  'I send a {word} request to {string}',
  async function (this: ApiWorld, method: HttpMethod, endpoint: string) {
    const resolvedEndpoint = replaceVariables(endpoint);

    this.response = await sendRequest({
      method,
      endpoint: resolvedEndpoint,
    });

    if (this.response) {
      try {
        this.responseBody = await this.response.json();
      } catch (e) {
        console.warn('Could not parse response body as JSON');
      }
    }
  }
);
