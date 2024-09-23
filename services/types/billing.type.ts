export interface County {
    county_name: string;
    county_id: string;
}

export interface State {
    state_name: string;
    state_id: string;
    county_list: County[];
}


export interface Scanner {
    state_name: string;
    state_id: string;
    county_id: string;
    county_name: string;
    scanner_title: string;
    scanner_id: number;
}


export interface PurchaseScannersResponse {
    status: boolean;
    message: string;
}