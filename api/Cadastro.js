const Aluno = require('../DB/Aluno');
const Personal = require('../DB/Personal');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const express = require('express');
const route = express.Router();
mongoose.set('useFindAndModify', false);




route.post('/personal', async (req, res) => {
    const { password, nome, celular, email, nascimento, instagram, facebook, cref, foco, especializacao, faixaEtaria, cidade, estado } = req.body.user;
    await Personal.find({ email: email }).then((response) => {
        if (response.length == 0) {
            let personal = {};
            if (password != "" && nome != "" && celular != "" && email != "" && nascimento != "" && instagram != "" && facebook != "" && cref != "" && foco != "" && especializacao != "" && faixaEtaria != "" && cidade != "" && estado != "") {
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
                    personal.cidade = cidade;
                    personal.estado = estado;
                    let personalModel = new Personal(personal);
                    personalModel.save();
                    res.json(personalModel);
                })
            }
            else {
                return res.json({
                    error: true,
                    mensagem: "Preencha todos os campos!"
                });
            }
        }
        else {
            return res.json({
                error: true,
                mensagem: "Email já cadastrado!"
            });
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
                    return res.json(alunoModel);
                })
            } else {
                return res.json({
                    error: true,
                    mensagem: "Preencha todos os campos!"
                });
            }
        }
        else {
            return res.json({
                error: true,
                mensagem: "Email já cadastrado!"
            });
        }
    });
});

module.exports = route;