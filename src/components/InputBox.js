// src/components/InputBox.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { InputContainer, TextArea, SubmitButton } from './InputBoxStyles';



const InputBox = ({ value, onChange, onSubmit }) => {
  return (
    <InputContainer>
      <form>
        <TextArea
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Type a message"
          autoComplete="off"
        />
      </form>
      <SubmitButton type="submit" onClick={onSubmit}>
        <FontAwesomeIcon icon={faPaperPlane} />
      </SubmitButton>
    </InputContainer>
  );
};

export default InputBox;
