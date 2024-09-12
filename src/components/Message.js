import React from 'react';
import styled from 'styled-components';

const Message = ({ text, sender, isOwnMessage }) => {
  return (
    <MessageContainer isOwnMessage={isOwnMessage}>
      {!isOwnMessage && <Sender>{sender}</Sender>} {/* Show sender name if not own message */}
      <MessageBubble isOwnMessage={isOwnMessage}>{text}</MessageBubble>
    </MessageContainer>
  );
};

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ isOwnMessage }) => (isOwnMessage ? 'flex-end' : 'flex-start')};
  margin-bottom: 10px;
`;

const Sender = styled.span`
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 5px;
`;

const MessageBubble = styled.div`
  background-color: ${({ isOwnMessage }) => (isOwnMessage ? '#DCF8C6' : '#E5E5EA')};
  padding: 10px;
  border-radius: 15px;
  max-width: 60%;
  color: #000;
  
  ${({ isOwnMessage }) => (isOwnMessage ? 'border-bottom-right-radius: 0'
    : '    border-bottom-left-radius: 0')};

`;

export default Message;
