import mongoose from "mongoose";

const footerSchema = new mongoose.Schema({
  copyright: {
    type: String,
    required: true,
    default: "© Your Company 2025",
  },
});

export default mongoose.model("Footer", footerSchema);
