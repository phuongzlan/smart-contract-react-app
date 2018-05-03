import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from './TextField';
import RefreshIndicator from './RefreshIndicator';
import IconCheckboxList from './IconCheckboxList';
import iconModelsData from '../script/iconModels';
import { 
  createContract, 
  getAccounts, 
  getBalance,
  deploy,
  getContractByAddress,
} from '../script/web3';

import {
  Row, Col
} from 'reactstrap';

import SelectAccount from './SelectAccount'; 
import ContractDetail from './ContractDetail';
import Snackbar from 'material-ui/Snackbar';

export default class EnterContract extends React.Component{
  constructor(){
    super();
    this.state = {
      alert: {
        showAlert: false,
        message: ''
      },
      address: '',
      value: 0,
      accounts: [],
      iconModelsData,
      defaultAccount:{},
      contract: {
        _jsonInterface: []
      },
    }

    getAccounts((err, result) => {
      if (err || !result.length) return;
      getBalance(result[0], (err, balance) => {
        if (err) return;
        this.setState({
          accounts: result,
          defaultAccount: {
            number: result[0],
            balance,
          }
        });
      });
    });

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.changeAccount = this.changeAccount.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);

  }

  handleChange(name, value){
    this.setState({
      [name]: value
    });
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
  handleSubmit(){
    let states = this.state.iconModelsData.filter(t => t.checked);
    console.log(states);
    this.setState({
      requesting: true
    })
    createContract(states, (err, result) => {
      if (err || !result.contract) {
        return this.setState({
          alert: {
            showAlert: true,
            message: err
          },
          requesting: false
        });
      }
      getContractByAddress({
        contract: result.contract, 
        address: this.state.address
      }, (contract) => {
        console.log(contract);
        this.setState({
          contract,
          requesting: false
        });
      });
    });
  }
  handleCheck(index){
    let {iconModelsData} = this.state;
    iconModelsData[index].checked = !iconModelsData[index].checked;
    this.setState({
      iconModelsData
    })
  }
  handleRequestClose(){
    this.setState({
      alert: {
        showAlert: false,
        message: ""
      }
    });
  };
  render(){
    return (
      <div>
        <Card>
          <CardHeader
            title="Choose Default Account"
          />
          <CardText>
            <Row>
              <Col sm='auto'>
                <SelectAccount 
                  label='Default Account'
                  name='defaultAccount'
                  accounts={this.state.accounts} 
                  accountSelected={this.state.defaultAccount}
                  onChange={this.changeAccount}
                  />
                </Col>
                <Col>
                  <TextField 
                    label='Value (wei)'
                    name='value'
                    type='number'
                    value={this.state.value}
                    onChange={this.handleChange}
                    fullWidth={true}
                  />
                </Col>
              </Row>
          </CardText>
        </Card>
        <Card>
          {this.state.requesting ? <RefreshIndicator /> : null }
          <CardHeader
            title="Enter Contract"
          />
          <CardText>
            <IconCheckboxList iconModelsData={this.state.iconModelsData} handleCheck={this.handleCheck} />
            <TextField 
              label='Address'
              name='address'
              value={this.state.address}
              onChange={this.handleChange}
              fullWidth={true}
            />
          </CardText>
          <CardActions>
            <RaisedButton 
              disabled={this.state.requesting} 
              primary={true} 
              label="Enter" 
              onClick={this.handleSubmit} 
              />
          </CardActions>
          {this.state.contract._address ? 
            <ContractDetail 
              contract={this.state.contract}
              defaultAccount={this.state.defaultAccount}
              value={this.state.value}
            /> : null 
          }
          <Snackbar
            open={this.state.alert.showAlert}
            message={this.state.alert.message}
            autoHideDuration={5000}
            onRequestClose={this.handleRequestClose}
          />
        </Card>
       
      </div>
    );
  }
}
