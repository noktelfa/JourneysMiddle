import { query } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const user = searchParams.get('user');
  
  try {
    const userSQL = `SELECT * FROM users WHERE UserId=${user}`;
		const valueParams = [];
		const foundUser = await query({ query: userSQL, values: [valueParams] });
		const postSQL = `SELECT * FROM posts WHERE UserId=${user}`;
		const allPosts = await query({ query: postSQL, values: [valueParams] });
    const userData = {
      firstName: foundUser[0].FirstName,
      lastName: foundUser[0].LastName,
      email: foundUser[0].Email,
      username: foundUser[0].Username,
      admin: foundUser[0].Admin,
      deleted: foundUser[0].Deleted,
      avatar: foundUser[0].Avatar,
      motto: foundUser[0].Motto,
      passwordExpired: foundUser[0].PasswordExpired,
      preferredTheme: foundUser[0].Theme,
    }
    const extantPosts = allPosts
			.filter((post) => post.Deleted == 0)
			.map((post) => ({
				title: post.PostTitle,
				message: btoa(
					atob(post.PostBody)
						.replace(/&lt;.+?(?=&gt;)&gt;/gi, '')
						.replace(/(<([^>]+)>)/gi, '')
						.replace(/&lt;.*/gi, '')
						.slice(0, 300)
				),
				postid: parseInt(post.PostId),
			}));
		const deletedPosts = allPosts
			.filter((post) => post.Deleted == 1)
			.map((post) => ({
				title: post.PostTitle,
				message: btoa(
					atob(post.PostBody)
						.replace(/&lt;.+?(?=&gt;)&gt;/gi, '')
						.replace(/(<([^>]+)>)/gi, '')
						.replace(/&lt;.*/gi, '')
						.slice(0, 300)
				),
				postid: parseInt(post.PostId),
			}));
    return NextResponse.json({
			user: userData,
			posts: extantPosts,
			deleted: deletedPosts,
		});
  } catch (error) {
    console.log(error)
		return NextResponse.error(error)
  }
}