import { query } from '../../../lib/db';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { formatReactions } from '../../../lib/conversions';

export async function POST(request) {
  const session = await getServerSession(request);
	const res = await request.json();
  const articleid = res.articleid;
  const emote = res.emote;

  try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_SITE_URL}/api/finduserbyemail?email=${session.user.email}`
		);
		let userData = await res.json();
		userData = userData.user;
		if (userData !== null) {
			session.userid = userData.userid;
			session.isRegistered = true;
		}

		if(session.userid && session.isRegistered) {
			const testSQL = `SELECT ReactId FROM reactions WHERE UserId=${session.userid} AND PostId=${articleid}`;
			const valueParams = [];
			const isReacted = await query({
				query: testSQL,
				values: [valueParams],
			});
			
			if(isReacted.length > 0) {
				const updateSQL = `UPDATE reactions SET Reaction="${emote}" WHERE ReactId=${isReacted[0].ReactId}`;
				const updatedReaction = await query({
					query: updateSQL,
					values: [valueParams],
				});
			} else {
				const insertSQL = `INSERT INTO reactions (Reaction, UserId, PostId) values ("${emote}", ${session.userid}, ${articleid});`;
				const addReaction = await query({
					query: insertSQL,
					values: [valueParams],
				});
			}

			const reactSQL = `SELECT * FROM reactions WHERE PostId=${articleid}`;
			let rawReactions = await query({
				query: reactSQL,
				values: [valueParams],
			});
			const reactions = formatReactions(rawReactions);
			
			return NextResponse.json({ likes: reactions });
		}
		return NextResponse.json({ likes: 'none' })
	} catch(error) {
			console.log(error);
			return NextResponse.json({ error: error });
	}
}