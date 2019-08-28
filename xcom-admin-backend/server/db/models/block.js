import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BlockSchema = new Schema({
  title: { type: String, required: true },
  regionIds: { type: [Number], required: false },
  storeId: { type: Number, required: false },
  regionId: { type: Number, required: false },
  productIds: { type: [Number], required: true },
  active: { type: Boolean, required: true }
});

export default mongoose.model("Block", BlockSchema);
