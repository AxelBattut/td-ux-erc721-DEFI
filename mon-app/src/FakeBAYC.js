import React, { Component} from 'react';
import abi from './FakeBaycABI';
import TokenGrid from './TokenGrid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';


class FakeBAYC extends Component {
  constructor(props) {
    super(props)
    this.props = props
    this.state = {contract: undefined, contractName: undefined, totalNumberToken: undefined, URIContent: undefined, nft: {url: undefined, name: undefined, description: undefined }, token: {txHash: undefined, confirmationNumber: undefined},
  tileData: [], tokensOwned: []}  
  }

  async componentWillMount() {
      const instance = await new this.props.web3.eth.Contract(abi.abi, '0x6b740C7a965d75A4801642Fabc650DA92CeA47ef')
      this.setState({contract: instance})
      this.infosFromContract(this.state.contract)

  }

  async componentDidMount() {
    await this.displayToken();

  }

  async infosFromContract(instance) {
    this.setState({contract: instance})
    this.setState({contractName: await instance.methods.name().call()})
    this.setState({totalNumberToken: await instance.methods.tokenCounter().call()})
    instance.methods.tokenURI(0).call().then(uri => {
      fetch('https://cors-anywhere.herokuapp.com/' + uri)
      .then(res => res.json())
      .then(data => {
        this.setState({ nft: {url: data.properties.image.description, name: data.properties.name.description, description: data.properties.description.description} });
      })
    })
  }

  async creditToken(){
    //this.props.web3.eth.defaultAccount = this.props.web3.eth.accounts[0]; // = this.props.address  ou  web3.eth.accounts[0] ???
    //console.log(this.props.web3.eth.accounts[0])   is undefined ='(
    this.state.contract.methods.claimAToken().send({from : this.props.address[0]})
    .on('transactionHash', function(hash){
      this.setState({token: {txHash: hash}})
    }.bind(this))
    .on('confirmation', function(confirmationNumber, receipt) {
      this.setState({token: {confirmationNumber: confirmationNumber}})
    }.bind(this))
    .on('receipt', function(receipt){
    })
  }

  async displayToken(){
    const instance = await new this.props.web3.eth.Contract(abi.abi, '0x6b740C7a965d75A4801642Fabc650DA92CeA47ef')
    let nbTokens = await instance.methods.balanceOf(this.props.address[0]).call()
    let tid = undefined
    for (var i = 0; i < nbTokens; i++) {
      tid = await this.state.contract.methods.tokenOfOwnerByIndex(this.props.address[0], i).call()
      this.setState({ tokensOwned: [...this.state.tokensOwned, await this.displayInfos(tid)] })
      //this.state.tokensOwned.push(this.displayInfos(this.state.contract.methods.tokenOfOwnerByIndex(this.props.address[0], i)));
      //this.setState({tokensOwned: [...this.state.tokensOwned, this.displayInfos(i)]})
    }
    this.preRender()
  }

  preRender() {
    this.state.tokensOwned.forEach(elt => {
      this.setState({ tileData: [...this.state.tileData, {img: elt.img, title: elt.name, author: elt.tokenId}]})
    })
  }

  async displayInfos(tokenId){
    let img = ''
    let name = ''
    const instance = await new this.props.web3.eth.Contract(abi.abi, '0x6b740C7a965d75A4801642Fabc650DA92CeA47ef')
  //  let symbol = await this.state.contract.methods.symbol().call()
    let promise = instance.methods.tokenURI(tokenId).call().then(uri => {
      let promise = fetch('https://cors-anywhere.herokuapp.com/' + uri)
      .then(res => res.json())
      .then(data => {
        img = data.properties.image.description
        name = data.properties.name.description
        const token = {tokenId, name, img}
        return token
      })
      return promise
    })
    return promise
  }



  render() {
    return (
      <div>
      <Card style={{width: "35%", textAlign: 'center',margin: '2rem auto', padding: '2rem', boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"}}>
        <h2>Fake BAYC</h2>
        <p>Contract Name : {this.state.contractName}</p>
        <p>Total Number of Tokens : {this.state.totalNumberToken}</p>
       
        <br></br>
        <Button variant="contained" color="primary" onClick={() => this.creditToken()}>MINT TOKEN</Button>
        <p>Tx Hash : {this.state.token.txHash}</p>
        
      </Card>
      <TokenGrid tileData={this.state.tileData}></TokenGrid>
      </div>
    );
  }
}

export default FakeBAYC;