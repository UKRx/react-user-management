const express = require("express");
const UserController = require("../controllers/userController");
const upload = require("../middleware/imageUpload");

const router = express.Router();

// GET /users - Get all users
router.get("/", UserController.getAllUsers);

// GET /users/:nameSurname - Get users by name or surname
router.get("/:nameSurname", UserController.getUsersByName);

// POST /users - Create a new user
router.post("/", upload.single("image"), UserController.createUser);

// PUT /users/:id - Update an existing user
router.put("/:id", upload.single("image"), UserController.updateUser);

// DELETE /users/:id - Delete a user
router.delete("/:id", UserController.deleteUser);

module.exports = router;
