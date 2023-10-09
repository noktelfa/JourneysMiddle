'use client'

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';

export default function GET(request) {

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [motto, setMotto] = useState('');
	const [avatar, setAvatar] = useState('');
	const [theme, setTheme] = useState('');
	
	const [userPosts, setuserPosts] = useState([]);
	const [deletedPosts, setdeletedPosts] = useState([]);
	
	const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			redirect('/');
		},
	});
	
	
	const isProfile = session && session.isRegistered;
	const isAuthed = status === 'authenticated';
	const isAdmin = session && session.admin;
	const userId = session && session.userid;

	const themeSwap = () => {
		if (document.body.className.match('theme-dark')) {
			document.body.classList.remove('theme-dark');
			document.body.classList.add('theme-light');
			updateTheme(userId, 'light');
		} else if (document.body.className.match('theme-light')) {
			document.body.classList.remove('theme-light');
			document.body.classList.add('theme-dark');
			updateTheme(userId, 'dark');
		}	
	};	

	const imageUpload = () => {
		document.getElementById('imageUpload').click();
	};

	const avatarize = (e) => {
		const selectedfile = e.target.files;
		if (selectedfile.length > 0) {
			const [imageFile] = selectedfile;
			const fileReader = new FileReader();
			fileReader.onload = async () => {
				const srcData = fileReader.result;
				const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/setprofiledata`;
				const response = await fetch(apiUrlEndpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						newAvatar: srcData,
						userid: userId,
					}),
				});
				setAvatar(srcData);
			};
			fileReader.readAsDataURL(imageFile);
		}
	};

	const updateProfileData = async (userProfileData) => {
		userProfileData['userid'] = userId;
		const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/setprofiledata`;
		const response = await fetch(apiUrlEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userProfileData),
		});
		const reply = await response.json();
	};

	const confirmUnique = async (parameter, datum) => {
		const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/isunique?id=${userId}&${parameter}=${datum}`;
		const response = await fetch(apiUrlEndpoint);
		const res = await response.json();
		return res.available;
	}

	const updateTheme = async (newTheme) => {
		setTheme(newTheme);
		const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/updatetheme`;
		const response = await fetch(apiUrlEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId: userId,
				theme: newTheme,
			}),
		});	
	}

	const updateUsername = async (usernameData) => {
		if(username != usernameData) {
			const isUnique = await confirmUnique('username', usernameData);
			if (isUnique) {
				setUsername(usernameData);
				updateProfileData({
					username: usernameData,
				});
			} else {
				let tempUsername = username
				setUsername(usernameData);
				setUsername(tempUsername);
				alert('Username already in use')
			}
		}
	};

		const updateFirstName = async (firstNameData) => {
			if(firstName != firstNameData) {
				setFirstName(firstNameData)
				updateProfileData({
					firstName: firstNameData,
				});
			}
		}

		const updateLastName = async (lastNameData) => {
			if(lastName != lastNameData) {
				setLastName(lastNameData);
				updateProfileData({
					lastName: lastNameData,
				});
			}
		}

		const updateEmail = async (emailData) => {
			if(emailData != email) {
				const isUnique = await confirmUnique('email', emailData);
				if (isUnique) {
					setEmail(emailData);
					updateProfileData({
						email: emailData,
					});
				} else {
					let emailTemp = email
					setEmail(emailData);
					setEmail(emailTemp);
				}
			}
		}


		const updateMotto = async (mottoData) => {
			if(mottoData != motto) {
				setMotto(mottoData)
				updateProfileData({
					motto: mottoData,
				});
			}
		}

	const profileDeletePost = async (postid) => {
		const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/deletearticle`;
		const response = await fetch(apiUrlEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				postid: postid,
				user: userId,
			}),
		});
		let res = await response.json()
		setuserPosts(res.extantPosts);
		setdeletedPosts(res.deletedPosts);
	};

	const restorePost = async (postid) => {
		const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/restorearticle`;
		const response = await fetch(apiUrlEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				postid: postid,
				user: userId,
			}),
		});
		let res = await response.json();
		setuserPosts(res.extantPosts);
		setdeletedPosts(res.deletedPosts);
	};
	
	useEffect(() => {
		async function getProfileData() {
			const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/profile?user=${userId}`;
			const response = await fetch(apiUrlEndpoint);
			const res = await response.json();
			setuserPosts(res.posts);
			setdeletedPosts(res.deleted);
			setFirstName(res.user.firstName);
			setLastName(res.user.lastName);
			setEmail(res.user.email);
			setUsername(res.user.username);
			setMotto(res.user.motto);
			setAvatar(res.user.avatar);
			setTheme(res.user.preferredTheme);
		}
			getProfileData();
	}, []);

	if (status === 'loading') {
		return <div>Loading...</div>;
	}

		try {
			return (
				<div className="flex min-h-screen flex-col items-center p-6">
					<div id="profile">
						<img
							id="avatar"
							className="clickable"
							src={avatar}
							onClick={imageUpload}
						/>
						<input
							type="file"
							id="imageUpload"
							accept="image/*"
							style={{ display: 'none' }}
							onChange={avatarize}
						/>
						<h2>
							Name:&nbsp;
							<span
								id="firstName"
								className="width-machine"
								aria-hidden="true"
								contentEditable
								onBlur={(e) => updateFirstName(e.target.innerHTML)}
							>
								{firstName}
							</span>
							&nbsp;
							<span
								contentEditable
								id="lastName"
								className="edit-area clickable"
								onBlur={(e) => updateLastName(e.target.innerHTML)}
							>
								{lastName}
							</span>
						</h2>
						<h3>
							Email: &nbsp;
							<span
								contentEditable
								id="email"
								className="edit-area clickable"
								onBlur={(e) => updateEmail(e.target.innerHTML)}
							>
								{email}
							</span>
						</h3>
						<h3>
							Username:&nbsp;
							<span
								contentEditable
								id="username"
								className="edit-area clickable"
								onBlur={(e) => updateUsername(e.target.innerHTML)}
							>
								{username}
							</span>
						</h3>
						<h3>
							Motto:&nbsp;
							<span
								contentEditable
								id="motto"
								className="edit-area clickable"
								onBlur={(e) => updateMotto(e.target.innerHTML)}
								onClick={(e) => {
									if (motto.length === 0) e.target.innerHTML = '';
								}}
							>
								{motto.length === 0 ? '***no motto***' : motto}
							</span>
						</h3>
						<span onClick={themeSwap}>
							<h3 className="item-light">Theme: light</h3>
							<h3 className="item-dark">Theme: dark</h3>
						</span>
						<Link href={{ pathname: '/changepassword' }}>
							<button className="neutralButton">Change Password</button>
						</Link>
						<br />
						<br />
						<Link href={{ pathname: '/newpost' }}>
							<button className="newPostButton">New Post</button>
						</Link>
						<br />
						<br />
						<div id="postBox">
							<h2>Posts:</h2>
							<table className="postList">
								<tbody>
									{userPosts.map((post) => {
										return (
											<tr key={post.postid} className="articlePreviewRow">
												<td>{atob(post.title)}:</td>
												<td className="messageCell">
													<div className="messageCell">
														{atob(post.message)}
													</div>
												</td>
												<td width="20px"></td>
												<td width="20px">
													<button
														className="deleteButton"
														onClick={() => profileDeletePost(post.postid)}
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
											<tr key={post.postid} className="articlePreviewRow">
												<td>{atob(post.title)}:</td>
												<td className="messageCell">
													<div className="messageCell">
														{atob(post.message)}
													</div>
												</td>
												<td width="20px"></td>
												<td width="20px">
													<button
														className="newPostButton"
														onClick={() => restorePost(post.postid)}
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
				</div>
			);
		} catch (error) {
			console.log('Error:', error);
			return <h1>Something bad happened... </h1>;
		}
}
