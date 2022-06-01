// eslint-disable-next-line @next/next/no-server-import-in-page
import type { NextRequest } from "next/server";

import { supabase } from "@services/supabase";

const getUser = async (req: NextRequest): Promise<any> => {
  const token = req.cookies["sb:token"];
  if (!token) {
    return {
      user: null,
      data: null,
      error: "There is no supabase token in request cookies",
    };
  }
  const authRequestResult = await supabase.auth.api.getUser(token);

  const { user, data, error } = await authRequestResult;
  console.error("Supabase auth result", user);
  return {
    user: user,
    data: data,
    error: error,
  };
};

export default getUser;
