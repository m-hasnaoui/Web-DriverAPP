import React from "react";
import { useField, useFormikContext } from "formik";
import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const FileInputWrapper = ({
  name,
  multiple = false,
  onChange,
  ...otherProps
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();

  const handleChange = (event) => {
    const files = event.currentTarget.files;
    setFieldValue(name, multiple ? files : files[0]);
    if (onChange) {
      onChange(event);
    }
  };

  const configFileInput = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: "outlined",
    type: "file",
    onChange: handleChange,
    InputLabelProps: { shrink: true },
    inputProps: { multiple },
  };

  if (meta && meta.touched && meta.error) {
    configFileInput.error = true;
    configFileInput.helperText = meta.error;
  }

  return <TextField {...configFileInput} />;
};

FileInputWrapper.propTypes = {
  name: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
};

export default FileInputWrapper;
