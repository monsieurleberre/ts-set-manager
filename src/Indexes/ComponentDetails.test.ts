import { BigNumber } from 'bignumber.js'
import { GetUnitsCalculationParams, IComponentDetails } from './ComponentDetails'
import { IndexDetails, IIndexDetails } from "./IndexDetails";
import { BidAsk } from './BidAsk';

const wBtc: IComponentDetails = {
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8,
    name: 'Wrapped Bitcoin',
    symbol: 'wBtc',
    usdBidAsk: new BidAsk(7625.00, 7626.00)
}

const wEth: IComponentDetails = {
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
    name: 'Wrapped Ethereum',
    symbol: 'wEth',
    usdBidAsk: new BidAsk(233.01, 233.03)
}

const trueUsd: IComponentDetails = {
    address: '0x0000000000085d4780b73119b644ae5ecd22b376',
    decimals: 18,
    name: 'True USD',
    symbol: 'tUsd',
    usdBidAsk: new BidAsk(0.99, 1.01)
}

it('GetUnitsCalculationParams transforms to the correct format', () => {
    
    const index: IIndexDetails = new IndexDetails(
        'My Index Abc',
        'ABC',
        [wBtc, wEth, trueUsd],
        0.1
    )

    const result = GetUnitsCalculationParams(index);
    expect(result.components).toEqual([
            '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
            '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            '0x0000000000085d4780b73119b644ae5ecd22b376'
        ]);
    expect(result.decimals).toEqual([8, 18, 18]);
    expect(result.prices).toEqual([new BigNumber(7625.5), new BigNumber(233.02), new BigNumber(1)]);
    expect(result.targetPrice).toEqual(0.1)
    expect(result.proportions).toEqual([new BigNumber(0.33333333333334), 
        new BigNumber(0.33333333333333),
        new BigNumber(0.33333333333333)
    ]);
});
