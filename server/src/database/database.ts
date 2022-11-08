import { isDevelopment, surrealDbDatabase, surrealDbNamespace, surrealDbPass, surrealDbUri, surrealDbUser } from "shared/server_config";
import Surreal from "surrealdb.js";
import initializeDevDatabase from "../../dev_data/initialize_dev_database";
import { formatDate } from "../util/util";

const db = new Surreal(surrealDbUri)

/// Configure and connect first time to database
async function configure() {
    try {
        await db.signin({
            user: surrealDbUser,
            pass: surrealDbPass,
        })

        await db.use(surrealDbNamespace, surrealDbDatabase)

        console.log(formatDate(new Date()))
        console.log("Database configured using ns", surrealDbNamespace, "db", surrealDbDatabase)

        if(isDevelopment) {
            console.log("Initializing dev environment database data")
            initializeDevDatabase(db)
        }
    } catch (error) {
        console.log(formatDate(new Date()))
        console.log("Database configuration failed")
        console.log("Terminating server")
        console.log("===================================")
        throw error
    }
}

export { db, configure }