import express, { Express, Application, Request, Response } from "express";
import * as http from "http";
import cors from "cors";
import { RouteConfig } from "./framework/route.config";
// import { UserRoutes } from "./modules/user/user.route";
// import { StoreRoutes } from "./modules/store/store.route";
import { AuthenticationRoutes } from "./core/authentication/authentication.route";
import morgan from "morgan";

const routes: Array<RouteConfig> = [];
const app: Express = express();

/** Logging */
app.use(morgan('dev'));
/** Takes care of JSON data */
app.use(express.json());

app.use(cors());

const PORT: number = 7777;

// will be neede when we add environment
// if (process.env.DEBUG) {
//   process.on("unhandledRejection", (reason) => {
//     process.exit(1);
//   });
// } 

// routes.push(new UserRoutes(app));
// routes.push(new StoreRoutes(app));
routes.push(new AuthenticationRoutes(app));

// app.get("/", (req: Request, res: Response) => {
//   res.send("Welcome world")
// });

const server: http.Server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  routes.forEach((route: RouteConfig) => {
    console.log(`Routes configured for ${route.getName()}`)
  })
})