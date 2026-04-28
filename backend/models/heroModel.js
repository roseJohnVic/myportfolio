import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    subheading: { type: String, required: true },
    description: { type: String, required: true },
   backgroundImage: { type: String, required: false }, 
  rightImage: { type: String, required: false }, 
}, {
    timestamps: true ,//timing 
})

const Hero = mongoose.model("Hero", heroSchema);

export default Hero;