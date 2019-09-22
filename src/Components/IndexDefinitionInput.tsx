import React, { ChangeEvent } from 'react';
import 'Components/App.css'
import { IIndexDetails, IIndexDefinition } from 'Indexes/IndexDetails';
import TextArea from 'antd/lib/input/TextArea';

export interface IndexDefinitionInputProps {
    handleInputChange: ((event: ChangeEvent<HTMLTextAreaElement>) => void);
    enabled: boolean;
}

export interface IndexDefinitionInputState {
    input: string;
    definition?: IIndexDefinition;
    details?: IIndexDetails;
}

export default class IndexDefinitionInput extends React.Component<IndexDefinitionInputProps>{
    enabled: any;

    constructor(props: IndexDefinitionInputProps) {
        super(props);
        this.enabled = props.enabled;
    }

    state: IndexDefinitionInputState = {
        input: '',
    }

    render() {
        if (!this.enabled) return (<div />);

        return (
            <div className="App-set-definition-input">
                <h4>My set definition</h4>
                <TextArea
                    rows={10}
                    onChange={this.props.handleInputChange} />
            </div>)
    }
}
