import axios from 'axios';
import mongoose, { Document, Schema, ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connect = async () => {
    await mongoose.connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
      {
          keepAlive: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
      } as ConnectOptions);
    return mongoose;
};

export interface ISample extends Document {
    online: number,
    time : Date,
    player : [ string,],
}

const SampleSchema: Schema = new Schema({
    online: { type: Number, },
    time : { type : Date, default: Date.now },
    player: [{ type: String }]
});

export const SampleModel = mongoose.model<ISample>('samples', SampleSchema);

const get_player = async () => {

    const res = await axios.get(`https://panel.revivenode.com/api/client/servers/${process.env.SERVER_ID}/players`, {
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

connect();

get_player();
