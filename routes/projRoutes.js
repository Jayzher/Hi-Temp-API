const express = require("express");
const router = express.Router();
const projController = require("../controllers/projController.js");
const auth = require("../auth.js");

router.post("/addproject", (req, res) => {
    const data = {
        isAdmin: auth.decode(req.headers.authorization).isAdmin,
        id : auth.decode(req.headers.authorization).id
    }

    if (data.isAdmin) {
        projController.createProject(req.body).then(resultFromController => res.send(resultFromController));
    } else {
        res.send(false);
    }
})

/*router.get("/allTasks", (req, res) => {
    tasksController.getAll().then(resultFromController => res.send(resultFromController));
})

router.get("/active", (req, res) => {
    tasksController.availableProducts().then(resultFromController => res.send(resultFromController));
})

router.put("/update", auth.verify, (req, res) => {
    const data = {
        isAdmin: auth.decode(req.headers.authorization).isAdmin,
    }

    if(data.isAdmin) {
        tasksController.updateTask(req.body).then(resultFromController => res.send(resultFromController));
    } else {
        res.send(false);
    }
})

router.patch("/archive/:taskId", auth.verify, (req, res) => {

    const data = {
        isAdmin: auth.decode(req.headers.authorization).isAdmin,
        params: req.params
    }

    if (data.isAdmin) {
        tasksController.archiveTask(data.params, req.body).then(resultFromController => res.send(resultFromController));
    } else {
        res.send(false);
    }

})

router.post("/details", (req, res) => {
    tasksController.getTask(req.body).then(resultFromController => res.send(resultFromController));
})

router.post("/assign", (req, res) => {
    tasksController.assignTo(req.body)
        .then(resultFromController => {
            res.send(resultFromController);
        })
        .catch(error => {
            console.error("Error:", error);
            res.status(500).send("An error occurred");
        });
});

router.put("/setActive", (req, res) => {
    tasksController.setTaskActive(req.body).then(resultFromController => res.send(resultFromController));
})*/


module.exports = router;
