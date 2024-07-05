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
}

// Hàm lấy OTP từ session
export function getOTP(req: Request, email: string): OTPRecord | null {
  if (req.session.otps && req.session.otps[email]) {
    return req.session.otps[email];
  }
  return null;
}

// Hàm xác thực OTP
export function verifyOTP(req: Request, email: string, otp: string): boolean {
  const otpRecord = getOTP(req, email);
  if (otpRecord && req.session.otps) {
    // Thêm kiểm tra req.session.otps
    if (otpRecord.otp === otp && otpRecord.expirationTime > Date.now()) {
      delete req.session.otps[email];
      return true;
    }
  }
  return false;
}
