import { Scanner } from "./scanner.type";

export interface IUser {
    first_name: string;
    id: number;
    forgot_password_token: string;
    is_superuser: boolean;
    user_type_id: number;
    hashed_password: string;
    email: string;
    last_name: string;
    is_active: boolean;
    stripe_id: number | null;
}

export interface IUserType {
    state_limit: number;
    id: number;
    scanner_limit: number;
    county_limit: number;
    tier: string;
    price: number;
}

export interface GetUserResponse {
    user: IUser;
    usertype: IUserType;
    purchased_scanners: Scanner[]
}