import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Swal from 'sweetalert2';
import chatLogo from '../logo.png'; // Import your logo image

const ChatroomCode = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#f0f0f0');
  const navigate = useNavigate();
  const url = "http://54.255.106.216:3000";
  // const url = "http://localhost:3000";
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const red = Math.min(255, Math.floor((clientX / window.innerWidth) * 255));
    const blue = Math.min(255, Math.floor((clientY / window.innerHeight) * 255));
    const green = Math.min(255, Math.floor((red + blue) / 2));

    setBackgroundColor(`rgb(${red}, ${green}, ${blue})`);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === "") return;
    axios.get(`${url}/api/v1/chatrooms/${code}`)
      .then((response) => {
        console.log("response.data", response.data);
        if (response?.data) {
          navigate(`/chatroom/${code}`);
        } else {
          setError('Invalid code. Please try again.');
        }
      })
      .catch((error) => setError('Invalid code. Please try again.'));
  };

  const handleCreateRoom = () => {
    const storedName = localStorage.getItem('name');

    Swal.fire({
      title: 'Create New Chatroom',
      html: `
        <input type="text" id="name" class="swal2-input" placeholder="Room Name">
        <input type="text" id="description" class="swal2-input" placeholder="Description">
        ${!storedName ? `<input type="text" id="created_by" class="swal2-input" placeholder="Your Name">` : ''}
      `,
      showCancelButton: true,
      confirmButtonText: 'Create',
      preConfirm: () => {
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const created_by = document.getElementById('created_by') ? document.getElementById('created_by').value : storedName;

        if (!name || !description || (!storedName && !created_by)) {
          Swal.showValidationMessage(`Please fill out all fields`);
          return false;
        }

        return { name, description, created_by };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { name, description, created_by } = result.value;

        if (!storedName) {
          localStorage.setItem('name', created_by);
        }
        // console.log({
        //   name,
        //   description,
        //   created_by
        // })
        // return
        axios.post(`${url}/api/v1/chatrooms`, {
          "chatroom": {
            name,
            description,
            created_by
          }
        }).then(response => {
          console.log(response.data)
          navigate(`/chatroom/${response?.data?._id}`);
        }).catch(error => {
          Swal.fire('Error', 'Failed to create chatroom', 'error');
        });
      }
    });
  };

  return (
    <Container backgroundColor={backgroundColor}>
      <FormContainer onSubmit={handleSubmit}>
        <Logo src={chatLogo} alt="Chat App Logo" />
        <h2>Enter Chatroom Code</h2>
        <Input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
        />
        <SubmitButton type="submit">Join Chatroom</SubmitButton>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <CreateButton onClick={handleCreateRoom}>Create Chatroom</CreateButton>
      </FormContainer>
    </Container>
  );
};

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${({ backgroundColor }) => backgroundColor};
  transition: background-color 0.5s ease;
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

const Logo = styled.img`
  width: 100px;
  height: auto;
  margin-bottom: 20px;
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

const CreateButton = styled.button`
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  margin-top: 10px;

  &:hover {
    background-color: #218838;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

export default ChatroomCode;
