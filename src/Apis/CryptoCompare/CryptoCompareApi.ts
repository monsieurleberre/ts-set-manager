import fetch from 'node-fetch'
import { ExchangeMappingResponse } from './ExchangeMappingResponse';
import { Address } from 'set-protocol-utils';
import AllCoinList from 'Apis/CryptoCompare/jsonExamples/all-coinlist.json';
import { AllCoinlist } from './AllCoinList';
import { cryptoCompareApiKey } from 'Apis/ApiKeys'

export default class CryptoCompareApi {

    private static readonly urlRoot = "https://min-api.cryptocompare.com/data/"
    private static readonly headers = { authorization: 'Apikey ' + cryptoCompareApiKey }
    
    private readonly allCoinList: AllCoinlist;

    constructor(){
        this.allCoinList = AllCoinList as AllCoinlist;
    }

    public getListingExchanges = async (symbol: string) => {
        const path = "pair/mapping/exchange/";
        const query = CryptoCompareApi.urlRoot + path +
            'fsym?exchangeFsym=' + symbol;

        const request = await fetch(query, { headers: CryptoCompareApi.headers });

        const result = await request.json() as ExchangeMappingResponse;
        return result;
    }

    private getCryptoCompareSymbolForContractAddress(address: Address){
        const lowerCaseAddress = address.toLowerCase();
        const contractDetails = Object.values(this.allCoinList.Data)
            .find(d => d.SmartContractAddress.toLowerCase() === lowerCaseAddress)
        if(!contractDetails) 
            throw new Error(`Failed to retrieve CryptoCompare symbol for contract ${address}`)
        return contractDetails.Symbol;
    }

    public getPriceForContractAddress = async (address: Address, quoteCurrency = 'USD') => {
        
        try {
            
            var symbol = this.getCryptoCompareSymbolForContractAddress(address);
            const path = "price";
            const currencySymbol = quoteCurrency.toUpperCase();
            const query = CryptoCompareApi.urlRoot + path + 
                '?fsym=' + symbol + 
                '&tsyms=' + currencySymbol;
    
            const request = await fetch(query, { headers: CryptoCompareApi.headers });
            const result = await request.json();
            
            return result[currencySymbol] as number;

        } catch (error) {
            console.warn("Failed to retrieve price for token at ", address, error);
            return 0;
        }
    }
}