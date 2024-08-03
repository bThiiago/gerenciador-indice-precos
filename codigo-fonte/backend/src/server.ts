import "express-async-errors";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { createConnection } from "typeorm";

import "./shared/container";
import { AppError } from "./errors/AppError";
import { ServerError } from "./errors/ServerError";
import { router } from "./routes";
import swaggerFile from "./swagger.json";
import "./modules/container";

const app = express();

// Criação da conexão com o banco de dados
createConnection()
  .then(() => {
    console.log("Database connection established!");

    app.use(cors());

    app.use(morgan("dev"));

    app.use(helmet());

    app.use(express.json());

    app.use("/api", router);

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

    app.use(
      (
        err: Error,
        request: Request,
        response: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next: NextFunction,
      ) => {
        if (err instanceof AppError) {
          return response.status(err.statusCode).json({
            message: err.message,
          });
        }
        if (err instanceof ServerError) {
          return response.status(err.statusCode).json({
            message: err.message,
          });
        }
      },
    );

    // Inicialização do servidor
    const PORT = 3339;

    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error creating database connection:", error);
  });
