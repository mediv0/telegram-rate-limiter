import { createClient } from "redis";
import { IBaseStrategyImpl, IBucketImpl, IRedisOptions } from "../_types";

export class RedisDriver implements IBaseStrategyImpl {
    constructor(opts: IRedisOptions, private readonly client = createClient(opts)) {
        this.init();
    }
    async setVal(userId: string, settings: IBucketImpl): Promise<void> | never {
        try {
            await this.client.set(`limiter::${userId}`, JSON.stringify(settings));
        } catch (e) {
            throw e;
        }
    }

    async getVal(userId: string): Promise<IBucketImpl> | never {
        try {
            const redisResult = await this.client.get(`limiter::${userId}`);
            const result = JSON.parse(redisResult!) as IBucketImpl;
            return result;
        } catch (e) {
            throw e;
        }
    }

    private async init(): Promise<void> {
        this.client.on("error", (err) => console.log("Redis Client Error", err));
        await this.client.connect();
        console.log("[TELEGRAM LIMITER]: Connected to redis driver successfully");
    }
}
