import { Auth } from "@supabase/ui";
import {
  Badge,
  Button,
  Center,
  Container,
  Box,
  Flex,
  Spacer,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Chat from "@components/Chat";
import { ColorModeButton } from "@components/ColorModeButton";
import Questions from "@components/Questions";
import Game from "@components/Game";
import { UserAccountType } from "../types";

const LoginPage: NextPage = () => {
  const { isLoading, user, error } = useUser();
  const [data, setData] = useState<UserAccountType>();

  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient
        .from("profiles")
        .select("*")
        .single();
      setData(data);
    }
    if (user) loadData();
  }, [user]);

  if (!user)
    return (
      <Container>
        <Center>
          <ColorModeButton />
        </Center>
        <Box maxW='lg'>
          <Auth
            view='magic_link'
            supabaseClient={supabaseClient}
            socialLayout='horizontal'
            socialButtonSize='xlarge'
            magicLink={true}
          />
        </Box>
      </Container>
    );

  return (
    <Container maxW='3xl'>
      <Flex>
        <Button onClick={() => supabaseClient.auth.signOut()}>Sign out</Button>
        <Spacer />
        <ColorModeButton />
      </Flex>
      <Flex>
        <Box>
          <Badge>{user.email}</Badge>
        </Box>
        <Spacer />
        <Box>
          <Badge>{data && data?.username}</Badge>
        </Box>
      </Flex>
      <Tabs variant='enclosed-colored'>
        <TabList>
          <Tab>Questions</Tab>
          <Tab>Chat</Tab>
          <Tab>Game</Tab>
          <Tab>Stats</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Questions user={user} />
          </TabPanel>
          <TabPanel>
            <Chat />
          </TabPanel>
          <TabPanel>
            <Game user={user} data={data} />
          </TabPanel>
          <TabPanel>
            <StatGroup>
              <Stat>
                <StatLabel>Bitcoin Cash Address</StatLabel>
                <StatNumber>{data && data?.cash_address}</StatNumber>
                <StatHelpText>
                  Safe to share and used to receive funds.
                </StatHelpText>
              </Stat>
              <Stat>
                <StatLabel>Bitcoin Cash Balance</StatLabel>
                <StatNumber>
                  {data &&
                    new Intl.NumberFormat().format(data?.cash_balance ?? 0)}
                </StatNumber>
                <StatHelpText>
                  Your Bitcoin Cash balance in satoshis.
                </StatHelpText>
              </Stat>
            </StatGroup>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default LoginPage;
