import apiClient from "../axios";
import { IGetAlerts, IGetAlertsResponse } from "./types/alert.type";

export const scannerService = {
  async getAllAlerts(payload: IGetAlerts) {
    const endPoint = "/api/scanners/get-scanners-by-filter";
    try {
      const response = await apiClient.post<IGetAlertsResponse>(`${endPoint}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
