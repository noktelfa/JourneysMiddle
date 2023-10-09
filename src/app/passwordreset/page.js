'use client';
import { useEffect, useState } from 'react';
import { redirect, useRouter, useSearchParams } from 'next/navigation';

export default function GET(request) {
	const searchParams = useSearchParams();
	const token = searchParams.get('token');

	const router = useRouter();

	const submit = () => {
 
	}

	useEffect(() => {
		document.getElementById('passwordResetButton').disabled = true;
	});

	const [newPasswordValue, setNewPasswordValue] = useState('');
  const [eyeColor, setEyeColor] = useState('lightgray');
	const [passwordTips, setPasswordTips] = useState('');
	const [passwordVisible, setPasswordVisible] = useState('text');


	const togglePasswordVisible = () => {
		if (passwordVisible === 'password') {
			setPasswordVisible('text');
			setEyeColor('lightgray');
		} else {
			setPasswordVisible('password');
			setEyeColor('#606060');
		}
	};

	  const passwordCheck = () => {
			const newPassword = document.getElementById('newPassword');
			const verifyPassword = document.getElementById('verifyPassword');

			var [strength, tips] = checkPasswordStrength(newPassword.value);
			const strengths = document.querySelectorAll('.strengths');
			if (newPassword.value.length > 0) {
				setPasswordTips(tips);
				strengths.forEach((strength) => (strength.style.display = 'none'));
				strengths[strength].style.display = 'block';
			} else {
				setPasswordTips('');
			}

			if (newPassword.value.length > 7) {
				if (newPassword.value === verifyPassword.value) {
					document.getElementById('mustMatch').style.display = 'none';
					document.getElementById('doMatch').style.display = 'block';
				} else {
					document.getElementById('mustMatch').style.display = 'block';
					document.getElementById('doMatch').style.display = 'none';
				}
			} else {
				document.getElementById('mustMatch').style.display = 'none';
				document.getElementById('doMatch').style.display = 'none';
			}

			if (strength > 2 && password.value.length > 0) {
				document.getElementById('passwordResetButton').disabled = false;
			} else {
				document.getElementById('passwordResetButton').disabled = true;
			}

			setNewPasswordValue(newPassword.value);
		};

		const checkPasswordStrength = (password) => {
			var strength = 0;
			var tips = '';

			if (password.length < 8) {
				tips += 'Please use at least eight (8) characters.\n';
			} else {
				strength += 1;
			}

			if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
				strength += 1;
			} else {
				tips += 'Use both lowercase and uppercase letters.\n';
			}

			if (password.match(/\d/)) {
				strength += 1;
			} else {
				tips += 'Include at least one number.\n';
			}

			if (password.match(/[^a-zA-Z\d]/)) {
				strength += 1;
			} else {
				tips += 'Include at least one special character.\n';
			}

			return [strength, tips];
		};


	const changePassword = async () => {
	const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/passwordrecovery`;
	const response = await fetch(apiUrlEndpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			newPassword: newPasswordValue,
			token: token
		}),
	});
	const reply = await response.json();
		if (reply.Success) {
			router.push(`${process.env.NEXT_PUBLIC_SITE_URL}/login`);
		}
	}
	
  return (
		<div>
			<h1 id="reason"></h1>
			<br />
			<br />
			<span className="passwordContainer">
				<label htmlFor="verifyPassword">Verify New Password&nbsp;</label>
				<input
					id="verifyPassword"
					type={passwordVisible}
					required
					onChange={passwordCheck}
				/>
				<span
					className="eye"
					onClick={togglePasswordVisible}
					style={{ color: eyeColor }}
				>
					&#128065;
				</span>
			</span>
			<div id="mustMatch">Password and Verify Password must match.</div>
			<div id="doMatch">Passwords match!</div>
			<br />
			<br />
			<button
				id="passwordResetButton"
				className="newPostButton"
				onClick={changePassword}
			>
				Change Password
			</button>
			<br />
			<br />
			<pre id="tipsBox">{passwordTips}</pre>
		</div>
	);
}