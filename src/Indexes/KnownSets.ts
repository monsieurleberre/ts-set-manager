import L1CPU003 from 'Indexes/Definitions/L1CPU003.definition.json'
import L1EXC003 from 'Indexes/Definitions/L1EXC003.definition.json'
import L1FIN003 from 'Indexes/Definitions/L1FIN003.definition.json'
import L1INF003 from 'Indexes/Definitions/L1INF003.definition.json'
import L1SCA004 from 'Indexes/Definitions/L1SCA004.definition.json'
import L1STR004 from 'Indexes/Definitions/L1STR004.definition.json'
import { Address } from 'setprotocol.js'
import { IIndexDefinition } from './IndexDetails'

export const KnownSets = new Map<string, IIndexDefinition>(
    [
        [L1CPU003.symbol, L1CPU003 as IIndexDefinition],
        //[L1EXC003.symbol, L1EXC003 as IIndexDefinition],
        [L1FIN003.symbol, L1FIN003 as IIndexDefinition],
        [L1INF003.symbol, L1INF003 as IIndexDefinition],
        [L1SCA004.symbol, L1SCA004 as IIndexDefinition],
        [L1STR004.symbol, L1STR004 as IIndexDefinition],
    ]
)

export const KnownSetsAddresses = new Map<string, Address>(
    [
        //hard to figure out why these are wrapped like that
        ["BTCETH5050", "0xc06aec5191be16b94ffc97b6fc01393527367365"],
        ["BTCETH7525", "0x5879536f56c2e9232c552e1d5eb0a5688bd2f817"],
        ["ETHBTC7525", "0xa6c040045d962e4b8efa00954c7d23ccd0a2b8ad"],
        
        //["ETHMINVOL", "0xf1e5f03086e1c0ce55e54cd8146bc9c28435346f"],

        //index created by transaction: 0xe28784f72d0724db621999eec6cdc0e741d348aa1190a25918a27ae8c6fa385d
        [L1CPU003.symbol, "0x7210cc724480c85b893a9febbecc24a8dc4ff1de"],
        //index created by transaction: 0x9844fb5a3b9bd8703021f140fd3223d87171e9bcfbd98bfdda485a7e2b768d64
        [L1FIN003.symbol, "0xa308dde45d2520108d16078457dbd489c3947e8a"],
        //index created by transaction: 0x4cb6a800814e7d5b8150a2cf0d00cdce16f5645d511b9c582be61930eb7cb731
        [L1INF003.symbol, "0x5a3996551e34ee9f3c0496af727dd07e8be127f2"],
        //index created by transaction: 0xd30fa565144105ac7d2311fa67648079154a6e99942c3434fc34be1d4d77dbb1
        [L1SCA004.symbol, "0xb2fc2d89e09e0d903c33f28608aecbe9b402ba59"],
        //index created by transaction: 0x120ad80e658077b889629e37a02f7198c63f073c4d66a55805f630b397763b4a
        [L1STR004.symbol, "0xe05168c3fa30e93d3f1667b35e9456aac9b5519a"],
    ]
)

export const KnownSetsSymbols = new Array<string>(KnownSetsAddresses.size);
const keyIterator = KnownSetsAddresses.keys();
for (let i = 0; i < KnownSetsAddresses.size; i++) {
    KnownSetsSymbols[i] = keyIterator.next().value
}

export const KnownSetsDefinitions = new Array<string>(KnownSets.size);
const definitionIterator = KnownSets.values();
for (let i = 0; i < KnownSets.size; i++) {
    KnownSetsDefinitions[i] = definitionIterator.next().value
}
