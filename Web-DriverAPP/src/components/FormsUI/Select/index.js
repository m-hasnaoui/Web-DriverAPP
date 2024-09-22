import React from "react";
import TextField from "@mui/material/TextField";
import { useFormikContext } from "formik";

const SelectWrapper = ({
  label,
  options,
  handleChange,
  name,
  ...otherProps
}) => {
  const { submitForm } = useFormikContext();

  const handleSubmit = () => {
    submitForm();
  };

  const configTextField = {
    fullWidth: true,
    select: true,
    label: label,
    onChange: handleChange,
    name: name,
    SelectProps: {
      native: true,
      ...otherProps.SelectProps,
    },
    sx: { gridColumn: "span 4" },
    // disabled={dataSelectDriver.length > 0 ? false : true}
  };

  return (
    <TextField {...configTextField}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </TextField>
  );
};

export default SelectWrapper;
