import { BigNumber } from 'bignumber.js';
import { Address } from 'setprotocol.js';
import { BidAsk } from './BidAsk';
import { bigNumberMaxDecimals } from 'Config/Constants';
import { IWeighedComponentDetails, IComponentDetails, WeighedComponentDetails } from './ComponentDetails';


/** 
 * The IIndexDefinition is intended to be a data structure in which one can easily represent the different parameters
 * that one should create in order to be able to create a give set.
 * An improvement would be to add the ability to specify weights for the components.
 * **/
export interface IIndexDefinition {
    name: string;
    symbol: string;
    targetUsdPrice: number;
    componentAddresses: Address[];
}

export interface IIndexDetails extends IIndexDefinition {
    readonly components: Array<IWeighedComponentDetails>,
    usdBidAsk: BidAsk,
}

export class IndexDetails implements IIndexDetails {
    readonly name: string;
    readonly symbol: string;
    readonly components: IWeighedComponentDetails[];
    readonly componentAddresses: Address[];
    // when creating an index, one can use that field for the targeted usd price,
    // before passing the details to GetUnitsCalculationParams
    readonly targetUsdPrice: number;
    usdBidAsk: BidAsk;
    constructor(name: string, symbol: string, components: IComponentDetails[], targetUsdPrice: number) {
        this.components = this.areComponentsWeighedCorrectly(components)
            ? components.map(c => (<IWeighedComponentDetails>c))
            : this.assignEqualWeights(components);
        this.symbol = symbol;
        this.name = name;
        this.targetUsdPrice = targetUsdPrice;
        const usdBid = this.components.map(c => c.usdBidAsk.bid.mul(c.proportion))
            .reduce((prev, current) => prev.plus(current));
        const usdOffer = this.components.map(c => c.usdBidAsk.ask.mul(c.proportion))
            .reduce((prev, current) => prev.plus(current));
        this.usdBidAsk = new BidAsk(usdBid, usdOffer);
        this.componentAddresses = this.components.map(c => c.address);
    }
    private assignEqualWeights(components: IComponentDetails[]) {
        //automatically put equal weights.
        const componentCount = components.length;
        const standardProportion = (1.0 / componentCount).toFixed(bigNumberMaxDecimals);
        const remainder = (1 - (componentCount - 1) * (+standardProportion)).toFixed(bigNumberMaxDecimals);
        const weighedComponents = (<IComponentDetails[]>components).map((c, i) => new WeighedComponentDetails(i === 0
            ? new BigNumber(remainder)
            : new BigNumber(standardProportion), c));
        return weighedComponents;
    }
    private areComponentsWeighedCorrectly(components: IComponentDetails[]) {
        const asWeighedComponents = components.map(c => (<IWeighedComponentDetails>c));
        const areWeighed = asWeighedComponents.every(c => c.proportion !== undefined);
        if (!areWeighed)
            return false;
        const summedWeights = asWeighedComponents.map(c => c.proportion)
            .reduce((current, previous) => current.plus(previous));
        return summedWeights === new BigNumber(1);
    }
}
