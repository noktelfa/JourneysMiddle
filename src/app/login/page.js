'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function GET() {
  const { data, status } = useSession();

	const [passwordVisible, setPasswordVisible] = useState('text');
	const [eyeColor, setEyeColor] = useState('lightgray');

	useEffect(() => {
		function resetEyePosition() {
			togglePasswordVisible();
			togglePasswordVisible();
		}
		resetEyePosition();
	}, []);

	const togglePasswordVisible = () => {
		if (passwordVisible === 'password') {
			setPasswordVisible('text');
			setEyeColor('lightgray');
		} else {
			setPasswordVisible('password');
			setEyeColor('#606060');
		}
	};

  const login = async (e) => {
		e.preventDefault();

		const credentials = {
			username: document.getElementById('username').value,
			password: document.getElementById('password').value,
		};

		signIn('credentials', {
			username: credentials.username,
			password: credentials.password,
			redirect: true,
			callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
		});

	}	
	
	return (
		<div className="loginScreen">
			<br />
			<form onSubmit={login} id="box">
				<h2 className="login">Please log in</h2>
				<label className="login" htmlFor="username">
					Username:
				</label>
				<input
					className="login"
					type="text"
					name="username"
					id="username"
					required
				/>
				<label className="login" htmlFor="password">
					Password:
				</label>
				<span className="passwordContainer">
					<input
						className="login"
						type={passwordVisible}
						name="password"
						id="password"
						required=""
					/>
					<span
						className="eye"
						onClick={togglePasswordVisible}
						style={{ color: eyeColor }}
					>
						&#128065;
					</span>
				</span>
				<button className="login" type="submit">
					Login
				</button>
				<div id="links">
					<Link href='/register'>
						Register
					</Link>
					<Link href='/passwordrecovery'>
						Forgot Password
					</Link>
				</div>
			</form>
			<br />
			<br />
			<div>
				<button
					onClick={() =>
						signIn('google', {
							redirect: true,
							callbackUrl: '/',
						})
					}
				>
					Or... Sign in with Google!
				</button>
			</div>
		</div>
	);
}
