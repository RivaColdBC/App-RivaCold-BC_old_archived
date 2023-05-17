const { Connection, Request } = require('tedious')
const localforage = require('localforage')
const os = require('os')

const DB = [
  'RivaColdEq',
  'RivaColdEvap',
  'RivaColdCond',
  'RivaColdCentral',
  'RivaColdEvapGlicol',
  'RivaColdTarifa0000',
  'RivaColdStock',
  'RivaColdCliente',
  'RivaColdGama',
  'RegOferta',
  'CustomEq',
  'GMActualización',
  'RivaColdCompra',
  'RivaColdCamara',
  'RivaColdComparativa'
]

var wait = 0

function SQL_Azure() {
  let connection = new Connection(config)
  connection.on('connect', function (err) {
    err ? console.log(err) : SQL_Azure_Connection(DB[wait], connection)
  })
  connection.connect()
  connection.close()
}

function SQL_Azure_Connection(StringDB, connection) {
  let requestSelect = new Request('SELECT * from dbo.' + StringDB, function (err) {
    console.log(err ? err : 'DB ' + StringDB + ' Got')
  })
  let array = []
  let j = 0
  requestSelect.on('row', function (columns) {
    array[j] = {}
    columns.forEach((column) => {
      array[j][column.metadata.colName] = column.value
    })
    j += 1
  })
  requestSelect.on('requestCompleted', () => {
    wait = wait + 1
    document.getElementById('progressbar').style.width = (wait / DB.length) * 100 + '%'
    document.getElementById('progressbar').innerText =
      'Cargando base de datos: ' + parseInt((wait / DB.length) * 100) + ' %'
    localforage.setItem(StringDB, JSON.stringify(array)).then(() => {
      if (wait < DB.length) {
        SQL_Azure_Connection(DB[wait], connection)
      } else {
        setTimeout(() => (document.getElementById('divprogressbar').style.display = 'none'), 2000)
      }
    })
  })
  connection.execSql(requestSelect)
}
export function SQL(SQL) {
  localStorage.clear()
  localforage.clear()
  wait = 0
  document.getElementById('progressbar').style.width = '0%'
  document.getElementById('progressbar').innerText = 'Cargando base de datos: 0 %'
  document.getElementById('divprogressbar').style.display = ''
  SQL_Azure()
}

const config = {
  authentication: {
    options: { userName: 'gestorbcloud', password: 'BCSYSTEMS&bccloud08918' },
    type: 'default'
  },
  server: 'bccloud.database.windows.net',
  options: { database: 'bccloud', encrypt: true }
}

if (os.userInfo().username != 'YYZ') {
  let connection = new Connection(config)
  connection.on('connect', function (err) {
    err
      ? (document.getElementById('AzureSQL').disabled = true)
      : (requestLogging = new Request(
          "INSERT INTO dbo.Logging (UserName ,Time) VALUES ('" +
            os.userInfo().username +
            "','" +
            new Date().toString().slice(4, 24) +
            "')",
          function (err) {
            console.log(err ? err : 'Logging registed')
          }
        ))
    connection.execSql(requestLogging)
  })
  connection.connect()
  connection.close()
}
