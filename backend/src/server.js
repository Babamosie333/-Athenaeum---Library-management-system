// Local development entry point. Vercel uses api/index.js (serverless handler)
// instead of this file — this one just adds app.listen() so `npm run dev`
// actually starts a server you can hit on localhost.
require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
