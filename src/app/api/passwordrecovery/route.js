import { NextResponse } from 'next/server';
import { query } from '../../../lib/db';
import { mailToken } from '../../../lib/mailer';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { randomBytes } from 'node:crypto';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  try {
    const passwordSQL = `SELECT UserId, Email FROM users WHERE Username="${username}"`;
    const valueParams = [];
    const user = await query({
      query: passwordSQL,
			values: [valueParams],
		});
    
    if(user[0].Email) {
      const resetToken = hashSync(
        randomBytes(32).toString('hex'),
        Number(genSaltSync(10))
      );
      const tokenTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const tokenSQL = `UPDATE users SET Token="${resetToken}", TokenTime="${tokenTime}" where Email="${user[0].Email}"`;
      let tokenSet = await query({ query: tokenSQL, values: [valueParams] });
      
      mailToken(user[0].Email, resetToken);
      return NextResponse.json({ success: tokenSet });
    } else {
      return NextResponse.json({error: 'User not found'})
    }
    
  } catch(error) {
    console.log('error:', error)
    return NextResponse.json({error: error})
  }
}

export async function POST(request) {
  const res = await request.json();
	const token = res.token;
  const password = res.newpassword;

  const tokenTimeSQL = `SELECT TokenTime FROM users WHERE Token="${token}"`;
  const valueParams = [];
  const user = await query({
    query: tokenTimeSQL,
    values: [valueParams],
  });
  
  try {
    if(user[0].TokenTime) {
      let time = new Date(user[0].TokenTime).getTime();
      let now = new Date().getTime();
      if (now - time < 1800000) {
        const newPassword = hashSync(password, genSaltSync(10));
        const tokenSQL = `UPDATE users SET Password="${newPassword}", Token="", TokenTime="0000-00-00 00:00:00" where Token="${token}"`;
        const resetStatus = await query({
					query: tokenSQL,
					values: [valueParams],
				});
        return NextResponse.json({ success: resetStatus });
      } else {
        return NextResponse.json({error: 'Expired reset token'})
      }
    }

  } catch(error) {
    console.log(error)
    return NextResponse.json({error: 'error'})
  }
}