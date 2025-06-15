const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || token !== `Bearer ${process.env.API_HEADER_TOKEN}`) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid or missing token'
    });
  }

  next();
};

module.exports = authMiddleware;