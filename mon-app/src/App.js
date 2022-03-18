import React, { Component } from 'react';
import Web3 from 'web3';
import SongInTheCity from './FakeBAYC'
import ToutDoucement from './FakeNefturians'
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

// var songABI = require ("./SongForTheCityABI.js");
// var songContract = web3.eth.contract(songforthecity);


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {isConnected: false, chainId: undefined, lastBlockNumber: undefined, address: undefined, accounts: []};
    this.web3 = undefined
  }

  async loadWeb3() {
    if (window.ethereum.isConnected) {
      this.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
      this.setState({isConnected: true});
    } else {
      window.alert(
        'Metamask not detected! Install Metamask plugin to proceed: https://metamask.io/download.html'
      )
      this.setState({isConnected: false});
    }
  }

  async componentWillMount() {
    this.loadWeb3()
    this.setUpAccount()
  }

  async setUpAccount() {
    this.setState({chainId: await this.web3.utils.hexToNumber(window.ethereum.chainId)})
    this.setState({lastBlockNumber: await this.web3.eth.getBlockNumber()})
    this.setState({address: await this.web3.eth.getAccounts()})
    window.ethereum.on('accountsChanged', (accounts) => {
      this.setState({address: accounts})
    });
    window.ethereum.on('chainChanged', (chainId) => {
      this.setState({chainId: this.web3.utils.hexToNumber(chainId)})
    });
    window.ethereum.on('disconnect', () => {
      this.setState({isConnected: false})
    })
    window.ethereum.on('connect', () => {
      this.setState({isConnected: true})
    })
  }

    activateImages() {
      window.location.href="https://cors-anywhere.herokuapp.com/"
    }

  render() {
    
    // If the state.address in the 
    document.body.style = 'background: blue;';
    if (this.state.address === undefined) {
      return null
    }
    return (
      <Router>
      <div>
        <nav style={{margin: '1rem 1rem', textDecoration: 'none', textAlign: 'center', }}>
        <Button variant="contained" color="blue" style={{margin: '0.05rem'}}><Link to="/" style={{textDecoration: "none", color: 'black'}}></Link></Button>
        </nav>

        <Switch>
        
            
          <Route path="/">
            <Card style={{width: "35%",margin: '2rem auto', padding: '2rem', boxShadow: "0px 5px 5px -3px rgba(5, 4, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)"}}>
              <div style={{textAlign: 'center'}}>
                
                <Typography variant="h5" component="h6" gutterBottom >Metamask Chain Infos </Typography>
              
                <Typography variant="body1" gutterBottom style={{color: this.state.isConnected ? 'green':'red'}}>{this.state.isConnected ? 'Connected':'Not connected'}</Typography>
                <Typography variant="h5" component="h6" gutterBottom >Chain Id : {this.state.chainId} </Typography>
                <Typography variant="h5" component="h6" gutterBottom >Last Block Number : {this.state.lastBlockNumber} </Typography>
                <Typography variant="h5" component="h6" gutterBottom > User Address : {this.state.address} </Typography>
              </div>
              
            </Card>
            
            <SongInTheCity web3 = {this.web3} address = {this.state.address}></SongInTheCity>
            <ToutDoucement web3 = {this.web3} address = {this.state.address}></ToutDoucement>
          </Route>
        </Switch>
      </div>
    </Router>
    );
  }
}
export default App;