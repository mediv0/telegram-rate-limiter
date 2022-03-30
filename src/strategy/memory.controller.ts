import { IBaseStrategyImpl, IBucketImpl, IRedisOptions } from "../_types";

export class MemoryDriver implements IBaseStrategyImpl {
    private readonly client: { [key: string]: IBucketImpl };
    constructor() {
        this.client = {};
    }

    setVal(userId: string, settings: IBucketImpl): any | never {
        return (this.client[userId] = settings);
    }

    getVal(userId: string): IBucketImpl | never {
        return this.client[userId];
    }

    db() {
        return this.client;
    }
}
