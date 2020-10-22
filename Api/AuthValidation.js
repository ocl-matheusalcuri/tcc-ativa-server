const Aluno = require('../DB/Aluno');
const Personal = require('../DB/Personal');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const express = require('express');
const route = express.Router();


route.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const aluno = await Aluno.findOne({email});
    const personal = await Personal.findOne({email});

    if(aluno) {
        const match = await bcrypt.compare(password, aluno.password);
        if(match) {
            aluno.password = undefined;
            return res.json({
                user: {...aluno._doc, temFoto: aluno.temFoto || false},
                type: "aluno",
                token: jwt.sign(aluno.toJSON(), 'segredo')
            })
        } else {
            return res.json({
                error: true,
                mensagem: "Senha incorreta!"
            });
        }
    } else if(personal) {
        const match = await bcrypt.compare(password, personal.password);

        if(match) {
            personal.password = undefined;
            return res.json({
                user: {...personal._doc, temFoto: personal.temFoto},
                type: "personal",
                token: jwt.sign(personal.toJSON(), 'segredo')
            })
        } else {
            return res.json({
                error: true,
                mensagem: "Senha incorreta!"
            });
        }
    }
})

module.exports = route;