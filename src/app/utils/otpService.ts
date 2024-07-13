import otpGenerator from "otp-generator";
import { Request } from "express";
declare module "express-session" {
  interface SessionData {
    otps: { [key: string]: OTPRecord };
  }
}
interface OTPRecord {
  otp: string;
  expirationTime: number;
}

// Hàm tạo OTP
export function generateOTP(): string {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
}

// Hàm lưu OTP trong session
export function storeOTP(req: Request, email: string, otp: string): void {
  const expirationTime = Date.now() + 5 * 60 * 1000; // 5 phút
  const otpRecord: OTPRecord = { otp, expirationTime };

  if (!req.session.otps) {
    req.session.otps = {};
  }
  req.session.otps[email] = otpRecord;
  console.log("đây là thông tin storeOTP");
  console.log(req.session.otps);
  console.log("Session ID:", req.sessionID); // Thêm log session ID
}

// Hàm lấy OTP từ session
export function getOTP(req: Request, email: string): OTPRecord | null {
  if (req.session.otps && req.session.otps[email]) {
    console.log("đây là thông tin getOTP");
    console.log(req.session.otps[email]);
    return req.session.otps[email];
  }
  return null;
}

// Hàm xác thực OTP
export function verifyOTP(req: Request, email: string, otp: string): boolean {
  console.log("đây là thông tin verifyOTP");
  console.log(req.session.otps);
  console.log("Session ID:", req.sessionID); // Thêm log session ID
  console.log(email);
  console.log(otp);
  const otpRecord = getOTP(req, email);
  console.log(otpRecord);
  if (otpRecord && req.session.otps) {
    console.log("đây là thông tin verifyOTP true1");
    // Thêm kiểm tra req.session.otps
    if (otpRecord.otp === otp && otpRecord.expirationTime > Date.now()) {
      console.log("đây là thông tin verifyOTP true2");
      delete req.session.otps[email];
      return true;
    }
  }
  return false;
}
