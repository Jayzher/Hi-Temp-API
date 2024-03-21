const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js");
const taskRoutes = require("./routes/tasksRoutes.js");

const app = express();

// Define CORS options
const corsOptions = {
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
};

app.use(cors(corsOptions)); // Apply CORS with specified options
app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://admin:admin12345@newcluster.nt7phfb.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log(`Connected to the cloud database`));

app.listen(4000, () => console.log(`API is now online on port 4000`));
