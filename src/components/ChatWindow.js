import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import axios from 'axios';
import Swal from 'sweetalert2';
import Message from './Message';
import InputBox from './InputBox';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCopy } from 'react-icons/fi'; // Import the copy icon

// const url = "http://localhost:3000"
const url = "http://13.250.107.199:3000"
const url_ws = "http://13.250.107.199:4000"
const socket = io(url_ws);

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
    const [room, setRoom] = useState({});
    const [title, setTitle] = useState("");
    const messagesEndRef = useRef(null);
    const { code } = useParams();
    const navigate = useNavigate();
    const userName = localStorage.getItem('name');

    useEffect(() => {
        if (!userName) {
            Swal.fire({
                title: 'Enter your name',
                input: 'text',
                inputPlaceholder: 'Enter your name',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showCancelButton: false,
                confirmButtonText: 'Join Chat',
                inputValidator: (value) => {
                    if (!value) {
                        return 'You need to enter your name!';
                    }
                }
            }).then((result) => {
                if (result.value) {
                    localStorage.setItem('name', result.value);
                    window.location.reload(); 
                }
            });
        }
    }, [userName]);

    useEffect(() => {
        axios.get(`${url}/api/v1/chatrooms/${code}`)
            .then((response) => {
                if(response.data.messages) {
                    setMessages(response.data.messages);
                    
                    console.log(response)
                }
                else setMessages([]);
                setRoom(response.data)
                    setTitle(response.data.name)
            })
            .catch((error) => console.error('Error fetching chatroom messages:', error));
    }, [code]);

    useEffect(() => {
        socket.on('new_data', (message) => {
            console.log(message)
            setMessages(message.messages);
        });

        return () => socket.off('new_data');
    }, []);

    useEffect(() => {
        const colorInterval = setInterval(() => {
            setHeaderColor(getRandomColor());
        }, 3000);

        return () => clearInterval(colorInterval);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = () => {
        if (input.trim() !== "") {
            const newMessage = {
                message: {
                    content: input,
                    sender: userName || 'user',
                    created_at: new Date().toISOString(),
                }
            };

            axios.post(`${url}/api/v1/chatrooms/${code}/messages`, newMessage)
                .then(() => {
                    setInput('');
                })
                .catch((error) => console.error('Error sending message:', error));
        }
    };

    const handleCopyCode = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Link copied!',
                    text: `Chatroom url "${currentUrl}" has been copied to your clipboard. Share to your friend!`,
                    timer: 2000,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            })
            .catch((error) => console.error('Error copying url:', error));
    };

    const handleLeaveRoom = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will leave this chatroom.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Leave',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/'); // Redirect to homepage or another page
            }
        });
    };

    return (
        <ChatContainer>
            <ChatHeader style={{ backgroundColor: headerColor }}>
                <h2>{title}</h2>
                <CenterCopyButton>
                    <CopyButton onClick={handleCopyCode}>
                        <FiCopy size={20} /> {/* Add copy icon */}
                        <span>Share to youre friend!</span>
                    </CopyButton>
                </CenterCopyButton>
                <LeaveButton onClick={handleLeaveRoom}>
                    Leave Room
                </LeaveButton>
            </ChatHeader>

            <MessagesContainer>
                {messages.map((msg, index) => (
                    <Message
                        key={index}
                        text={msg.content}
                        sender={msg.sender}
                        isOwnMessage={msg.sender === userName} // Check if the sender is the user
                    />
                ))}
                <div ref={messagesEndRef} />
            </MessagesContainer>

            <InputBox value={input} onChange={(e) => setInput(e.target.value)} onSubmit={() => handleSubmit()} />
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
  background-color: #fff;
`;

const ChatHeader = styled.div`
  color: white;
  padding: 15px;
  text-align: center;
  font-size: 1.5rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CenterCopyButton = styled.div`
  flex-grow: 1; /* Allow this container to take all available space */
  display: flex;
  justify-content: center; /* Center the copy button */
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  outline: none;
  padding: 10px;

  &:hover {
    opacity: 0.8;
  }

  span {
    margin-left: 8px; /* Add some space between the icon and the text */
  }
`;

const LeaveButton = styled.button`
  background-color: #d33;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  margin-right:10px;
  
  &:hover {
    background-color: #b52c2c;
  }
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
