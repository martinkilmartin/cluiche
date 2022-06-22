import { useContext } from "react";
import UserContext from "@lib/UserContext";
import { deleteMessage } from "@lib/Store";
import TrashIcon from "@components/TrashIcon";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";

const Message = ({ message }) => {
  const { user, userRoles } = useContext(UserContext);

  return (
    <Box>
      <Grid templateColumns="repeat(7, 1fr)" gap={4}>
        <GridItem colSpan={2} >
          <Text>{message.author.username}</Text>
        </GridItem>
        <GridItem colSpan={4} >
          <Text>{message.message}</Text>
        </GridItem>
        <GridItem colSpan={1} >
          {user?.id === message.user_id ||
            (userRoles.some((role) =>
              ["admin", "moderator"].includes(role)
            ) && (
              <button onClick={() => deleteMessage(message.id)}>
                <TrashIcon />
              </button>
            ))}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Message;
