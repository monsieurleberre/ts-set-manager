import EtherscanHtmlParser from "./EtherscanHtmlParser";
import { Address } from "setprotocol.js";
import BigNumber from "bignumber.js";

const parser = new EtherscanHtmlParser();

describe("EtherscanHtmlParser", () => {
    it("Should find price from HTML page", async () => {
        const price = await parser.getPriceForAddress("0x422866a8f0b032c5cf1dfbdef31a20f4509562b0");
        console.info(price);
        expect(price).not.toBe(0);
    })

    interface PricedComponent {
        address: Address
        price: BigNumber
    }

    it("is not a test, just a way to get latest price batch and hardcode...", async () => {
        const allCoins = [
            "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07",
            "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
            "0x4f9254c83eb525f9fcf346490bbb3ed28a81c667",
            "0x4e15361fd6b4bb609fa63c81a2be19d873717870",

            "0xbf2179859fc6d5bee9bf9158632dc51678a4100e",
            "0xa74476443119A942dE498590Fe1f2454d7D4aC0d",
            "0xb98d4c97425d9908e66e53a6fdf673acca0be986",
            "0x8290333cef9e6d528dd5618fb97a76f268f3edd4",

            "0xb63b606ac810a52cca15e44bb630fd42d8d1d83d",
            "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07",
            "0xa15c7ebe1f07caf6bff097d8a589fb8ac49ae5b3",
            "0x64c86899bc02dd9af823b131e5acd4369f72bd39",

            "0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac",
            "0x8290333cef9e6d528dd5618fb97a76f268f3edd4",
            "0x5732046a883704404f284ce41ffadd5b007fd668",
            "0x607F4C5BB672230e8672085532f7e901544a7375",

            "0x6c6ee5e31d828de241282b9606c8e98ea48526e2",
            "0x744d70fdbe2ba4cf95131626614a1763df805b9e",
            "0x08f5a9235b08173b7569f83645d2c7fb55e8ccd8",

            "0x6f259637dcd74c767781e37bc6133cd6a68aa161",
            "0x039b5649a59967e3e936d7471f9c3700100ee1ab",
            "0x75231f58b43240c9718dd58b4967c5114342a86c"
        ]

        const resolveMe = allCoins.map(async c => {
            const price = await parser.getPriceForAddress(c);

            //console.info(`"${c}" : ${price}`);
            return { address: c, price: price } as PricedComponent;
        })

        const prices = await Promise.all(resolveMe);
        console.info(JSON.stringify(prices, null, 2))
        //expect(true).toBe(false);
    })
})