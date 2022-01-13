import { Request, Response, NextFunction } from "express"

const ACCESS_TOKEN = process.env.ACCESS_TOKEN || ''

const checkToken = (authHeader: string) : boolean => {

    return authHeader === `Token ${ACCESS_TOKEN}`;
};

const auth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers || !req.headers['authorization']) return res.sendStatus(403)

    if (!checkToken(req.headers['authorization'])) return res.sendStatus(403)

    next();
}

export default auth;
