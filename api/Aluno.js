const express = require('express');
const mongoose = require('mongoose');
const Aluno = require('../DB/Aluno');
const Personal = require('../DB/Personal');
const route = express.Router();
const bcrypt = require('bcrypt');


mongoose.set('useFindAndModify', false);

route.get('/getAll', async (req, res) => {
    let aluno = await Aluno.find().then((response) => {
        if (response.length != 0) {
            res.json(response);
        }
        else {
            res.status(404).send("Não existem alunos cadastrados no banco");
        }
    });
});

route.get('/getFiltrado', async (req, res) => {
    const { nome, personalId } = req.query;
    await Aluno.find({personalId: personalId, $or: [{nome: { "$regex": nome, "$options": "i"}}, {email: { "$regex": nome, "$options": "i"}}]}).then((response) => {
        if (response.length != 0) {
            res.json(response);
        }
        else {
            res.json([]);
        }
    });
});

route.get('/getById', async (req, res) => {
    const { userId } = req.query;
    await Aluno.findById(userId).then((response) => {
        if (response != null) {
            return res.json(response);
        }
        else {
            return res.json([]);
        }
    });
});

route.put('/deletarRelation', async (req, res) => {
    const { alunoId, senha } = req.body.body;
    const aluno = await Aluno.findById(alunoId);

    if(aluno) {
        const match = await bcrypt.compare(senha, aluno.password);

        if(match) {
            aluno.personalId = null;
            await aluno.save();

            return res.json(aluno)
        } else {
            return res.json({
                error: true,
                mensagem: "Senha incorreta!"
            })
        }
    }
});

route.get('/getAlunosByPersonalId', async (req, res) => {
    const { personalId } = req.query;
    await Aluno.find({ personalId: personalId }).then((response) => {
        if (response.length != 0) {
            res.json(response);
        }
        else {
            res.json([]);
        }
    });
});

route.put('/editarPerfil', async (req, res) => {
    const { alunoId, nome, email, celular, nascimento, hrAtiva, saude, prepFisico, objetivo } = req.body.body;
    let aluno = await Aluno.findById(alunoId).then((response) => {
        if (response != null) {
            if (nome != "" && email != "" && celular != "" && nascimento != "" && hrAtiva != "" && saude != "" && prepFisico != "" && objetivo != "") {
                response.nome = nome;
                response.email = email;
                response.nascimento = nascimento;
                response.celular = celular;
                response.hrAtiva = hrAtiva;
                response.saude = saude;
                response.prepFisico = prepFisico;
                response.objetivo = objetivo;
            } else {
                res.status(400).send("Preencha todos os dados");
            }
            response.save();
            return res.json(response);
        }
        else {
            res.status(404).send("Aluno Inexistente");
        }
    });
});

route.put('/atualizarStatus', async (req, res) => {
    const { alunoId, peso, massaMuscular, imc } = req.body.body;

    await Aluno.findByIdAndUpdate(alunoId, {$set: {
        peso, 
        massaMuscular, 
        imc
    }}).then(response => {
        if(response != null) {
            res.json(response)
        } else {
            res.json([]);
        }
    })
})

route.put('/incluirPersonal', async (req, res) => {
    const { alunoId, personalId } = req.body.body;
    let aluno = await Aluno.findOne({token: alunoId}).then((response) => {
        if (response != null) {
            if (personalId != null) {
                Personal.findById(personalId).then((responsePersonal) => {
                    if (responsePersonal != null) {
                        response.personalId = personalId;
                        response.save();
                        res.json(response);
                    } else {
                        res.status(404).send("Personal Inexistente");
                    }
                });
            }
            else {
                res.status(400).send("Selecione um Personal");
            }
        } else {
            return res.json({
                error: true,
                mensagem: "Aluno não encontrado!"
            })
        }
    });
});

route.put('/removerPersonal', async (req, res) => {
    const { alunoId, personalId } = req.body;
    let aluno = await Aluno.findById(alunoId).then((response) => {
        if (response != null) {
            response.personalId = null;
            response.save();
            res.json(response);
        }
        else {
            res.status(404).send("Aluno Inexistente");
        }
    });
});

route.delete('/deletarPerfil', async (req, res) => {
    const { alunoId } = req.body;
    Aluno.findByIdAndRemove(alunoId).exec().then((response) => {
        if (response != null) {
            res.status(200).send("Perfil Excluido com Sucesso");
        }
        else {
            res.status(404).send("Perfil Inexistente");
        }
    });
});

module.exports = route;