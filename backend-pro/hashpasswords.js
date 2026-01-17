const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/user");

dotenv.config();

const hashPasswords = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const users = await User.find();

  for (let user of users) {
    if (!user.password.startsWith("$2a")) {
      user.password = await bcrypt.hash(user.password, 10);
      await user.save();
    }
  }

  console.log("✅ All passwords hashed");
  process.exit();
};

hashPasswords();
