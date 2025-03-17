const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const dataPath = path.join(__dirname, "../data/users.json");

// Ensure the data directory exists
const dataDir = path.dirname(dataPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize users.json if it doesn't exist
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(
    dataPath,
    JSON.stringify(
      [
        {
          id: "1",
          firstName: "Somsak",
          lastName: "Deemak",
          gender: "Male",
          birthDate: "2000-06-13",
          image: null,
        },
        {
          id: "2",
          firstName: "Manee",
          lastName: "DeeDee",
          gender: "Female",
          birthDate: "2001-01-21",
          image: null,
        },
      ],
      null,
      2
    )
  );
}

class UserModel {
  // Get all users
  static getAllUsers() {
    try {
      const data = fs.readFileSync(dataPath, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading users data:", error);
      return [];
    }
  }

  // Get user by ID
  static getUserById(id) {
    try {
      const users = this.getAllUsers();
      return users.find((user) => user.id === id) || null;
    } catch (error) {
      console.error("Error getting user by ID:", error);
      return null;
    }
  }

  // Get users by name or surname
  static getUsersByName(query) {
    try {
      const users = this.getAllUsers();
      const lowerCaseQuery = query.toLowerCase();

      return users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(lowerCaseQuery) ||
          user.lastName.toLowerCase().includes(lowerCaseQuery)
      );
    } catch (error) {
      console.error("Error getting users by name:", error);
      return [];
    }
  }

  // Create a new user
  static createUser(userData) {
    try {
      const users = this.getAllUsers();
      const newUser = {
        id: uuidv4(),
        ...userData,
      };

      users.push(newUser);
      fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));

      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }

  // Update an existing user
  static updateUser(id, userData) {
    try {
      const users = this.getAllUsers();
      const userIndex = users.findIndex((user) => user.id === id);

      if (userIndex === -1) {
        return null;
      }

      // Preserve the image if not provided in update
      if (!userData.image && users[userIndex].image) {
        userData.image = users[userIndex].image;
      }

      const updatedUser = {
        ...users[userIndex],
        ...userData,
        id, // Ensure ID remains the same
      };

      users[userIndex] = updatedUser;
      fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  }

  // Delete a user
  static deleteUser(id) {
    try {
      const users = this.getAllUsers();
      const filteredUsers = users.filter((user) => user.id !== id);

      if (filteredUsers.length === users.length) {
        return false; // User not found
      }

      fs.writeFileSync(dataPath, JSON.stringify(filteredUsers, null, 2));
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }
}

module.exports = UserModel;
