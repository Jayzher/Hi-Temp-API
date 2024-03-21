const Users = require("../models/Users.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");
const Tasks = require("../models/Tasks.js");

module.exports.registerUser = (requestBody) => {
	let newUser = new Users({
		name: requestBody.name,
		username: requestBody.username,
		password: bcrypt.hashSync(requestBody.password, 10)
	})

	return newUser.save().then((user, err) => {
		if(err) {
			return false;
		} else {
			return true;
		}
	})
} 

module.exports.authenticateUser = (requestBody) => {
	return Users.findOne({username: requestBody.username}).then(result => {
		if(result == null) {
			return false;
		} else {
			const isPasswordCorrect = bcrypt.compareSync(requestBody.password, result.password)
			if(isPasswordCorrect) {
				return {access: auth.createAccessToken(result)}
			} else {
				return false;
			};
		};
	});
};

module.exports.getProfile = (data) => {
	return Users.findById(data.userId).then(result => {
		result.password = "";
		return result;
	});
};

module.exports.checkIfEmailExists = (requestBody) => {
	return Users.find({username: requestBody.username}).then(result => {
		if(result.length > 0) {
			return true;
		} else {
			return false;
		}
	})
};