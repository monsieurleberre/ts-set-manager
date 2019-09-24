import React from 'react';
import { KnownSetsSymbols, KnownSetsAddresses } from 'Indexes/KnownSets';
import { Input, Select } from 'antd';
import 'Components/IndexDropdown.css'
import { Address } from 'setprotocol.js';

export interface IndexDropdownProps {
    //handleSelect: ((param: ClickParam) => void);
    bubbleAddressChange: ((address: Address) => void),
    //addressInput: string;
}

export interface IndexDropdownState {
    //currentSelection: string;
    currentAddress: string;
}

export const CUSTOM_SYMBOL = "🎅💨☮❤💱"

export default class IndexDropdown extends React.Component<IndexDropdownProps>{
    state: IndexDropdownState = {
        //currentSelection: '',
        currentAddress: ''
    }

    constructor(props: IndexDropdownProps) {
        super(props);

        this.handleSetAddressChange = this.handleSetAddressChange.bind(this);
        this.handleSymbolChanged = this.handleSymbolChanged.bind(this);
    }

    async handleSetAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({currentAddress: event.target.value})
        const address = event.target.value as Address
        await this.props.bubbleAddressChange(address)
      }

    handleSymbolChanged(value: string){
        const address = (KnownSetsAddresses.get(value) || '') as Address;
        this.setState({currentAddress: address})
        this.props.bubbleAddressChange(address)
    }

    render() {

        const {currentAddress} = this.state
        const customItem = [<Select.Option key={CUSTOM_SYMBOL}>Custom</Select.Option>];
        const items = customItem.concat(KnownSetsSymbols.sort().map(k => <Select.Option key={k}>{k}</Select.Option>));

        const select =
            <Select defaultValue={CUSTOM_SYMBOL} 
                onChange={this.handleSymbolChanged}
                style={{ width: 130 }} >
                {items}
            </Select>

        const customAddressInput = <Input 
            addonBefore={select}
            onChange={this.handleSetAddressChange} 
            value={currentAddress}
            style={{ width: "80%" }}/>

        return (<div>
            <h4>Set Address</h4>
            {customAddressInput}

        </div>
        );
    }
}
