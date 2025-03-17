const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const userRoutes = require("./routes/userRoutes");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "User Management API",
    endpoints: {
      getAllUsers: "GET /api/users",
      getUsersByName: "GET /api/users/:nameSurname",
      createUser: "POST /api/users",
      updateUser: "PUT /api/users/:id",
      deleteUser: "DELETE /api/users/:id",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong on the server",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
