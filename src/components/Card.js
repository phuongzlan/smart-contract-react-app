import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import IconCheckboxList from './IconCheckboxList';
import iconModelsData from '../script/iconModels';
import { 
  createContract, 
  getAccounts, 
  getBalance,
  deploy
} from '../script/web3';
import CircularProgress from 'material-ui/CircularProgress';
import SelectAccount from './SelectAccount'; 
import TextField from './TextField';

import {
  Row, Col
} from 'reactstrap';

export default class CardExampleExpandable extends React.Component{
  constructor(){
    super();
    getAccounts((err, result) => {
      if (err || !result.length) return;
      getBalance(result[0], (err, balance) => {
        if (err) return;
        this.setState({
          accounts: result,
          defaultAccount: {
            number: result[0],
            balance,
          },
          oracleAccount: {
            number: result[0],
            balance,
          }
        });
      });
      getBalance(result[1], (err, balance) => {
        if (err) return;
        this.setState({
          sellerAccount: {
            number: result[1],
            balance,
          }
        });
      });
      getBalance(result[2], (err, balance) => {
        if (err) return;
        this.setState({
          buyerAccount: {
            number: result[2],
            balance,
          }
        });
      });


    });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.changeAccount = this.changeAccount.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deployContract = this.deployContract.bind(this);

    this.state = {
      iconModelsData,
      contractCode: '',
      requesting: false,
      contract: {
        _jsonInterface: []
      },
      contractDeploy: {
        _jsonInterface: []
      },
      accounts: [],
      defaultAccount:{},
      oracleAccount: {},
      buyerAccount: {},
      sellerAccount: {},
      price: 0,
      penaltyRate: 0
    }
  }
  
  changeAccount(name, value){
    getBalance(value, (err, balance) => {
        if (err) return;
        this.setState({
          [name]: {
            number: value,
            balance,
          }
        });
      })
  }

  handleChange(name, value){
    this.setState({
      [name]: value
    })
  }

  handleSubmit(){
    let states = this.state.iconModelsData.filter(t => t.checked);
    console.log(states);
    this.setState({
      requesting: true
    })
    createContract(states, (result) => {
      this.setState({
        contractCode: result.contractCode,
        contract: result.contract,
        requesting: false
      });
      console.log(result);
    });
  }
  handleCheck(index){
    let {iconModelsData} = this.state;
    iconModelsData[index].checked = !iconModelsData[index].checked;
    this.setState({
      iconModelsData
    })
  }

  deployContract(){
    const {
      sellerAccount,
      buyerAccount,
      oracleAccount,
      price,
      penaltyRate,
    } = this.state;

    deploy({
      contract: this.state.contract,
      params:[sellerAccount.number, buyerAccount.number, oracleAccount.number, price, penaltyRate],
      fromAccount: this.state.defaultAccount.number
    }, (err, contract) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(contract);
      getBalance(this.state.defaultAccount.number, (err, balance) => {
        if (err) return;
        this.setState({
          defaultAccount: {
            number: this.state.defaultAccount.number,
            balance,
          }
        });
      })
    })
  }
  render(){
    console.log(this.state);
    return (
      <div>
        <Card>
          <CardHeader
            title="Select Account"
          />
          <CardText>
            <SelectAccount 
              label='Default Account'
              name='defaultAccount'
              accounts={this.state.accounts} 
              accountSelected={this.state.defaultAccount}
              onChange={this.changeAccount}
              />
          </CardText>
        </Card>
        <Card>
          <CardHeader
            title="Actions List"
          />
          <CardText>
            <IconCheckboxList iconModelsData={this.state.iconModelsData} handleCheck={this.handleCheck} />
          </CardText>
          <CardActions>
            <RaisedButton disabled={this.state.requesting} primary={true} label="Create Contract" onClick={this.handleSubmit} />
          </CardActions>
          {this.state.requesting ? <CircularProgress /> : null }
        </Card>
        <Card>
          <CardHeader
            title="Contract Methods"
          />
          <CardText>
          {this.state.contract._jsonInterface.map((item, index) => {
            if (item.name && item.stateMutability !=='view') return(
            <RaisedButton 
              key={index}
              secondary={true} 
              style={{margin: 10, textTransform: 'none'}} 
              label={item.name} 
              />
            );
          })}
          </CardText>
        </Card>
        <Card>
          <CardHeader
            title="Deploy contract"
          />
          <CardText>
            <SelectAccount 
              label='Oracle Account'
              name='oracleAccount'
              accounts={this.state.accounts} 
              accountSelected={this.state.oracleAccount}
              onChange={this.changeAccount}
              />
            <SelectAccount 
              label='Buyer Account'
              name='buyerAccount'
              accounts={this.state.accounts} 
              accountSelected={this.state.buyerAccount}
              onChange={this.changeAccount}
              />
            <SelectAccount 
              label='Seller Account'
              name='sellerAccount'
              accounts={this.state.accounts} 
              accountSelected={this.state.sellerAccount}
              onChange={this.changeAccount}
              />
            <Row>
              <Col>
                <TextField 
                  type='number'
                  label='Price'
                  name='price'
                  value={this.state.price}
                  onChange={this.handleChange}
                />
              </Col>
              <Col>
                <TextField 
                  type='number'
                  label='Penalty Rate'
                  name='penaltyRate'
                  value={this.state.penaltyRate}
                  onChange={this.handleChange}
                />
              </Col>
            </Row>
            <RaisedButton 
              primary={true} 
              style={{margin: 10}} 
              label='Deploy' 
              disabled={this.state.requesting}
              onClick={this.deployContract}
              />
          </CardText>
        </Card>
        <Card>
          <CardHeader
            title="Contract Code"
          />
          <CardText>
            <pre>
              {this.state.contractCode}
            </pre>
          </CardText>
        </Card>
      </div>
    );
  }
}
