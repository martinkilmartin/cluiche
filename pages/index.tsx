import { Auth } from "@supabase/ui";
import {
  Badge,
  Button,
  Center,
  Container,
  Box,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useUser } from "@supabase/supabase-auth-helpers/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { ColorModeButton } from "@components/ColorModeButton";
import Questions from "@components/Questions";
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
    <Container maxW='2xl'>
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
      <Flex>
        <Box>
          <Questions user={user} />
        </Box>
      </Flex>
    </Container>
  );
};

export default LoginPage;
