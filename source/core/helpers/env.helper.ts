import * as dotenv from "dotenv";

dotenv.config();

// if we would like to override env variables from Windows, we need to call config with property override: true
// dotenv.config({ override: true });

export class Environment {
    public static DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING as string; 
    public static TOKEN_SECRET = process.env.TOKEN_SECRET as string; 
    public static DEFAULT_LOG_FOLDER = process.env.DEFAULT_LOG_FOLDER as string; 
    public static SERVER_PORT = process.env.SERVER_PORT as string; 
}