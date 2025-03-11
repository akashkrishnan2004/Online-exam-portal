import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import jwt from "jsonwebtoken";

import examRoutes from './routes/routers.js';

import User from "./models/user.model.js";

import connect from "./connection.js";
import router from "./routes/routers.js";
import { authenticateToken } from "./middleware/auth.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.static("./dist"));
app.use(express.json({ limit: "5mb" }));

app.use("/api", router);


import userRoutes from "./routes/routers.js"
app.use("/api", userRoutes);



app.get("/api/user", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "your_jwt_secret");
    const user = await User.findById(decoded.id).select("username email role");
    res.json(user);
  } catch (error) {
    res.status(401).json({ msg: "Unauthorized" });
  }
});



router.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});


app.use(examRoutes);

app.all("/*", (req, res) => res.sendFile(path.resolve("./dist/index.html")));
connect()
  .then(() => {
    app.listen(process.env.VITE_PORT, (error) => {
      if (error) return console.log(error);
      console.log(`Server started on port ${process.env.VITE_PORT}`);
      console.log("data base connected");
    });
  })
  .catch((e) => {
    console.log(e);
  });
