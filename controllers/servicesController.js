const Service = require("../models/servicesModel");
const slugify = require("slugify");

// Create Service
exports.createService = async (req, res) => {
  try {
    const { serviceName, description, categoryId, image, iconImage } = req.body;

    if (!serviceName || typeof serviceName !== "string") {
      return res
        .status(400)
        .json({ message: "Service Name must be a valid string." });
    }

    const slug = slugify(serviceName, { lower: true });

    const service = new Service({
      serviceName,
      slug,
      description,
      image,
      iconImage,
      categoryId,
    });

    await service.save();

    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate({
      path: "categoryId",
      select: "categoryName -_id",
    });
    res.status(200).json(services);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Service by ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate({
      path: "categoryId",
      select: "categoryName -_id",
    });
    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Service
exports.updateService = async (req, res) => {
  try {
    const { serviceName } = req.body;

    let updatedFields = { ...req.body };
    if (serviceName && typeof serviceName === "string") {
      updatedFields.slug = slugify(serviceName, { lower: true });
    } else if (serviceName && typeof serviceName !== "string") {
      return res
        .status(400)
        .json({ message: "Service Name must be a valid string." });
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found." });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Service deleted successfully.", service });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// const Service = require("../models/servicesModel");
// const slugify = require("slugify");
// const fs = require("fs");
// const path = require("path");

// // Create Service
// exports.createService = async (req, res) => {
//   try {
//     const { serviceName, description, categoryId, image, iconImage } = req.body;

//     // // Generate URLs for the uploaded images
//     // const imageUrl = req.files["image"]
//     //   ? `uploads/services/${req.files["image"][0].filename}`
//     //   : null;
//     // const iconImageUrl = req.files["iconImage"]
//     //   ? `uploads/services/${req.files["iconImage"][0].filename}`
//     //   : null;

//     const slug = slugify(serviceName, { lower: true });

//     const service = new Service({
//       serviceName,
//       slug,
//       description,
//       image,
//       iconImage,
//       // image: imageUrl,
//       // iconImage: iconImageUrl,
//       categoryId,
//     });

//     await service.save();

//     res.status(201).json(service);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Get All Services
// exports.getAllServices = async (req, res) => {
//   try {
//     const services = await Service.find().populate({
//       path: "categoryId",
//       select: "categoryName -_id",
//     });
//     res.status(200).json(services);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Get Service by ID
// exports.getServiceById = async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id).populate({
//       path: "categoryId",
//       select: "categoryName -_id",
//     });
//     if (!service) {
//       return res.status(404).json({ message: "Service not found." });
//     }
//     res.status(200).json(service);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Update Service
// exports.updateService = async (req, res) => {
//   try {
//     const { serviceName, description, categoryId, image, iconImage } = req.body;

//     // // Handle image updates
//     // const imageUrl = req.files["image"]
//     //   ? `uploads/services/${req.files["image"][0].filename}`
//     //   : undefined;
//     // const iconImageUrl = req.files["iconImage"]
//     //   ? `uploads/services/${req.files["iconImage"][0].filename}`
//     //   : undefined;

//     const slug = slugify(serviceName, { lower: true });

//     const service = await Service.findByIdAndUpdate(
//       req.params.id,
//       {
//         serviceName,
//         slug,
//         description,
//         image,
//         iconImage,
//         // image: imageUrl,
//         // iconImage: iconImageUrl,
//         categoryId,
//       },
//       { new: true }
//     );

//     if (!service) {
//       return res.status(404).json({ message: "Service not found." });
//     }

//     res.status(200).json(service);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete Service
// exports.deleteService = async (req, res) => {
//   try {
//     const service = await Service.findById(req.params.id);
//     if (!service) {
//       return res.status(404).json({ message: "Service not found." });
//     }

//     if (service.image) {
//       const imagePath = path.join(
//         __dirname,
//         "../uploads/services",
//         path.basename(service.image)
//       );
//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath);
//       }
//     }

//     if (service.iconImage) {
//       const iconImagePath = path.join(
//         __dirname,
//         "../uploads/services",
//         path.basename(service.iconImage)
//       );
//       if (fs.existsSync(iconImagePath)) {
//         fs.unlinkSync(iconImagePath);
//       }
//     }

//     await Service.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "Service deleted successfully.", service });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
