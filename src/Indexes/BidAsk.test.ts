import { BidAsk } from './BidAsk'
import { BigNumber } from "bignumber.js";
it('should calculate centre price assuming centered srpead', () =>{
    const bid = new BigNumber(1);
    const offer = new BigNumber(2);

    const bidOffer = new BidAsk(bid, offer);
    expect(bidOffer.bid).toStrictEqual(bid);
    expect(bidOffer.ask).toStrictEqual(offer);

    expect(bidOffer.center).toStrictEqual(new BigNumber(1.5));
    expect(bidOffer.spread).toStrictEqual(new BigNumber(1));
})

it('should accept number in constructor', () =>{
    const bid = 3;
    const offer = new BigNumber(4);

    const bidOffer = new BidAsk(bid, offer);
    expect(bidOffer.bid).toStrictEqual(new BigNumber(bid));
    expect(bidOffer.ask).toStrictEqual(offer);

    expect(bidOffer.center).toStrictEqual(new BigNumber(3.5));
    expect(bidOffer.spread).toStrictEqual(new BigNumber(1));
})