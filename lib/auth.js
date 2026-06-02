import jwt from "jsonwebtoken";

// Helper function to verify token from Next.js request headers and return user data
export function verifyAuth(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return null;
    }

    return jwt.verify(token, process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production");
  } catch (error) {
    console.error("JWT Verification error:", error);
    return null;
  }
}

// Helper function to verify token and return user data
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production");
  } catch (error) {
    return null;
  }
}