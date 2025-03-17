const fs = require("fs");
const path = require("path");
const UserModel = require("../models/userModel");

// Helper function to convert image to base64
const imageToBase64 = (imagePath) => {
  try {
    if (!imagePath || !fs.existsSync(imagePath)) {
      return null;
    }
    const image = fs.readFileSync(imagePath);
    return `data:image/${path
      .extname(imagePath)
      .substring(1)};base64,${image.toString("base64")}`;
  } catch (error) {
    console.error("Error converting image to base64:", error);
    return null;
  }
};

class UserController {
  // Get all users
  static getAllUsers(req, res) {
    try {
      const users = UserModel.getAllUsers();

      // Process users to include base64 images
      const processedUsers = users.map((user) => {
        if (
          user.image &&
          fs.existsSync(path.join(__dirname, "../../uploads", user.image))
        ) {
          const imagePath = path.join(__dirname, "../../uploads", user.image);
          const base64Image = imageToBase64(imagePath);
          return { ...user, image: base64Image };
        }
        return user;
      });

      res.status(200).json({
        success: true,
        data: processedUsers,
      });
    } catch (error) {
      console.error("Error in getAllUsers controller:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching users",
      });
    }
  }

  // Get users by name or surname
  static getUsersByName(req, res) {
    try {
      const { nameSurname } = req.params;
      const users = UserModel.getUsersByName(nameSurname);

      // Process users to include base64 images
      const processedUsers = users.map((user) => {
        if (
          user.image &&
          fs.existsSync(path.join(__dirname, "../../uploads", user.image))
        ) {
          const imagePath = path.join(__dirname, "../../uploads", user.image);
          const base64Image = imageToBase64(imagePath);
          return { ...user, image: base64Image };
        }
        return user;
      });

      res.status(200).json({
        success: true,
        data: processedUsers,
      });
    } catch (error) {
      console.error("Error in getUsersByName controller:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching users by name",
      });
    }
  }

  // Create a new user
  static createUser(req, res) {
    try {
      const { firstName, lastName, gender, birthDate } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !gender || !birthDate) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // Process image if uploaded
      let imageName = null;
      if (req.file) {
        imageName = req.file.filename;
      }

      const userData = {
        firstName,
        lastName,
        gender,
        birthDate,
        image: imageName,
      };

      const newUser = UserModel.createUser(userData);

      // Convert image to base64 for response
      if (newUser.image) {
        const imagePath = path.join(__dirname, "../../uploads", newUser.image);
        newUser.image = imageToBase64(imagePath);
      }

      res.status(201).json({
        success: true,
        data: newUser,
      });
    } catch (error) {
      console.error("Error in createUser controller:", error);
      res.status(500).json({
        success: false,
        message: "Server error while creating user",
      });
    }
  }

  // Update an existing user
  static updateUser(req, res) {
    try {
      const { id } = req.params;
      const { firstName, lastName, gender, birthDate } = req.body;

      // Get existing user
      const existingUser = UserModel.getUserById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Process image if uploaded
      let imageName = existingUser.image;
      if (req.file) {
        // Delete old image if exists
        if (
          existingUser.image &&
          fs.existsSync(
            path.join(__dirname, "../../uploads", existingUser.image)
          )
        ) {
          fs.unlinkSync(
            path.join(__dirname, "../../uploads", existingUser.image)
          );
        }
        imageName = req.file.filename;
      }

      const userData = {
        firstName: firstName || existingUser.firstName,
        lastName: lastName || existingUser.lastName,
        gender: gender || existingUser.gender,
        birthDate: birthDate || existingUser.birthDate,
        image: imageName,
      };

      const updatedUser = UserModel.updateUser(id, userData);

      // Convert image to base64 for response
      if (updatedUser.image) {
        const imagePath = path.join(
          __dirname,
          "../../uploads",
          updatedUser.image
        );
        updatedUser.image = imageToBase64(imagePath);
      }

      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      console.error("Error in updateUser controller:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating user",
      });
    }
  }

  // Delete a user
  static deleteUser(req, res) {
    try {
      const { id } = req.params;

      // Get user before deletion to handle image
      const user = UserModel.getUserById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Delete user's image if exists
      if (
        user.image &&
        fs.existsSync(path.join(__dirname, "../../uploads", user.image))
      ) {
        fs.unlinkSync(path.join(__dirname, "../../uploads", user.image));
      }

      const result = UserModel.deleteUser(id);

      if (result) {
        res.status(200).json({
          success: true,
          message: "User deleted successfully",
        });
      } else {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    } catch (error) {
      console.error("Error in deleteUser controller:", error);
      res.status(500).json({
        success: false,
        message: "Server error while deleting user",
      });
    }
  }
}

module.exports = UserController;
