import { BigNumber } from "bignumber.js";

export interface IBidAsk {
    bid : BigNumber,
    ask: BigNumber,
    center: BigNumber,
    spread: BigNumber
}

export class BidAsk implements IBidAsk {
    
    readonly bid: BigNumber;
    readonly ask: BigNumber;

    constructor(bid: BigNumber | number, offer?: BigNumber | number){
        this.bid = new BigNumber(bid);
        this.ask = new BigNumber(offer || bid);
    }

    public get center(){ return this.bid.add(this.ask).div(2); }
    
    public get spread(){ return this.ask.minus(this.bid); }
}