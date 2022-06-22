import { useContext, useEffect, useRef } from "react";
import Message from "@components/Message";
import MessageInput from "@components/MessageInput";
import UserContext from "@lib/UserContext";
import { useStore, addMessage } from "@lib/Store";
import { Box } from "@chakra-ui/react";

export default function Chat() {
  const channelId = 1;
  const { user } = useContext(UserContext);
  const { messages } = useStore({ channelId });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <Box>
      {messages.map((x) => (
        <Message key={x.id} message={x} />
      ))}
      <Box ref={messagesEndRef} style={{ height: 0 }} />
      <MessageInput
        onSubmit={async (text) => addMessage(text, channelId, user.id)}
      />
    </Box>
  );
}
