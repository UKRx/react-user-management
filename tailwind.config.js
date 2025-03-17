/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4285F4", // Blue color from the header
        secondary: "#f0f0f0", // Light gray for table header
        success: "#4CAF50", // Green for save button
        warning: "#FFC107", // Yellow for edit button
        danger: "#F44336", // Red for delete button
        cancel: "#9E9E9E", // Gray for cancel button
      },
    },
  },
  plugins: [],
};
