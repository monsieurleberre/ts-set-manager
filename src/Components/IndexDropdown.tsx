import React from 'react';
import { KnownSetsSymbols } from 'Indexes/KnownSets';
import { Menu, Dropdown, Icon } from 'antd/lib';
import { ClickParam } from 'antd/lib/menu';
import 'Components/IndexDropdown.css'

export interface IndexDropdownProps {
    handleSelect: ((param: ClickParam) => void);
    currentSelection: string;
}

export interface IndexDropdownState {
    currentSelection: string;
}

export default class IndexDropdown extends React.Component<IndexDropdownProps>{
    state: IndexDropdownState = {
        currentSelection: ''
    }

    render() {
        const indexMenu =
            <Menu onClick={this.props.handleSelect}>
                {KnownSetsSymbols.map(k => <Menu.Item key={k}>{k}</Menu.Item>)}
            </Menu>

        return (<div>
            <h4>Predefined Sets</h4>
            <Dropdown overlay={indexMenu} className="Index-dropdown">
                <a>
                    {this.props.currentSelection || "Select an index"} <Icon type="down" />
                </a>
            </Dropdown>
        </div>
        );
    }
}
