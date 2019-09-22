import fetch from 'node-fetch'
import { coinMarketCapApiKey } from 'Apis/ApiKeys';

export default class CoinMarketCapApi {

    private static readonly marketDataEndpoint = "https://eu.market-api.kaiko.io/v1/"
    private static readonly headers = { 'X-CMC_PRO_API_KEY': coinMarketCapApiKey }
    
    constructor(){
        //this.allCoinList = AllCoinList as AllCoinlist; 
    }

    public getPriceForSymbol = async (symbol: string) => {
        const now = new Date(Date.now());
        const previousDay = new Date(now.setDate(now.getDate() - 1));
        const startTime = previousDay.toISOString()
        const endTime = now.toISOString()
        const path = "data/trades.latest/spot_direct_exchange_rate/";
        const query = CoinMarketCapApi.marketDataEndpoint + path
            + symbol.toLowerCase() + "/"
            + "usd?sources=true"
            + "&start_time=" + startTime
            + "&end_time=" + endTime

        const request = await fetch(query, { headers: CoinMarketCapApi.headers });

        const result = await request.json();
        return result;
    }
}