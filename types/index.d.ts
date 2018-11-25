import {
    Path,
    FROM_STATE,
    FROM_ACTION,
    FROM_PAYLOAD,
    FROM_META,
    FromActionNoArgs,
    FromStateNoArgs,
    InnerReducer,
    OuterReducer
} from "./path";

// TypeScript Version: 2.9

type ReducerLikeFunction<TS, TA, TRet> = (state: TS, action: TA, ...others: any[]) => TRet;
export type Reducer<TS, TA> = (state: TS, action: TA, ...others: any[]) => TS;
type TemplateType<TS, TA, TO> = {
  [K in keyof TO]: TO[K] | ReducerLikeFunction<TS, TA, TO[K]>
};
type CastableToReducer<TS, TA, TO = TS> =
  ReducerLikeFunction<TS, TA, TO> |
  TemplateType<TS, TA, TO> |
  TO;

/// switchReducers
type MatcherFunction<TS, TA> = ReducerLikeFunction<TS, TA, boolean>;
type AdvancedRuleDef<TS, TA> = [Matcher<TS, TA>, CastableToReducer<TS, TA>];
type Matcher<TS, TA> = string | MatcherFunction<TS, TA> | MatcherArray<TS, TA>;
interface MatcherArray<TS, TA> extends Array<Matcher<TS, TA>> { }

type SelectWithType<TA, TAType> = TA extends { type: TAType } ? TA : never;
interface ActionWithType {
  type: any;
}
interface ActionWithPayload<P> extends ActionWithType {
  payload: P;
}
export type ActionTypeRuleDef<TS, TA extends ActionWithType> = TA extends { type: infer TAType }
  ? [TAType, CastableToReducer<TS, SelectWithType<TA, TAType>>]
  : AdvancedRuleDef<TS, TA>;

export type RuleDef<TS, TA extends ActionWithType> =
  | ActionTypeRuleDef<TS, TA>
  | AdvancedRuleDef<TS, TA>;

export function switchReducers<TS, TA extends ActionWithType>(initialValue: TS, ...ruleDefs: Array<RuleDef<TS, TA>>): Reducer<TS, TA>;
export default switchReducers;

/// outerReducer
export declare const outerReducer: OuterReducer;

/// innerReducer
export declare const innerReducer: InnerReducer;

/// concatReducer
export function concat<TS extends any[] | string, TA>(getter: CastableToReducer<TS, TA>): Reducer<TS, TA>;

/// mergeReducer
export function merge<TS, TA>(reducer: CastableToReducer<TS, TA, Partial<TS>>): Reducer<TS, TA>;

/// isType
export function isType<TA extends ActionWithType>(x: TA['type']): MatcherFunction<any, TA>;

// "path" helpers
export declare const fromState: Path<FROM_STATE>;
export declare const fromAction: Path<FROM_ACTION>;
export declare const fromPayload: Path<FROM_PAYLOAD>;
export declare const fromMeta: Path<FROM_META>;
export declare const getAction: FromActionNoArgs
export declare const getState: FromStateNoArgs

/// composeReducers
export function composeReducers<TA, TS, TRet>(
    reducer1: ReducerLikeFunction<TS, TA, TRet>
): ReducerLikeFunction<TS, TA, TRet>;
export function composeReducers<TA, TS, TS1, TRet>(
    reducer1: ReducerLikeFunction<TS1, TA, TRet>,
    reducer2: ReducerLikeFunction<TS, TA, TS1>
): ReducerLikeFunction<TS, TA, TRet>;
export function composeReducers<TA, TS, TS1, TS2, TRet>(
    reducer1: ReducerLikeFunction<TS1, TA, TRet>,
    reducer2: ReducerLikeFunction<TS2, TA, TS1>,
    reducer3: ReducerLikeFunction<TS, TA, TS2>
): ReducerLikeFunction<TS, TA, TRet>;
export function composeReducers<TA, TS, TS1, TS2, TRet>(
    reducer1: ReducerLikeFunction<TS1, TA, TRet>,
    reducer2: ReducerLikeFunction<TS2, TA, TS1>,
    reducer3: ReducerLikeFunction<TS, TA, TS2>
): ReducerLikeFunction<TS, TA, TRet>;
export function composeReducers<TA>(...reducers: ReducerLikeFunction<any, TA, any>[]): Reducer<any, TA>;

/// withState utilities
// export type WithState<T> = T extends (arg1: infer R, target: infer TT) => any ?
//     (fn: ReducerLikeFunction<TT, any, R>) => Reducer<TT, any> :
//     never;

// export type FilterUpdaterFn = <T>(
//     fn: T extends Array<infer R> ?
//         (value: R, index: number, array: T) => boolean :
//         T extends {[key: string]: infer R} ? (value: R, key: string, target: T) => boolean :
//         never,
//     target: T
// ) => T;

export function filter<T = any>(
    fn: ReducerLikeFunction<
        T,
        any,
        T extends Array<infer R> ? (value: R, index: number, array: T) => boolean :
        T extends {[key: string]: infer R} ? (value: R, key: string, target: T) => boolean :
        never
        >
): Reducer<T, any>;

export const reject: typeof filter;

export function map<T = any, TRet = any>(
    fn: ReducerLikeFunction<
        T[],
        any,
        (value: T, index: number, array: T[]) => TRet
    >
): ReducerLikeFunction<T[], any, TRet[]>;
export function map<T extends {[key: string]: any}>(
    fn: T extends Array<any> ? never : ReducerLikeFunction<
        T,
        any,
        (value: any, key: string, object: T) => any
    >
): ReducerLikeFunction<T, any, {[P in keyof T]: any}>;

// type Omit<T, K extends keyof T> = Pick<T, ({ [P in keyof T]: P } & { [P in K]: never } & { [x: string]: never })[keyof T]>;
// export function omit<T, K extends keyof T>(
//     keys: Array<K>
// ): ReducerLikeFunction<T, any, Omit<T, K>>;
// These two have the problem of partial inference - This would only work if
// the consumer specifies T, but then we must provide a default for K.... which
// if we set any/never as default, tsc gets lazy and accepts these for any value of keys.
export function omit(
    keys: string[]
): ReducerLikeFunction<any, any, any>;

export function pick(
    keys: string[]
): ReducerLikeFunction<any, any, any>;

// TODO
// createReducer, => Waiting for tests
// update