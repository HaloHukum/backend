import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HalloHukum API",
      version: "1.0.0",
      description:
        "The HalloHukum API provides secure access to legal consultation features, allowing client and advocate users to register, authenticate, and engage in consultations through chat, voice, or video...",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./controllers/*.ts", "./interfaces/*.ts"], // ← adjust to your path
};

export const swaggerSpec = swaggerJsdoc(options);
