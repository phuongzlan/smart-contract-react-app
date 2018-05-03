import React from 'react';

import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';

import RaisedButton from 'material-ui/RaisedButton';

import TextField from './TextField';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import {
  Row, Col, Alert
} from 'reactstrap';
import ContractMethod from './ContractMethod';
import Snackbar from 'material-ui/Snackbar';

export default class EnterContract extends React.Component{
  constructor(){
    super();
    this.handleClickView = this.handleClickView.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.alertErr = this.alertErr.bind(this);
    this.state = {
      alert: {
        showAlert: false,
        message: ""
      },
    }
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  handleClickView(name){
    this.props.contract.methods[name]().call({from: this.props.defaultAccount.number}, (err, res) => {
      if (err){
        this.setState({
          [name]: 'Err'
        });
        return this.alertErr(err.message);
      }
      this.setState({
        [name]: res
      });
    });
  }
  handleChange(name, value){
    this.setState({
      [name]: value
    })
  }
  alertErr(message){
    this.setState({
      alert: {
        showAlert: true,
        message: message
      },
      requesting: false
    });
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
    const { contract } = this.props;
    console.log(contract);
    return (
      <Card>
        <CardTitle title='Contract Details' />
        
        <CardText>
          <Row> 
            <Col>
              <Subheader> Contract Address </Subheader>
            </Col>
            <Col>
              { contract._address }
            </Col>
          </Row>
          {contract._jsonInterface.map((item, index) => {
            if (item.name === 'seller' || item.name === 'buyer' ||
              item.name === 'oracle' || item.name === 'price' || 
              item.name === 'penaltyRate' || item.name === 'getState'){
              if (!this.state[item.name]) this.handleClickView(item.name);
              return(
                 <Row key={index}> 
                  <Col>
                    <Subheader> {item.name} </Subheader>
                  </Col>
                  <Col>
                    {this.state[item.name]}
                  </Col>
                </Row>
              );
            }
          })}
          <Divider />
          <Subheader> Contract Views: </Subheader>
          {contract._jsonInterface.map((item, index) => {
            if (item.name && item.stateMutability === 'view' && !(item.name === 'seller' || item.name === 'buyer' ||
              item.name === 'oracle' || item.name === 'price' || 
              item.name === 'penaltyRate' || item.name === 'getState')) return(
            <ContractMethod 
              key={index}
              contractMethod={item}
              method={this.props.contract.methods[item.name]}
              defaultAccount={this.props.defaultAccount}
              value={this.props.value}
              alertErr={this.alertErr}
            />
            )
          })}
          <Subheader> Contract Methods: </Subheader>
          {contract._jsonInterface.map((item, index) => {
            if (item.name && item.stateMutability !== 'view') return(
            <ContractMethod 
              key={index}
              contractMethod={item}
              method={this.props.contract.methods[item.name]}
              defaultAccount={this.props.defaultAccount}
              value={this.props.value}
              alertErr={this.alertErr}
              updateState={this.handleClickView}
            />
            )
          })}
        </CardText>
        <Snackbar
          open={this.state.alert.showAlert}
          message={this.state.alert.message}
          autoHideDuration={5000}
          onRequestClose={this.handleRequestClose}
        />
      </Card>
    );
  }
}
