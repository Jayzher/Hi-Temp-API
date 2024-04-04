const express = require("express");
const mongoose = require("mongoose");
const http = require('http');
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js");
const taskRoutes = require("./routes/tasksRoutes.js");
const projRoutes = require("./routes/projRoutes.js");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Enable CORS for HTTP requests
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://admin:admin12345@newcluster.nt7phfb.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/project", projRoutes);

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log(`Connected to the cloud database`));

// Use the middleware for WebSocket connections
io.use((socket, next) => {
    // Allow requests from the specified origin
    const origin = socket.handshake.headers.origin;
    if (origin === "http://localhost:3000") {
        return next();
    }
    return next(new Error("Unauthorized access"));
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle WebSocket events here

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`API is now online on port ${PORT}`));
