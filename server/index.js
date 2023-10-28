import  express  from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose
    .connect(process.env.MONGO).then (()=>{
    console.log("sucessfully connected to MongoDB");
})
.catch((err)=>{
    console.log(err);
});

const app = express();

// app.listen(process.env.PORT, () => {
// 	console.log(`server started on port:' ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
// });
app.listen(3000, () => {
	console.log("server started on port 3000");
});