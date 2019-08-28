import Block from "./../../../db/models/block";

async function getBlock(ctx) {
  const { id } = ctx.params;
  const block = await Block.findOne({ _id: id });
  if (block) {
    ctx.response.body = block._doc;
    ctx.status = 200;
  } else {
    ctx.status = 404;
  }
}

async function getBlocks(ctx) {
  const query = ctx.query.regionId
    ? {
        regionIds: {
          $in: [ctx.query.regionId, -1]
        }
      }
    : {};
  ctx.response.body = (await Block.find(query)).map(bl => bl._doc);
  ctx.status = 200;
}

async function createBlock(ctx) {
  const block = new Block(ctx.request.body);
  await block.save();
  ctx.body = block;
  ctx.status = 200;
}

async function updateBlock(ctx) {
  const { id } = ctx.params;
  const { title, regionIds, storeId, productIds, active } = ctx.request.body;
  await Block.updateOne(
    { _id: id },
    {
      title,
      regionIds,
      storeId,
      productIds,
      active
    }
  );
  ctx.body = new Block({
    _id: id,
    title,
    regionIds,
    storeId,
    productIds,
    active
  });
  ctx.status = 200;
}

async function deleteBlock(ctx) {
  const { id } = ctx.params;
  await Block.deleteOne({ _id: id });
  ctx.body = id;
  ctx.status = 200;
}

export default {
  getBlock,
  getBlocks,
  createBlock,
  updateBlock,
  deleteBlock
};
