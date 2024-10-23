import express from 'express';
import { engine } from 'express-handlebars';
import passport from 'passport';

import { router as sessionsRouter } from './routes/sessions.Router.js';
import { router as vistasRouter } from './routes/viewsRouter.js';
import { connDB } from './ConnDB.js';
import { config } from './config/config.js';
import { iniciarPassport } from './config/passportConfig.js';

const PORT = config.PORT;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

iniciarPassport();
app.use(passport.initialize());
app.use(express.static("./src/public"));

app.use("/api/sessions", sessionsRouter);
app.use("/", vistasRouter);

const server = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});

connDB(config.MONGO_URL, config.DB_NAME);
