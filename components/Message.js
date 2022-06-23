import { useContext } from "react";
import UserContext from "@lib/UserContext";
import { deleteMessage } from "@lib/Store";
import TrashIcon from "@components/TrashIcon";
import diffDisplay from "@lib/time-format";
import { Badge, Code, Flex, Grid, GridItem, Tag, Text } from "@chakra-ui/react";

const Message = ({ message }) => {
  const { user, userRoles } = useContext(UserContext);
  const insertedDate = new Date(message.inserted_at);
  return (
    <Flex w='100%' p={2}>
      <Grid
        templateColumns='repeat(5, 1fr)'
        w='full'
      >
        <GridItem colSpan={1}>
          <Badge colorScheme={user?.id === message.user_id ? 'green' : ''}>{message.author.username}</Badge>
        </GridItem>
        <GridItem colSpan={3}>
          <Code colorScheme={user?.id === message.user_id ? 'gray' : ''}>{message.message}</Code>
        </GridItem>
        <GridItem colSpan={1}>
          <Grid templateColumns='repeat(3, 1fr)'>
            <GridItem colSpan={1}>
              {user?.id === message.user_id ? (
                <button onClick={() => deleteMessage(message.id)}>❌</button>
              ) : userRoles.some((role) =>
                  ["admin", "moderator"].includes(role)
                ) ? (
                <button onClick={() => deleteMessage(message.id)}>🗑️</button>
              ) : (
                ""
              )}
            </GridItem>
            <GridItem colSpan={2}>
              <Tag>{diffDisplay(insertedDate)}</Tag>
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </Flex>
  );
};

export default Message;
