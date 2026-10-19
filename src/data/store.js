const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "db.json");

function defaultState() {
  return {
    employees: [],
    projects: [],
    tasks: [],
  };
}

function readStore() {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = defaultState();
    writeStore(initial);
    return initial;
  }

  const raw = fs.readFileSync(DATA_FILE, "utf8");
  return JSON.parse(raw);
}

function writeStore(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

function getCollection(name) {
  const store = readStore();
  return store[name] || [];
}

function saveCollection(name, items) {
  const store = readStore();
  store[name] = items;
  writeStore(store);
}

module.exports = {
  DATA_FILE,
  readStore,
  writeStore,
  getCollection,
  saveCollection,
};
