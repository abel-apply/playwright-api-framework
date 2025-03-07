import { Before } from '@cucumber/cucumber';
import { ApiWorld } from './world';

let isAuthenticated = false;
let authToken: string;

Before({ tags: '@Login' }, async function (this: ApiWorld) {
  // Skip if already authenticated
  if (isAuthenticated && authToken) {
    this.apiContext.setAuthToken(authToken);
    return;
  }

  // Set base URL if not already set
  const baseUrl = this.apiContext.getBaseUrl() || 'https://dummyjson.com';
  this.apiContext.setBaseUrl(baseUrl);

  try {
    // Perform authentication
    const response = await this.apiContext.post('/auth/login', {
      username: 'emilys',
      password: 'emilyspass',
    });

    // Process response
    if (response.ok()) {
      const responseBody = await response.json();
      if (responseBody.accessToken) {
        authToken = responseBody.accessToken;
        this.apiContext.setAuthToken(authToken);
        isAuthenticated = true;
        console.log('Authentication successful');
      }
    } else {
      console.error(`Authentication failed: ${response.status()}`);
    }
  } catch (error) {
    console.error('Authentication error:', error);
  }
});
