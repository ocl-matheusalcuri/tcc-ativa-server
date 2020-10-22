const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const aluno = new mongoose.Schema({
    password: {
        type:String
    },
    nome: {
        type:String
    },
    celular: {
        type:String
    },
    email: {
        type:String
    },
    nascimento: {
        type:String
    },
    hrAtiva: {
        type:String
    },
    saude: {
        type:String
    },
    prepFisico: {
        type:String
    },
    objetivo: {
        type:String
    },
    token: {
        type:String,
        default: mongoose.Types.ObjectId,
        index: { unique: true }
    },
    personalId:{
        type: Schema.Types.ObjectId, 
        ref: 'Personal'
    },
    temFoto: { type: Boolean, default: false },
    peso: {
        type:Number, default: 0
    },
    massaMuscular: {
        type:Number, default: 0
    },  
    imc: {
        type:String, default: ""
    },
});

module.exports = Aluno = mongoose.model('aluno',aluno);