// config/database.js  —  sql.js wrapper (pure JS, no native build needed)
const path = require('path');
const fs   = require('fs');

const DB_DIR  = path.join(__dirname, '../database');
const DB_PATH = path.join(DB_DIR, 'lms.db');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

let _proxy = null;
let _raw   = null;

/* persist in-memory DB to disk */
const save = () => {
  try { fs.writeFileSync(DB_PATH, Buffer.from(_raw.export())); }
  catch (e) { console.error('DB save error:', e.message); }
};

/* flatten (.run(a,b,c) or .run([a,b,c])) → always a plain array */
const toArray = (args) =>
  args.length === 1 && Array.isArray(args[0]) ? args[0] : Array.from(args);

const makeProxy = (raw) => ({
  _raw: raw,

  /* DDL — multi-statement strings like CREATE TABLE */
  exec(sql) {
    raw.run(sql);
    save();
  },

  prepare(sql) {
    const isWrite = /^\s*(INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)/i.test(sql);

    return {
      /* mutating query */
      run(...args) {
        const params = toArray(args);
        // sql.js run() accepts (sql, params) directly — fastest path
        raw.run(sql, params);
        if (isWrite) save();
      },

      /* single-row SELECT → object | undefined */
      get(...args) {
        const params = toArray(args);
        const results = raw.exec(sql, params);   // [{columns, values}] or []
        if (!results.length || !results[0].values.length) return undefined;
        const { columns, values } = results[0];
        const row = {};
        columns.forEach((col, i) => { row[col] = values[0][i]; });
        return row;
      },

      /* multi-row SELECT → array of objects */
      all(...args) {
        const params  = toArray(args);
        const results = raw.exec(sql, params);
        if (!results.length) return [];
        const { columns, values } = results[0];
        return values.map(row => {
          const obj = {};
          columns.forEach((col, i) => { obj[col] = row[i]; });
          return obj;
        });
      },
    };
  },
});

/* ── public API ───────────────────────────────────────────── */
const initDatabase = async () => {
  if (_proxy) return _proxy;
  const initSqlJs = require('sql.js');
  const SQL = await initSqlJs();
  _raw   = fs.existsSync(DB_PATH)
    ? new SQL.Database(fs.readFileSync(DB_PATH))
    : new SQL.Database();
  _proxy = makeProxy(_raw);
  return _proxy;
};

const getDb = () => {
  if (!_proxy) throw new Error('DB not ready — call initDatabase() first.');
  return _proxy;
};

module.exports = { initDatabase, getDb };
