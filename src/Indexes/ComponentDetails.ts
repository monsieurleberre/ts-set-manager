import { BigNumber } from 'bignumber.js'
import { Address } from 'setprotocol.js'
import { IBidAsk, BidAsk } from './BidAsk';
import { IIndexDetails } from './IndexDetails';

export interface IComponentDetails {
    readonly address: string,
    readonly name: string,
    readonly symbol: string,
    readonly decimals: number,
    usdBidAsk: IBidAsk,
}

export interface IWeighedComponentDetails extends IComponentDetails {
    readonly proportion: BigNumber,
}

export class ComponentDetails implements IComponentDetails {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    usdBidAsk: IBidAsk;

    constructor(address: string,
        name: string,
        symbol: string,
        decimals: number,
        bid: BigNumber | number,
        offer: BigNumber | number) {
        this.address = address;
        this.name = name;
        this.symbol = symbol;
        this.decimals = decimals;
        this.usdBidAsk = new BidAsk(bid, offer)
    }
}

export class WeighedComponentDetails extends ComponentDetails implements IWeighedComponentDetails {
    proportion: BigNumber;

    constructor(proportion: BigNumber, componentDetails: IComponentDetails) {
        const { address, name, symbol, decimals, usdBidAsk: usdBidOffer } = componentDetails
        super(address, name, symbol, decimals, usdBidOffer.bid, usdBidOffer.ask)
        this.proportion = new BigNumber(proportion)
    }
}

export interface IUnitCalculationsParams {
    components: Address[],
    decimals: number[],
    prices: BigNumber[],
    proportions: BigNumber[],
    targetPrice: number,
    percentError?: number
}

export const GetUnitsCalculationParams = (indexDetails: IIndexDetails) => {

    if (!indexDetails.components.every(c => c.usdBidAsk))
        throw new Error("All components should have a USD price.")

    const componentAddresses = indexDetails.components.map(c => c.address);
    const decimals = indexDetails.components.map(c => c.decimals);
    const usdPrices = indexDetails.components.map(c => c.usdBidAsk.center);
    const proportions = indexDetails.components.map(c => c.proportion);

    return {
        components: componentAddresses,
        decimals: decimals,
        prices: usdPrices,
        proportions: proportions,
        targetPrice: indexDetails.targetUsdPrice
    } as IUnitCalculationsParams
}