import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import axios from 'axios';
import Swal from 'sweetalert2'; // SweetAlert2 import
import Message from './Message';
import InputBox from './InputBox';
import { useParams } from 'react-router-dom'; // Import useParams
const url = "http://localhost:3000"
const url_ws = "http://localhost:4000"
// const url_ws = "http://54.179.52.46:4000"
// const socket = io(url_ws);

const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const ChatWindow = () => {
    const [messages, setMessages] = useState([]);
    const [headerColor, setHeaderColor] = useState(getRandomColor());
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    // const id = '66e1c82eea2c3878c74708d5';
    const { id } = useParams();
    // Check for the "name" key in localStorage
    useEffect(() => {
        const userName = localStorage.getItem('name');
        if (!userName) {
            Swal.fire({
                title: 'Enter your name',
                input: 'text',
                inputPlaceholder: 'Enter your name',
                showCancelButton: false,
                allowOutsideClick: false, // Disable closing the popup by clicking outside
                    allowEscapeKey: false,   // Disable closing the popup by pressing escape
                    showCancelButton: false, // Remove the cancel button
                confirmButtonText: 'Join Chat',
                inputValidator: (value) => {
                    if (!value) {
                        return 'You need to enter your name!';
                    }
                }
            }).then((result) => {
                if (result.value) {
                    localStorage.setItem('name', result.value);
                    // Optionally, redirect to another page after setting name
                    // window.location.href = '/meeting-room'; // Uncomment this if needed
                }
            });
        }
    }, []);

    // Fetch initial messages from the API using axios
    useEffect(() => {
        console.log("hitted")
        axios.get(`${url}/api/v1/chatrooms/${id}`)
            .then((response) => {
                // setMessages(response);
            })
            .catch((error) => console.error('Error fetching chatroom messages:', error));
    }, [id]);

    // Handle incoming WebSocket messages
    // useEffect(() => {
    //     socket.on('message', (message) => {
    //         setMessages((prevMessages) => [...prevMessages, message]);
    //     });

    //     return () => socket.off('message');
    // }, []);

    // Change header color every 3 seconds
    useEffect(() => {
        const colorInterval = setInterval(() => {
            setHeaderColor(getRandomColor());
        }, 3000);

        return () => clearInterval(colorInterval);
    }, []);

    // Scroll to bottom on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("input")
        if (input.trim() !== "") {
            const newMessage = {
                message: {
                    content: input,
                    sender: localStorage.getItem('name') || 'user',
                    created_at: new Date().toISOString(), // Set the current timestamp
                }
            };
    
            // Send message via POST request using axios with id in the URL
            axios.post(`${url}/api/v1/chatrooms/${id}/messages`, newMessage)
                .then((response) => {
                    // Assuming the API returns the saved message
                    setMessages((prevMessages) => [...prevMessages, response.data.message]);
                    setInput('');
                })
                .catch((error) => console.error('Error sending message:', error));
        }
    };
    

    return (
        <ChatContainer>
            <ChatHeader style={{ backgroundColor: headerColor }}>
                <h2>Chatroom: Bahaya</h2>
            </ChatHeader>

            <MessagesContainer>
                {messages.map((msg, index) => (
                    <Message key={index} text={msg.text} sender={msg.sender} />
                ))}
                <div ref={messagesEndRef} />
            </MessagesContainer>

            <InputBox value={input} onChange={(e) => setInput(e.target.value)} onSubmit={()=>handleSubmit} />
            
        </ChatContainer>
    );
};

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  max-width: 100vw;
  max-height: 100vh;
  border: 1px solid #ccc;
  border-radius: 0;
  background-color: #fff;
  box-shadow: none;
`;

const ChatHeader = styled.div`
  color: white;
  padding: 15px;
  text-align: center;
  font-size: 1.5rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
`;

const MessagesContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
  overflow-y: auto;
`;

export default ChatWindow;
