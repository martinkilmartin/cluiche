import { useState } from "react";
import { Input } from '@chakra-ui/react'

const MessageInput = ({ onSubmit }) => {
  const [messageText, setMessageText] = useState("");

  const submitOnEnter = (event) => {
    // Watch for enter key
    if (event.keyCode === 13) {
      onSubmit(messageText);
      setMessageText("");
    }
  };

  return (
    <>
      <Input
        type='text'
        placeholder='Send a message'
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={(e) => submitOnEnter(e)}
      />
    </>
  );
};

export default MessageInput;
