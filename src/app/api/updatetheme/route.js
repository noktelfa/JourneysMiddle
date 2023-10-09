import { query } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const res = await request.json();
  const id = res.id;
	const theme = res.theme;
  
  try {
    const userSQL = `UPDATE users SET Theme='${theme}' where UserId=${id}`;
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