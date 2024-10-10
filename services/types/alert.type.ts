import { Scanner } from "./scanner.type";

export interface Pagination {
  page?: number;
  limit?: number;
}

export interface IGetAlertsPayload extends Pagination {
  scanner_id?: number;
  sub_category?: string;
  headSearch: string;
  decSearch: string;
  category?: string;
  selected_from?: Date | null;
  selected_to?: Date | null;
  stars?: number;
}

export interface IGetAlertByIdPayload {
  alert_id?: number;
  scanner_id?: number;
  sub_category?: string;
}

export interface IGetUnlockContactInfoPayload {
  address_id?: number;
}
export interface IGetUnlockContactInfoResponse {
  status: boolean;
  message: string;
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
  rating: number;
  rating_title: string;
  rating_criteria: string;
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
  addresses: AddressData[];
  scanner: Scanner;
  audio: any;
}

export interface ContactInfo {
  past_info: ResidentInfo[];
  owner_info: (ResidentInfo | null)[];
  current_info: ResidentInfo[];
}

export interface AddressData {
  address: string;
  score: number;
  type: string | null;
  dateTime: string | null;
  id: number;
  alert_id: number;
  scanner_id: number | null;
  contact_info: ContactInfo;
  spokeo_status: number;
}

export interface ResidentInfo {
  name: string;
  past_address: string;
  phone_number: string;
  email_address: string;
  current_address: string;
}