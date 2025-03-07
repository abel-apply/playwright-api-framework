interface Config {
  baseUrl: string;
  timeout: number;
}

interface EnvironmentConfig {
  [key: string]: Config;
}

const environments: EnvironmentConfig = {
  development: {
    // Example dummy api
    baseUrl: 'https://dummyjson.com',
    timeout: 30000,
  },
  staging: {
    baseUrl: 'https://staging-api-url.com',
    timeout: 30000,
  },
};

const env = process.env.NODE_ENV || 'development';
export const config = environments[env];
