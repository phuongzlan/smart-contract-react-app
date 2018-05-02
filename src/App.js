import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Paper from 'material-ui/Paper';
import Card from './components/Card';

//import getMuiTheme from 'material-ui/styles/getMuiTheme';

let App = (props) => {
  return ( 
    <MuiThemeProvider>
      <Paper>
        <div className='main'>  
          <Card />
        </div>
      </Paper>
    </MuiThemeProvider>
)};

export default App;

