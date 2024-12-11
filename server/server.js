require('dotenv').config();
const errorMiddleware = require("./middlewares/error-middleware");
// Import necessary modules
const express = require("express");
const router = require("./router/auth-router");

// Create an Express application
const app = express();
app.use(express.json());
const connectDB = require("./utils/db");



app.use("/api/task-manager-app/auth", router);

PORT = process.env.PORT || 3000;

app.use(errorMiddleware);


// Start the server
connectDB().then(()=>{
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});

