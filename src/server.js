require("dotenv").config();

const fs = require("fs");
const { createApp } = require("./app");
const { DATA_FILE } = require("./data/store");
const { seedIfEmpty } = require("./data/seed");

const PORT = process.env.PORT || 3001;

if (!fs.existsSync(DATA_FILE)) {
  seedIfEmpty();
}

const app = createApp();

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
});