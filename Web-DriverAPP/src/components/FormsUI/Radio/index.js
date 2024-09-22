import React from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  FormHelperText,
  FormGroup,
} from "@mui/material";
import { useFormikContext, ErrorMessage } from "formik";

const RadioGroupWrapper = ({
  name,
  legend,
  options,
  defaultValue,
  ...otherProps
}) => {
  const { values, setFieldValue, touched, errors } = useFormikContext();

  const handleChange = (event) => {
    setFieldValue(name, event.target.value);
  };

  return (
    <FormControl component="fieldset" error={touched[name] && !!errors[name]}>
      <FormLabel component="legend">{legend}</FormLabel>
      <RadioGroup
        name={name}
        value={values[name] || defaultValue}
        onChange={handleChange}
        {...otherProps}
      >
        <FormGroup row>
          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              value={option.value}
              control={option.control || <Radio />}
              label={option.label}
              labelPlacement={option.labelPlacement || "end"}
            />
          ))}
        </FormGroup>
      </RadioGroup>
      <ErrorMessage name={name} component={FormHelperText} />
    </FormControl>
  );
};

export default RadioGroupWrapper;
