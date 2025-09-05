import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";
// Opções básicas do Swagger
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Closet Moda Fitness",
            version,
            description: "Documentação da API RESTful para o e-commerce Closet Moda Fitness",
            license: {
                name: "Proprietário",
            },
            contact: {
                name: "Suporte",
                email: "suporte@closetmodafitness.com.br",
            },
        },
        servers: [
            {
                url: "http://localhost:8000",
                description: "Servidor de Desenvolvimento",
            },
            {
                url: "https://api.closetmodafitness.com.br",
                description: "Servidor de Produção",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};
// Especificações do Swagger
const swaggerSpec = swaggerJsdoc(options);
// Função para configurar o Swagger na API
export function setupSwagger(app) {
    // Rota para documentação da API
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "API Closet Moda Fitness - Documentação",
    }));
    // Endpoint para buscar o JSON com as especificações do Swagger
    app.get("/api-docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
}
//# sourceMappingURL=swagger.js.map