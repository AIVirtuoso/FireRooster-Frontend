import apiClient from "../axios";
import { IGetMyScannerResponse, IGetScanners, IGetScannersResponse } from "./types/scanner.type";

export const scannerService = {
  async getAllScanners(payload: IGetScanners) {
    const endPoint = "/api/scanners/get-scanners-by-filter";
    try {
      const response = await apiClient.post<IGetScannersResponse>(`${endPoint}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  async getMyScanners(payload: IGetScanners) {
    console.log("payload: ", payload)
    const endPoint = "/api/scanners/get-my-scanners";
    try {
      const response = await apiClient.post<IGetMyScannerResponse>(`${endPoint}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
