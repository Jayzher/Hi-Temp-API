const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksController.js");
const auth = require("../auth.js");

router.post("/addTask", (req, res) => {
    const data = {
        role: auth.decode(req.headers.authorization).role,
        id : auth.decode(req.headers.authorization).id
    }

    if(data.role === "Admin") {
    	tasksController.createTask(req.body).then(resultFromController => res.send(resultFromController));
    } else {
		res.send(false);
	}
})

router.get("/allTasks", (req, res) => {
	tasksController.getAll().then(resultFromController => res.send(resultFromController));
})

router.patch("/active", (req, res) => {
	tasksController.availableProducts(req.body).then(resultFromController => res.send(resultFromController));
})

router.post("/TaskDetails", (req, res) => {
    tasksController.getTaskById(req.body).then(resultFromController => res.send(resultFromController));
})


router.put("/update", auth.verify, (req, res) => {
    const data = {
        role: auth.decode(req.headers.authorization).role
    }

    if(data.role === "Admin") {
        tasksController.updateTask(req.body).then(resultFromController => res.send(resultFromController));
    } else {
        res.send("Not an Admin!");
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

router.put("/Active", (req, res) => {
    tasksController.setTaskActive(req.body).then(resultFromController => res.send(resultFromController));
})

router.put("/addtasktypes", (req, res) => {
    tasksController.addTaskType(req.body).then(resultFromController => res.send(resultFromController));
})

router.post("/adddepartment", (req, res) => {
    tasksController.addDepartment(req.body).then(resultFromController => res.send(resultFromController));
})


module.exports = router;
