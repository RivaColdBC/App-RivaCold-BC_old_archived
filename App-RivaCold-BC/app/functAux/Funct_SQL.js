const DB = [
  "RivaColdEq",
  "RivaColdEvap",
  "RivaColdCond",
  "RivaColdCentral",
  "RivaColdEvapGlicol",
  "RivaColdTarifa0000",
  "RivaColdStock",
  "RivaColdCliente",
  "RivaColdGama",
  "RegOferta",
  "CustomEq",
  "GMActualización",
  "RivaColdCompra",
  "RivaColdCamara",
  "RivaColdComparativa",
];
const { Connection, Request } = require("tedious");
const localforage = require("localforage");

async function SQL_Access(SQL) {
  const oledb = require("node-adodb");
  oledb.PATH = "./resources/adodb.js";
  if (SQL === "Servidor") {
    var connection = oledb.open(
      "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=\\\\call-bc\\Carpetas Publicas\\TECNIC\\RivaColdSelect\\RivaColdSelect.accdb;Mode=Read;",
      process.arch.includes("64")
    );
  } else if (SQL === "Local") {
    Directorio = __dirname.replace("app\\main\\app.asar", "");
    var connection = oledb.open(
      "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" +
        Directorio +
        "\\BaseDatos\\RivaColdSelect.accdb;Mode=Read;",
      process.arch.includes("64")
    );
  }
  for (i = 0, DBlen = DB.length; i < DBlen; i++) {
    SQL_Access_Connection(DB[i], connection);
  }
}
async function SQL_Access_Connection(StringDB, connection) {
  try {
    var Query = await connection.query("SELECT * from " + StringDB);
    wait += 1;
  } catch (error) {
    console.log(error);
    SQL_Access_Connection(StringDB, connection);
  }
  let data = await Promise.all(Query);
  localforage.setItem(StringDB, JSON.stringify(data)).then(function () {
    if (wait < DB.length) {
      SQL_Azure_Connection(DB[wait], connection);
    } else {
      fakeProgress.end();
      setTimeout(
        (document.getElementById("divprogressbar").style.display = "none"),
        2000
      );
    }
  });
}
function SQL_Azure() {
  connection = new Connection(config);
  connection.on("connect", function (err) {
    err ? console.log(err) : SQL_Azure_Connection(DB[0], connection, 0);
  });
  connection.connect();
  connection.close();
}
function SQL_Azure_Connection(StringDB, connection, i) {
  requestSelect = new Request("SELECT * from dbo." + StringDB, function (err) {
    console.log(err ? err : "DB " + StringDB + " Got");
  });
  array = [];
  j = 0;
  requestSelect.on("row", function (columns) {
    array[j] = {};
    columns.forEach((column) => {
      array[j][column.metadata.colName] = column.value;
    });
    j += 1;
  });
  requestSelect.on("requestCompleted", function () {
    localforage.setItem(StringDB, JSON.stringify(array)).then(function () {
      wait += 1;
      if (wait <= DB.length) {
        SQL_Azure_Connection(DB[i], connection, wait);
      } else {
        fakeProgress.end();
        setTimeout(() => {
          document.getElementById("divprogressbar").style.display = "none";
        }, 2000);
      }
    });
  });
  connection.execSql(requestSelect);
}
function SQL(SQL) {
  document.getElementById("progressbar").style.width = "0%";
  document.getElementById("progressbar").innerText =
    "Cargando base de datos: 0 %";
  localStorage.clear();
  localforage.clear();
  fakeProgress = new FakeProgress({ timeConstant: 2000, autoStart: true });
  wait = 0;
  ProgressInterval = setInterval(function () {
    document.getElementById("progressbar").style.width =
      fakeProgress.progress * 100 + "%";
    document.getElementById("progressbar").innerText =
      "Cargando base de datos: " + parseInt(fakeProgress.progress * 100) + " %";
  }, 1);
  document.getElementById("divprogressbar").style.display = "";
  SQL === "Servidor" || SQL === "Local"
    ? SQL_Access(SQL)
    : SQL === "AzureSQL"
    ? SQL_Azure()
    : null;
}

//const fs = require("fs");
//if (!fs.existsSync("\\\\call-bc\\Carpetas Publicas\\")) { document.getElementById("Servidor").disabled = true }

const config = {
  authentication: {
    options: { userName: "gestorbcloud", password: "BCSYSTEMS&bccloud08918" },
    type: "default",
  },
  server: "bccloud.database.windows.net",
  options: { database: "bccloud", encrypt: true },
};

const os = require("os");
const FakeProgress = require("fake-progress");
if (os.userInfo().username != "YYZ") {
  connection = new Connection(config);
  connection.on("connect", function (err) {
    err
      ? (document.getElementById("AzureSQL").disabled = true)
      : (requestLogging = new Request(
          "INSERT INTO dbo.Logging (UserName ,Time) VALUES ('" +
            os.userInfo().username +
            "','" +
            new Date().toString().slice(4, 24) +
            "')",
          function (err) {
            console.log(err ? err : "Logging registed");
          }
        ));
    connection.execSql(requestLogging);
  });
  connection.connect();
  connection.close();
}
