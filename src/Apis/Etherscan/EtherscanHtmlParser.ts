//"<span title='Price per Token'>Price<\\\/span><\\\/div>\\s?<span.*>\\s?\\$([0-9\\.]+)<span class=.*>\\s?<\\\/span>"
//<span title='Price per Token'>Price<\/span><\/div>\s?<span.*>\s?\$([0-9\.]+)<span class=.*>\s?<\/span>


import fetch from 'node-fetch'
import { BigNumber } from 'bignumber.js';
import hardcodedPrices from './harcodedPrices';
import { delay } from 'q';

export default class EtherscanHtmlParser {

    private static readonly httpBase = "https://etherscan.io/token/"
    private static readonly regex = /<span title='Price per Token'>Price<\/span><\/div>\s?<span.*>\s?\$(?<Price>[0-9.]+)<span class=.*>\s?<\/span>/gm

    public getPriceForAddress = async (address: string) => {
        const query = EtherscanHtmlParser.httpBase + address
        try {
            const request = await fetch(query,
                {
                    compress: true,
                    mode: 'no-cors',

                });
            
            const result = await request.text();
            await delay(1000)
            const matches = EtherscanHtmlParser.regex.exec(result)
            const price = matches
                ? new BigNumber(matches[1])
                : new BigNumber(hardcodedPrices
                    .filter(h => h.address.toLowerCase() === address.toLowerCase())[0].price  || "0");
            //console.info(matches ? matches[1] : "no match")
            //console.info(`Found price for ${address} from Etherscan: `, price)
            return price;
        } catch (error) {
            console.warn("Failed to find price from Etherscan for ", address, error)
            return 0;
        }
    }
}