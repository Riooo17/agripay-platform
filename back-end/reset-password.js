const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

mongoose.connect("mongodb+srv://briomondi116_db_user:ItjJOs0bIEqZLOlE@agripay-cluster.ztsnhuq.mongodb.net/agripay?retryWrites=true&w=majority&appName=AgriPay-Cluster");

mongoose.connection.once("open", async () => {
  const hashedPassword = await bcrypt.hash("password123", 12);
  await mongoose.connection.collection("users").updateOne(
    { email: "briomondi116@gmail.com" },
    { $set: { password: hashedPassword } }
  );
  console.log("✅ Password reset to: password123");
  process.exit();
});
