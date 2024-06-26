import apiClient from "../axios";
import { IGetScanners, IGetScannersResponse } from "./types/scanner.type";

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
};
