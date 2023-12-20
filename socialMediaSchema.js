const mongoose = require("mongoose");

const SocialMediaShcema = new mongoose.Schema(
  {
    siteSettings: {
      type: String,
      default: "siteSettings",
    },
    faceBookUrl: {
      type: String,
      required: true,
    },
    whatsAppUrl: {
      type: String,
      required: true,
    },
    telegramUrl: {
      type: String,
      required: true,
    },
    instagramUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SocialMediaModel = mongoose.model("SocialMedia", SocialMediaShcema);

module.exports = SocialMediaModel;