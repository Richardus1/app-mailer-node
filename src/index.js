const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(require("./routes/home"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res)=>{
  res.send(`<h1>Bienvenido al Nodemailer de Prueba!</h1>
  <form action="/main.html" method=GET>
  <button class="btn btn-primary btn-black">Ir a probarlo></button>
  </form>  
  `)
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
  console.log("Servidor corriendo en el puerto: " + PORT)
})