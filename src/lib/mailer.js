const nodemailer = require('nodemailer');

export const mailToken = async (email, token) => {
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: 'traveler@journeysmiddle.org',
			pass: process.env.EMAIL_PASSWORD,
		},
	});
	
	var mailOptions = {
		from: 'traveler@journeysmiddle.org',
		to: email,
		subject: 'Password Recovery Message from The Traveler',
		text: `
    Good morning, Fellow Traveler!
  
  
    A request was received to reset the password for the user at ${email} recently. No actions have been taken at this time.
    
    If you did not send this request, please disregard. If you made this request, you can go to the following address in a browser:
    
      ${process.env.NEXT_PUBLIC_SITE_URL}/passwordrecovery?token=${token}
    
    Again, if you did not initiate this request, no action needs to be taken. To stop receiving e-mails from us forever, please go to the address below:

		  ${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${token}
    
  
    Happy Adventuring,
    The Traveler
  `,
		html: `
		Good morning, Fellow Traveler!
    <br>
    <br>
    A request was received to reset the password for the user at ${email} recently. No actions have been taken at this time.
    <br>
    If you did not send this request, please disregard. If you made this request, you can use the following link to initiate a password reset:
    <br>
    <br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="${process.env.NEXT_PUBLIC_SITE_URL}/passwordrecovery?token=${token}">Click here to reset your password</a>
    <br>
    <br>
    Again, if you did not initiate this request, no action needs to be taken. To stop receiving e-mails from us forever, please use the link below:
    <br>
    <br>
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?token=${token}">Unsubscribe</a>
    <br>
    <br>
    Happy Adventuring,
		<br>
		The Traveler
  `,
	};
	
	transporter.sendMail(mailOptions, (err, info) => {
		secure: false;
		if (err) {
			console.log(err);
		} else {
			console.log('Email sent successfully!');
		}
	});
}
