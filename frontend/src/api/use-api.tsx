import { Client} from "./client";
import { Api } from "./resources/index";

export function useApi() {
  const client = new Client("https://hackmty2025-640704095453.northamerica-south1.run.app");
  const api = new Api(client);

  return { api };
}