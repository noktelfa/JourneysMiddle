import { query } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
	const res = await request.json();
  const postid = res.postid;
  const user = res.user;

  try {
		const restoreSQL = `UPDATE posts SET Deleted=0 WHERE PostId=${postid}`;
    const valueParams = [];
    const deletedSuccess = await query({
			query: restoreSQL,
			values: [valueParams],
		});

    const postSQL = `SELECT * FROM posts WHERE UserId=${user}`;
    const allPosts = await query({ query: postSQL, values: [valueParams] });

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
			extantPosts: extantPosts,
			deletedPosts: deletedPosts,
		});
  } catch(error) {
    console.log(error)
    return NextResponse.json({ error: error });
  }
}