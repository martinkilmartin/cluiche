// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from 'next/server'

import { supabase } from '@services/supabase'

const handler = async (req: NextRequest, res: NextResponse): Promise<void> => {
  await supabase.auth.api.setAuthCookie(req, res)
}

export default handler