import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

// Appointment Schema
const appointmentSchema = new mongoose.Schema({
  name: String,
  date: String,
  time: String,
  service: String,
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

// Routes
app.get("/appointments", async (req, res) => {
  const apps = await Appointment.find();
  res.json(apps);
});

app.post("/appointments", async (req, res) => {
  const newApp = new Appointment(req.body);
  await newApp.save();
  res.json(newApp);
});

app.put("/appointments/:id", async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/appointments/:id", async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
