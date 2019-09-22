import KyberTradingApi from "./KyberTradingApi";
import { usdc, wEth, omiseGo } from "Config/Erc20Tokens";
import BigNumber from "bignumber.js";

const kyberTradingApi = new KyberTradingApi;

describe('getSupportedTokens', () => {
    it('retrieves and parses currency data from kyber api', async () => {
        const currencies = await kyberTradingApi.getSupportedTokens();

        expect(currencies.data.length).toBeGreaterThan(10);
        expect(currencies.data[0].address).not.toBeNull();
        ///expect(currencies.data[0].address).not.toMatch(new RegExp('0x[0-9A-Za-z]{40}'));
    });
})


describe('getConversionRate', () => {
    it('retrieves and parses price data from Kyber api', async () => {
        
        //buy
        const buyRateResponse = await kyberTradingApi.getEthBuyRate(omiseGo, new BigNumber(1));
        
        const buyRateUsdc = buyRateResponse.data[0].src_qty[0];
        expect(buyRateUsdc).toBeLessThan(1);
        
        const buyRateOmg = buyRateResponse.data[1].src_qty[0];
        expect(buyRateOmg).toBeLessThan(1);
        
        const estimatedBuyRate = buyRateOmg / buyRateUsdc;

        //sell
        const sellRateResponse = await kyberTradingApi.getEthSellRate(omiseGo, new BigNumber(1));
        
        const sellRateUsdc = sellRateResponse.data[0].dst_qty[0];
        expect(sellRateUsdc).toBeLessThan(1);
        
        const sellRateOmg = sellRateResponse.data[1].dst_qty[0];
        expect(sellRateOmg).toBeLessThan(1);

        const estimatedSellRate = sellRateOmg / sellRateUsdc;

        //act
        const rateOmgUsdc = await kyberTradingApi.getUsdConversionRate(omiseGo, new BigNumber(1));
        
        // assert
        const sellRateOmgUsdcNumber = rateOmgUsdc.ask.toNumber();
        expect(sellRateOmgUsdcNumber).toBeCloseTo(estimatedSellRate, 2);

        const buyRateOmgUsdcNumber = rateOmgUsdc.bid.toNumber();
        expect(buyRateOmgUsdcNumber).toBeCloseTo(estimatedBuyRate, 2);
    });

    it('returns similar rates for similar quantities', async () => {
        
        const rateOmgUsdc1 = await kyberTradingApi.getUsdConversionRate(omiseGo, new BigNumber(1));
        const rateOmgUsdc2 = await kyberTradingApi.getUsdConversionRate(omiseGo, new BigNumber(2));

        const ask1 = rateOmgUsdc1.ask.toNumber();
        const ask2 = rateOmgUsdc2.ask.toNumber();
        expect(ask1).toBeCloseTo(ask2);

        
        const bid1 = rateOmgUsdc1.bid.toNumber();
        const bid2 = rateOmgUsdc2.bid.toNumber();
        expect(bid1).toBeCloseTo(bid2)
    })
})