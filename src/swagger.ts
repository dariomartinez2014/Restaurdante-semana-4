import swaggerAutogen from "swagger-autogen";

const doc = {
  openapi: "3.0.0",
  info: {
    title: "API de Restaurante",
    description: "Documento generado automaticamente por swagger-autogen",
    version: "1.0.0",
  },
  // host: 'lzrlgb5t-3000.brs.devtunnels.ms',
  // host: 'localhost:3000',
  // schemes: ['https']
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor Local",
    },
    {
      url: "https://t0jhb360-3000.brs.devtunnels.ms/",
      description: "Servidor de Desarrollo (Dev Tunnels)",
    },
  ],
};

// Archivo generado de salida
const outputFile = "./swagger-output.json";
// Archivo cabecera del proyecto para ser leido por swagger-autogen
const routes = ["./index.ts"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);
