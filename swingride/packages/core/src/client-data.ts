export type Q = {
  $query?: QueryRouteClientData<any, any>;
  $subscription?: QueryRouteClientData<any, any>;
  $?: Record<string, Q>;
};
export type QueryRouteClientData<Params, Return> = {
  segments: string[];
  isParamsVoid: boolean;
  isReturnVoid: boolean;
  [s: symbol]: {
    params: Params;
    returnValue: Return;
  };
};
export type SubscriptionRouteClientData<Params, Yield, Return> = {
  segments: string[];
  isParamsVoid: boolean;
  isYieldVoid: boolean;
  isReturnVoid: boolean;
  [s: symbol]: {
    params: Params;
    yieldValue: Yield;
    returnValue: Return;
  };
};
