const exp = require("express");
const port = 3200;
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = exp();



const cateRoute = require("./routes/categories");
const proRoute = require("./routes/products");

dotenv.config();
mongoose.connect(process.env.MONGO_URL).then(() => console.log("DB Connection Successfull!")).catch((err) => {
  console.log(err);
});
app.use(cors());
app.use(exp.json());


app.use("/api/categories", cateRoute);
app.use("/api/products", proRoute);



app.listen(process.env.PORT ||port, () =>{
  console.log(`Ung dung dang chay voi port ${port}`);
});
module.exports = app;