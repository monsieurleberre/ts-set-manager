import fetch from 'node-fetch';
import { IIndexDefinition } from 'Indexes/IndexDetails';
import { Address } from 'setprotocol.js';
import BigNumber from 'bignumber.js';
import { ConversionRateResponse, ConversionRateData } from './ConversionRateData';
import { usdc } from 'Config/Erc20Tokens';
import { bigNumberMaxDecimals } from 'Config/Constants';
import { BidAsk, IBidAsk } from 'Indexes/BidAsk';
import { CurrencyResponse } from './CurrencyData';

export default class KyberTradingApi {
    
    public getSupportedTokens = async () => {
        const tokensBasicInfoRequest = await fetch(
          "https://api.kyber.network/currencies"
        );
        const tokensBasicInfo = await tokensBasicInfoRequest.json() as CurrencyResponse;
        return tokensBasicInfo;
    }

    public areAllComponentsSuportedByKyber = async (index: IIndexDefinition) => {
        const tokensBasicInfo = await this.getSupportedTokens();
        const areComponentsSupported = index.componentAddresses.map(c => tokensBasicInfo.data.some(d => d.address === c));
        console.info(`Are components for ${index.symbol} supported?`, areComponentsSupported);
        return areComponentsSupported.every(b => b)
    }

    public getUsdConversionRate = async (address: Address, quantity: BigNumber) => {
        
        const buyRateTokenResponse = await this.getEthBuyRate(address, quantity);
        const buyRateUsdc = this.getRateAsBigNumber(buyRateTokenResponse, 0, d => d.src_qty[0]);
        const buyRateToken = this.getRateAsBigNumber(buyRateTokenResponse, 1, d => d.src_qty[0]);

        const sellRateTokenResponse = await this.getEthSellRate(address, quantity);
        const sellRateUsdc = this.getRateAsBigNumber(sellRateTokenResponse, 0, d => d.dst_qty[0]);
        const sellRateToken = this.getRateAsBigNumber(sellRateTokenResponse, 1, d => d.dst_qty[0]);

        return new BidAsk(buyRateToken.dividedBy(buyRateUsdc),
            sellRateToken.dividedBy(sellRateUsdc)) as IBidAsk;
    }

    private getRateAsBigNumber = (response: ConversionRateResponse, rateIndex: number, selector: (d: ConversionRateData) => number) => 
        new BigNumber(selector(response.data[rateIndex]).toFixed(bigNumberMaxDecimals))

    private static readonly buyPath = "buy_rate";
    private static readonly  sellPath = "sell_rate";

    public getEthBuyRate = async (address: Address, quantity: BigNumber) => {
        return await this.getEthRate(address, quantity, KyberTradingApi.buyPath);
    }

    public getEthSellRate = async (address: Address, quantity: BigNumber) => {
        return await this.getEthRate(address, quantity, KyberTradingApi.sellPath);
    }

    private getEthRate = async (address: Address, quantity: BigNumber, buyOrSellPath: string) => {
    
        const requestPath = "https://api.kyber.network/" + buyOrSellPath
            + "?id=" + usdc + "&qty=" + quantity.toString()
            + "&id=" + address + "&qty=" + quantity.toString();
        const ratesRequest = await fetch(requestPath);

        const rates = await ratesRequest.json() as ConversionRateResponse;
        return rates;
    }

}