import mongoose from "mongoose";

const Schema = mongoose.Schema;

const BannerSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  regionId: { type: Number, required: false },
  regionIds: { type: [Number], required: true },
  productIds: { type: [Number], required: true },
  show: { type: Boolean, required: true },
  image: { type: String }
});

export default mongoose.model("Banner", BannerSchema);
