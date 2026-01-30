require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDatabase = require("./src/database/database");
const authRoutes = require("./src/routes/authRoutes");
const communityRoutes = require("./src/routes/communityRoutes");
const app = express();

// CORS Configuration
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (e.g., same-origin or server-to-server requests)
    if (!origin) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) {
      // echo back the incoming origin so the response header exactly matches the request origin
      return callback(null, true);
    }
    return callback(new Error('Origin not allowed by CORS'));
  },
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

