'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { passwordCheck } from '@/lib/passwordchecker';

export default function GET(request) {
  const searchParams = useSearchParams()
	const token = searchParams.get('token');

	const router = useRouter()

	const [strengthValues, setStrengthValues] = useState(['', '']);
	const [mustMatch, setMustMatch] = useState(false);
	const [doMatch, setDoMatch] = useState(false);
	const [passwordButtonDisabled, setPasswordButtonDisabled] = useState(true);

	const strengths = [
		['', ''],
		['easy', 'Too Easy'],
		['moderate', 'Moderately easy'],
		['good', 'Medium hard'],
		['better', 'Challenging'],
		['best', 'Acceptable'],
	];
	
	if(token) {

		const [newPasswordValue, setNewPasswordValue] = useState('');
		const [eyeColor, setEyeColor] = useState('lightgray');
		const [passwordTips, setPasswordTips] = useState('');
	  const [passwordVisible, setPasswordVisible] = useState('password');

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

		const passwordVerify = () => {
			const newPassword = document.getElementById('newPassword').value;
			const verifyPassword = document.getElementById('verifyPassword').value;

			let { strength, tips, matches } = passwordCheck(
				newPassword,
				verifyPassword
			);
	
			setPasswordButtonDisabled(!(strength > 2 && newPassword === verifyPassword))
	
			setStrengthValues([strengths[strength]]);
			setPasswordTips(tips);
			setMustMatch(matches[0]);
			setDoMatch(matches[1]);

			setNewPasswordValue(newPassword);
		}

		const setPassword = async () => {
			const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/passwordrecovery`;
			const response = await fetch(apiUrlEndpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					newpassword: newPasswordValue,
					token: token,
				}),
			});
			const reply = await response.json();
			if (reply.success) {
				router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/login`);
			}
		};

		return (
			<div>
				<h1 id="reason"></h1>
				<span className="passwordContainer">
					<label htmlFor="newPassword">New Password&nbsp;</label>
					<input
						id="newPassword"
						type={passwordVisible}
						onChange={passwordVerify}
						required
					/>
					<span
						className="eye"
						onClick={togglePasswordVisible}
						style={{ color: eyeColor }}
					>
						&#128065;
					</span>
				</span>
				<div id={strengthValues[0][0]}>{strengthValues[0][1]}</div>
				<br />
				<br />
				<span className="passwordContainer">
					<label htmlFor="verifyPassword">Verify New Password&nbsp;</label>
					<input
						id="verifyPassword"
						type={passwordVisible}
						required
						onChange={passwordVerify}
					/>
					<span
						className="eye"
						onClick={togglePasswordVisible}
						style={{ color: eyeColor }}
					>
						&#128065;
					</span>
				</span>
				{mustMatch && (
					<div id="mustMatch">Password and Verify Password must match.</div>
				)}
				{doMatch && <div id="doMatch">Passwords match!</div>} <br />
				<br />
				{passwordButtonDisabled ? (
					<button id="passwordResetButton" className="newPostButton" disabled>
						Password requirements not met!
					</button>
				) : (
					<button
						id="passwordResetButton"
						className="newPostButton"
						onClick={setPassword}
					>
						Change Password
					</button>
				)}
				<br />
				<br />
				<pre id="tipsBox">{passwordTips}</pre>
			</div>
		);

	} else {

		const recoverPassword = async () => {
			const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}//api/passwordrecovery?username=${document.getElementById('username').value}`;
			const response = await fetch(apiUrlEndpoint);	
			document.getElementById('notification').innerHTML = 'If you have an account, a recovery email is being sent to your registered email address.'
			setTimeout(() => router.push('/'), 20000)
		}
	
		return (
			<div>
				<h1>Journey's Middle - Password Recovery</h1>
				<br />
				<br />
				<div id="notification"></div>
				<br />
				<label htmlFor="username">Please enter your username:</label>
				<input id="username" type="text" placeholder="UserName" required />
				<br />
				<br />
				<button onClick={recoverPassword} className="newPostButton">
					Send Reset Code
				</button>
				<br />
				<Link href="/">
					<button className="deleteButton">Cancel</button>
				</Link>
			</div>
		);

	}
}
