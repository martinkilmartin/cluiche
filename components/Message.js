import { useContext } from "react";
import UserContext from "@lib/UserContext";
import { deleteMessage } from "@lib/Store";
import TrashIcon from "@components/TrashIcon";
import diffDisplay from "@lib/time-format";
import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";

const Message = ({ message }) => {
  const { user, userRoles } = useContext(UserContext);
  const insertedDate = new Date(message.inserted_at);
  return (
    <Flex w='100%' p={2}>
      <Grid
        templateColumns='repeat(8, 1fr)'
        w='full'
        bg='#edf3f8'
        _dark={{
          bg: "#3e3e3e",
        }}
      >
        <GridItem colSpan={2}>
          <Text>{message.author.username}</Text>
        </GridItem>
        <GridItem colSpan={5}>
          <Text>{message.message}</Text>
        </GridItem>
        <GridItem colSpan={1}>
          {user?.id === message.user_id ? (
            <button onClick={() => deleteMessage(message.id)}>🚮</button>
          ) : userRoles.some((role) =>
              ["admin", "moderator"].includes(role)
            ) ? (
            <button onClick={() => deleteMessage(message.id)}>🗑️</button>
          ) : (
            ""
          )}
          <Text>{diffDisplay(insertedDate)}</Text>
        </GridItem>
      </Grid>
    </Flex>
  );
};

export default Message;
