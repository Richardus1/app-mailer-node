const express = require("express");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const router = express.Router();
require("dotenv").config();

router.post("/sendEmail", (req, res) => {
  const { name, email, phone, message } = req.body;
  const contentHtml = `
  <h1>Formulario de Nodemailer</h1>
  <ul>
    <li>name: ${name}</li>
    <li>email: ${email}</li>
    <li>celular: ${phone}</li>
  </ul>
  <p>${message}</p>
  `;

  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;
  const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  async function sendMail() {
    try {
      const accessToken = await oAuth2Client.getAccessToken(Error);
      if (Error)
        return console.log(
          "Fallo al conseguir el refreshToken, el correo no se envió"
        );

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.USER,
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });

      const mailOptions = {
        from: "La página!!! <rikkodigital@gmail.com>",
        to: process.env.DESTINO,
        subject: "Prueba de app-mailer-node",
        html: contentHtml,
      };

      const result = await transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  sendMail()
    .then((result) =>
      res.status(200)
        .send(`<h1>Enviado con éxito!</h1><form action="/" method=GET>
  <button class="btn btn-primary btn-black">Ir al inicio></button>
  </form>  
  `)
    )
    .catch((error) => console.log(error.message));
  //res.send("Enviado")
});

module.exports = router;
