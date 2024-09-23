export enum SubEnum {
    Ember = 'silver',
    Blaze = 'gold',
    Inferno = 'platinum',
    ADMINISTRATOR = "administrator",
    WildFire = "partner",
    Partner = "partner_plus"
}

export enum PlanEnum {
    Ember = "price_1Q2EPWAZfjTlvHBok0I7tr1x",
    Blaze = "price_1Q2EPzAZfjTlvHBoD9VQ8mQz",
    Inferno = "price_1Q2EJRAZfjTlvHBoyeugJqGq",
    WildFire = "price_1Q2EMhAZfjTlvHBooIDAfuRC",
    Partner = "price_1Q2EHmAZfjTlvHBoX4ojWyfW"
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
    },
    partner: {
        state: 2,
        county: 4,
        scanners: 50
    },
    partner_plus: {
        state: 2,
        county: 5,
        scanners: 80
    }

}