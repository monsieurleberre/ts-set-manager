import CoinMarketCapApi from "./CoinMarketCapApi";

const coinMarketCapApi = new CoinMarketCapApi();

describe("KaikoApi", () => {
    it("Should allow retrieving prices in USD for a given symbol", async () => {
        const price = await coinMarketCapApi.getPriceForSymbol("BTC");
        console.info(price);
        //expect(true).toBe(false);
    })
})