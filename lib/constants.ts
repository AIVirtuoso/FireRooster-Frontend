export enum SubEnum {
    Ember = 'Ember',
    Blaze = 'Blaze',
    Inferno = 'Inferno',
    WildFire = 'WildFire',
    Partner = 'Partner',
    Administrator = 'Administrator',
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

export const subInfo = {
    Ember: { state: 1, county: 1, scanners: 10 },
    Blaze: { state: 1, county: 2, scanners: 20 },
    Inferno: { state: 2, county: 3, scanners: 30 },
    WildFire: { state: 2, county: 4, scanners: 50 },
    Partner: { state: 2, county: 5, scanners: 80 },
    Administrator: { state: Infinity, county: Infinity, scanners: Infinity },
};