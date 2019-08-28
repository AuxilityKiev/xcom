import fs from "fs";

import Banner from "./../../../db/models/banner";
import { IMAGE_DIR, IMAGE_URL } from "./../../../config/env.config";

async function getBanner(ctx) {
  const { id } = ctx.params;
  const banner = await Banner.findOne({ _id: id });
  if (banner) {
    ctx.response.body = {
      ...banner._doc,
      image: `${IMAGE_URL}/${banner.image}`
    };
    ctx.status = 200;
  } else {
    ctx.status = 404;
  }
}

async function getBanners(ctx) {
  const query = ctx.query.regionId
    ? {
        regionIds: {
          $in: [ctx.query.regionId, -1]
        }
      }
    : {};
  ctx.response.body = (await Banner.find(query)).map(ban => {
    return {
      ...ban._doc,
      image: `${IMAGE_URL}/${ban.image}`
    };
  });
  ctx.status = 200;
}

async function getPublicBanners(ctx) {
  const query = ctx.query.regionId
    ? {
        regionIds: {
          $in: [ctx.query.regionId, -1]
        }
      }
    : {};
  ctx.response.body = (await Banner.find({ show: true, ...query })).map(ban => {
    return {
      ...ban._doc,
      image: `${IMAGE_URL}/${ban.image}`
    };
  });
  ctx.status = 200;
}

async function createBanner(ctx) {
  const banner = new Banner(ctx.request.body);
  await banner.save();
  ctx.body = banner;
  ctx.status = 200;
}

async function uploadImage(ctx) {
  const { id } = ctx.params;
  const image = ctx.request.files.file;
  const [name, ext] = image.name.split('.');
  const imageName = `${name}-${id}.${ext}`;
  const reader = fs.createReadStream(image.path);
  const writer = fs.createWriteStream(`${IMAGE_DIR}/${imageName}`);
  reader.pipe(writer);
  await Banner.updateOne(
    { _id: id },
    {
      image: imageName
    }
  );
  ctx.body = { url: `${IMAGE_URL}/${imageName}` };
  ctx.status = 200;
}

async function updateBanner(ctx) {
  const { id } = ctx.params;
  const {
    title,
    body,
    startDate,
    endDate,
    regionIds,
    productIds,
    show
  } = ctx.request.body;
  await Banner.updateOne(
    { _id: id },
    {
      title,
      body,
      startDate,
      endDate,
      regionIds,
      productIds,
      show
    }
  );
  ctx.body = new Banner({
    _id: id,
    title,
    body,
    startDate,
    endDate,
    regionIds,
    productIds,
    show
  });
  ctx.status = 200;
}

async function deleteBanner(ctx) {
  const { id } = ctx.params;
  await Banner.deleteOne({ _id: id });
  ctx.body = id;
  ctx.status = 200;
}

export default {
  getBanner,
  getBanners,
  getPublicBanners,
  createBanner,
  uploadImage,
  updateBanner,
  deleteBanner
};
