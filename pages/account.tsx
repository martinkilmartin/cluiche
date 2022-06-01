import { useState, useEffect } from "react";
import { supabase } from "@services/supabase";
import Auth from "@components/Auth";
import Account from "@components/Account";
import { AuthSession } from "@supabase/supabase-js";

const HomePage = (): JSX.Element => {
  const [session, setSession] = useState<AuthSession | null>(null);
  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange(
      (_event: string, session: AuthSession | null) => {
        setSession(session);
      }
    );
  }, []);

  return (
    <>
      {!session ? (
        <Auth />
      ) : (
        <Account key={session?.user?.id} session={session} />
      )}
    </>
  );
};

export default HomePage;
