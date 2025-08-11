'use client';

import React, { useState } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { useDebounce } from 'react-use';

type DebouncedInputProps = TextFieldProps & {
  value: string;
  onChange: (value: string) => void;
  debounceTime?: number;
};

const DebouncedInput = ({ value, onChange, debounceTime = 500, ...props }: DebouncedInputProps) => {
  const [inputValue, setInputValue] = useState(value);

  useDebounce(
    () => {
      onChange(inputValue);
    },
    debounceTime,
    [inputValue]
  );

  return (
    <TextField
      {...props}
      value={inputValue}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
    />
  );
};

export default DebouncedInput;
