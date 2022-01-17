import 'dotenv/config';
import express from 'express';
import { connect, ConnectOptions } from 'mongoose';
import whitelistRouter from './routes/whitelist';
import statsRouter from './routes/stats';
import auth from './middleware/auth';
import { VERSION } from './version';
import helmet from 'helmet';

const PORT = process.env.PORT || 5050;
const app = express();
app.use(helmet());
app.use(express.json());

connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
    {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions
);

app.use('/whitelist', auth, whitelistRouter);
app.use('/stats', auth, statsRouter);

app.get('/status', (req, res) => {

    return res.status(200).json({
        status: "success",
        data: {
            name: "Raptor API",
            status: "running",
            version: `${VERSION}`
        }
    })
});
app.listen(PORT, () => console.log(`server started at http://localhost:${PORT}`));
