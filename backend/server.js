const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const app = express();

// Middleware to parse JSON
app.use(express.json());
const cors = require("cors");

// Enable CORS for all routes
app.use(cors());
dotenv.config();

// MongoDB Connection

const mongoURI = process.env.MONGO_DB_URI;
// const mongoURI = "mongodb+srv://priyanshukushwaha311:SmGwb9CTcWfZkgbB@cluster0.zc8da.mongodb.net/";
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Define a schema and model for the form data
const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  forWhom: { type: String, required: true },
  images: [{ type: String }], // Store file paths for images
});

const FormDataModel = mongoose.model("FormData", formSchema);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Files will be stored in the "uploads" folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// Route to handle form submission
app.post("/api/submit", upload.array("images"), async (req, res) => {
  try {
    const { name, for: forWhom } = req.body;

    // Validate input
    if (!name || !forWhom || req.files.length < 5) {
      return res.status(400).json({
        message:
          "All fields are required, and at least 5 images must be uploaded.",
      });
    }

    // Generate URLs for the uploaded images
    const imageUrls = req.files.map(
      (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
    );

    const formData = new FormDataModel({
      name,
      forWhom,
      images: imageUrls,
    });

    await formData.save();

    res.status(200).json({ message: "Form submitted successfully", formData });
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Route to get form data by ID
app.get("/api/submit/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    // Find the form data by ID
    const formData = await FormDataModel.findById(id);

    if (!formData) {
      return res.status(404).json({ message: "Form data not found" });
    }

    res
      .status(200)
      .json({ message: "Form data retrieved successfully", formData });
  } catch (error) {
    console.error("Error retrieving form data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
