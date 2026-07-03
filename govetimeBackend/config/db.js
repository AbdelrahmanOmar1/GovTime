const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI environment variable is required");
}

mongoose.set("strictQuery", false);

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB successfully."))
  .catch((err) => console.error("💥 Error connecting to MongoDB:", err));

module.exports = mongoose;
