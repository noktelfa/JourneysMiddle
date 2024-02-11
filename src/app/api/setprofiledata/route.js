import { query } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
	const res = await request.json();
  const userid = res.userid;

  try {

      const userSQL = `Update users SET ${Object.keys(res)[0]}='${Object.values(res)[0]}' WHERE UserId=${userid}`;
      const valueParams = [];
      const foundUser = await query({ query: userSQL, values: [valueParams] });

      return NextResponse.json({ success: foundUser.changedRows === 1});

  } catch(error) {
    console.log(error)
	return NextResponse.json({ success: false });
	  }
}