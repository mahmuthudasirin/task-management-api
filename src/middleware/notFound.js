function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: "İstenen kaynak bulunamadı",
    path: req.originalUrl,
  });
}

module.exports = { notFound };
