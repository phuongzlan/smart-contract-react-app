import React from 'react';
import {
  Step,
  Stepper,
  StepLabel,
  StepContent
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
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
import ContractDetail from './ContractDetail';

import {
  Row, Col
} from 'reactstrap';

export default class CreateContract extends React.Component {
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
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);

    this.state = {
      alert: {
        showAlert: false,
      },
      iconModelsData,
      finished: false,
      stepIndex: 0,
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
      penaltyRate: 0,
      value: 0
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
    createContract(states, (err, result) => {
      if (err) {
        this.setState({
          alert: {
            showAlert: true,
            message: err
          },
          requesting: false
        });
        setTimeout(() => {
          this.setState({
            alert: {
              showAlert: false,
              message: null
            }
          });
        }, 5000);
        return;
      }
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
      this.setState({
        contractDeploy: contract
      });
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
    });
    this.handleNext();
  }
  handleNext(){
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 1,
    });
  };

  handlePrev(){
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return 'Select campaign settings...';
      case 1:
        return 'What is an ad group anyways?';
      case 2:
        return 'This is the bit I really care about!';
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};

    return (
      <div style={{ margin: 'auto'}}>
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
        <Stepper activeStep={stepIndex} orientation="vertical">
          <Step>
            <StepLabel> Choose Contract Actions </StepLabel>
            <StepContent>
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
              {this.state.contract._jsonInterface.length ?
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
                : null
              }
              {this.state.contractCode ? 
              <Card>
                <CardHeader
                  title="Contract Code"
                  actAsExpander={true}
                  showExpandableButton={true}
                />
                <CardText expandable={true}>
                  <pre>
                    {this.state.contractCode}
                  </pre>
                </CardText>
              </Card>
              : null
              }
            </StepContent>
          </Step>
          <Step>
            <StepLabel> Deploy Contract </StepLabel>
            <StepContent>
              <Card>
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
            </StepContent>
          </Step>
          <Step>
            <StepLabel> Contract Details</StepLabel>
            <StepContent>
              <ContractDetail 
                contract={this.state.contractDeploy}
                defaultAccount={this.state.defaultAccount}
                value={this.state.value}
                />
            </StepContent>
          </Step>
        </Stepper>
        <CardActions style={contentStyle}>
          {finished ? (
            <p>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({stepIndex: 0, finished: false});
                }}
              >
                Click here
              </a> to create new contract.
            </p>
          ) : (
            <div>
              <div style={{marginTop: 12}}>
                <FlatButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onClick={this.handlePrev}
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  label={stepIndex === 1 ? 'Finish' : 'Next'}
                  primary={true}
                  onClick={this.handleNext}
                />
              </div>
            </div>
          )}
        </CardActions>
      </div>
    );
  }
}