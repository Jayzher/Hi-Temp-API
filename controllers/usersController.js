const Users = require("../models/Users.js");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");
const Tasks = require("../models/Tasks.js");
const TaskTypes = require("../models/TaskTypes.js");

module.exports.registerUser = (requestBody) => {
	let newUser = new Users({
		name: requestBody.name,
		username: requestBody.username,
		profile: requestBody.profile,
		department: requestBody.department,
		role: requestBody.role,
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

module.exports.logoutUser = async (userId, io) => { // Pass Socket.IO instance as a parameter
    try {
        // Update user's status to false
        await Users.findOneAndUpdate({ _id: userId }, { Status: false });

        // Emit event to notify clients that the user has logged out
        io.emit('userStatusChange', { userId: userId, status: false });

        return true; // Successfully logged out
    } catch (error) {
        console.error("Error in logout:", error);
        return false; // Handle errors gracefully
    }
};

module.exports.authenticateUser = async (requestBody, io) => { // Pass Socket.IO instance as a parameter
    try {
        const result = await Users.findOne({ username: requestBody.username });
        if (!result) {
            return false; // User not found
        }

        const isPasswordCorrect = bcrypt.compareSync(requestBody.password, result.password);
        if (isPasswordCorrect) {
            await Users.findOneAndUpdate({ username: requestBody.username }, { Status: true });
            const accessToken = auth.createAccessToken(result);

            // Emit event to notify clients that a user has logged in
            io.emit('userStatusChange', { userId: result._id, status: true });

            return { access: accessToken };
        } else {
            return false; // Incorrect password
        }
    } catch (error) {
        console.error("Error in authentication:", error);
        return false; // Handle errors gracefully
    }
};

module.exports.getProfile = (data) => {
	return Users.findById(data.userId).then(result => {
		result.password = "";
		return result;
	});
};

module.exports.userProfile = (data) => {
	return Users.findOne({name : data.name}).then(result => {
		return result;
	});
};

module.exports.allusers = () => {
	return Users.find({}).then(result => {
		return result;
	});
};

module.exports.checkIfEmailExists = (requestBody) => {
	return Users.find({name: requestBody.name}).then(result => {
		if(result.length > 0) {
			return true;
		} else {
			return false;
		}
	})
};


module.exports.updateProfile = (id, requestBody) => {
	return Users.findByIdAndUpdate(id, {profile: requestBody.profile}).then((result, err) => {
		if (err) {
			return false;
		} else {
			return true;
		}
	})
}

module.exports.getUserbyDepartment = (requestBody) => {
	return Users.find({department: requestBody.department}, {name: 1}).then((result, err) => {
		if (err) {
			return false;
		} else {
			return result;
		}
	})
}


module.exports.getTaskTypebyDepartment = (requestBody) => {
	return TaskTypes.findOne({department: requestBody.department}, {taskTypes: 1}).then((result, err) => {
		if (err) {
			return false;
		} else {
			return result;
		}
	})
}

module.exports.getDepartment = () => {
	return TaskTypes.find({}).then((result, err) => {
		if (err) {
			return false;
		} else {
			return result;
		}
	})
}