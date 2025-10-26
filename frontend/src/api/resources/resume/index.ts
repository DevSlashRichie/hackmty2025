import type { Client } from "../../client";

export class Energy {
  private readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  calculate(file: File) {
    const formData = new FormData();
    formData.append("bill", file);

    const { operation } = this.client.prepare<{ panels: string }>(
      "/energy/calculate_from_file",
      "POST",
      formData,
    );

    return operation.map((it) => Number(it));
  }
}
