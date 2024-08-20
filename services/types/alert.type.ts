import { Scanner } from "./scanner.type";

export interface Pagination {
  page?: number;
  limit?: number;
}

export interface IGetAlertsPayload extends Pagination {
  scanner_id?: number;
  sub_category?: string;
  search: string;
  category?: string;
  selected_from?: Date | null;
  selected_to?: Date | null;
}

export interface IGetAlertByIdPayload {
  alert_id?: number;
  scanner_id?: number;
  sub_category?: string;
}

export interface Alert {
  id: number;
  headline: string;
  description: string;
  scanner_id: number;
  address: string;
  dateTime: string;
  category: string;
  sub_category: string;
  is_visited?: number;
}

export interface AlertObject {
  alert: Alert;
  addresses: string[];
}

export interface IGetAlertsResponse {
  alerts: AlertObject[];
  pagination: {
    total: number;
  };
}
export interface IGetAlertByIdResponse {
  alert: Alert;
  addresses: string[];
  scanner: Scanner;
  audio: any;
}
