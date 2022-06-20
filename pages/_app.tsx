import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "@supabase/supabase-auth-helpers/react";
import { supabaseClient } from "@supabase/supabase-auth-helpers/nextjs";
import { Chakra } from "../Chakra";
import React, { useState, useEffect } from "react";
import UserContext from "lib/UserContext";
import { fetchUserRoles } from "lib/Store";
import { supabase } from "@utils/supabaseClient";
import { Session, User } from "@supabase/gotrue-js/src/lib/types";
import { Router } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const [userLoaded, setUserLoaded] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const session = supabase.auth.session();
    setSession(session);
    setUser(session?.user ?? null);
    setUserLoaded(session ? true : false);
    if (user) {
      signIn();
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        const currentUser = session?.user;
        setUser(currentUser ?? null);
        setUserLoaded(!!currentUser);
        if (currentUser) {
          signIn();
        }
      }
    );

    return () => {
      authListener && authListener.unsubscribe();
    };
  }, [user]);

  const signIn = async () => {
    await fetchUserRoles(
      (userRoles: {
        map: (arg0: (userRole: any) => any) => React.SetStateAction<never[]>;
      }) => setUserRoles(userRoles.map((userRole) => userRole.role))
    );
  };

  const signOut = async () => {
    const result = await supabase.auth.signOut();
  };
  return (
    <UserContext.Provider
      value={{
        userLoaded,
        user,
        userRoles,
        signIn,
        signOut,
      }}
    >
      <UserProvider supabaseClient={supabaseClient}>
        <Chakra cookies={pageProps.cookies}>
          <Component {...pageProps} />
        </Chakra>
      </UserProvider>
    </UserContext.Provider>
  );
}

export default MyApp;
