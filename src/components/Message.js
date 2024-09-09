import React from 'react';
import styled, { css } from 'styled-components';

const Message = ({ text, sender }) => {
  return <MessageContainer sender={sender}>{text}</MessageContainer>;
};

const MessageContainer = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 15px;
  max-width: 60%;
  display: flex;
  ${({ sender }) => sender === 'user' ? css`
    background-color: #007bff;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 0;
  ` : css`
    background-color: #e1e1e1;
    color: black;
    align-self: flex-start;
    border-bottom-left-radius: 0;
  `}
`;

export default Message;
