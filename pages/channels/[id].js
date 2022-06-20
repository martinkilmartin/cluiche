import Layout from "@components/Layout";
import Message from "@components/Message";
import MessageInput from "@components/MessageInput";
import { useRouter } from "next/router";
import { useStore, addMessage } from "@lib/Store";
import { useContext, useEffect, useRef } from "react";
import UserContext from "@lib/UserContext";
import {
  Box,
} from "@chakra-ui/react";

const ChannelsPage = (props) => {
  const router = useRouter();
  const { user, authLoaded, signOut } = useContext(UserContext);
  const messagesEndRef = useRef(null);

  // Else load up the page
  const { id: channelId } = router.query;
  const { messages, channels } = useStore({ channelId });

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [messages]);

  // redirect to public channel when current channel is deleted
//   useEffect(() => {
//     if (!channels.some((channel) => channel.id === Number(channelId))) {
//       router.push("/channels/1");
//     }
//   }, [channels, channelId, router]);

  // Render the channels and messages
  return (
    <Layout channels={channels} activeChannelId={channelId}>
      <Box className='relative h-screen'>
        <Box className='Messages h-full pb-16'>
          <Box className='p-2 overflow-y-auto'>
            {messages.map((x) => (
              <Message key={x.id} message={x} />
            ))}
            <Box ref={messagesEndRef} style={{ height: 0 }} />
          </Box>
        </Box>
        <Box className='p-2 absolute bottom-0 left-0 w-full'>
          <MessageInput
            onSubmit={async (text) => addMessage(text, channelId, user.id)}
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default ChannelsPage;
