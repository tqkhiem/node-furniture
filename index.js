const exp = require("express");
const port = 3200;
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = exp();
const nodemailer = require("nodemailer");

const cateRoute = require("./routes/categories");
const proRoute = require("./routes/products");
const orderRoute = require("./routes/order");
const userRoute = require("./routes/user");


dotenv.config();
mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB Connection Successfull!")).catch((err) => {
  console.log(err);
});
app.use(cors());
app.use(exp.json());


app.use("/api/categories", cateRoute);
app.use("/api/products", proRoute);
app.use("/api/orders", orderRoute);
app.use("/api/users", userRoute);

app.get("/", async (req, res)=>{
  // let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    service: 'Yandex',
    auth: {
      user: 'admin@tqkpro.net', // generated ethereal user
      pass: 'pepruryohldbizsd', // generated ethereal password
    },
  });
  let info = await transporter.sendMail({
    from: '"Trần Quang Khiêm" <admin@tqkpro.net>', // sender address
    to: "tqkpro.dev@gmail.com", // list of receivers
    subject: "Đăng nhập vào Spotify", // Subject line
    html: "<b>email test</b>", // html body
  });
  console.log(info)
  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // res.send("ahihi")
})



app.listen(port, () =>{
  console.log(`Ung dung dang chay voi port ${port}`);
});
