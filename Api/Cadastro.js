const Aluno = require('../DB/Aluno');
const Personal = require('../DB/Personal');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const express = require('express');
const route = express.Router();
mongoose.set('useFindAndModify', false);




route.post('/personal', async (req, res) => {
    const { password, nome, celular, email, nascimento, instagram, facebook, cref, foco, especializacao, faixaEtaria } = req.body.user;
    await Personal.find({ email: email }).then((response) => {
        if (response.length == 0) {
            let personal = {};
            if (password != "" && nome != "" && celular != "" && email != "" && nascimento != "" && instagram != "" && facebook != "" && cref != "" && foco != "" && especializacao != "" && faixaEtaria != "") {
                bcrypt.hash(password, 10).then(hash => {

                    let encryptedPssword = hash;

                    personal.password = encryptedPssword;
                    personal.nome = nome;
                    personal.celular = celular;
                    personal.email = email;
                    personal.nascimento = nascimento;
                    personal.instagram = instagram;
                    personal.facebook = facebook;
                    personal.cref = cref;
                    personal.foco = foco;
                    personal.especializacao = especializacao;
                    personal.faixaEtaria = faixaEtaria;
                    let personalModel = new Personal(personal);
                    personalModel.save();
                    res.json(personalModel);
                })
            }
            else {
                res.status(404).send("Preencha todos os dados");
            }
        }
        else {
            res.status(404).send("Esse personal já possui um cadastro");
        }
    });
});

route.post('/aluno', async (req, res) => {
    const { password, nome, celular, email, nascimento, hrAtiva, saude, prepFisico, objetivo } = req.body.user;
    await Aluno.find({ email: email }).then((response) => {
        if (response.length == 0) {
            let aluno = {};
            if (password != "" && nome != "" && celular != "" && email != "" && nascimento != "" && hrAtiva != "" && saude != "" && prepFisico != "" && objetivo != "") {

                bcrypt.hash(password, 10).then(hash => {

                    let encryptedPssword = hash;

                    aluno.password = encryptedPssword;
                    aluno.nome = nome;
                    aluno.celular = celular;
                    aluno.email = email;
                    aluno.nascimento = nascimento;
                    aluno.hrAtiva = hrAtiva;
                    aluno.saude = saude;
                    aluno.prepFisico = prepFisico;
                    aluno.objetivo = objetivo;
                    aluno.personalId = null;
                    let alunoModel = new Aluno(aluno);
                    alunoModel.save();
                    res.json(alunoModel);
                })
            } else {
                res.status(400).send("Preencha todos os dados");
            }
        }
        else {
            res.status(404).send("Esse aluno já possui um cadastro");
        }
    });
});

module.exports = route;