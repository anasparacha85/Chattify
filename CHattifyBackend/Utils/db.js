const mongoose=require('mongoose')
require('dotenv').config()
const url=process.env.MONGODB_URL

const connectdb=async()=>{
try {
    await mongoose.connect(url)
    console.log("database connected successfully");
    
} catch (error) {
    console.error("database connection failed");
    
    
}

}
module.exports=connectdb