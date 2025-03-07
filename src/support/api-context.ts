import { APIRequestContext, APIResponse, request } from '@playwright/test';

export class ApiContext {
  private static instance: ApiContext;
  private requestContext: APIRequestContext | null = null;
  private lastResponse: APIResponse | null = null;
  private baseUrl: string = '';
  private stash: Map<string, any> = new Map();
  private headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  private constructor() {}

  public static getInstance(): ApiContext {
    if (!ApiContext.instance) {
      ApiContext.instance = new ApiContext();
    }
    return ApiContext.instance;
  }

  public async initialize(): Promise<void> {
    if (this.requestContext) {
      await this.requestContext.dispose();
    }

    // Get the stored auth token if available
    const authToken = this.getValue('authToken');
    if (authToken) {
      this.headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
      this.requestContext = await request.newContext({
        baseURL: this.baseUrl,
        extraHTTPHeaders: this.headers,
        ignoreHTTPSErrors: true,
      });
    } catch (error) {
      console.error(`Failed to initialize request context: ${error}`);
      throw error;
    }
  }

  public setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public storeValue(key: string, value: any): void {
    this.stash.set(key, value);
  }

  public getValue(key: string): any {
    return this.stash.get(key);
  }

  public setAuthToken(token: string): void {
    this.storeValue('authToken', token);
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  public setHeader(name: string, value: string): void {
    this.headers[name] = value;
  }

  public async get(
    url: string,
    params?: Record<string, string>
  ): Promise<APIResponse> {
    if (!this.requestContext) await this.initialize();

    const queryString = params ? new URLSearchParams(params).toString() : '';
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    try {
      const response = await this.requestContext!.get(fullUrl);
      this.lastResponse = response;
      return response;
    } catch (error) {
      console.error(`Error during GET request to ${fullUrl}:`, error);
      throw error;
    }
  }

  public async post(url: string, data?: any): Promise<APIResponse> {
    if (!this.requestContext) await this.initialize();

    try {
      // Explicitly build the full URL
      const fullUrl = url.startsWith('http')
        ? url
        : `${this.baseUrl}${url.startsWith('/') ? url : '/' + url}`;

      const options = data ? { data } : undefined;
      const response = await this.requestContext!.post(fullUrl, options);
      this.lastResponse = response;
      return response;
    } catch (error) {
      console.error(`Error during POST request to ${url}:`, error);
      throw error;
    }
  }

  public async put(url: string, data?: any): Promise<APIResponse> {
    if (!this.requestContext) await this.initialize();

    try {
      const options = data ? { data } : undefined;
      const response = await this.requestContext!.put(url, options);
      this.lastResponse = response;
      return response;
    } catch (error) {
      console.error(`Error during PUT request to ${url}:`, error);
      throw error;
    }
  }

  public async delete(url: string, data?: any): Promise<APIResponse> {
    if (!this.requestContext) await this.initialize();

    try {
      const options = data ? { data } : undefined;
      const response = await this.requestContext!.delete(url, options);
      this.lastResponse = response;
      return response;
    } catch (error) {
      console.error(`Error during DELETE request to ${url}:`, error);
      throw error;
    }
  }

  public async patch(url: string, data?: any): Promise<APIResponse> {
    if (!this.requestContext) await this.initialize();

    try {
      const options = data ? { data } : undefined;
      const response = await this.requestContext!.patch(url, options);
      this.lastResponse = response;
      return response;
    } catch (error) {
      console.error(`Error during PATCH request to ${url}:`, error);
      throw error;
    }
  }

  public getLastResponse(): APIResponse | null {
    return this.lastResponse;
  }

  public async close(): Promise<void> {
    if (this.requestContext) {
      await this.requestContext.dispose();
      this.requestContext = null;
    }
  }
}
