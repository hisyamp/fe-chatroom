import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import Message from './Message';
import InputBox from './InputBox';

const socket = io('http://localhost:4000'); // Replace with your server URL

// Helper function to generate random colors
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const ChatWindow = () => {
    const [messages, setMessages] = useState([
        { text: "Hello!", sender: "other" },
        { text: "How are you?", sender: "other" },
        { text: "I'm fine, thank you!", sender: "user" },
        { text: "What's up?", sender: "user" },
        { text: "Let's build this chat!", sender: "other" },
        { text: "Hello!", sender: "other" },
        { text: "How are you?", sender: "other" },
        { text: "I'm fine, thank you!", sender: "user" },
        { text: "What's up?", sender: "user" },
        { text: "Let's build this chat!", sender: "other" },
        { text: "Hello!", sender: "other" },
        { text: "How are you?", sender: "other" },
        { text: "I'm fine, thank you!", sender: "user" },
        { text: "What's up?", sender: "user" },
        { text: "Let's build this chat!", sender: "other" },
        { text: "Hello!", sender: "other" },
        { text: "How are you?", sender: "other" },
        { text: "I'm fine, thank you!", sender: "user" },
        { text: "What's up?", sender: "user" },
        { text: "Let's build this chat!", sender: "other" },
        { text: "Hello!", sender: "other" },
        { text: "How are you?", sender: "other" },
        { text: "I'm fine, thank you!", sender: "user" },
        { text: "What's up?", sender: "user" },
        { text: "Let's build this chat!", sender: "other" },
        { text: "Hello!", sender: "other" },
        { text: "How are you?", sender: "other" },
        { text: "I'm fine, thank you!", sender: "user" },
        { text: "What's up?", sender: "user" },
        { text: "Let's build this chat!", sender: "other" },
        { text: "Hello!", sender: "other" },
        { text: "How are you?", sender: "other" },
        { text: "I'm fine, thank you!", sender: "user" },
        { text: "What's up?", sender: "user" },
        { text: "Let's build this chat!", sender: "other" },
        { text: "Hello!", sender: "other" },
        { text: "How are you?", sender: "other" },
        { text: "I'm fine, thank you!", sender: "user" },
        { text: "What's up?", sender: "user" },
        { text: "Let's build this chat!", sender: "other" },
        { text: "Hello!", sender: "other" },
        { text: "How are you?", sender: "other" },
        { text: "I'm fine, thank you!", sender: "user" },
        { text: "What's up?", sender: "user" },
        { text: "Let's build this chat!", sender: "other" }
    ]);
    const [headerColor, setHeaderColor] = useState(getRandomColor());
    const [input, setInput] = useState('');

    const messagesEndRef = useRef(null);  // Create a ref for the end of the messages container

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
            socket.emit('message', newMessage);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInput('');
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
                {/* This div is used to ensure the scroll to the bottom */}
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
