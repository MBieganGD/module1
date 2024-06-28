import mongoose, { Document, Schema } from "mongoose";

interface IData extends Document {
  id: number;
  message: string;
}

const DataSchema: Schema<IData> = new Schema(
  {
    id: { type: Number, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IData>("Data", DataSchema);
