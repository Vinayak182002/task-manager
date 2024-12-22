import React, { useState } from 'react';
import styles from './ChatBox.module.css'; // Import CSS module


const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: 'Bot', text: 'Hello! How can I assist you today?' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false); // State to control chat visibility

  const handleInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { sender: 'User', text: inputMessage }]);
      setInputMessage('');
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'Bot', text: 'I am here to help!' },
        ]);
      }, 1000); // Simulate bot response after 1 second
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen); // Toggle chat visibility
  };

  return (
    <div>
      {/* Floating Chat Icon */}
      <button onClick={toggleChat} className={styles.chatIcon}>
        <i className="fas fa-comment-alt"></i> {/* Font Awesome chat bubble icon */}
      </button>

      {/* Chatbot Window */}
      {isChatOpen && (
        <div className={styles.chatbotContainer}>
          <div className={styles.chatbot}>
            <div className={styles.chatbotHeader}>
              <span className={styles.chatbotTitle}>Chat Support</span>
              <button onClick={toggleChat} className={styles.closeButton}>X</button> {/* Close button */}
            </div>
            <div className={styles.chatbotMessages}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`${styles.chatMessage} ${msg.sender.toLowerCase()}`}
                >
                  <span className={styles.messageSender}>{msg.sender}</span>
                  <p className={styles.messageText}>{msg.text}</p>
                </div>
              ))}
            </div>
            <div className={styles.chatbotInput}>
              <input
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className={styles.inputBox}
              />
              <button onClick={handleSendMessage} className={styles.sendButton}>
                <i className="fas fa-paper-plane"></i> {/* Send button icon */}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
