import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import logger from "morgan";
import MongoStore from "connect-mongo";
import path from "path";
import flash from "connect-flash";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import errorHandler from "errorhandler";

dotenv.config({path: "variable.env"});
import indexRouter from "./routes/index";
import authRouter from "./routes/auth";
import "./handlers/passport";

// Create Express server
const app = express();

app.use(helmet());
// view engine setup
app.set("views", path.join(__dirname, "../views")); // this is the folder where we keep our pug files
app.set("view engine", "pug"); // we use the engine pug, mustache or EJS work great too
app.get("env") === "development" ? app.use(require("express-status-monitor")()) : "";
app.use(logger("dev"));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use(express.static(path.join(__dirname, "../public")));

// Takes the raw requests and turns them into usable properties on req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({mongoUrl: process.env.MONGODB_URI || "mongodb://localhost:27017/your-db-name"
    })
  })
);

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests
app.use(flash());

// pass variables to our templates + all requests
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.locals.flashes = req.flash();
    res.locals.user = req.user || null;
    res.locals.currentPath = req.path;
    next();
});

//  Express Routing URLS
app.use("/", indexRouter);
app.use("/auth", authRouter);

app.get("*", function(req: express.Request, res: express.Response) {
    return res.status(404).redirect("/404");
});

if (app.get("env") === "development") {
    app.use(errorHandler());
    app.locals.pretty = true;
}

export default app;
