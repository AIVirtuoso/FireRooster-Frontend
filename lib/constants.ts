export enum SubEnum {
    SILVER = 'silver',
    GOLD = 'gold',
    PLATINUM = 'platinum'
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
}