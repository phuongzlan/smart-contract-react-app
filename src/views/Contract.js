import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import CreateContract from '../components/CreateContract';
import EnterContract from '../components/EnterContract';

import ContentAdd from 'material-ui/svg-icons/content/add';
import ExitToApp from 'material-ui/svg-icons/action/exit-to-app';

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  slide: {
    padding: 10
  },
};

export default class TabsExampleSwipeable extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0,
    };
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };

  render() {
    return (
      <div>
        <Tabs
          onChange={this.handleChange}
          value={this.state.slideIndex}
        >
          	<Tab 
          		icon={<ContentAdd />}
      			label="Create Contract"
          		value={0} 
          	>
          		<CreateContract />
          	</Tab>
          	<Tab 
          		icon={<ExitToApp />}
          		label="Enter Contract" 
          		value={1} >
          		<EnterContract />
          	</Tab>
        </Tabs>
      </div>
    );
  }
}




