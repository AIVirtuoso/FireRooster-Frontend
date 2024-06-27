import apiClient from "../axios";
import { IGetAlertsPayload, IGetAlertsResponse } from "./types/alert.type";
import { IGetAlertByIdPayload, IGetAlertByIdResponse } from "./types/alert.type";

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
  async getAlertsById(payload: IGetAlertByIdPayload) {
    const endPoint = "/api/alerts/get-alert-by-id";
    try {
      const response = await apiClient.post<IGetAlertByIdResponse>(`${endPoint}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

