import { State } from "./billing.type";

export interface Pagination {
    page?: number;
    limit?: number;
}

export interface IGetScanners extends Pagination {
    state_id?: number[];
    county_id?: number[];
    search?: string;
}

export interface Scanner {
    county_id: number;
    county_name: string;
    scanner_id: number;
    scanner_title: string;
    id: number;
    listeners_count: string;
    state_id: number;
    state_name: string;
}

export interface IGetScannersResponse {
    data: Scanner[],
    pagination: {
        total: number;
    }
}

export interface IGetMyScannerResponse extends IGetScannersResponse {
    states: State[]
}

export interface IDeleteScanner {
    scanner_id: number;
}

export interface IDeleteScannerResponse {
    status: boolean;
    message: string;
}