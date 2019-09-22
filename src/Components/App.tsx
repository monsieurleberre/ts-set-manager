import React from 'react';
import setLogo from 'assets/setlogo.189bf363.svg';
import { SetManagerApi } from 'Apis/SetManagerApi';
import { Address } from 'setprotocol.js';
import { IIndexDetails, IndexDetails, IIndexDefinition } from "Indexes/IndexDetails";
import BigNumber from 'bignumber.js';
import 'Components/App.css';
import IndexDetailsFactory from 'Indexes/IndexDetailsFactory';
import TextArea from 'antd/lib/input/TextArea';
import { Row, Col, InputNumber, Icon, Alert } from 'antd/lib';
//import ConfigureBigNumber from "Utils/BigNumberJsonReplacer";
import IndexDropdown from 'Components/IndexDropdown';
import { ClickParam } from 'antd/lib/menu';
import Web3Status from 'Components/Web3Status';
import { KnownSets, KnownSetsAddresses } from 'Indexes/KnownSets';
import IndexDefinitionInput from 'Components/IndexDefinitionInput';

type AppProps = {
};

type AppState = {
  createdSetLink?: URL;
  walletAddress?: Address;
  walletError?: string;
  indexDetails: IIndexDetails;
  //indexDefinition: IIndexDefinition
  setAddress: string;
  issuanceOrder: string;
  output: string;
  issueQuantity: BigNumber;
  redeeemQuantity: BigNumber;
  error: Error | undefined;
};

export default class App extends React.Component<AppProps, AppState> {
  private setManagerApi!: SetManagerApi;
  private indexDetailsFactory: IndexDetailsFactory;

  constructor(props: AppProps) {
    super(props);
    //ConfigureBigNumber();

    this.indexDetailsFactory = IndexDetailsFactory.prototype;

    this.handleSetAddressChange = this.handleSetAddressChange.bind(this);
    this.handleDefinitionChanged = this.handleDefinitionChanged.bind(this);
    this.createSet = this.createSet.bind(this);
    this.issueSet = this.issueSet.bind(this);
    this.redeemSet = this.redeemSet.bind(this);
    this.approveTokensForTransfer = this.approveTokensForTransfer.bind(this);
    this.createIssuanceOrder = this.createIssuanceOrder.bind(this);
    this.logStateOnConsole = this.logStateOnConsole.bind(this);
    this.indexSelectionChanged = this.indexSelectionChanged.bind(this);
    this.updateDefinitionFromAddress = this.updateDefinitionFromAddress.bind(this);
    this.updateIssueQuantity = this.updateIssueQuantity.bind(this);
    this.updateRedeemQuantity = this.updateRedeemQuantity.bind(this);
    this.closeError = this.closeError.bind(this);
  }

  state: AppState = {
    createdSetLink: URL.prototype,
    indexDetails: IndexDetails.prototype,
    setAddress: '',
    issuanceOrder: '',
    output: '',
    issueQuantity: new BigNumber(0),
    redeeemQuantity: new BigNumber(0),
    error: undefined
  }

  async componentDidMount() {
    
    try {
      this.setManagerApi = new SetManagerApi();
      await this.setManagerApi.tryGetAccountAsync();
      if (this.setManagerApi.web3 
        && this.setManagerApi.setProtocol) {
  
        this.indexDetailsFactory = new IndexDetailsFactory(this.setManagerApi.setProtocol)
  
        this.setState({
          walletAddress: this.setManagerApi.accountAddress,
          walletError: ''
        });
      }  
    } catch (error) {
      this.setState({ walletError: error.message || '', ...this.state })
    }    
  }

  async handleSetAddressChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ setAddress: event.target.value },
      () => console.debug('setAddress', this.state));
  }

  async handleDefinitionChanged(event: React.ChangeEvent<HTMLTextAreaElement>) {
    console.debug('raw defintion changed')
    try {
      const json = JSON.parse(event.target.value);
      const indexDefinition = json as IIndexDefinition;
      await this.indexDetailsFactory.getIndexDetails(indexDefinition);
    } catch (error) {
      if (error instanceof SyntaxError) return;
      console.error(error);
      this.setState({
        output: "Index definition invalid. Here is a suitable example: \n\r"
          + JSON.stringify(KnownSets.get(KnownSets.keys().next().value))
      })
    }
  }

  async indexSelectionChanged(param: ClickParam) {
    const indexAddress = KnownSetsAddresses.get(param.key);
    if (!indexAddress) return
    await this.updateDefinitionFromAddress(indexAddress);
  }

  async updateDefinitionFromAddress(address: Address) {
    try {
      var indexDetails = await this.indexDetailsFactory.getIndexDetailsFromAddress(address)
      if (!indexDetails) {
        console.warn('Failed to retrieve index details.')
        return;
      }
      const detailsJson = JSON.stringify(indexDetails, null, 2)
      this.setState({
        setAddress: address,
        indexDetails: indexDetails,
        createdSetLink: new URL(`https://etherscan.io/token/${address}`),
        output: detailsJson
      }, () => console.debug('updated definition', this.state))
    } catch (error) {
      console.error('Failed to retrieve index details.')
      this.setState({error: error.message})
    }

  }

  updateIssueQuantity(value: number | string | undefined) {
    this.setState({ issueQuantity: this.getNewQuantity(value) });
  }

  updateRedeemQuantity(value: number | string | undefined) {
    this.setState({ redeeemQuantity: this.getNewQuantity(value) });
  }

  private getNewQuantity(value: number | string | undefined) {
    let newQuantity;
    try {
      newQuantity = new BigNumber(value || 0);
    }
    catch (e) {
      newQuantity = new BigNumber(0);
    }
    return newQuantity;
  }

  async createSet() {
    if (!this.state.indexDetails) return;

    const setAddress = await this.setManagerApi.createSet(this.state.indexDetails)
    this.setState({
      createdSetLink: new URL(`https://etherscan.io/token/${setAddress}`),
      setAddress: setAddress,
      ...this.state
    });
  }

  async issueSet() {
    try {
      await this.setManagerApi.issueSet(this.state.setAddress, this.state.issueQuantity)
    }
    catch (e) {
      this.setState({ error: e as Error });
    }
  }

  async redeemSet() {
    try {
      await this.setManagerApi.redeemSet(this.state.setAddress, this.state.redeeemQuantity)
    }
    catch (e) {
      this.setState({ error: e as Error });
    }
  }

  async approveTokensForTransfer() {
    try {
      this.setManagerApi.approveTokensForTransfer(this.state.indexDetails);
    }
    catch (e) {
      this.setState({ error: e as Error });
    }
  }

  closeError() {
    this.setState({ error: undefined })
  }

  async createIssuanceOrder() {
    const order = await this.setManagerApi.createIssuanceOrders(this.state.setAddress);
    console.info('issuance order created', order)
    this.setState({ issuanceOrder: order, ...this.state })
  }

  async logStateOnConsole() {
    if (this.state.indexDetails)
      console.log('state index details', JSON.stringify(this.state.indexDetails, null, 2))

    console.log(this.state);
  }

  renderEtherScanLink(link: URL) {
    return link !== URL.prototype ? (
      <div className="App-button-container">
        <a target="_blank" rel="noopener" href={link.href}>
          See token on etherscan.io
        </a>
      </div>
    ) : (<div />)
  }

  render() {
    const { createdSetLink,
      walletAddress,
      indexDetails,
      setAddress,
      output,
      error } = this.state;

    // const issueOrderButton =
    //   (<p><button className="App-button" onClick={this.createIssuanceOrder}
    //     disabled={!walletAddress || !setAddress}>
    //     Issue component orders for {indexDetails.name}
    //   </button></p>)

    // const createSetButton =
    //   (<p><button className="App-button" onClick={this.createSet}
    //     disabled={!walletAddress}>
    //     Create My {indexDetails.name} Set
    //   </button></p>)

    const web3Status = this.setManagerApi 
      ? <Web3Status setManagerApi={this.setManagerApi} /> 
      : <div>Web3 provider not found.</div>

    const errorBox = !error
      ? <div />
      : <Alert
        message={error.message}
        description={error.stack}
        type="error"
        closable
        onClose={this.closeError}
      />

    return (
      <div className="App">
        <header className="App-header">
          <img src={setLogo} className="App-logo" alt="Set logo" />
          <h1 className="App-title">Set Manager</h1>
        </header>
        {web3Status}
        <br />
        <br />
        <Row gutter={16} type="flex" >
          <Col span={12}>
            <div>
              <IndexDefinitionInput enabled={false}
                handleInputChange={this.handleDefinitionChanged} />
              <IndexDropdown
                handleSelect={this.indexSelectionChanged}
                currentSelection={indexDetails.symbol} />
            </div>
            <div>
              {createdSetLink ? this.renderEtherScanLink(createdSetLink) : null}
              <p>
                <button className="App-button"
                  onClick={this.approveTokensForTransfer}
                  disabled={!walletAddress || !setAddress}>
                  Approve Tokens for Transfer
                </button>
              </p>
            </div>
            <div>
              <Row type="flex" align="middle" gutter={5}>
                <Col span={5}>
                  <Row type="flex" justify="end"><h4>Issue</h4></Row></Col>
                <Col span={10}><InputNumber
                  className="App-quantity-input-in-button"
                  value={this.state.issueQuantity.toNumber()}
                  onChange={this.updateIssueQuantity} /></Col>
                <Col span={6}><Row type="flex" justify="start" >{indexDetails.symbol} tokens using my funds</Row></Col>
                <Col span={3}><button className="App-button App-button--small" onClick={this.issueSet}
                  disabled={!walletAddress || !setAddress}>
                  <Icon type="audit" />
                </button>
                </Col>
              </Row> <br />

              <Row type="flex" align="middle" gutter={5}>
                <Col span={5}>
                  <Row type="flex" justify="end"><h4>Redeem</h4></Row></Col>
                <Col span={10}><InputNumber
                  className="App-quantity-input-in-button"
                  value={this.state.redeeemQuantity.toNumber()}
                  onChange={this.updateRedeemQuantity} /></Col>
                <Col span={6}><Row type="flex" justify="start" >{indexDetails.symbol} tokens to my wallet</Row></Col>
                <Col span={3}><button className="App-button App-button--small"
                  onClick={this.redeemSet}
                  disabled={!walletAddress || !setAddress}>
                  <Icon type="fire" />
                </button>
                </Col>
              </Row> <br />
              <p>
                <button className="App-button"
                  onClick={this.logStateOnConsole}>
                  Log state on Console
                </button>
              </p>
            </div>
          </Col>
          <Col span={12} >
            <TextArea className="App-output"
              rows={20}
              style={{ height: "100%" }}
              value={output || "... select an index to get its details..."}
              readOnly />
          </Col>
        </Row>
        <footer>
          {errorBox}
        </footer>
      </div>

    );
  }
}