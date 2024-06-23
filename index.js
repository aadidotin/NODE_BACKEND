const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    try {
        res.send({ success: true, data: [1, 2, 3] });
    } catch (error) {
        console.log(error);
    }
});

// Authentication Router
app.use("/api/auth", require("./routers/authenticate.js"));

// Data Input Router
app.use("/api/student", require("./routers/students.js"));

app.listen(4000, () => {
    console.log("Server is running at http://localhost:4000");
});
