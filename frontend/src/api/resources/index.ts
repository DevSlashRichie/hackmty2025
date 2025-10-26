import type { Client } from "../client";

import { Energy } from "./resume";

export class Api {
  private readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  get energy() {
    return new Energy(this.client);
  }
}
