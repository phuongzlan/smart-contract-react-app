import React from 'react';

import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';

import RaisedButton from 'material-ui/RaisedButton';

import TextField from './TextField';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import {
  Row, Col
} from 'reactstrap';

export default class ContractMethod extends React.Component{
  constructor(props){
    super(props);
    this.handleClickView = this.handleClickView.bind(this);
    this.handleClickNoneView = this.handleClickNoneView.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeInputs = this.handleChangeInputs.bind(this);
    this.state = {
      value: 0,
      inputs: props.contractMethod.inputs || [],
      outputs: [],
    }
  }

  handleChange(name, value){
    this.setState({
      [name]: value
    })
  }
  handleChangeInputs(index, value){
    let { inputs } = this.state;
    inputs[index].value = value;
    this.setState({
      inputs
    });
  }

  handleClickView(name){
    let inputs = [];
    this.state.inputs.map(item => {
      inputs.push(item.value || "");
    });
    
    let method = this.props.method(...inputs);

    method.call({from: this.props.defaultAccount.number}, (err, res) => {
      if (err) return this.props.alertErr('Error! Make sure you have chosen right account and value');
      if (typeof res!== 'string' && res.length > 0)
        return this.setState({
          outputs: res
        });
      this.setState({
        outputs: [res]
      });
    });
  }

  handleClickNoneView(name){
    let inputs = [];
    this.state.inputs.map(item => {
      inputs.push(item.value);
    });
    
    let method = inputs.length ? this.props.method(inputs) : this.props.method();

    method.send({
      from: this.props.defaultAccount.number,
      value: this.props.value,
    }, (err, res) => {
      if (err) return this.props.alertErr('Error! Make sure you have chosen right account and value');
      if (typeof res!== 'string' && res.length > 0)
        return this.setState({
          outputs: res
        });
      this.props.updateState('getState');
      this.setState({
        outputs: [res]
      });
    });
  }
  render(){
    const { contractMethod } = this.props;
    console.log(this.props);
    return (
      <div>
        <RaisedButton 
          secondary={true} 
          style={{margin: 10}}
          label={contractMethod.name} 
          onClick={() => { 
            contractMethod.stateMutability === 'view' ? 
            this.handleClickView(): this.handleClickNoneView() 
          }}
          />
        { this.state.inputs.length ? 
          <Row>
            <Col>
              Inputs:
            </Col>
              {this.state.inputs.map((item, index) => (
                <Col key={index}>
                  <TextField   
                    label={item.name}
                    type={item.type === 'string' ? 'text' : 'number'}
                    name={this.state.inputs[index]}
                    value={this.state.inputs[index].value}
                    onChange={(name, value) => this.handleChangeInputs(index, value)}
                  />
                </Col>
              ))
            }
          </Row>: null
        }
        {this.state.outputs.length ? 
          <Row>
            <Col>
              Outputs:
            </Col>
            {this.state.outputs.map((item, index) => (
              <Col key={index}> {item} </Col>
            ))
            }
          </Row> : null
        }
        <br />
        <Divider />
      </div>
    );
  }
}
