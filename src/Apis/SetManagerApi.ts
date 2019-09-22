import Fortmatic from 'fortmatic';
import SetProtocol, { Address } from 'setprotocol.js';
import { SetProtocolUtils, KyberTrade, ExchangeIssuanceParams } from 'set-protocol-utils';
import Web3 from 'web3';
import { GetUnitsCalculationParams } from 'Indexes/ComponentDetails';
import { MainNetSetContracts } from 'Config/SetProtocolContracts';
import BigNumber from 'bignumber.js';
import * as Erc20Tokens from 'Config/Erc20Tokens'
import promisify from 'tiny-promisify';
import { IIndexDetails } from 'Indexes/IndexDetails';
import { fortmaticApiKey } from 'Apis/ApiKeys'

declare global {
    interface Window { web3: any }
}

export class SetManagerApi {
    private _web3?: Web3;
    
    get web3(): Web3 {
        if(this._web3) return this._web3
        this._web3 = this.tryGetWeb3();
        return this._web3;
    }
    
    private _setProtocol?: SetProtocol;

    get setProtocol(): SetProtocol {
        if(this._setProtocol) return this._setProtocol;
        this._setProtocol = this.tryGetSetProtocol();
        return this._setProtocol;
    }

    accountAddress?: Address;
    gasPrice!: BigNumber;
    web3Error: string;

    constructor() {
        this.web3Error = '';
        this._web3 = this.tryGetWeb3();
        this._setProtocol = this.tryGetSetProtocol();
        this.gasPrice = new BigNumber(0);
        this.setLatestGasPrice();
    }

    public tryGetWeb3 = () => {

        let web3: Web3;
        try {
            if (window.web3) { web3 = window.web3; }
            else {
                const fm = new Fortmatic(fortmaticApiKey)
                web3 = new Web3(fm.getProvider());
            }
            if (!web3) {
                this.web3Error = "Please unlock your metamask.";
                throw new Error("Failed to instanciate web3.");
            }
            (web3.currentProvider as any).enable();
            return web3;
        } catch (error) {
            throw new Error("Set Manager needs to a web3 provider to work properly. " + 
            "Please either install an unlock Metamask, or get a Fortmatic API key and " +
            "replace the value in src/Apis/ApiKeys.ts")
        }
       
    }

    public tryGetSetProtocol = () => {
        try {
            const provider = this.web3.currentProvider;
            const setProtocol = new SetProtocol(provider as any, MainNetSetContracts);
            console.info('setProtocol initialised', setProtocol);
            return setProtocol;
        } catch (err) {
            return SetProtocol.prototype
        }
    }

    private setLatestGasPrice(updateStateCallback?: ((price: BigNumber) => void)) {
        this.web3.eth.getGasPrice((error, gasPrice) => {
            if (error) console.log(error);
            this.gasPrice = new BigNumber(gasPrice);
            if (updateStateCallback) updateStateCallback(this.gasPrice);
            return gasPrice;
        });
    }

    public async tryGetAccountAsync() {

        const getAccountPromise = promisify(this.web3.eth.getAccounts);
        try {
            this.accountAddress = (await getAccountPromise())[0];
        }
        catch (exception) {
            this.web3Error = exception
        }
    }

    public async refreshGasPrice(updateStateCallback?: ((price: BigNumber) => void)) {
        try {
            this.setLatestGasPrice(updateStateCallback);
        }
        catch (e) {
            console.error(e)
        }
        return this.gasPrice;
    }

    public createSet = async (indexDetails: IIndexDetails) => {

        const { components, prices, proportions, targetPrice }
            = GetUnitsCalculationParams(indexDetails)

        // calculate the units to assign to our new Token
        const { units, naturalUnit } = await
            this.setProtocol.calculateSetUnitsAsync(components, prices, proportions, new BigNumber(targetPrice));

        // console.log("units:", units.map(u => u.toExponential()))
        // console.log("index natural unit:", naturalUnit.toExponential())

        const account = this.accountAddress;
        const txOpts = {
            from: account,
            gas: 4000000,
            gasPrice: this.gasPrice.toNumber(),
        };

        const txHash = await this.setProtocol.createSetAsync(
            components,
            units,
            naturalUnit,
            indexDetails.name,
            indexDetails.symbol,
            txOpts,
        );

        console.debug('index created by transaction:', txHash);
        const setAddress = await this.setProtocol
            .getSetAddressFromCreateTxHashAsync(txHash);

        return setAddress;
    }

    public issueSet = async (setAddress: Address, tokenQuantity: BigNumber) => {
        try {
            const quantity = await this.validateAndGetMultipliedQuantity(setAddress, tokenQuantity);
            return await this.setProtocol.issueAsync(
                setAddress,
                quantity,
                {
                    from: this.accountAddress,
                    gas: 4000000,
                    gasPrice: this.gasPrice.toNumber(),
                },
            );
        } catch (err) {
            throw new Error(`Error when issuing token at address ${setAddress}: ${err}`);
        }
    }

    public redeemSet = async (setAddress: Address, tokenQuantity: BigNumber) => {
        try {
            const quantity = await this.validateAndGetMultipliedQuantity(setAddress, tokenQuantity);
            const withdraw = true;
            const tokensToExclude = [] as string[];

            return await this.setProtocol.redeemAsync(
                setAddress,
                quantity,
                withdraw,
                tokensToExclude,
                {
                    from: this.accountAddress,
                    gas: 4000000,
                    gasPrice: this.gasPrice.toNumber(),
                },
            );
        } catch (err) {
            throw new Error(`Error when redeeming token at address ${setAddress} : ${err.message}`);
        }
    }

    private async validateAndGetMultipliedQuantity(address: Address, tokenQuantity: BigNumber) {
        const decimals = await this.setProtocol.erc20.getDecimalsAsync(address);
        const multiplier = new BigNumber(10 ** decimals.toNumber());
        const naturalUnit = await this.setProtocol.setToken.getNaturalUnitAsync(address);
        const quantity = tokenQuantity.mul(multiplier)

        console.log(`multiplied quantity is ${quantity}=${tokenQuantity}*${multiplier}`, quantity.toNumber)

        const isMultipleOfNaturalUnit = await this.setProtocol.setToken
            .isMultipleOfNaturalUnitAsync(address, quantity);
        if (!isMultipleOfNaturalUnit) {
            throw new Error(`Quantity ${tokenQuantity} * ${multiplier} = ${quantity} is not multiple of natural unit ${naturalUnit}.
            Confirm that your issue quantity is divisible by the natural unit.`);
        }
        return quantity;
    }

    public approveTokensForTransfer = async (indexDetails: IIndexDetails) => {

        const componentsAddresses = indexDetails.components.map(c => c.address);

        componentsAddresses.forEach(async (address: Address) => {
            console.info(`requesting withdraw approval for token ${address}`);
            await this.setProtocol.setUnlimitedTransferProxyAllowanceAsync(
                address, { gas: 60000, gasPrice: this.gasPrice.toNumber() },
            );
        });
    };

    public createIssuanceOrders = async (setAddress: Address) => {

        const tUsd = Erc20Tokens.tUsd;
        const makerTokenAmount = new BigNumber(1.0)

        try {
            const requiredComponents = await this.setProtocol.setToken.getComponentsAsync(setAddress);
            console.info('requiredComponents', requiredComponents)

            const amountToIssue = new BigNumber(10 ** 19);
            const requiredQuantities = await this.setProtocol.setToken.calculateComponentAmountsForIssuanceAsync(
                setAddress, amountToIssue);

            var requiredComponentAmounts = requiredQuantities.map(c => c.unit);

            console.info(requiredQuantities.map(c => tUsd));
            console.info(requiredQuantities.map(q => q.address));
            console.info(requiredComponentAmounts.map(q => q.toString()));

            var kyberConversionRates = await this.setProtocol.exchangeIssuance.getKyberConversionRates(
                [requiredQuantities.map(c => tUsd)[1]],
                [requiredQuantities.map(q => q.address)[1]],
                [requiredQuantities.map(q => q.unit)[1]])



            requiredQuantities.forEach((c, i) => {
                console.info(c.address, c.unit.toString(), kyberConversionRates[i][0])
            })

            const kyberTrades = requiredQuantities.map((q, i): KyberTrade => {
                const trade: KyberTrade = {
                    destinationToken: q.address,
                    sourceToken: tUsd,
                    sourceTokenQuantity: q.unit.div(kyberConversionRates[i][0]),
                    minimumConversionRate: kyberConversionRates[i][0].mul(0.98),
                    maxDestinationQuantity: q.unit
                };
                return trade;
            });

            console.info("kyber trades prepared", kyberTrades);

            //const twelveHoursInSec = 12 * 60 * 60;
            //var expiration = SetProtocolTestUtils.generateTimestamp(twelveHoursInSec)

            const txOpts = {
                from: this.accountAddress,
                gas: 4000000,
                gasPrice: this.gasPrice.toNumber(),
            };

            var exchangeParams: ExchangeIssuanceParams = {
                setAddress: setAddress,
                sendTokenExchangeIds: [SetProtocolUtils.EXCHANGES.KYBER],
                sendTokens: [tUsd],
                sendTokenAmounts: [makerTokenAmount.mul(1.1)],
                quantity: amountToIssue,
                receiveTokens: requiredQuantities.map(r => r.address),
                receiveTokenAmounts: requiredQuantities.map(r => r.unit)
            }

            console.info("exchange params", exchangeParams)

            var exchangeIssue = await this.setProtocol.exchangeIssuance.exchangeIssueAsync(exchangeParams, kyberTrades, txOpts);
            return exchangeIssue

        } catch (error) {
            console.error(error)
        };
    }
} 
