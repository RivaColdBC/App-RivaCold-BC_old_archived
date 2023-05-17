const localforage = require("localforage");

function DeleteAzure() {
    OF = document.getElementById("OF").value
    const { Connection, Request, TYPES } = require("tedious");
    const config = {
        authentication: {
            options: { userName: "gestorbcloud", password: "BCSYSTEMS&bccloud08918" },
            type: "default",
        },
        server: "bccloud.database.windows.net",
        options: { database: "bccloud", encrypt: true },
    };
    var connection = new Connection(config);
    connection.on("connect", function () {
        console.log(requestDelete = new Request(`DELETE FROM dbo.RegOferta WHERE NOferta = '${OF}'`, err => err))
        requestDelete.on("requestCompleted", function () {
            requestSelect = new Request("SELECT * from dbo.RegOferta", err => err);
            array = []; j = 0;
            requestSelect.on("row", function (columns) {
                array[j] = {};
                columns.forEach((column) => { array[j][column.metadata.colName] = column.value; });
                j += 1;
            });
            requestSelect.on("requestCompleted", function () {
                localforage.setItem("RegOferta", JSON.stringify(array));
                Registro = array
                console.log(array)
            })
            connection.execSql(requestSelect);
        });
        connection.execSql(requestDelete);
    });
    connection.connect();
    connection.close();
}