import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  customWidth: {
    width: 'auto',
    maxWidth: '100%'
  },
};

const SelectAccount = ({label, accounts, onChange, accountSelected, name }) => (
  <div>
    <SelectField
      floatingLabelText={label}
      value={accountSelected.number}
      onChange={(event, index, value) => onChange(name, value)}
    //  autoWidth={true}
      style={styles.customWidth}
    >
      {accounts.map((item, index) => (
        <MenuItem 
          key={index}
          value={item} primaryText={item} />  
        ))}
    </SelectField>
    <p> Balance: {accountSelected.balance} </p>
  </div>
);

export default SelectAccount;