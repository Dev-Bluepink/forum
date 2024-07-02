import * as jwt from "jsonwebtoken";

export const tokenSign = (idUser: string): string => {
  if (!idUser) {
    throw new Error("idUser không hợp lệ");
  }
  return jwt.sign({ _id: idUser }, "PW");
};

export const tokenVerify = (token: string) => {
  if (!token) {
    throw new Error("Token không hợp lệ");
  }
  try {
    return jwt.verify(token, "PW");
  } catch (err) {
    throw new Error("Token không hợp lệ hoặc đã hết hạn");
  }
};
