const express = require("express");
const cors = require("cors");

const Connect = require("./config");

const routes = require("./routes/index");

const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

// kết nối mongodb atlas và chạy server với port 5000
Connect(app);

routes(app);
