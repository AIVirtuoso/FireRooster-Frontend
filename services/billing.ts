import apiClient from "../axios";
import { State } from "./types/billing.type";

export const billingService = {
  async getStateList() {
    const endPoint = "/api/scanners/get-state-and-county-list";
    try {
      const response = await apiClient.get<State[]>(`${endPoint}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
