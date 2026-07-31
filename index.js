const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Pair Code Routes
const pairRouter = require("./main");
app.use("/", pairRouter);

// Home Page
app.get("/", (req, res) => {
    res.send({
        status: true,
        bot: "Kawshala-MD",
        owner: "Kawshala",
        message: "🚀 Kawshala-MD Pair Code Server is Running Successfully."
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════╗
║     KAWSHALA-MD ONLINE     ║
╠════════════════════════════╣
║ Owner : Kawshala           ║
║ Port  : ${PORT}            ║
║ Status: Running ✅         ║
╚════════════════════════════╝
`);
});

module.exports = app;
