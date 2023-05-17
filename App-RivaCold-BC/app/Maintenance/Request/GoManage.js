function GetContacto() {
    const oledb = require("node-adodb");
    oledb.PATH = "./resources/adodb.js";
    const connectionxxx = oledb.open("DRIVER={Progress OpenEdge 11.7 Driver};Dsn=tlmplusV11;uid=userSQL;pwd=userSQL;host=servidor;port=2611;db=tlmplus", process.arch.includes("64"));
    connectionxxx.query("SELECT * FROM tlmplus.PUB.gmclienc")
        .then(data => { console.log(data) }).catch(error => { console.log(error) })
}
