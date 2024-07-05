import nodemailer from "nodemailer";
export async function sendMailToResetPassword(to: string, otp: string) {
  let trasporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bluepinkphan@gmail.com",
      pass: "ejqi sfct aebr ldsx",
    },
  });
  let info = await trasporter.sendMail({
    from: "Công Ty TNHH BluePink",
    to: to,
    subject: "Lấy lại mật khẩu",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
        <h2 style="color: #1E90FF;">Đồng hành cùng con</h2>
        <p style="color: #FF69B4;">Xin chào,</p>
        <p>Chúng tôi đã nhận được yêu cầu lấy lại mật khẩu cho tài khoản của bạn.</p>
        <p>Vui lòng sử dụng mã OTP sau để đặt lại mật khẩu của bạn:</p>
        <h3 style="color: #1E90FF;">${otp}</h3>
        <p>Mã OTP này sẽ hết hạn sau 5 phút.</p>
        <p>Nếu bạn không yêu cầu lấy lại mật khẩu, vui lòng bỏ qua email này.</p>
        <p>Trân trọng,</p>
        <p style="color: #FF69B4;">Công Ty TNHH BluePink</p>
      </div>
    `,
  });

  console.log("Message sent: %s", info.messageId);
}
