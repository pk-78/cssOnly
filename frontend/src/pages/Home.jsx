import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import url from "../url";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    for: "",
    images: [],
  });
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "images") {
      setFormData((prevData) => ({
        ...prevData,
        images: Array.from(e.target.files),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate minimum 5 images
    if (formData.images.length < 5) {
      alert("Please upload at least 5 images.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("for", formData.for);

    formData.images.forEach((image) => {
      data.append("images", image);
    });

    try {
      const response = await axios.post(
        `${url}/api/submit`,
        data
      );
      console.log(
        "Form submitted successfully:",
        response?.data?.formData?._id
      );
      setUserId(response?.data?.formData?._id);
      console.log(userId);
      toast.success("uploaded Successfully");
      navigate(`/design1/${response?.data?.formData?._id}`);
      // Clear form data
      setFormData({
        name: "",
        for: "",
        images: [],
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit the form. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Welcome to Something</h1>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Enter Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="for">For</label>
          <input
            type="text"
            name="for"
            value={formData.for}
            placeholder="Myself or other"
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <p className="form-note">
            Please select at least 5 images for a better experience.
          </p>
          <label htmlFor="images">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            name="images"
            id="images"
            onChange={handleChange}
            required
          />
        </div>

        <button className="form-submit" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
