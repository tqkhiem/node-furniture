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
const Mailjet = require('node-mailjet');
dotenv.config();

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC || '',
  apiSecret: process.env.MJ_APIKEY_PRIVATE || ''
});

mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB Connection Successfull!")).catch((err) => {
  console.log(err);
});
app.use(cors());
app.use(exp.json());


app.use("/api/categories", cateRoute);
app.use("/api/products", proRoute);
app.use("/api/orders", orderRoute);
app.use("/api/users", userRoute);

app.get('/send-email', async (req, res) => {
  try {
    const request = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: 'no-reply@30slice.com',
            Name: '30slice',
          },
          To: [
            {
              Email: 'tqkpro.dev@gmail.com',
              Name: 'passenger 1',
            },
          ],
          Variables: {
            day: "Monday"
          },
          TemplateID: 4275347,
          TemplateLanguage: true,
          Subject: 'Lịch cắt tóc của bạn',
        },

      ],

    })
    console.log(request.body);
    res.send(request.body);

  }
  catch (err) {
    console.log(err);
  }




  //   request
  //     .then(result => {
  //       console.log(result.body)
  //       res.send(result.body);
  //     })
  //     .catch(err => {
  //       console.log(err.statusCode)
  //     })
})






app.listen(port, () => {
  console.log(`Ung dung dang chay voi port ${port}`);
});
