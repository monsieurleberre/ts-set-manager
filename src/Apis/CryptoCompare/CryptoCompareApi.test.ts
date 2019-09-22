import CryptoCompareApi from "./CryptoCompareApi";
import { usdc } from "Config/Erc20Tokens";

const cryptoCompareApi = new CryptoCompareApi;

// describe('getListingExchanges', () => {
//     it('retrieves and parses exchange mapping data from CryptoCompare api', async () => {
        
//         const fromSymbol = 'OMG';
//         var currencies = await cryptoCompareApi.getListingExchanges(fromSymbol);
//         expect(currencies).not.toBeNull();
//         console.log(currencies)
//         expect(currencies.Data.length).toBeGreaterThan(1);
//         expect(currencies.Data[0].fsym).toBe(fromSymbol);
//     });
// })

describe('getPriceForContractAddress', () => {
    it('retrieves the price of an ERC20 token from its smart contract address', async () => {
        var priceOfUsdcInUsd = await cryptoCompareApi.getPriceForContractAddress(usdc);
        console.info(priceOfUsdcInUsd);
        expect(priceOfUsdcInUsd).toBeCloseTo(1, 2);
    })
})