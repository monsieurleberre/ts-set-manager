import SetProtocol, { Address } from 'setprotocol.js';
import { IComponentDetails } from 'Indexes/ComponentDetails';
import { IndexDetails, IIndexDefinition } from "Indexes/IndexDetails";
import CryptoCompareApi from 'Apis/CryptoCompare/CryptoCompareApi';
import { BidAsk } from './BidAsk';
import EtherscanHtmlParser from 'Apis/Etherscan/EtherscanHtmlParser';

/**
 * Offers a couple of methods to get from the definition of an index to an object of type IIndexDetails,
 * which can provide a little bit more information.
 * **/
export default class IndexDetailsFactory{

    private setProtocol: SetProtocol;
    private cryptoCompareApi: CryptoCompareApi;
    private EtherscanHtmlParser: EtherscanHtmlParser;

    constructor(setProtocol: SetProtocol){
        this.setProtocol = setProtocol;
        this.cryptoCompareApi = new CryptoCompareApi();
        this.EtherscanHtmlParser = new EtherscanHtmlParser();
    }
    
    /**
    * This method is meant to be used when creating an index, the function is currently disabled and will
    * be restored rapidly, when redux is brought back in the solution :)
    * It allows to get from an JSON defintion, to an IIndexDefintion complete enought to proceed with
    * the creation of the index.
    **/
    public getIndexDetails = async (indexDefinition: IIndexDefinition) => {

        try {
            console.info("Retrieving index details for ", indexDefinition.symbol)
            const components = indexDefinition.componentAddresses;
            const tokenDetails = await Promise.all(
                components.map(async a => await this.getTokenDetails(a)));

            return new IndexDetails(indexDefinition.name, 
                indexDefinition.symbol, 
                tokenDetails,
                indexDefinition.targetUsdPrice)
        } catch (error) {
            console.warn("Failed to retreive index details.")
            return undefined;
        }
        
    }
   
    private getTokenDetails = async (address: Address) => {
        const name = await this.setProtocol.erc20.getNameAsync(address);
        const symbol = await this.setProtocol.erc20.getSymbolAsync(address);
        const decimals = await this.setProtocol.erc20.getDecimalsAsync(address);
        const cryptoComparePrice = await this.cryptoCompareApi.getPriceForContractAddress(address);
        if(cryptoComparePrice === 0) console.warn(`Price for ${symbol} not found on CryptoCompare`)
        
        const usdPrice = cryptoComparePrice === 0 
            ? await this.EtherscanHtmlParser.getPriceForAddress(address)
            : cryptoComparePrice;
        const usdBidAsk = new BidAsk(usdPrice)

        return {
            address,
            name,
            symbol,
            decimals: decimals.toNumber(),
            usdBidAsk: usdBidAsk
        } as IComponentDetails
    }


    /** 
     * Use this to retrieve details about an existing index given its address on chain.
     * **/
    public getIndexDetailsFromAddress = async (setAddress: Address) => {

        try {
            console.info("Retrieving index details for ", setAddress)
            const details = await this.setProtocol.setToken.getDetailsAsync(setAddress);
            const allComponentDetails = await Promise.all(details.components.map(async a => await this.getTokenDetails(a.address)));

            return new IndexDetails(details.name, 
                details.symbol, 
                allComponentDetails,
                0) //we cannot know what the target price was at the time of creation...

        } catch (error) {
            console.warn("Failed to retreive index details.")
            return undefined;
        }
        
    }
}
