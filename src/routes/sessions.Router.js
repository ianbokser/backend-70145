import { Router } from 'express';
import passport from 'passport';
import jwt from "jsonwebtoken";
import { config } from '../config/config.js';
export const router = Router();

router.post(
    "/registro",
    passport.authenticate("registro", { session: false, failureRedirect: "/api/sessions/error" }),
    (req, res) => {
        res.status(201).json({ payload: `Registro exitoso`, usuario: req.user });
    }
);

router.post(
    "/login",
    passport.authenticate("login", { session: false, failureRedirect: "/api/sessions/error" }),
    (req, res) => {
        let token = jwt.sign(req.user, config.SECRET, { expiresIn: 3600 });
        res.status(201).json({ token });
    }
);
