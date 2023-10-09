'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { passwordCheck } from '../../lib/passwordchecker'

export default function GET(request) {

	
	try {
		
		const [user, setUser] = useState();
		const router = useRouter();
		const [takenEmail, setTakenEmail] = useState(null);
		const [takenUsername, setTakenUsername] = useState(null);
		const [passwordTips, setPasswordTips] = useState('');
		const [mustMatch, setMustMatch] = useState(false);
		const [doMatch, setDoMatch] = useState(false);
		const [registerButtonDisabled, setRegisterButtonDisabled] = useState(true);
	  const [passwordVisible, setPasswordVisible] = useState('text');
		const [eyeColor, setEyeColor] = useState('lightgray');
		const [strengthValues, setStrengthValues] = useState(['blank', '']);

	useEffect(() => {
		document.getElementById('firstName').value = 'Tobias'
		document.getElementById('lastName').value = 'King';
		document.getElementById('username').value = 'toblerone';
		document.getElementById('email').value = 'toby@journeysmiddle.org';
		togglePasswordVisible();
	}, []);

		const strengths = [
			['blank', ''],
			['easy', 'Too Easy'],
			['moderate', 'Moderately easy'],
			['good', 'Medium hard'],
			['better', 'Challenging'],
			['best', 'Acceptable'],
		];

		const togglePasswordVisible = () => {
			if (passwordVisible === 'password') {
				setPasswordVisible('text');
				setEyeColor('lightgray');
			} else {
				setPasswordVisible('password');
				setEyeColor('#606060');
			}
		};

    const register = async () => {
			if(user && user.password && user.username) {
				const apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/register`;
				const response = await fetch(apiUrlEndpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(user),
				});
				const reply = await response.json();
				if (reply.success) {
					router.replace(`${process.env.NEXT_PUBLIC_SITE_URL}/login`);
				}
			}
    }

    const cancel = () => {
      router.replace('/')
    }

		const passwordVerify = () => {
			const newPassword = document.getElementById('newPassword').value;
			const verifyPassword = document.getElementById('verifyPassword').value;

			let { strength, tips, matches } = passwordCheck(
				newPassword,
				verifyPassword
			);

			setRegisterButtonDisabled(
				!(strength > 2 && newPassword === verifyPassword)
			);

			setStrengthValues([strengths[strength]]);
			setPasswordTips(tips);
			setMustMatch(matches[0]);
			setDoMatch(matches[1]);

			setNewPasswordValue(newPassword);
			update();
		};

    const update = async () => {

      let testUsername = document.getElementById('username');
			let testEmail = document.getElementById('email');
			
      let apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/isunique?username=${testUsername.value}`;
      let response = await fetch(apiUrlEndpoint);
      let res = await response.json();
      
			if(res.available) {
				setTakenUsername(null);
      } else {
				setTakenUsername(testUsername.value)
        testUsername.value = '';
      }
			
			apiUrlEndpoint = `${process.env.NEXT_PUBLIC_SITE_URL}/api/isunique?email=${testUsername.value}`;
			response = await fetch(apiUrlEndpoint);
			res = await response.json();
			if (res.available) {
				setTakenEmail(null)
			} else {
				setTakenEmail(testEmail.value);
				testEmail.value = '';
			}

      setUser({
				username: testUsername.value,
				email: testEmail.value,
				password: document.getElementById('newPassword').value,
				firstname: document.getElementById('firstName').value,
				lastname: document.getElementById('lastName').value,
			}); 
      
    }
		
    return (
			<div>
				<h2>Welcome! Please sign up!</h2>
				<br />
				<div>
					<label htmlFor="firstName">First Name: </label>
					<input type="text" id="firstName" onInput={update} required />
				</div>
				<br />
				<div>
					<label htmlFor="lastName">Last Name: </label>
					<input type="text" id="lastName" onInput={update} required />
				</div>
				<br />
				<div>
					<label htmlFor="email">Email: </label>
					<input type="text" id="email" onBlur={update} required />
				</div>
				{takenEmail && (
					<div id="emailIsUsed">Email {takenEmail} is already in use.</div>
				)}
				<br />
				<div>
					<label htmlFor="username">Username: </label>
					<input type="text" id="username" onBlur={update} required />
				</div>
				{takenUsername && (
					<div id="usernameIsUsed">
						Username {takenUsername} is already in use.
					</div>
				)}
				<br />
				<div>
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
				</div>
				<div>
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
				</div>
				<pre id="tipsBox">{passwordTips}</pre>
				<br />
				<div>
					{registerButtonDisabled ? (
						<button type="submit" disabled>
							Register
						</button>
					) : (
						<button className="newPostButton" type="submit" onClick={register}>
							Register
						</button>
					)}
					<br />
					<br />
					<button className="deleteButton" type="submit" onClick={cancel}>
						Cancel
					</button>
				</div>

				<div id="notification"></div>
			</div>
		);
  } catch(error) {
    console.log(error)
  }
}