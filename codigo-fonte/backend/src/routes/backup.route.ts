/* eslint-disable consistent-return */
import { exec } from "child_process";
import { Router } from "express";
import fs from "fs";
import path from "path";

const backupRoute = Router();

backupRoute.get("/", (req, res) => {
  const backupFile = path.join(__dirname, "backup.sql");

  // Comando para executar o pg_dump dentro do container Docker
  const command = `docker exec -t database-ipjr pg_dump -U docker --exclude-table="user" database_ipjr > ${backupFile}`;

  // eslint-disable-next-line consistent-return
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro ao gerar o backup: ${error.message}`);
      return res.status(500).send("Erro ao gerar o backup");
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }
    console.log(`Stdout: ${stdout}`);
    // Enviar o arquivo de backup para o frontend
    // eslint-disable-next-line consistent-return
    res.download(
      backupFile,
      `backup_ipjr_${new Date().toISOString().split("T")[0].replace("-", "_")}.sql`,
      (err) => {
        if (err) {
          console.error(`Erro ao enviar o arquivo de backup: ${err.message}`);
          return res.status(500).send("Erro ao enviar o arquivo de backup");
        }

        // Remover o arquivo de backup após o envio
        fs.unlink(backupFile, (err) => {
          if (err) {
            console.error(
              `Erro ao remover o arquivo de backup: ${err.message}`,
            );
          }
        });
      },
    );
  });
});

export { backupRoute };
