import React from 'react';
import TextField from 'material-ui/TextField';

const TextFieldExampleSimple = ({label, value, onChange, name, type, fullWidth}) => (
    <TextField
    	floatingLabelText={label}
      	value={value}
      	type={type}
      	fullWidth={fullWidth}
      	onChange={(e, value) => onChange(name, value)}
    />
);

export default TextFieldExampleSimple;