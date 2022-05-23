import { MemoryDriver } from "./strategy/memory.controller";
import { RedisDriver } from "./strategy/redis.controller";
import { driver, IBucketImpl, IDriverImpl, ILimiterOptions, IRedisOptions } from "./_types";

export class Limiter<K extends keyof driver> {
    private interval: number;
    private max: number;
    private dbDriver: IDriverImpl;

    constructor(driver: K, options: ILimiterOptions<driver[K]>) {
        this.interval = options.interval;
        this.max = options.max;

        if (driver === "redis") {
            this.dbDriver = new RedisDriver(options.driverOptions as IRedisOptions);
        } else {
            this.dbDriver = new MemoryDriver();
        }
    }

    public async limit(userId: string): Promise<void> | never {
        const user = await this.dbDriver.getVal(userId);
        if (user === null) {
            await this.dbDriver.setVal(userId, { timestamp: Date.now(), count: this.max });
            return;
        }

        const diff = this.timestampDiff(user.timestamp, Date.now());

        if (diff >= this.interval) {
            user.timestamp = Date.now();
            user.count = this.max;
            return;
        }

        if (user.count <= 0) {
            throw new Error("Limit reached");
        }

        user.count--;
    }

    public getDatabase(): { [key: string]: IBucketImpl } | undefined {
        return this.dbDriver.db ? this.dbDriver.db() : undefined;
    }

    private timestampDiff(t1: number, t2: number): number {
        const _diff = t2 - t1;
        const __minuteDiff = Math.floor(_diff / 1000 / 60);
        return __minuteDiff;
    }
}
