// src/components/InputBoxStyles.js
import styled from 'styled-components';

export const InputContainer = styled.div`
  border-top: 1px solid #ddd;
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  position: relative;
  width: 100%;
`;

export const FormContainer = styled.form`
  display: flex;             /* Ensure the form items (input and button) are inline */
  align-items: center;
  justify-content: center;
  width: 75%;                /* Set width to 75% of the screen */
  max-width: 1200px;         /* Optional max width for larger screens */
`;

export const TextArea = styled.input`
  flex: 1;                  /* Take up available space */
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 16px;
  margin-right: 10px;        /* Space between input and button */
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
`;

export const SubmitButton = styled.button`
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 50%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #0056b3;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  }

  svg {
    font-size: 16px;
  }
`;
