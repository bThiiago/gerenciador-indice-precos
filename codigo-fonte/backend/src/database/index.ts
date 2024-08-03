import { createConnection } from "typeorm";

createConnection()
  .then(() => {
    console.log("Database connection established!");
  })
  .catch((error) => {
    console.error("Error creating database connection:", error);
  });
