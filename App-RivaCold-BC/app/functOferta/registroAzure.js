
function GuardarRegistro() {
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
        requestDelete = new Request("DELETE FROM dbo.RegOferta WHERE NOferta = @Cabecera", err => err);
        requestDelete.addParameter("Cabecera", TYPES.VarChar, Cabecera[0]);
        requestDelete.on("requestCompleted", function () {
            if (Table.length && Reference.length && Cabecera.length) {
                var i = 0;
                FunctrequestInsert(connection, i, Table, Reference, Cabecera);
            } else {
                document.getElementById("MensajeRegistro").innerHTML = "No hay datos existente a registrar!"
            }
        });
        connection.execSql(requestDelete);
    });
    connection.connect();
    connection.close();
}

function FunctrequestInsert(connection, i, Table, Reference, Cabecera) {
    const { Request, TYPES } = require("tedious");
    requestInsert = new Request(
        "INSERT INTO dbo.RegOferta (NOferta,Cabecera,Oferta) VALUES (@Cabecera,@TextCabecera,@TextOferta)",
        err => err);
    TextCabecera = Cabecera[0]
    for (j = 1, Campolen = Campo.length; j < Campolen; j++) {
        TextCabecera += ";" + Cabecera[j]
    }
    const TextOferta = Table[i][0] + ";" + Table[i][1] + ";" + Table[i][2] + ";" + Table[i][3] + ";" + Table[i][4] + ";" + Table[i][5] + ";" + Reference[i];
    requestInsert.addParameter("Cabecera", TYPES.VarChar, Cabecera[0]);
    requestInsert.addParameter("TextCabecera", TYPES.VarChar, TextCabecera);
    requestInsert.addParameter("TextOferta", TYPES.VarChar, TextOferta);
    requestInsert.on("requestCompleted", function () {
        if (i < Reference.length - 1) {
            i += 1;
            FunctrequestInsert(connection, i, Table, Reference, Cabecera);
        } else {
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
                RegistroOferta();
                document.getElementById("MensajeRegistro").innerHTML = "Oferta registrada!"
            })
            connection.execSql(requestSelect);
        }
    });
    connection.execSql(requestInsert);
}

const table_registro_oferta_tbody = document.getElementById("table_registro_oferta").getElementsByTagName("tbody")[0]
const table_registro_oferta_td = document.getElementById("table_registro_oferta").getElementsByTagName("td")

function RegistroOferta() {
    table_registro_oferta_tbody.innerHTML = "";
    const Count = 5;
    let j = -1;
    if (Registro.length > 1) {
        for (i = 0; i < Registro.length; i++) {
            if (i == 0 || Registro[i - 1]["NOferta"] != Registro[i]["NOferta"]) {
                table_registro_oferta_tbody.insertRow().innerHTML = "<td scope='row'/><td/><td/><td/><td style='text-align:center'/>";
                j += 1;
                table_registro_oferta_td[j * Count + 0].innerText = j + 1;
                table_registro_oferta_td[j * Count + 1].innerText = Registro[i]["Cabecera"].split(";")[0];
                table_registro_oferta_td[j * Count + 2].innerText = Registro[i]["Cabecera"].split(";")[13];
                table_registro_oferta_td[j * Count + 3].innerText = Registro[i]["Cabecera"].split(";")[3];
                table_registro_oferta_td[j * Count + 4].insertAdjacentHTML("beforeend", "<button><i class='bi bi-clipboard-plus'style='color:green;font-size:15px;' onclick='AccederRegistro(" + JSON.stringify(Registro[i]["Cabecera"].split(";")[0]) + ")' data-bs-dismiss='modal'/></button>"
                );
            }
        }
    }
}

function AccederRegistro(NOferta) {
    for (i = 0; i < Registro.length; i++) {
        if (Registro[i]["NOferta"] == NOferta) {
            for (n = 0; n < Campo.length; n++) {
                document.getElementById([Campo[n]]).value =
                    Registro[i]["Cabecera"].split(";")[n];
            }
        }
    }
    var Count = 0;
    Table = [];
    Reference = [];
    for (i = 0; i < Registro.length; i++) {
        if (Registro[i]["NOferta"] == NOferta) {
            Table[Count] = [];
            Table[Count][0] = Registro[i]["Oferta"].split(";")[0] || ""
            Table[Count][1] = parseFloat(Registro[i]["Oferta"].split(";")[1]).toFixed(0) || ""
            Table[Count][2] = parseFloat(Registro[i]["Oferta"].split(";")[2]) || ""
            Table[Count][3] = parseFloat(Registro[i]["Oferta"].split(";")[3]) || ""
            Table[Count][4] = Table[Count][2] * (1 - Table[Count][3] / 100) || ""
            Table[Count][5] = Table[Count][4] * Table[Count][1] || ""
            Reference[Count] = Registro[i]["Oferta"].split(";")[6]
            Count += 1;
        }
    }
    localStorage.setItem("TableOferta", JSON.stringify(Table));
    localStorage.setItem("TextoModelo", JSON.stringify(Reference));
    PushDB(); ModifTable(); GuardarDatos();
}