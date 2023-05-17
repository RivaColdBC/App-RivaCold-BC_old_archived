const { Connection, Request } = require("tedious");
const config = {
    authentication: {
        options: { userName: "gestorbcloud", password: "BCSYSTEMS&bccloud08918" },
        type: "default",
    },
    server: "bccloud.database.windows.net",
    options: { database: "bccloud", encrypt: true },
};
var connection = new Connection(config);
connection.on("connect", function (err) {
    //var requestSelect = new Request("DROP TABLE dbo.Logging; CREATE TABLE dbo.Logging (UserName varchar(255),Time varchar(255))", function (err) { console.log(err) });
    var requestSelect = new Request("SELECT * from dbo.Logging", function (err) {
        console.log(err ? err : "Table got")
    });
    array = []; j = 0;
    requestSelect.on("row", function (columns) {
        array[j] = {};
        columns.forEach((column) => { array[j][column.metadata.colName] = column.value; });
        array[j]["Time"] = new Date(array[j]["Time"]).getFullYear() + "/" + ("0" + (new Date(array[j]["Time"]).getMonth() + 1)).slice(-2) + "/" + ("0" + new Date(array[j]["Time"]).getDate()).slice(-2) + " " + ("0" + new Date(array[j]["Time"]).getHours()).slice(-2) + ":" + ("0" + new Date(array[j]["Time"]).getMinutes()).slice(-2)
        j += 1;
    });
    requestSelect.on("requestCompleted", function () {
        array = array.sort(function (a, b) { if (a.Time > b.Time) { return -1; } else { return +1 } })
        for (i = 0, logginglength = array.length; i < logginglength; i++) {
            document.getElementById("logging").insertAdjacentHTML("beforeend", "<tr><th>" + array[i]["UserName"] + "</th><th>" + array[i]["Time"] + "</th></tr>")
        }
    });
    connection.execSql(requestSelect);
    console.log(err ? err : "DB Connected")
});
connection.connect()


