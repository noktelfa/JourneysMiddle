import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { query } from '../../../lib/db';

export async function GET(req) {

  const token = await getToken({ req });


  try {
    if(token) {
      if(token.admin){
        const userSQL = `SELECT UserId, FirstName, LastName, Email, Admin, Deleted FROM users`;
        const valueParams = [];
        let userlist = await query({ query: userSQL, values: [valueParams] });
        return NextResponse.json({ userlist: userlist });
      } else {
        return new NextResponse('Error', { status: 400 });
      }
    } else {
      return new NextResponse('Error', { status: 400 });
    }
    
  } catch(error) {
    console.log(error)
    return NextResponse.error({error: error})
  }
}