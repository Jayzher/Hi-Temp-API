const express = require("express");
const router = express.Router();
const userController = require("../controllers/usersController.js");
const auth = require("../auth.js");
const { getIO, init } = require('../socket'); // Import the getIO function from socket.js

const io = init(); // Call init function to initialize the io instance

router.post("/register", (req, res) => {
    userController.registerUser(req.body).then(resultFromController => res.send(resultFromController));
});

router.get("/logout", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization).id;
    userController.logoutUser(userData, io).then(resultFromController => {
        res.send(resultFromController);
    });
});

router.post("/login", (req, res) => {
    userController.authenticateUser(req.body, io).then(resultFromController => {
        res.send(resultFromController);
    });
});

router.get("/details", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    userController.getProfile({userId: userData.id}).then(resultFromController => res.send(resultFromController));
});

router.post("/profile", (req, res) => {
    userController.userProfile(req.body).then(resultFromController => res.send(resultFromController));
});

router.get("/all", (req, res) => {
    userController.allusers().then(resultFromController => res.send(resultFromController));
});

router.post("/checkEmail", (req, res) => {
    userController.checkIfEmailExists(req.body).then(resultFromController => res.send(resultFromController));
});

router.put("/update", auth.verify, (req, res) => {
    const userData = auth.decode(req.headers.authorization);
    userController.updateProfile(userData.id, req.body).then(resultFromController => res.send(resultFromController));
});

router.post("/department", (req, res) => {
    userController.getUserbyDepartment(req.body).then(resultFromController => res.send(resultFromController));
});

router.post("/taskTypes", (req, res) => {
    userController.getTaskTypebyDepartment(req.body).then(resultFromController => res.send(resultFromController));
});

router.get("/getdepartment", (req, res) => {
    userController.getDepartment().then(resultFromController => res.send(resultFromController));
});


module.exports = router;
