import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
const ChatroomCode = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const url = "http://18.141.187.131:3000"
  const handleSubmit = (e) => {
    e.preventDefault()
    axios.get(`${url}/api/v1/chatrooms/${code}`)
      .then((response) => {
        console.log("response.data", response.data)
        if (response?.data) {
          navigate(`/chatroom/${code}`);
        } else {
          setError('Invalid code. Please try again.');
        }
      })
      .catch((error) => setError('Invalid code. Please try again.'));

  };

  return (
    <Container>
      <FormContainer onSubmit={handleSubmit}>
        <h2>Enter Chatroom Code</h2>
        <Input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
        />
        <SubmitButton type="submit">Join Chatroom</SubmitButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </FormContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 10px;
  width: 100%;
  max-width: 300px;
`;

const SubmitButton = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  max-width: 300px;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

export default ChatroomCode;
