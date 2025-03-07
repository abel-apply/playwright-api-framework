import { ApiContext } from '../support/api-context';
import { HttpMethod } from '../types';

export interface RequestOptions {
  method: HttpMethod;
  endpoint: string;
  body?: string;
  params?: Record<string, string>;
}

export async function sendRequest(options: RequestOptions) {
  const apiContext = ApiContext.getInstance();
  const { method, endpoint, body, params } = options;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  let response;

  switch (method.toLowerCase()) {
    case 'get':
      response = await apiContext.get(cleanEndpoint, params);
      break;
    case 'post':
      response = await apiContext.post(
        cleanEndpoint,
        body ? JSON.parse(body) : undefined
      );
      break;
    case 'put':
      response = await apiContext.put(
        cleanEndpoint,
        body ? JSON.parse(body) : undefined
      );
      break;
    case 'delete':
      response = await apiContext.delete(
        cleanEndpoint,
        body ? JSON.parse(body) : undefined
      );
      break;
    default:
      throw new Error(`Unsupported HTTP method: ${method}`);
  }

  return response;
}

export function replaceVariables(text: string): string {
  const apiContext = ApiContext.getInstance();

  return text.replace(/\{([^}]+)\}/g, (match, key) => {
    const value = apiContext.getValue(key);
    return value !== undefined ? String(value) : match;
  });
}
