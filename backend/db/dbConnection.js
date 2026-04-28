import mongoose from "mongoose";

const startDb = async()=>{
    try{
       const conn = await mongoose.connect(process.env.MONGO_URL);
       console.log(`Db connected ${conn.connection.host}`);
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}


export default startDb;