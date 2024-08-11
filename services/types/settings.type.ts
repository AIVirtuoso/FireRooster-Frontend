export interface Pagination {
  page?: number;
  limit?: number;
}

export interface IGetAlertsPayload extends Pagination {
  scanner_id?: number;
}

export interface IGetAlertByIdPayload {
  alert_id?: number;
  scanner_id?: number;
}

export interface IGetSubCategoriesByCategory extends Pagination {
  category: string;
}

export interface Alert {
  id: number;
  headline: string;
  description: string;
  scanner_id: number;
  address: string;
  dateTime: string;
}

export interface Category {
  id: number;
  sub_category: string;
  category: string;
  scanner_id: number;
}

export interface SettingsObject {
  alert: Alert;
  addresses: string[];
}

export interface IGetAlertsResponse {
  alerts: SettingsObject[];
}
export interface IGetAlertByIdResponse {
  alert: Alert;
  addresses: string[];
}

export interface IGetSubCategoriesByCategoryResponse {}
