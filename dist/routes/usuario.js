"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuario_model_1 = require("../models/usuario.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const autenticacion_1 = require("../middlewares/autenticacion");
const userRoutes = express_1.Router();
userRoutes.get("/prueba", (req, res) => {
    res.json({
        ok: true,
        mensaje: "Todo funciona bien!"
    });
});
// Login
userRoutes.post('/login', (req, res) => {
    usuario_model_1.Usuario.findOne({
        email: req.body.email
    }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB)
            return res.json({
                ok: false,
                mensaje: "Usuario/contraseña no son correctos"
            });
        if (userDB.compararPassword(req.body.password)) {
            const tokenUser = token_1.default.getJwtToken({
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email,
                avatar: userDB.avatar
            });
            return res.json({
                ok: true,
                token: tokenUser
            });
        }
        else
            return res.json({
                ok: false,
                mensaje: "Usuario/contraseña no son correctos ***"
            });
    });
});
// Crear un usuario
userRoutes.post("/create", (req, res) => {
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    usuario_model_1.Usuario.create(user).then((userDB) => {
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avaar: userDB.avatar
        });
        return res.json({
            ok: true,
            token: tokenUser
        });
    }).catch((error) => {
        res.json({
            ok: false,
            error
        });
    });
});
// Actualizar usuario
userRoutes.post('/update', autenticacion_1.verificaToken, (req, res) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
        avatar: req.body.avatar || req.usuario.avatar
    };
    usuario_model_1.Usuario.findByIdAndUpdate(req.usuario._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB)
            return res.json({
                ok: false,
                mensaje: "No existe un usuario con ese id"
            });
        const tokenUser = token_1.default.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
            avaar: userDB.avatar
        });
        return res.json({
            ok: true,
            token: tokenUser
        });
    });
});
exports.default = userRoutes;
