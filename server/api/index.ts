import express from 'express';
import mapbox from './routes/mapbox';
import og from './routes/og';
import ripple from './routes/ripple';
import xumm from './routes/xumm';
import coil from './routes/coil';

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', mapbox);
app.use('/', og);
app.use('/', ripple);
app.use('/', xumm);
app.use('/', coil);

export default app;
