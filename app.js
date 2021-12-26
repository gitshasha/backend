const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const app = express();
const { append } = require("express/lib/response");
const { default: axios } = require("axios");
const key_secret = "MX0O8EfhsKqGR6NgTLc4daMX";
const key_id = "rzp_test_V0bUr4809xcQba";

const instance = new Razorpay({
  key_id,
  key_secret,
});
app.use(cors());
app.use(express.json());
let resort;
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/order/:payid", async (req, res) => {
  const payid = req.params;
  console.log(payid);
  resort = await axios.get(
    `https://candata.herokuapp.com/paymentorder?uniqueid=${payid.payid}`
  );
  resort = resort.data;
  const amount = resort[0].sum * 100;
  console.log(resort[0].sum);
  const currency = "INR";
  const receipt = "bla";

  instance.orders.create({ amount, currency, receipt }, (error, order) => {
    if (error) {
      return res.status(500).json(error);
    }
    console.log(order);
    return res.status(200).json(order);
  });
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("listening on" + PORT);
});
