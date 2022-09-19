const express = require("express");
const actorRouter = require("./routes/actorRouter");
require("dotenv/config");

const PORT = process.env.PORT;
console.log(process.env.PORT);
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api",actorRouter);


app.get("/", (req, res) => {
  res.send("Yoo");
});

app.listen(PORT, () => {
  console.log(`the server is running on port ${PORT}`);
});