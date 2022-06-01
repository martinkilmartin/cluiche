import { VercelRequest, VercelResponse } from "@vercel/node";

const handler = (_req: VercelRequest, res: VercelResponse): void => {
  res.setHeader(
    "Set-Cookie",
    "sb:token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  );
  res.send({});
};

export default handler;
