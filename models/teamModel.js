const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
    },
    images: {
      type: String, // URL of the image
      required: [true, "Image URL is required"],
      validate: {
        validator: function (v) {
          return /^(http|https):\/\/[^ "]+$/.test(v); // Ensures it is a valid URL
        },
        message: "Please enter a valid image URL.",
      },
    },
    expertise: {
      type: String,
      required: [true, "Expertise is required"],
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
