import { Client} from "./client";
import { Api } from "./resources/index";

export function useApi() {
  const client = new Client("http://localhost:8080");
  const api = new Api(client);

  return { api };
}