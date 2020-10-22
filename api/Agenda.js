const express = require('express');
const mongoose = require('mongoose');
const Treino = require('../DB/Treino');
const Personal = require('../DB/Personal');
const Aluno = require('../DB/Aluno');
const Agenda = require('../DB/Agenda');
const route = express.Router();
mongoose.set('useFindAndModify', false);

route.get('/getAgenda', async (req, res) => {
    const { professorId } = req.query;
     await Agenda.find({ professorId}).sort({data: 1, hora: 1}).then((response) => {
        if (response.length != 0) {
            res.json(response);
        }
        else {
            res.json([]);
        }
    });
});

route.post('/cadastroAgenda', async (req, res) => {
    const { nome, professorId, data, hora } = req.body;
    await Agenda.create({professorId, nome, data, hora}).then(response => {
        if(response != null) {
            res.json(response)
        } else {
            res.json([])
        }
    })
});

route.delete('/deletarAgenda', async (req, res) => {
    const { agendaId } = req.query;
    await Agenda.findByIdAndRemove(agendaId).then((response) => {
        if (response != null) {
            res.json(response);
        }
        else {
            res.json([]);
        }
    });
});

module.exports = route;

