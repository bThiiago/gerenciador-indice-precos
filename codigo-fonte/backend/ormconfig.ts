require('dotenv').config();
module.exports = [{
        "type":"postgres",
        "port": parseInt(process.env.DATABASE_PORT),
        "host": "localhost", 
        "username": process.env.DATABASE_USERNAME,
        "password": process.env.DATABASE_PASSWORD,
        "database":"database_ipjr",
        "entities": ["./src/modules/**/entities/*.ts"],
        "migrations": ["./src/database/migrations/*.ts"],
        "cli": {
            "migrationsDir": "./src/database/migrations"
        }
    }]
