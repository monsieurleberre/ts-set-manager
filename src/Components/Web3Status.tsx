import React from 'react';
import 'Components/App.css'
import 'Components/Web3Status.css'
import { SetManagerApi } from 'Apis/SetManagerApi';
import { InputNumber, Icon } from 'antd';
import BigNumber from 'bignumber.js';

export interface Web3StatusProps {
    setManagerApi: SetManagerApi
}

export interface Web3StatusState {
    walletAddress: string;
    walletError: string;
    gasPrice: BigNumber;
    currentGasPrice: BigNumber;
}

export default class Web3Status extends React.Component<Web3StatusProps>{
    setManagerApi: SetManagerApi;
    
    constructor(props: Web3StatusProps) {
        super(props);
        this.setManagerApi = props.setManagerApi;

        this.unlockAccount = this.unlockAccount.bind(this);
        this.overrideGasPrice  = this.overrideGasPrice.bind(this);
        this.resetGasPrice  = this.resetGasPrice.bind(this);
    }

    async componentDidMount() { 
        this.unlockAccount();
     }

    state: Web3StatusState = {
        walletAddress: '',
        walletError: '',
        gasPrice: new BigNumber(0),
        currentGasPrice: new BigNumber(0)
    }

    async unlockAccount() {
        if(!this.setManagerApi) return;
        
        await this.setManagerApi.tryGetAccountAsync();
        await this.resetGasPrice()
        this.setState({
            walletAddress: this.setManagerApi.accountAddress,
            walletError: this.state.walletError,
        })
    }

    overrideGasPrice(value: number | undefined) {
        if(!value) return;
        this.setManagerApi.gasPrice = new BigNumber(value);
        this.setState({gasPrice: this.setManagerApi.gasPrice})
    }

    async resetGasPrice() {
        await this.setManagerApi.refreshGasPrice(
            n => this.setState({currentGasPrice: n, gasPrice: n})
        );
    }

    renderWallet = () => {
        if (this.state.walletError || !this.state.walletAddress) {
            const message = this.state.walletError 
            ? <h3>Account not available: {this.state.walletError}</h3>
            : <h3>Account not available, please unlock.</h3>
            return (
                <div>
                    {message}
                    <button className="App-button" onClick={this.unlockAccount}>
                        Unlock my account.
                    </button>
                </div>)
        }
        return (<div><code>Wallet: {this.state.walletAddress}</code></div>)
    }

    renderGasPrice = () => {
        return(<div>
                <code>current gas price: {this.state.currentGasPrice.toNumber()} <a onClick={this.resetGasPrice}><Icon type="reload" /></a> | 
                override gas price : <InputNumber 
                    className="Web3Status-override-gas-price" onChange={this.overrideGasPrice} value={this.state.gasPrice.toNumber()}></InputNumber>
                </code>
            </div>)
    }

    render() {
        return (
            <div>
                {this.renderWallet()}
                {this.renderGasPrice()} <br />
            </div>)
    }
}
