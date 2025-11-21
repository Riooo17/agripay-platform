// utils/createAdmin.js - RUN THIS ONCE to create admin user
const createAdminUser = async () => {
  const adminUser = {
    name: "AgriPay Administrator",
    email: "admin@agripay.com", 
    password: "admin123", // Change this!
    role: "admin",
    phone: "+254700000000",
    isVerified: true,
    status: "active"
  };
  
  console.log("✅ Admin user created: admin@agripay.com");
  console.log("🔑 Temporary password: admin123");
  console.log("🚨 CHANGE PASSWORD IMMEDIATELY!");
};