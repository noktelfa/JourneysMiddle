import { query } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const res = await request.json();
  const userid = res.userid;
	const theme = res.theme;
  
  try {
    const userSQL = `UPDATE users SET Theme='${theme}' where UserId=${userid}`;
    const valueParams = [];
    const themedUser = await query({
      query: userSQL,
      values: [valueParams],
    });
    return NextResponse.json({ themeduser: themedUser })
  } catch(error) {
    console.log(error);
    return NextResponse.json(error);
  }
}