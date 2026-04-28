import mongoose from "mongoose";


const skillsSchema = new mongoose.Schema({
    heading:{
        type:String,
        required : true,
    },
    description :{
        type : String,
        required : true,
    },
    skillsCnt : [
        {
           title: { type: String, required: true }, 
            icon: { type: String, required: true },
            range: {type: String,required : true}
        }
    ]
},
  { timestamps: true }
)


const Skills = mongoose.model("Skills",skillsSchema) ;

export default Skills;