import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
import path from "path";

// Kiểm tra xem thư mục 'dist' có tồn tại hay không
const isDistFolderExists = fs.existsSync(
  path.resolve(__dirname, "../../../dist")
);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for your application",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Sử dụng định dạng 'Bearer {token}' để truyền token trong header Authorization.",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [isDistFolderExists ? "dist/app/routes/*.js" : "src/app/routes/*.ts"], // Đường dẫn tới các file chứa định nghĩa API
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
