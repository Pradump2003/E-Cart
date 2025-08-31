const expressAsyncHandler = require("express-async-handler");
const v2 = require("../config/cloudinary.config");

const uploadImageOnCloudinary = expressAsyncHandler(async (file) => {
  let uploaded = await v2.uploader.upload(file, {
    resource_type: "auto",
    folder: "BitBasket",
  });
  return uploaded;
});

module.exports = { uploadImageOnCloudinary };
