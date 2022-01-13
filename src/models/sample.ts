import { Document, Schema, model } from 'mongoose';

export interface ISample extends Document {
    online: number,
    time : Date,
    player : [ string,],
}

const schema: Schema = new Schema({
    online: { type: Number, },
    time : { type : Date, default: Date.now },
    player: [{ type: String }]
});

export default model<ISample>('samples', schema);
