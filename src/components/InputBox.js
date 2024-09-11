// src/components/InputBox.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { InputContainer, TextInput, SubmitButton } from './InputBoxStyles';



const InputBox = ({ value, onChange, onSubmit }) => {
  return (
    <InputContainer>
      <form>
        <TextInput
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Type a message"
          autoComplete="off"
        />
      </form>
      <SubmitButton type="submit" onClick={onSubmit={onSubmit}}>
        <FontAwesomeIcon icon={faPaperPlane} />
      </SubmitButton>
    </InputContainer>
  );
};

export default InputBox;
