export enum SubEnum {
    SILVER = 'silver',
    GOLD = 'gold',
    PLATINUM = 'platinum',
    ADMINISTRATOR = "administrator"
}

export enum PlanEnum {
    SILVER_ID = "price_1PV6UpAZfjTlvHBorhDSu5N7",
    GOLD_ID = "price_1PV6VgAZfjTlvHBo6XIjxJUM",
    PLATINUM_ID = "price_1PV6WHAZfjTlvHBoMdUxAcCJ"
}

type SubValueType = {
    state: number;
    county: number;
    scanners: number;
}

export const subInfo: Record<SubEnum, SubValueType> = {
    silver: {
        state: 1,
        county: 1,
        scanners: 10
    },
    gold: {
        state: 1,
        county: 2,
        scanners: 20
    },
    platinum: {
        state: 2,
        county: 2,
        scanners: 30
    },
    administrator: {
        state: 60,
        county: 10000,
        scanners: 10000
    }
}