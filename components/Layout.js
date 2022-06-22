import Link from "next/link";
import { useContext } from "react";
import UserContext from "@lib/UserContext";
import { addChannel, deleteChannel } from "@lib/Store";
import TrashIcon from "@components/TrashIcon";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  LinkBox,
  LinkOverlay,
  List,
  ListItem,
  ListIcon,
  Spacer,
  Stat,
  StatNumber,
  Text,
  Wrap,
  WrapItem,
  chakra,
} from "@chakra-ui/react";
import { CheckCircleIcon, CloseIcon } from "@chakra-ui/icons";

export default function Layout(props) {
  const { signOut, user, userRoles } = useContext(UserContext);

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w-]+/g, "") // Remove all non-word chars
      .replace(/--+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  };

  const newChannel = async () => {
    const slug = prompt("Please enter your name");
    if (slug) {
      addChannel(slugify(slug), user.id);
    }
  };

  return (
    <Container>
      {/* <Grid templateColumns='repeat(2, 1fr)' gap={6}>
        <GridItem w='20%'> */}
          {/* Sidebar */}
          {/* <Box maxWidth={"20%"} minWidth={200} maxHeight={"100vh"} p={2}>
            <Box p={2}>
              <Button colorScheme='blue' onClick={() => newChannel()}>
                New Channel
              </Button>
            </Box>
            <Divider />
            <Box p={2} flex flexDirection={"column"}>
              <Heading as='h6' size='xs'>
                {user?.email}
              </Heading>
              <Button colorScheme='blue' onClick={() => signOut()}>
                Log out
              </Button>
            </Box>
            <Divider />
            <Heading as='h4' size='md'>
              Channels
            </Heading>
            <List spacing={3}>
              {props.channels.map((x) => (
                <SidebarItem
                  channel={x}
                  key={x.id}
                  isActiveChannel={x.id === props.activeChannelId}
                  user={user}
                  userRoles={userRoles}
                />
              ))}
            </List>
            <p>{props.activeChannelId}</p>
          </Box> */}
        {/* </GridItem>
        <GridItem w='80%'> */}
          {/* Messages */}
          <Box p={2} flex>
            {props.children}
          </Box>
        {/* </GridItem>
      </Grid> */}
    </Container>
  );
}

const SidebarItem = ({ channel, isActiveChannel, user, userRoles }) => (
  <>
    <ListItem flex>
      <Link href='/channels/[id]' as={`/channels/${channel.id}`}>
        <LinkBox maxW='sm' p='2' borderWidth='1px' rounded='md'>
          <LinkOverlay>
            {isActiveChannel ? <CheckCircleIcon p={1} /> : <CloseIcon p={1} />}
            {channel.slug}
          </LinkOverlay>
        </LinkBox>
      </Link>
      {channel.id !== 1 &&
        (channel.created_by === user?.id || userRoles.includes("admin")) && (
          <Button
            colorScheme='blue'
            size='sm'
            m={2}
            onClick={() => deleteChannel(channel.id)}
          >
            <TrashIcon />
          </Button>
        )}
    </ListItem>
  </>
);
