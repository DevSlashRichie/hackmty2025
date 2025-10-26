import type { Client } from "../../client";

export class Energy {
  private readonly client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  calculate(file: File) {
    const formData = new FormData();
    formData.append("bill", file);

    const { operation } = this.client.prepare<{
      monthlyConsumption: number;
      monthlyCost: number;
      recommendedPanels: number;
      panelProduction: number;
      monthlySavings: number;
      yearlySavings: number;
      surplus: number;
      breakEvenYears: number;
      carbonOffset: number;
    }>("/energy/calculate_from_file", "POST", formData);

    return operation;
  }

  getMonthlyConsumption() {
    const { operation } = this.client.prepare<
      {
        month: string;
        consumption: number;
      }[]
    >("/energy/monthly_consumption", "GET");

    return operation;
  }

  textToTTS(text: string) {
    const { operation } = this.client.prepare<Blob>(
      "/energy/tts",
      "POST",
      {
        text,
      },
      undefined,
      { responseType: "blob", route: null },
    );

    return operation;
  }

  chat(history: string[], newMessage: string) {
    const { operation } = this.client.prepare<{ response: string }>(
      "/energy/chat",
      "POST",
      {
        history,
        new_message: newMessage,
      }
    );

    return operation;
  }
}
