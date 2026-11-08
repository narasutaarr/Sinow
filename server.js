require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/materials", require("./routes/material"));
app.use("/api/quizzes", require("./routes/quiz"));
app.use("/api/progress", require("./routes/progress"));
app.use("/api/ai", require("./routes/ai"));

// Endpoint utama
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Education API is running!"
    });
});

// Jalankan server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});