import express from 'express';
import { engine } from 'express-handlebars';
import passport from 'passport';

import { router as sessionsRouter } from './routes/sessions.Router.js';
import { router as vistasRouter } from './routes/viewsRouter.js';
import { connDB } from './ConnDB.js';
import { config } from './config/config.js';
import { iniciarPassport } from './config/passportConfig.js';
import { enviar } from './mails/mails.js';
import { uploader } from './utils.js';


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

app.post("/mails", uploader.array("adjuntos"),async(req, res)=>{

    let {subject, to, message}=req.body
    if(!subject || !to || !message){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Complete los datos`})
    }

    let adjuntos=[]
    if(req.files){
        req.files.forEach(i=>{
            adjuntos.push({
                path: i.path,
                filename: i.filename
            })
        })
    }

    try {
        let resultado=await enviar(subject, to, message, adjuntos)
        if(resultado.rejected.length){
            res.setHeader('Content-Type','application/json');
            return res.status(400).json({error:`Alguno de los destinatarios no pudo procesarse:`, detalle: resultado.rejected})
        }

        if(req.files){
            req.files.forEach(i=>{
                fs.unlinkSync(i.path)
            })
        }
        
        res.setHeader('Content-Type','application/json');
        return res.status(200).json({payload:"mail enviado"});
    } catch (error) {
        res.setHeader('Content-Type','application/json');
        return res.status(500).json({error:`Error al enviar mail... :(`})
    }
})

connDB(config.MONGO_URL, config.DB_NAME);
