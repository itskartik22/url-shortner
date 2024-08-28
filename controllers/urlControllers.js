const shortid = require("shortid");
const Url = require("../models/urlModel");

exports.generateNewShortUrl = async (req, res, next) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide an original URL",
      });
    }

    const shortId = shortid();
    const existingUrl = await Url.findOne({ shortId });

    if (existingUrl) {
      return res.status(400).json({
        status: "fail",
        message: "Short URL already exists. Please try again.",
      });
    }

    const result = await Url.create({
      shortId: shortId,
      redirectUrl: originalUrl,
    });

    return res.status(201).json({
      status: "success",
      data: {
        shortId: result.shortId,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.redirectToOriginalUrl = async (req, res, next) => {
  try {
    const { shortId } = req.params;
    const result = await Url.findOneAndUpdate(
      {
        shortId,
      },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      }
    );

    if (!result) {
      return res.status(404).json({
        status: "fail",
        message: "Short URL not found",
      });
    }

    return res.redirect(result.redirectUrl);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const { shortId } = req.params;
    const result = await Url.findOne({ shortId });

    if (!result) {
      return res.status(404).json({
        status: "fail",
        message: "Short URL not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        visitCount: result.visitHistory.length,
        visitHistory: result.visitHistory,
      },
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
