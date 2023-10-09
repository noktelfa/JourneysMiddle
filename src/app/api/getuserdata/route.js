import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { query } from '../../../lib/db';

export async function GET(req) {

	const token = await getToken({ req });

	try {
		const { searchParams } = new URL(req.url);
		const userid = searchParams.get('user');

		if (token) {
			if (token.admin) {
				const userSQL = `SELECT FirstName, LastName, Username, Email, Admin, Deleted, Avatar, Motto, PasswordExpired FROM users WHERE UserId=${userid}`;
				const valueParams = [];
				let userdata = await query({ query: userSQL, values: [valueParams] });
				let user = {
					firstname: userdata[0].FirstName,
					lastname: userdata[0].LastName,
					username: userdata[0].Username,
					email: userdata[0].Email,
					motto: userdata[0].Motto,
					avatar: userdata[0].Avatar,
					isAdmin: userdata[0].Admin === 1,
					isDeleted: userdata[0].Delete === 1,
					passexp: userdata[0].PasswordExpired === 1,
				};

				const postSQL = `SELECT * FROM posts WHERE UserId=${userid}`;
				const allPosts = await query({ query: postSQL, values: [valueParams] });

				const extantPosts = allPosts
					.filter((post) => post.Deleted == 0)
					.map((post) => ({
						title: post.PostTitle,
						message: btoa(atob(post.PostBody)
							.replace(/&lt;.+?(?=&gt;)&gt;/gi, '')
							.replace(/(<([^>]+)>)/gi, '')
							.replace(/&lt;.*/gi, '')
							.slice(0, 300)),
						id: parseInt(post.PostId),
					}));
				const deletedPosts = allPosts
					.filter((post) => post.Deleted == 1)
					.map((post) => ({
						title: post.PostTitle,
						message: btoa(atob(post.PostBody)
							.replace(/&lt;.+?(?=&gt;)&gt;/gi, '')
							.replace(/(<([^>]+)>)/gi, '')
							.replace(/&lt;.*/gi, '')
							.slice(0, 300)),
						id: parseInt(post.PostId),
					}));
				return NextResponse.json({
					userdata: user,
					extantPosts: extantPosts,
					deletedPosts: deletedPosts,
				});
			} else {
				return NextResponse.json({ error: 'unauthorized' });
			}
		} else {
			return NextResponse.json({ error: 'unauthorized' });
		}
	} catch (error) {
		console.log(error);
		return NextResponse.error({ error: error });
	}
}
