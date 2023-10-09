  export const passwordCheck = (newPassword, verifyPassword) => {

    var [strength, tips] = checkPasswordStrength(newPassword);
		let mustMatch;
		let doMatch;
    
    if (newPassword.length > 7) {
			if (newPassword === verifyPassword) {
				mustMatch = false;
				doMatch = true;
			} else {
				mustMatch = true;
				doMatch = false;
			}
		} else {
			mustMatch = false;
			doMatch = false;
		}

		return {
			strength: strength,
			tips: tips,
			matches: [mustMatch, doMatch],
		};
  }

  const checkPasswordStrength = (password) => {

    var strength = 0;
		var tips = '';

		if(password.length < 1) {
	    return [strength, tips];
		} else {
			strength += 1;
		}

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
	}