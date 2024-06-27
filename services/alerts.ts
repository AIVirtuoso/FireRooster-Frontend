import apiClient from "../axios";
import { IGetAlertsPayload, IGetAlertsResponse } from "./types/alert.type";

export const alertService = {
  async getAllAlerts(payload: IGetAlertsPayload) {
    const endPoint = "/api/alerts/get-alerts-by-filter";
    try {
      const response = await apiClient.post<IGetAlertsResponse>(`${endPoint}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

