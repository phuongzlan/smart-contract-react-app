import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

const ListExampleSettings = ({iconModelsData, handleCheck}) => {
  return (
  <div style={styles.root}>
      <List>
        {
          iconModelsData.map((item, index) => (
            <ListItem
              key={index}
              leftCheckbox={<Checkbox 
                checked={item.checked} 
                onCheck={() => handleCheck(index)}
                />}
              primaryText={item.title}
              secondaryText={item.description}
            />
          ))
        }
      </List>
  </div>
  )
}

export default ListExampleSettings;