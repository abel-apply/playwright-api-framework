import { Given } from '@cucumber/cucumber';
import { ApiWorld } from '../support/world';

/**
 * Sets the base URL for subsequent API requests
 *
 * @example
 * Given I set base URL to "https://api.example.com"
 */
Given('I set base URL to {string}', function (this: ApiWorld, url: string) {
  this.apiContext.setBaseUrl(url);
});

/**
 * Performs authentication using username and password, stores the auth token,
 * and sets up default headers for subsequent requests
 *
 * @example
 * Given I am logged in as "john.doe" with password "secretpass"
 */
Given(
  'I am logged in as {string} with password {string}',
  async function (this: ApiWorld, username: string, password: string) {
    // Set base URL if not already set
    if (!this.apiContext.getBaseUrl()) {
      this.apiContext.setBaseUrl(this.parameters.baseUrl);
    }

    this.response = await this.apiContext.post('/auth/login', {
      username,
      password,
    });

    if (this.response) {
      const responseBody = await this.response.json();

      if (responseBody && responseBody.accessToken) {
        // Store the token
        this.apiContext.storeValue('authToken', responseBody.accessToken);

        // Re-initialize with auth headers
        await this.apiContext.initialize();
      }
    }
  }
);

/**
 * Sets the bearer token for authentication in the default headers.
 * Token can be a direct value or a reference to a stored token in stash (using {tokenName})
 *
 * @example
 * Given I set bearer token "myAuthToken123"
 * Given I set bearer token "{storedToken}"
 */
Given(
  'I set bearer token {string}',
  async function (this: ApiWorld, token: string) {
    const actualToken = token.startsWith('{')
      ? this.apiContext.getValue(token.replace(/[{}]/g, ''))
      : token;

    this.apiContext.setAuthToken(actualToken);
    await this.apiContext.initialize();
  }
);
