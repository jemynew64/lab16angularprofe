const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Configuración de la app
const app = express();
app.use(express.json());
app.use(cors());

// Inicializar el servidor
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server is up and running on port: " + port);
});

const mongoose = require("mongoose");

// Conexión a MongoDB
mongoose
  .connect("mongodb://admin:admin123@0.0.0.0:27017/mean_db?authSource=admin")
  .then(() => console.log("MongoDB Connected…"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
