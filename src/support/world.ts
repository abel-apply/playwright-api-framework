import { setWorldConstructor, World } from '@cucumber/cucumber';
import { ApiContext } from './api-context';
import { APIResponse } from '@playwright/test';

export interface ApiWorld extends World {
  apiContext: ApiContext;
  response?: APIResponse;
  responseBody?: any;
}

export class CustomWorld implements ApiWorld {
  apiContext: ApiContext;
  response?: APIResponse;
  responseBody?: any;

  // World interface properties
  readonly attach: World['attach'];
  readonly log: World['log'];
  readonly parameters: World['parameters'];
  readonly link: World['link'];

  constructor({ attach, log, parameters }: World) {
    // Initialize World properties
    this.attach = attach;
    this.log = log;
    this.parameters = parameters;
    this.link = parameters.link;

    // Initialize custom properties
    this.apiContext = ApiContext.getInstance();
  }
}

setWorldConstructor(CustomWorld);
