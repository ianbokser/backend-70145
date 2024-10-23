import passport from "passport";
import local from "passport-local";
import { UsuariosManager } from "../dao/UsuariosManager.js";
import { generaHash, validaHash } from "../utils.js";

export const iniciarPassport = () => {
    passport.use("registro", 
        new local.Strategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {
                try {
                    let { nombre } = req.body;
                    if (!nombre) return done(null, false);
                    let existe = await UsuariosManager.getBy({ email: username });
                    if (existe) return done(null, false);
                    password = generaHash(password);
                    let nuevoUsuario = await UsuariosManager.addUser({ nombre, email: username, password });
                    return done(null, nuevoUsuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use("login", 
        new local.Strategy(
            { usernameField: "email" },
            async (username, password, done) => {
                try {
                    let usuario = await UsuariosManager.getBy({ email: username });
                    if (!usuario || !validaHash(password, usuario.password)) return done(null, false);
                    delete usuario.password;
                    return done(null, usuario);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};
