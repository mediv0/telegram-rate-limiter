import { IBucketImpl } from "./_types";
import { Limiter } from "./limiter";
import { MemoryDriver } from "./strategy/memory.controller";
import { RedisDriver } from "./strategy/redis.controller";

describe("Limiter tests", () => {
    let getVal_spy: jest.SpyInstance<IBucketImpl, [userId: string]>;
    let setVal_spy: jest.SpyInstance<any, [userId: string, settings: IBucketImpl]>;
    let limiter: Limiter<"memory">;
    beforeEach(() => {
        getVal_spy = jest.spyOn(MemoryDriver.prototype, "getVal");
        setVal_spy = jest.spyOn(MemoryDriver.prototype, "setVal");

        limiter = new Limiter("memory", {
            interval: 10,
            max: 5,
            driverOptions: {},
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should add user to bucker if not exists", async () => {
        await limiter.limit("test");

        expect(getVal_spy).toHaveBeenCalledWith("test");
        expect(setVal_spy).toHaveBeenCalledWith("test", { timestamp: expect.any(Number), count: expect.any(Number) });
    });

    it("diff timestamp should calculate diffrence between two timestamps and return it in minutes", () => {
        const d1 = Date.now();
        const d2 = Date.now() + 1000 * 60 * 2;
        expect((limiter as any).timestampDiff(d1, d2)).toEqual(2);

        const d3 = Date.now();
        const d4 = Date.now() + 1000 * 60 * 10;

        expect((limiter as any).timestampDiff(d3, d4)).toEqual(10);
    });

    it("should decrease limit size if getting new request", async () => {
        await limiter.limit("mahdi"); // init
        await limiter.limit("mahdi"); // decrease
        await limiter.limit("mahdi"); // decrease

        expect(limiter.getDatabase()!.mahdi.count).toEqual(3);
    });

    it("should throw an error if limit is reached", async () => {
        await limiter.limit("mahdi"); // init
        await limiter.limit("mahdi"); // decrease
        await limiter.limit("mahdi"); // decrease
        await limiter.limit("mahdi"); // decrease
        await limiter.limit("mahdi"); // decrease
        await limiter.limit("mahdi"); // decrease

        try {
            await limiter.limit("mahdi");
        } catch (e) {
            expect((e as Error).message).toEqual("Limit reached");
        }
    });

    it("should reset bucket size if interval passed our timestamp", async () => {
        await limiter.limit("mahdi"); // init
        await limiter.limit("mahdi"); // decrease
        await limiter.limit("mahdi"); // decrease

        expect(limiter.getDatabase()!.mahdi.count).toEqual(3);

        // set time to something bigger than initial timestamp
        const timestamp = Date.now() + 1000 * 60 * 20;
        jest.spyOn(global.Date, "now").mockImplementation(() => timestamp);
        await limiter.limit("mahdi"); // decrease
        // reset count to initiliazed value
        expect(limiter.getDatabase()!.mahdi.count).toEqual(5);
    });
});
