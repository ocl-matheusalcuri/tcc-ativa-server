const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const treino = new mongoose.Schema({
    alunoId: {
        type: Schema.Types.ObjectId,
        ref: 'Aluno'
    },
    personalId: {
        type: Schema.Types.ObjectId,
        ref: 'Personal'
    },
    nome: {
        type: String
    },
    descricaoTreino: {
        type: [{ nome: { type: String }, repeticao: { type: Number }, serie: { type: Number } }]
    }
});

module.exports = Treino = mongoose.model('treino', treino);