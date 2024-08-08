
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

export interface Alert {
    id: number;
    headline: string;
    description: string;
    scanner_id: number;
    address: string;
    dateTime: string
}

export interface AlertObject {
    alert: Alert;
    addresses: string[]
}


export interface IGetAlertsResponse {
    alerts: AlertObject[];
    pagination: {
        total: number;
    }
}
export interface IGetAlertByIdResponse {
    alert: Alert;
    addresses: string[]

}