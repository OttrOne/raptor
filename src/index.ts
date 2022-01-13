import 'dotenv/config';
import axios from 'axios';
import express from 'express';
import SampleModel from './models/sample';
import { connect, ConnectOptions } from 'mongoose';
import whitelistRouter from './routes/whitelist';
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

app.use('/whitelist', whitelistRouter);
app.listen(PORT, () => console.log(`server started at http://localhost:${PORT}`));

const get_player = async () => {

    const res = await axios.get(`${process.env.PTERODACTYL_ENDPOINT}/api/client/servers/${process.env.SERVER_ID}/players`, {
        headers: {
            'Authorization' : `Bearer ${process.env.TOKEN}`,
            'Content-Type' : 'application/json',
            'Accept' : 'Application/vnd.pterodactyl.v1+json',
        },
    });
    const data = res.data;
    const players = []

    for (const player of data.data.players) {
        players.push(player.name)
    }
    const sample = new SampleModel({
        online: data.data.online_players,
        player: players,
    });
    await sample.save();
    console.log('successfully saved');
};

get_player();

// run every 10 min
setInterval(() => { get_player(); }, 10 * 60 * 1000);
