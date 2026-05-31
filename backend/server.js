const  express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
// const user = require("./router/user.route")
const file = require("./router/file.route")

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

// app.use("/api/user",user)
app.use("/api/file",file)

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
