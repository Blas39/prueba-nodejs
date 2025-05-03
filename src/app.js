import express from "express";
import * as exphbs from "express-handlebars";
import indexRoutes from "./routes/index.routes";
import path from "path";
import "./database";

const app = express();
app.set("views", path.join(__dirname, "views"));

const hbs = exphbs.create({
  layoutsDir: path.join(app.get("views"), "layouts"),
  defaultLayout: "main",
  extname: ".hbs",
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

app.use(express.urlencoded({ extended: true }));

app.use(indexRoutes);
export default app;
