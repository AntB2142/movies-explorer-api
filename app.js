require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const indexRouter = require('./routes/index');

const { PORT = 3005 } = process.env;
const app = express();

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/bitfilms', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());

app.use(express.json());

app.use(indexRouter);

app.use(limiter);

app.use(helmet());

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(err.statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message, err });

  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`server listen on ${PORT}`);
});
