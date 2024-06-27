
export interface Pagination {
    page?: number;
    limit?: number;
}

export interface IGetAlertsPayload extends Pagination {
    scanner_id?: number;
}

export interface Alert {
    id: number;
    headline: string;
    description: string;
    scanner_id: number;
    address: string;
}

export interface IGetAlertsResponse {
    data: Alert[],
    pagination: {
        total: number;
    }
}