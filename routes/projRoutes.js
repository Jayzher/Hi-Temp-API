const express = require("express");
const router = express.Router();
const projController = require("../controllers/projController.js");
const auth = require("../auth.js");

router.post("/createProject", (req, res) => {
    const data = {
        role: auth.decode(req.headers.authorization).role,
        id : auth.decode(req.headers.authorization).id
    }

    if(data.role === "Admin") {
        projController.createProject(req.body).then(resultFromController => res.send(resultFromController));
    } else {
        res.send(false);
    }
})

router.post("/checkProject", (req, res) => {
    projController.checkIfProjectExists(req.body).then(resultFromController => res.send(resultFromController));
})


router.patch("/updateProject", auth.verify, (req, res) => {
    const data = {
        role: auth.decode(req.headers.authorization).role
    }

    if(data.role === "Admin") {
        projController.updateProject(req.body).then(resultFromController => res.send(resultFromController));
    } else {
        res.send("Not an Admin!");
    }
})


router.get("/allProject", (req, res) => {
    projController.getAll().then(resultFromController => res.send(resultFromController));
})

router.post("/active", (req, res) => {
    projController.availableProjects(req.body).then(resultFromController => res.send(resultFromController));
})

router.put("/updateProjectTasks", (req, res) => {
    projController.updateProjectTasks(req.body).then(resultFromController => res.send(resultFromController));
})




// router.patch("/archive/:taskId", auth.verify, (req, res) => {

//     const data = {
//         isAdmin: auth.decode(req.headers.authorization).isAdmin,
//         params: req.params
//     }

//     if (data.isAdmin) {
//         tasksController.archiveTask(data.params, req.body).then(resultFromController => res.send(resultFromController));
//     } else {
//         res.send(false);
//     }

// })

// router.post("/details", (req, res) => {
//     tasksController.getTask(req.body).then(resultFromController => res.send(resultFromController));
// })

// router.post("/assign", (req, res) => {
//     tasksController.assignTo(req.body)
//         .then(resultFromController => {
//             res.send(resultFromController);
//         })
//         .catch(error => {
//             console.error("Error:", error);
//             res.status(500).send("An error occurred");
//         });
// });

// router.put("/setActive", (req, res) => {
//     tasksController.setTaskActive(req.body).then(resultFromController => res.send(resultFromController));
// })


module.exports = router;
