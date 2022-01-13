import { Router } from 'express';
import axios from 'axios';
import auth from '../middleware/auth';

const router = Router();
router.use(auth);

const validate_name = async (name: string) => {

    const res = await axios(`https://api.mojang.com/users/profiles/minecraft/${name}`);
    const data = res.data;

    if (!data) return false;

    return data.name;
};

router.post('/', async (req, res) => {

    if (!req.body.name) return res.sendStatus(400);

    const username = await validate_name(req.body.name);
    if (!username) return res.sendStatus(404);

    await axios.post(`${process.env.PTERODACTYL_ENDPOINT}/api/client/servers/${process.env.SERVER_ID}/command`, {
        "command": `whitelist add ${username}`
    }, {
        headers: {
            'Authorization' : `Bearer ${process.env.TOKEN}`,
            'Content-Type' : 'application/json',
            'Accept' : 'Application/vnd.pterodactyl.v1+json',
        },

    });
    return res.sendStatus(201)
});

export default router;
