import L1CPU003 from './Definitions/L1CPU003.definition.json';
import { IIndexDefinition } from './IndexDetails.js';

it('Should parse the content of the JSON to an IIndexDefinition.', () => {
    
    const definition = L1CPU003 as IIndexDefinition;
    expect(definition.symbol).toBe('L1CPU003');
    expect(definition.componentAddresses.length).toBe(3);
    expect(definition.targetUsdPrice).toBe(0.1);
    expect(definition.componentAddresses[2]).toBe('0x8290333cef9e6d528dd5618fb97a76f268f3edd4')

    console.info(definition)
})

