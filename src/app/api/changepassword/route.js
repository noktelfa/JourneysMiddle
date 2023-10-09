import { query } from '../../../lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';

export async function POST(request) {

	const session = await getServerSession(request);

  try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_SITE_URL}/api/finduserbyemail?email=${session.user.email}`
		);
		let userData = await res.json();
		userData = userData.user;
		if (userData == null) {
		} else {
			session.userid = userData.userid;
			session.admin = userData.admin;
			session.deleted = userData.deleted;
			session.isRegistered = true;
		}
    
		const req = await request.json();
    const oldPassword = req.oldPassword;
    const newPassword = req.newPassword;

		if (compareSync(oldPassword, userData.password)) {
      let salt = genSaltSync(10);
      let newHash = hashSync(newPassword, salt);
			const passwordSQL = `UPDATE users SET Password='${newHash}' WHERE UserId=${session.userid}`;
      const valueParams = [];
      const passwordChanged = await query({
				query: passwordSQL,
				values: [valueParams],
			});
      return NextResponse.json({ Success: passwordChanged });
		} else {
      return NextResponse.json({error: 'Password error!'})
    }
  } catch(error) {
      console.log(error);
    return NextResponse.json({ error: error });
  }
}