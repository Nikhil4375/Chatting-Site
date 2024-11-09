const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const http = require("http");

const users = require("./routes/api/users");
const messages = require("./routes/api/messages");

const app = express();
const port = 5000;

// Use the http module to create an HTTP server
const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:3000", // Allow local React development
      "https://nik-chat-website.netlify.app", // Allow deployed frontend from Netlify
    ],
    methods: ["GET", "POST"], // Allow GET and POST methods
    credentials: true, // Allow cookies and headers
  },
});

// Body Parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS middleware for HTTP requests
const cors = require("cors");
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Allow local React development
      "https://nik-chat-website.netlify.app", // Allow deployed frontend from Netlify
    ],
    credentials: true, // Allow cookies and headers
  })
);

// Database configuration
const db = require("./config/keys").mongoURI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Successfully Connected"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// Assign socket object to every request
app.use(function (req, res, next) {
  req.io = io;
  next();
});

// Routes
app.use("/api/users", users);
app.use("/api/messages", messages);

// Start the server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
