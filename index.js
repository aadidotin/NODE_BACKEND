const express = require("express");
const app = express();
const { common } = require('./utils/constant.js');

const constant = new common();

console.log(constant);

app.use(express.json());

app.get("/", (req, res) => {
    try {
        res.send({ success: true, data: [1, 2, 3] });
    } catch (error) {
        console.log(error);
    }
});

app.use("/api/auth", require("./routers/authenticate.js"));

app.listen(4000, () => {
    console.log("Server is running at http://localhost:4000");
});
