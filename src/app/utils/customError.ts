class CustomError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "CustomError";
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export default CustomError;
