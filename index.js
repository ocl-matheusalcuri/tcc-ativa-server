require("dotenv").config();
const express = require('express');
const connectDB = require('./DB/Connection');

const Aluno = require('./DB/Aluno');
const Personal = require('./DB/Personal');

const authMiddleware = require('./authValidation');
const fileType = require('file-type');

const cors = require('cors');
const morgan = require("morgan");

const app = express();
const AWS = require('aws-sdk');
app.use(express.static('./assets/images'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(cors());

connectDB();
app.use(morgan("dev"));

app.get('/', (req, res) => {
    res.send("Trabalho de Conclusão de Curso!");
});

app.get('/publico', (req, res) => {
  res.send("Trabalho de Conclusão de Curso!");
});


app.use('/api', require('./api/Cadastro'));
app.use('/api', require('./api/AuthValidation'));

app.use(authMiddleware);

app.get('/privado', (req, res) => {
  res.send("Você não deveria poder ver isso!");
});

app.post("/upload", async (req, res) => {

  const {base64, userId, type} = req.body.body;
  const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } = process.env;

  AWS.config.setPromisesDependency(require('bluebird'));
  AWS.config.update({ accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY, region: AWS_REGION });

  const s3 = new AWS.S3();
  const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  const mimeInfo = fileType(Buffer.from(base64, 'base64'));

  const params = {
    Bucket: S3_BUCKET,
    Key: `${userId}_${Date.now()}.${mimeInfo.ext}`, // type is not required
    Body: base64Data,
    ACL: 'public-read',
    ContentEncoding: 'base64', // required
    ContentType: `${mimeInfo.mime}` // required. Notice the back ticks
  }

  let location = '';
  let key = '';
  try {
    const { Location, Key } = await s3.upload(params).promise();
    location = Location;
    key = Key;
  } catch (error) {
    console.log({locationError: error})
  }
  
  const user = type === "aluno" ? await Aluno.findById(userId) : await Personal.findById(userId);
  user.fotoUrl = location;
  user.temFoto = true;
  await user.save();

  return res.json({
      user: {name: user.nome, email: user.email, temFoto: user.temFoto, userFoto: user.fotoUrl},
      url: location
  });
});

app.use('/api/agendaModel', require('./api/Agenda'))
app.use('/api/alunoModel', require('./api/Aluno'))
app.use('/api/personalModel', require('./api/Personal'))
app.use('/api/treinoModel', require('./api/Treino'))
const Port = process.env.PORT || 3001;

app.listen(Port,()=>console.log('Server started'));
