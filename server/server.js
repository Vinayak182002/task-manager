require("dotenv").config();
const path = require("path");
const errorMiddleware = require("./middlewares/error-middleware");
// Import necessary modules
const express = require("express");
const router = require("./router/auth-router");
const router1 = require("./router/task-router");
const router2 = require("./router/data-router");
const cors = require("cors");

// Create an Express application
const app = express();
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
const connectDB = require("./utils/db");

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/task-manager-app/auth", router);
app.use("/api/task-manager-app/auth/tasks", router1);
app.use("/api/task-manager-app/auth/get-data", router2);

PORT = process.env.PORT || 3000;

app.use(errorMiddleware);

// Start the server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
