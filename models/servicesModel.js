const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      trim: true,
      required: [true, "Service Name is required."],
    },
    slug: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    image: {
      type: String,
      validate: {
        validator: function (v) {
          return v ? /^(http|https):\/\/[^ "]+$/.test(v) : true;
        },
        message: "Please enter a valid image URL.",
      },
    },
    iconImage: {
      type: String,
      validate: {
        validator: function (v) {
          return v ? /^(http|https):\/\/[^ "]+$/.test(v) : true;
        },
        message: "Please enter a valid icon image URL.",
      },
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServicesCategories",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Services", servicesSchema);

// const mongoose = require("mongoose");

// const servicesSchema = new mongoose.Schema(
//   {
//     serviceName: {
//       type: String,
//       trim: true,
//       required: [true, "Service Name is required."],
//     },
//     slug: {
//       type: String,
//     },
//     description: {
//       type: String,
//       required: [true, "Description is required."],
//     },
//     image: {
//       type: String,
//       required: false,
//     },
//     iconImage: {
//       type: String,
//       required: false,
//     },
//     categoryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "ServicesCategories",
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Services", servicesSchema);
