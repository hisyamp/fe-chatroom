import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import axios from 'axios';
import Message from './Message';
import InputBox from './InputBox';

const socket = io('http://54.179.52.46:4000');

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
    const chatroomId = '123';

    // Fetch initial messages from the API using axios
    useEffect(() => {
        axios.get(`http://54.179.52.46:3000/api/v1/chatrooms/${chatroomId}`)
            .then((response) => {
                setMessages(response.data.messages);
            })
            .catch((error) => console.error('Error fetching chatroom messages:', error));
    }, [chatroomId]);

    // Handle incoming WebSocket messages
    useEffect(() => {
        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => socket.off('message');
    }, []);

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
        if (input.trim() !== "") {
            const newMessage = { text: input, sender: "user" };

            // Send message via POST request using axios
            axios.post(`http://54.179.52.46:3000/api/v1/chatrooms`, {
                chatroomId: chatroomId,
                message: newMessage,
            })
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

            <InputBox value={input} onChange={(e) => setInput(e.target.value)} onSubmit={handleSubmit} />
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
