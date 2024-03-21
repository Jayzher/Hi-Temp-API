const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController.js");
const auth = require("../auth.js");

router.post("/register", (req, res) => {
	userController.registerUser(req.body).then(resultFromController => res.send(resultFromController));
})

router.post("/login", (req, res) => {
	userController.authenticateUser(req.body).then(resultFromController => res.send(resultFromController));
})

router.get("/details", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);
	userController.getProfile({userId: userData.id}).then(resultFromController => res.send(resultFromController));
});

router.post("/checkEmail", (req, res) => {
	userController.checkIfEmailExists(req.body).then(resultFromController => res.send(resultFromController));
});

module.exports = router;