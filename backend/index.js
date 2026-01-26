require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDatabase = require("./src/database/database");
const authRoutes = require("./src/routes/authRoutes");
const communityRoutes = require("./src/routes/communityRoutes");
const app = express();

// CORS Configuration
const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

const databaseURL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 3000;

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/communities", communityRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});

app.listen(PORT, async () => {
    console.log(`App is running at http://localhost:${PORT}`);
    await connectDatabase(databaseURL);
});

