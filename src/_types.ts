import { RedisClientOptions, RedisModules, RedisScripts, RedisClientType } from "redis";

export interface IRedisOptions extends RedisClientOptions<RedisModules, RedisScripts> {}

export interface IMemoryOptions {}

export type driver = {
    redis: IRedisOptions | undefined;
    memory?: IMemoryOptions;
};

export interface ILimiterOptions<T> {
    max: number;
    interval: number;
    driverOptions: T;
}
export interface IBucketImpl {
    timestamp: number;
    count: number;
}

export interface IBaseStrategyImpl {
    getVal(userId: string): Promise<IBucketImpl> | IBucketImpl | never;
    setVal(userId: string, settings: IBucketImpl): Promise<void> | void | never;
    db?(): { [key: string]: IBucketImpl };
}

export interface IDriverImpl extends IBaseStrategyImpl {}
