import { BigNumber } from "bignumber.js";

const ConfigureBigNumber = () => {

    BigNumber.config({ EXPONENTIAL_AT: 1 })
    BigNumber.prototype.toJSON = function() {
        return this.toExponential();
    }
    
}

export default ConfigureBigNumber;