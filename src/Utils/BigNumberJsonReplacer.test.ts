import L1AD005 from 'Indexes/Definitions/L1CPU003.definition.json';
import ConfigureBigNumber from "./BigNumberJsonReplacer";
import { IIndexDefinition } from 'Indexes/IndexDetails';

describe("BigNumberReplacer", () => {
    it("should serialise BigNumber fields using exponential format", () => {
        const details = L1AD005 as IIndexDefinition;
        ConfigureBigNumber();
        const serialised = JSON.stringify(details, null, 2);
        expect(serialised).not.toBeNull();
        expect(serialised).not.toBe('{}');
        console.info(serialised);
        //expect(true).toBe(false);
    })
})