import * as http from "http";
import cors from "cors";
import morgan from "morgan";
import express, { Express } from "express";
import { RouteConfig } from "./framework/routes.config";
import { StoreRoutes } from "./modules/store/store.routes";
import { AuthenticationRoutes } from "./core/authentication/authentication.routes";
import { UserRoutes } from "./modules/user/user.route";

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
routes.push(new StoreRoutes(app));
routes.push(new AuthenticationRoutes(app));
routes.push(new UserRoutes(app));

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