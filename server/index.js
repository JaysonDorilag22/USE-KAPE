import  express  from "express";

const app = express();

// app.listen(process.env.PORT, () => {
// 	console.log(`server started on port:' ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
// });
app.listen(3000, () => {
	console.log("server started on port 3000");
});