import { jwt } from 'jsonwebtoken'

const signuser = (user) => {
	const token = jwt.sign(
		{
			Username: user.Username,
			UserId: user.UserId,
		},
		'FlorbleJostinGlilk',
		{
			expiresIn: '7d',
		}
	);
	return token;
};

const verifyUser = (token) => {
	try {
		let decoded = jwt.verify(token, 'FlorbleJostinGlilk');
		return models.users.findByPk(decoded.UserId);
	} catch (err) {
		console.log(err);
		return false;
	}
};

const hashPassword = (plainTextPassword) => {
	let salt = bcrypt.genSaltSync(10);
	let hash = bcrypt.hashSync(plainTextPassword, salt);
	return hash;
};

const comparePasswords = function (plainTextPassword, hashedPassword) {
	return bcrypt.compareSync(plainTextPassword, hashedPassword);
};
