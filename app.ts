import morgan from "morgan";
import dotenv from "dotenv";
import express, { Application, Request, Response, NextFunction } from "express";
import indexRoute from "./src/routes/index";
import bodyParser from "body-parser";
import { connectDatabase } from "./config/database";


const PORT = process.env.PORT || 3000;
// Load environment variables
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
// Connect to database
connectDatabase();






// Create Express app
const app: Application = express();


// Middleware
app.use(bodyParser.json({ limit: "50mb" }));




app.use(morgan("dev"));

// All your controllers should live here
app.get("/", (req: Request, res: Response) => {
  res.send({ "message": "working" }).status(200);
});

app.use("/api", indexRoute);



// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to uncaught exception");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to unhandled promise rejection");
});


app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
});

export default app;