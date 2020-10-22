require("dotenv").config();
const express = require('express');
const connectDB = require('./DB/Connection');

const Aluno = require('./DB/Aluno');
const Personal = require('./DB/Personal');

const authMiddleware = require('./authValidation');
const fileType = require('file-type');

const cors = require('cors');
const fs = require('fs');
const morgan = require("morgan");

const app = express();
const AWS = require('aws-sdk');
app.use(express.static('./assets/images'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

//teste

app.use(cors());

connectDB();
app.use(morgan("dev"));


app.get('/', (req, res) => {
    res.send("Trabalho de Conclusão de Curso!");
})


app.use('/api', require('./api/Cadastro'));
app.use('/api', require('./api/AuthValidation'));

app.use(authMiddleware);

app.post("/upload", async (req, res) => {

  const {base64, userId, type} = req.body.body;

  // Configure AWS with your access and secret key.
  const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } = process.env;

  // Configure AWS to use promise
  AWS.config.setPromisesDependency(require('bluebird'));
  AWS.config.update({ accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY, region: AWS_REGION });

  // Create an s3 instance
  const s3 = new AWS.S3();

  // Ensure that you POST a base64 data to your server.
  // Let's assume the variable "base64" is one.
  const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');

  const mimeInfo = fileType(Buffer.from(base64, 'base64'))

  // With this setup, each time your user uploads an image, will be overwritten.
  // To prevent this, use a different Key each time.
  // This won't be needed if they're uploading their avatar, hence the filename, userAvatar.js.
  const params = {
    Bucket: S3_BUCKET,
    Key: `${userId}_${Date.now()}.${mimeInfo.ext}`, // type is not required
    Body: base64Data,
    ACL: 'public-read',
    ContentEncoding: 'base64', // required
    ContentType: `${mimeInfo.mime}` // required. Notice the back ticks
  }

  // The upload() is used instead of putObject() as we'd need the location url and assign that to our user profile/database
  // see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
  let location = '';
  let key = '';
  try {
    const { Location, Key } = await s3.upload(params).promise();
    location = Location;
    key = Key;
  } catch (error) {
    console.log({error})
  }
  
  // Save the Location (url) to your database and Key if needs be.
  // As good developers, we should return the url and let other function do the saving to database etc

  const user = type === "aluno" ? await Aluno.findById(userId) : await Personal.findById(userId);

  user.fotoUrl = location;
  user.temFoto = true;
  await user.save();

  return res.json({
      user: {name: user.nome, email: user.email, temFoto: user.temFoto, userFoto: user.fotoUrl},
      url: location
  });
  });



// app.post('/upload', async (req, res) => {
//     const { userId, imgsource, type } = req.body.body;
//     const user = type === "aluno" ? await Aluno.findById(userId) : await Personal.findById(userId);
//     fs.writeFile(`./assets/images/${userId}.png`, imgsource, 'base64', (err) => {
//         if (err) throw err
//     })
//     user.temFoto = true;
//     await user.save();

//     return res.json({
//         user: {name: user.nome, email: user.email, temFoto: user.temFoto},
//         //45 ou 58
//         url: `https://gentle-earth-50603.herokuapp.com//${user?._id}.png?${Date.now()}`
//     })
// });

app.use('/api/agendaModel', require('./api/Agenda'))
app.use('/api/alunoModel', require('./api/Aluno'))
app.use('/api/personalModel', require('./api/Personal'))
app.use('/api/treinoModel', require('./api/Treino'))
const Port = process.env.PORT || 3001;

app.listen(Port,()=>console.log('Server started'));
