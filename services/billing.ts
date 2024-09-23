import apiClient from "../axios";
import { PurchaseScannersResponse, State, Scanner } from "./types/billing.type";

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
  async getSelectedList() {
    const endPoint = "/api/scanners/get-selected-scanner-list";
    try {
      const response = await apiClient.get<Scanner[]>(`${endPoint}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async addSelectedScanners(ids: number[]) {
    const endPoint = "/api/scanners/purchase-scanners"
    try {
      const response = await apiClient.post<PurchaseScannersResponse>(endPoint, {
        scanner_id_list: ids
      })
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
