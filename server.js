import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index.js';
// import cors from 'cors';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(cors());

app.use(router);

app.listen(3000, () => {
    console.log('Listen Port 3000');
})