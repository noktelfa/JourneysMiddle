'use client'

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function GET(request) {
  
  
  const searchParams = useSearchParams();
  const userid = searchParams.get('user');
  const [user, setUser] = useState([]);
	const [userPosts, setuserPosts] = useState([]);
	const [deletedPosts, setdeletedPosts] = useState([]);

  const router = useRouter();

  useEffect(() => {
    async function getUserData() {
      const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/getuserdata?user=${userid}`;
      const response = await fetch(apiUrlEndpoint);
      const res = await response.json();
      setUser(res.userdata);
			setuserPosts(res.extantPosts)
			setdeletedPosts(res.deletedPosts)
    }
    getUserData();
  }, []);

	const profileDeletePost = async (postid) => {
		const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/deletearticle`;
		const response = await fetch(apiUrlEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: postid,
				user: userid,
			}),
		});
		let res = await response.json();
		setuserPosts(res.extantPosts);
		setdeletedPosts(res.deletedPosts);
	};

  const { data: session, status } = useSession();
  if (status === 'loading') return <h1> loading... please wait</h1>;

  try {

    if(session && session.admin) {
      return (
				<div className="flex min-h-screen flex-col items-center p-6">
					<table id="userEditTable">
						<tbody>
							<tr>
								<td>First Name:</td>
								<td>
									<input id="firstname" type="text" value={user.firstname} />
								</td>
							</tr>
							<tr>
								<td>Last Name:</td>
								<td>
									<input id="lastname" type="text" value={user.lastname} />
								</td>
							</tr>
							<tr>
								<td>Username:</td>
								<td>
									<input id="username" type="text" value={user.username} />
								</td>
							</tr>
							<tr>
								<td>Email address:</td>
								<td>
									<input id="username" type="text" value={user.email} />
								</td>
							</tr>
							<tr>
								<td>Motto:</td>
								<td>
									<input id="motto" type="text" value={user.motto} />
								</td>
							</tr>
							<tr>
								<td>Deleted:</td>
								<td>
									<input
										id="username"
										type="checkbox"
										checked={user.isDeleted}
									/>
								</td>
							</tr>
							<tr>
								<td>Admin:</td>
								<td>
									<input id="username" type="checkbox" checked={user.isAdmin} />
								</td>
							</tr>
							<tr>
								<td>Avatar:</td>
								<td>
									<img src={user.avatar} width="200px" />
								</td>
							</tr>
						</tbody>
					</table>
					<div id="postBox">
						<h2>Posts:</h2>
						<table className="postList">
							<tbody>
								{userPosts.map((post) => {
									return (
										<tr key={post.id}>
											<td>{atob(post.title)}:</td>
											<td>{atob(post.message)}</td>
											<td width="20px"></td>
											<td width="20px">
												<button
													className="deleteButton"
													onClick={() => profileDeletePost(post.id)}
												>
													Delete
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						<br />
						<h2>Deleted posts:</h2>
						<table className="postList">
							<tbody>
								{deletedPosts.map((post) => {
									return (
										<tr key={post.id}>
											<td>{atob(post.title)}:</td>
											<td>{atob(post.message)}</td>
											<td width="20px"></td>
											<td width="20px">
												<button
													className="newPostButton"
													onClick={() => restorePost(post.id)}
												>
													Restore
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			);
    } else {
      router.replace(`${process.env.NEXT_PUBLIC_SITE_URL}`);
    }
  } catch (error) {
    console.log(error)
  }
}