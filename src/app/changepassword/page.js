'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { passwordCheck } from '@/lib/passwordchecker';
import { useState } from 'react';


const strengths = [
	['blank', ''],
	['easy', 'Too Easy'],
	['moderate', 'Moderately easy'],
	['good', 'Medium hard'],
	['better', 'Challenging'],
	['best', 'Acceptable']
]

export default function GET(request) {
  
	const router = useRouter();

  const { data: session, status } = useSession({
		required: true,
		onUnauthenticated() {
			redirect('/');
		},
	});

  var id = 0;
  if (session) {
    id = session.userid;
  }

  const [oldPasswordValue, setOldPasswordValue] = useState('');
  const [newPasswordValue, setNewPasswordValue] = useState('');
  const [strengthValues, setStrengthValues] = useState(['', '']);
  const [mustMatch, setMustMatch] = useState(false);
  const [doMatch, setDoMatch] = useState(false);
	const [passwordButtonDisabled, setPasswordButtonDisabled] = useState(true);
	
  const changePassword = async () => {
		const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/changepassword`;
		const response = await fetch(apiUrlEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
        oldPassword: oldPasswordValue,
        newPassword: newPasswordValue,
      }),
		});
		const reply = await response.json();
    if(reply.Success) {
  		router.push(`${process.env.NEXT_PUBLIC_SITE_URL}`);
    } else {
			alert(reply.error)
		}
  };

  const [passwordVisible, setPasswordVisible] = useState('password');
  const [eyeColor, setEyeColor] = useState('lightgray')

  const [passwordTips, setPasswordTips] = useState('');
	
  const logout = () => {};
  
  const togglePasswordVisible = () => {
    if(passwordVisible === 'password') {
      setPasswordVisible('text')
      setEyeColor('lightgray');
    } else {
      setPasswordVisible('password')
      setEyeColor('#606060');
    }
  }

	const passwordVerify = () => {
		const password = document.getElementById('password').value;
		const newPassword = document.getElementById('newPassword').value;
		const verifyPassword = document.getElementById('verifyPassword').value;

		let { strength, tips, matches } = passwordCheck(
			newPassword,
			verifyPassword
		);

			setPasswordButtonDisabled(
				!(password.length > 7 && strength > 2 && newPassword === verifyPassword)
			);


		setStrengthValues([strengths[strength]]);
		setPasswordTips(tips);
		setMustMatch(matches[0]);
		setDoMatch(matches[1]);

		setOldPasswordValue(password);
		setNewPasswordValue(newPassword);

	}

	return (
		<div>
			<br />
			<span className="passwordContainer">
				<label htmlFor="password">Old Password&nbsp;</label>
				<input
					id="password"
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
			<br />
			<br />
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
			{doMatch && <div id="doMatch">Passwords match!</div>}
			<br />
			<br />
			{passwordButtonDisabled ? (
				<button id="passwordResetButton" className="newPostButton" disabled>
					Password requirements not met!
				</button>
			) : (
				<button
					id="passwordResetButton"
					className="newPostButton"
					onClick={changePassword}
				>
					Change Password
				</button>
			)}
			<br />
			<br />
			<Link href={'/'}>
				<button className="deleteButton">Cancel</button>
			</Link>
			<pre id="tipsBox">{passwordTips}</pre>
		</div>
	);
}
