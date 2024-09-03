const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const BlogCategories = require("../models/blogCategoriesModel");
const slugify = require("slugify");

//create blog
exports.createBlog = async (req, res) => {
  const { blogName, description, categoryId, userId, images } = req.body;

  try {
    const user = await User.findById(userId);

    console.log("user data =========", user);

    if (user.role !== "admin" && user.role !== "vendor") {
      return res
        .status(403)
        .json({ message: "Access denied. Only admins can create blogs." });
    }

    // const images = req.files.map((file) => file.path);

    const slug = slugify(blogName, { lower: true });

    const blog = new Blog({
      blogName,
      slug,
      description,
      images: images,
      categoryId,
      userId,
    });

    await blog.save();

    await BlogCategories.findByIdAndUpdate(
      categoryId,
      { $push: { blogs: blog._id } },
      { new: true, useFindAndModify: false }
    );

    await User.findByIdAndUpdate(
      req.userId,
      { $push: { blogs: blog._id } },
      { new: true, useFindAndModify: false }
    );

    res.status(201).json({ message: "Blog created successfully.", blog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// get all blogs
exports.getAllBlogs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const blogs = await Blog.find()
      .populate("categoryId", "categoryName")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Blog.countDocuments();

    res.status(200).json({
      blogs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// get by id
exports.getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id).populate("categoryId", "categoryName");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

//update blog
exports.updateBlog = [
  async (req, res) => {
    const { id } = req.params;
    const { blogName, description, images, categoryId } = req.body;

    try {
      const blog = await Blog.findById(id);

      if (!blog) {
        return res.status(404).json({ message: "Blog not found." });
      }

      const previousCategoryId = blog.categoryId;

      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { blogName, description, images, categoryId, images },
        { new: true, runValidators: true }
      );

      if (!updatedBlog) {
        return res.status(404).json({ message: "Failed to update the blog." });
      }

      if (categoryId !== previousCategoryId.toString()) {
        await BlogCategories.findByIdAndUpdate(
          previousCategoryId,
          { $pull: { blogs: blog._id } },
          { new: true }
        );

        await BlogCategories.findByIdAndUpdate(
          categoryId,
          { $push: { blogs: blog._id } },
          { new: true }
        );
      }

      res.status(200).json({
        message: "Blog updated successfully.",
        updatedBlog,
      });
    } catch (error) {
      console.error("Error updating blog:", error);
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  },
];

//delete
exports.deleteBlog = [
  async (req, res) => {
    const { id } = req.params;

    try {
      const blog = await Blog.findById(id);

      if (!blog) {
        return res.status(404).json({ message: "Blog not found." });
      }

      const categoryId = blog.categoryId;

      await Blog.findByIdAndDelete(id);

      await BlogCategories.findByIdAndUpdate(
        categoryId,
        { $pull: { blogs: id } },
        { new: true }
      );

      res.status(200).json({ message: "Blog deleted successfully.", blog });
    } catch (error) {
      console.error("Error deleting blog:", error);
      res
        .status(500)
        .json({ message: "Server error. Please try again later." });
    }
  },
];
