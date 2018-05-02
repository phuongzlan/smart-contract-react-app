import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import IconCheckboxList from './IconCheckboxList';
import iconModelsData from '../script/iconModels';
import createContract from '../script/createContract';
import CircularProgress from 'material-ui/CircularProgress';

export default class CardExampleExpandable extends React.Component{
  constructor(){
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.state = {
      iconModelsData,
      contractCode: '',
      requesting: false,
      contract: {
        _jsonInterface: []
      }
    }
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
  render(){
    return (
      <div>
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
