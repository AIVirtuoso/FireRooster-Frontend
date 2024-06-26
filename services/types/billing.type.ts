export interface County {
    county_name: string;
    county_id: string;
}

export interface State {
    state_name: string;
    state_id: string;
    county_list: County[];
}
