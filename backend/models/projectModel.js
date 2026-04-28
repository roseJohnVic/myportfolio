import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
  },
  projects: [
    {
      title: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
    },
  ],
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;
