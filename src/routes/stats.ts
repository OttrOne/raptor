import { Router } from 'express';
import axios from 'axios';
import SampleModel from './../models/sample';

const router = Router();

const request_players = async () : Promise<[number, Array<string>]> => {

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

    return [data.data.online_players, players]
};

router.get('/players', async (req, res) => {

    const [online, _] = await request_players();

    return res.status(200).json({
        status: "success",
        data: {
            online: online
        }
    })
});

router.post('/players', async (req, res) => {

    const [online, players] = await request_players();

    const sample = new SampleModel({
        online: online,
        player: players,
    });
    await sample.save();
    console.log('Sent data to statistics server.')
    return res.sendStatus(200);
});

export default router;
