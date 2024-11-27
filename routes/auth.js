const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// POST: /register
router.post("/register", (req, res) => {
  console.log("Request received at /register");
  console.log("Request body:", req.body); // Muestra los datos recibidos

  const { username, password } = req.body;

  if (!username || !password) {
    console.error("Validation error: username or password missing");
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Verifica si el usuario ya existe en la base de datos
  User.findOne({ username })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Si no existe, crea un nuevo usuario
      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser = new User({
        username,
        password: hashedPassword,
      });

      newUser
        .save()
        .then(() => {
          console.log("User added successfully!");
          res.json("User added!");
        })
        .catch((err) => {
          console.error("Error saving user:", err);
          res.status(400).json("Error: " + err);
        });
    })
    .catch((err) => {
      console.error("Error during user check:", err);
      res.status(500).json({ error: "Error during user check" });
    });
});

// POST: /login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "No user found" });
      }

      // Comparar la contraseña ingresada con la contraseña encriptada
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({ auth: false, token: null });
      }

      const token = jwt.sign({ id: user._id }, "your-secret-key", {
        expiresIn: 86400, // 24 horas
      });
      console.log("JWT Token: ", token); // Verificar si el token se genera correctamente

      res.status(200).send({ auth: true, token: token });
    })
    .catch((err) => {
      console.error("Error during login:", err);
      res.status(500).send("Error en la base de datos");
    });
});

module.exports = router;
