import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    stats: [
      {
        value: { type: Number, required: true },
        suffix: { type: String, required: true}, 
        label: { type: String, required: true }, 
      },
    ],

    services: [
      {

        title: { type: String, required: true }, 
            icon: { type: String, default: "" }
      },
    ],
  },
  { timestamps: true }
);

const About = mongoose.model("About", aboutSchema);

export default About;
