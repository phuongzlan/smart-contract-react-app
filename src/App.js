import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Paper from 'material-ui/Paper';
import Contract from './views/Contract';
import EnterContract from './components/EnterContract';

//import getMuiTheme from 'material-ui/styles/getMuiTheme';

let App = (props) => {
  return ( 
    <MuiThemeProvider>
      <Paper>
        <div className='main'>  
          <Contract />
        </div>
      </Paper>
    </MuiThemeProvider>
)};

export default App;

