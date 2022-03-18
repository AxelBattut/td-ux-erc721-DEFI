import React, { Component } from 'react';
import abi from './FakeNefturiansABI';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import TokenGrid from './TokenGrid';

class FakeNefturians extends Component {
  constructor(props) {
    super()
    this.state = {contract: undefined, contractName: undefined, totalNumberToken: undefined, URIContent: undefined, token: {txHash: undefined, confirmationNumber: undefined}, tileData: [], tokensOwned: []}
  }

  async componentWillMount() {
      const instance = await new this.props.web3.eth.Contract(abi.abi, '0x14e68d0ba29c07478bd68f4a479a0211bd48ca4e')
      this.setState({contract: instance})
  }

  async buyToken(){
    this.state.contract.methods.buyAToken().send({from: this.props.address[0], gas: 500000, gasPrice: '50000000000', value: 100000000000000101})
    .on('transactionHash', function(hash){
      this.setState({token: {txHash: hash}})
    }.bind(this))
    .on('confirmation', function(confirmationNumber, receipt) {
      this.setState({token: {confirmationNumber: confirmationNumber}})
    }.bind(this))
    .on('receipt', function(receipt){
    }) 
  }

  async componentDidMount() {
    await this.displayToken();
  }

  async displayToken(){
    const instance = await new this.props.web3.eth.Contract(abi.abi, '0x14e68d0ba29c07478bd68f4a479a0211bd48ca4e')
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
    const instance = await new this.props.web3.eth.Contract(abi.abi, '0x14e68d0ba29c07478bd68f4a479a0211bd48ca4e')
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

        <h2>FakeNefturians</h2>        
        {/* <img alt="song in the city" src={this.state.nft.url} style={{height: "200px", width: "200px"}}/> */}
        <Button variant="contained" color="primary" onClick={() => this.buyToken()}>BUY TOKEN (0.1ETH)</Button>
        <p>Tx Hash : {this.state.token.txHash}</p>
        <p>Blocks Confirmations : {this.state.token.confirmationNumber}</p>
        </Card>
        <TokenGrid tileData={this.state.tileData}></TokenGrid>
      </div>
    );
  }
}
export default FakeNefturians;