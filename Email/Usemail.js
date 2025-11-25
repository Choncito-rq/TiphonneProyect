const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURAR AQUI TU CORREO Y CLAVE
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tiphonneassistant7@gmail.com",    
    pass: "hmic lkkj pffu wtlr"          
  },
  tls: {
    rejectUnauthorized: false        
  }
});

// RUTA PARA ENVIAR EL CORREO
app.post("/send-token", async (req, res) => {
  const { email, token } = req.body;

  console.log("Enviando token a:", email);
  console.log("Token:", token);

  const mailOptions = {
    from: "tiphonneassistant7@gmail.com",
    to: email,
    subject: "Recuperación de Contraseña",
    text: `Tu token de recuperación es: ${token}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado correctamente.");
    res.json({ success: true, message: "Correo enviado." });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ success: false, message: "Error enviando correo" });
  }
});

// INICIAR SERVIDOR
app.listen(4000, () => {
  console.log("Servidor de correo activo en http://localhost:4000");
});
