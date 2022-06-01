// pages/profile.js
import { withPageAuth, User } from "@supabase/supabase-auth-helpers/nextjs";
import Link from "next/link";
import { ColorModeButton } from "@components/ColorModeButton";
import { Container } from "@chakra-ui/react";

export default function Profile({
  user,
  error,
}: {
  user: User;
  error: string;
}) {
  if (user)
    return (
      <Container maxW='xl' centerContent>
        <ColorModeButton />
        <p>
          [<Link href='/'>Home</Link>] | [
          <Link href='/protected-page'>supabaseServerClient</Link>]
        </p>
        <div>Hello {user.email}</div>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </Container>
    );
  return <p>{error}</p>;
}

export const getServerSideProps = withPageAuth({ redirectTo: "/login" });
