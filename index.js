const express = require('express');
const connectDB = require('./DB/Connection');

const Aluno = require('./DB/Aluno');
const Personal = require('./DB/Personal');

const authMiddleware = require('./authValidation');

const cors = require('cors');
const fs = require('fs')
const app = express();

app.use(express.static('./assets/images'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));



app.use(cors());

connectDB();

app.get('/', (req, res) => {
    res.send("Trabalho de Conclusão de Curso!");
})


app.use('/api', require('./api/Cadastro'));
app.use('/api', require('./api/AuthValidation'));


app.use(authMiddleware);

app.post('/upload', async (req, res) => {
    const { userId, imgsource, type } = req.body.body;
    const user = type === "aluno" ? await Aluno.findById(userId) : await Personal.findById(userId);
    fs.writeFile(`./assets/images/${userId}.png`, imgsource, 'base64', (err) => {
        if (err) throw err
    })
    user.temFoto = true;
    await user.save();

    return res.json({
        user: {name: user.nome, email: user.email, temFoto: user.temFoto},
        //45 ou 58
        url: `http://192.168.0.58:3001/${user?._id}.png?${Date.now()}`
    })
});

app.use('/api/agendaModel', require('./api/Agenda'))
app.use('/api/alunoModel', require('./api/Aluno'))
app.use('/api/personalModel', require('./api/Personal'))
app.use('/api/treinoModel', require('./api/Treino'))
const Port = process.env.Port || 3001;

app.listen(Port,()=>console.log('Server started'));
