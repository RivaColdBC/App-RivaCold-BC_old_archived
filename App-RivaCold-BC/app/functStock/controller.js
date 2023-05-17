const fs = require("fs");
const localforage = require("localforage");
const { Connection, Request } = require("tedious");
var DBCustom
const List_Catalogo = document.getElementById("List_Catalogo")
const List_Gama = document.getElementById("List_Gama")
const List_Mod = document.getElementById("List_Mod")
const Table_Modelo = document.getElementById("Table_Modelo")
const Table_Recambio = document.getElementById("Table_Recambio")
const Table_Modelo_Head = Table_Modelo.getElementsByTagName("tr")[1].getElementsByTagName("th")
const input_search = document.getElementById("FunctBusqueda")
const Table_Recambio_body = document.getElementById("Table_Recambio_body");


localforage.getItem("RivaColdStock").then(function (value) {
    DBStock = JSON.parse(value)
    localforage.getItem("RivaColdCompra").then(function (value) {
        DBCompra = JSON.parse(value)
        localforage.getItem("RivaColdTarifa0000").then(function (value) {
            DBTarifa = JSON.parse(value).sort(function (a, b) { if (a.Ref > b.Ref) { return 1; } else { return -1; } });
            DBStock == null || DBTarifa == null ? Table_Recambio.getElementsByTagName("tbody")[0].insertAdjacentHTML("beforeend", "<tr><th/><th>Carga de base de dato erronea, vuelva a cargar en el inicio.</th><th/><th/></tr>") : null
            localforage.getItem("GMActualización").then(function (value) {
                DBTime = JSON.parse(value)
                document.getElementById("Fecha_Actualizacion").innerHTML = DBTime[0]["Fecha"]
                SeleccionarGama()
            })
        })
    })
})

fs.existsSync("\\\\call-bc\\Carpetas Publicas\\") ? ActualizacionGoManage() : document.getElementById("Button_Actualizacion").innerHTML = "GM no disponible"

function SeleccionarGama() {
    localforage.getItem("CustomEq").then(function (valueCustom) {
        localforage.getItem(`RivaCold${List_Catalogo.value}`, function (err, valueRV) {
            let DBFilterGama
            if (List_Catalogo.value == "0") {
                DBCustom = JSON.parse(valueCustom)
                DBFilterGama = DBCustom.map((item) => item.Gama);
                List_Gama.style.display = ""
                List_Mod.style.display = ""
                input_search.style.display = "none"
                document.getElementById("buttonImportacion").style.display = ""
            } else if (List_Catalogo.value == "Buscador") {
                List_Gama.style.display = "none"
                List_Mod.style.display = "none"
                input_search.style.display = ""
                document.getElementById("buttonImportacion").style.display = "none"
            } else {
                DBCustom = JSON.parse(valueRV)
                DBFilterGama = DBCustom.filter(item => item.Marca == "RivaCold").map((item) => item.Gama);
                List_Gama.style.display = ""
                List_Mod.style.display = "none"
                input_search.style.display = "none"
                document.getElementById("buttonImportacion").style.display = "none"

            }
            if (List_Catalogo.value != "Buscador") {
                List_Gama.innerHTML = ""
                const DBDuplicate = DBFilterGama.filter((item, index) => DBFilterGama.indexOf(item) === index).filter((item) => item != null).sort();
                for (Gama of DBDuplicate) {
                    Opcion = document.createElement("option");
                    Opcion.text = Gama;
                    Opcion.value = Gama;
                    Opcion.id = Gama;
                    List_Gama.add(Opcion);
                }
            }
            SeleccionarCatalogo()
        })
    })
}
function SeleccionarCatalogo() {
    List_Mod.innerHTML = ""
    if (List_Catalogo.value == "0") {
        DBFilter = DBCustom.filter((item) => item.Gama == List_Gama.value).map((item) => item.Ref1);
        DBDuplicate = DBFilter.filter((item, index) => DBFilter.indexOf(item) === index).sort();
        for (Modelo of DBDuplicate) {
            Opcion = document.createElement("option");
            Opcion.text = Modelo;
            Opcion.value = Modelo;
            List_Mod.add(Opcion);
        }
    }
    SeleccionarModelo()
}
function SeleccionarModelo() {
    Table_Recambio.getElementsByTagName("tbody")[0].innerHTML = ""
    Table_Modelo_Head[0].innerText = Table_Modelo_Head[1].innerText = Table_Modelo_Head[2].innerText = ""
    ImportacionCodigo = ImportacionPrecio = ImportacionDescripcion = ImportacionUnidad = ImportacionEvaporador = ImportacionEvaporadorValv = ImportacionEvaporadorEstatico = ImportacionResistencia = "";
    ImportacionCuadroPotencia = ImportacionCuadroPotenciaYGestion = ImportacionCuadroGestion = false
    if (List_Catalogo.value == "0") {
        const DBFilter = DBCustom.filter((item) => item.Ref1 == List_Mod.value).filter((item) => item.Gama == List_Gama.value)
        Table_Modelo_Head[0].innerText = DBFilter[0]["Ref1"]
        ImportacionCodigo = DBFilter[0]["Ref1"]
        for (DBF of DBFilter) {
            if (DBF["Descripció1"]) {
                Table_Modelo_Head[1].innerText = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(DBF["Precio1"]))
                Table_Modelo_Head[2].innerText = DBF["Descripció1"]
                ImportacionPrecio = parseFloat(DBF["Precio1"])
                ImportacionDescripcion = DBF["Descripció1"]
                break
            }
        }
        const DBFilter1 = DBFilter.sort().sort(function (a) { if (a.Opcional) { return 1; } else { return -1 } }).map((item) => item.Descripció2);
        const DBDuplicate = DBFilter1.filter((item, index) => DBFilter1.indexOf(item) === index);
        for (i in DBDuplicate) {
            DBFilter2 = DBFilter.filter((item) => item.Descripció2 == DBDuplicate[i]).sort();
            Opcional = DBFilter2[0]["Opcional"] ? " (OPCIONAL)" : ""
            Table_Recambio.getElementsByTagName("tbody")[0].insertAdjacentHTML("beforeend", `<tr><th/><th class='TagTipo'>${DBDuplicate[i]}${Opcional}</th><th/><th/></tr>`)
            for (j in DBFilter2) {
                Check = false
                for (k in DBTarifa) {
                    if (DBTarifa[k]["Ref"] == DBFilter2[j]["Ref2"]) {
                        DBStockFilter = DBStock.filter(item => item.Cod == DBTarifa[k]["Ref2"])
                        StockDisp = 0, StockRes = 0
                        for (Stock of DBStockFilter) {
                            StockDisp = StockDisp + parseFloat(Stock["Stock"])
                            StockRes = StockRes + parseFloat(Stock["Reserva"])
                        }
                        Observación = DBTarifa[k]["Observación"] != null ? "<br>" + DBTarifa[k]["Observación"] : ""
                        StockRes < 0 ? StockRes = StockRes + " ?" : null
                        StockDisp < 0 ? StockDisp = StockDisp + " ?" : null
                        Price = DBTarifa[k]["Precio Venta"] ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(DBTarifa[k]["Precio Venta"])) : "-"
                        Table_Recambio_body.insertAdjacentHTML("beforeend", `<tr><th>${DBTarifa[k]["Ref"]}</th><th>${DBTarifa[k]["Descripción"]}${Observación}</th><th><div class='dropdown'><button id='buttondropdown_${i}_${j}' type='button' data-bs-toggle='dropdown' aria-expanded='false'>${StockDisp} & ${StockRes}</button><ul class='dropdown-menu' id='dropdown_${i}_${j}'/></div></th><th>${Price}</th></tr>`)
                        Check = true
                        HeadStock = StockDisp > 0 ? 1 : null
                        DBCompraFilter = DBCompra.filter(item => parseFloat(item.Cod) === parseFloat(DBTarifa[k]["Ref2"]))
                        ButtonStock("buttondropdown_" + i + "_" + j, "dropdown_" + i + "_" + j)
                        DBDuplicate[i] == "UNIDAD CONDENSADORA" ? ImportacionUnidad += DBFilter2[j]["Ref2"] + "_A_" : null
                        DBDuplicate[i] == "EVAPORADOR" ? ImportacionEvaporador += DBFilter2[j]["Ref2"] + "_A_" : null
                        DBDuplicate[i] == "EVAPORADOR CON VÁLVULA EN DOTACIÓN" ? ImportacionEvaporadorValv += DBFilter2[j]["Ref2"] + "_A_" : null
                        DBDuplicate[i] == "EVAPORADOR ESTÁTICO" ? ImportacionEvaporadorEstatico += DBFilter2[j]["Ref2"] + "_A_" : null
                        DBDuplicate[i].startsWith("RESISTENCIA ") ? ImportacionResistencia += DBDuplicate[i] + " " + DBFilter2[j]["Ref2"] + "_A_" : null


                        break
                    }
                }
                !Check ? Table_Recambio_body.insertAdjacentHTML("beforeend", "<tr><th>" + DBFilter2[j]["Ref2"] + "</th><th>Código no disponible en el GM.</th><th/><th/></tr>") : null
                DBDuplicate[i].startsWith("CUADRO DE POTENCIA UNIDAD") ? ImportacionCuadroPotencia = true : null
                DBDuplicate[i].startsWith("CUADRO DE POTENCIA Y GESTIÓN EVAPORADOR") ? ImportacionCuadroPotenciaYGestion = true : null
                DBDuplicate[i].startsWith("CUADRO DE GESTIÓN EVAPORADOR") ? ImportacionCuadroGestion = true : null
            }
        }
    }
    else if (List_Catalogo.value == "Buscador") {
        MostrarStock = false
        document.getElementById("Table_Modelo_body").getElementsByTagName("th")[1].innerHTML = "<button type='button' class='btn btn-danger' onclick='MostrarXStock()'>Stock</button>"
        Busqueda()
    } else {
        DBFilter = DBCustom.filter(item => item.Gama == List_Gama.value)
        for (i in DBTarifa) {
            for (j in DBFilter) {
                if (DBTarifa[i]["Ref"]) {
                    if (DBTarifa[i]["Ref"].startsWith(DBFilter[j]["Ref"].split(/([0-9]+)/)[0]) && DBTarifa[i]["Gama"].startsWith("RIVACOLD")) {
                        DBStockFilter = DBStock.filter(item => item.Cod == DBTarifa[i]["Ref2"])
                        StockDisp = 0, StockRes = 0;
                        for (Stock of DBStockFilter) {
                            StockDisp = StockDisp + parseFloat(Stock["Stock"])
                            StockRes = StockRes + parseFloat(Stock["Reserva"])
                        } if (DBStockFilter.length > 0) {
                            StockRes < 0 ? StockRes = StockRes + " ?" : null
                            StockDisp < 0 ? StockDisp = StockDisp + " ?" : null
                            Observación = DBTarifa[i]["Observación"] != null ? "<br>" + DBTarifa[i]["Observación"] : ""
                            Price = DBTarifa[i]["Precio Venta"] ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(DBTarifa[i]["Precio Venta"])) : "-"
                            Table_Recambio_body.insertAdjacentHTML("beforeend", "<tr><th>" + DBTarifa[i]["Ref"] + "</th><th>" + DBTarifa[i]["Descripción"] + Observación + "</th><th>" + "<div class='dropdown'><button id='buttondropdown_" + i + "' type='button' data-bs-toggle='dropdown' aria-expanded='false'>" + StockDisp + " & " + StockRes + "</button><ul class='dropdown-menu' id='dropdown_" + i + "'/></div>" + "</th><th>" + Price + "</th></tr>")
                            DBCompraFilter = DBCompra.filter(item => parseFloat(item.Cod) === parseFloat(DBTarifa[i]["Ref2"]))
                            ButtonStock("buttondropdown_" + i, "dropdown_" + i)
                            break
                        }
                    }
                }
            }
        }
    }
}

function ActualizacionGoManage() {
    const oledb = require("node-adodb");
    oledb.PATH = "./resources/adodb.js";
    document.getElementById("Button_Actualizacion").innerHTML = "Cargando Datos"
    connection = oledb.open(
        "DRIVER={Progress OpenEdge 11.7 Driver};Dsn=tlmplusV11;uid=userSQL;pwd=userSQL;host=servidor;port=2611;db=tlmplus",
        process.arch.includes("64"));
    connection
        .query("SELECT galardel_0.cod_art,galardel_0.sre_art-galardel_0.crs_art,galardel_0.spr_art+galardel_0.crs_art-galardel_0.sps_art-galardel_0.srr_art FROM TLMPLUS.PUB.galardel galardel_0 WHERE galardel_0.sre_art+galardel_0.srr_art+galardel_0.spr_art+galardel_0.sps_art+galardel_0.srr_art+galardel_0.crs_art > 0")
        .then(data1 => {
            localforage.setItem("RivaColdStock", JSON.stringify(data1).replaceAll("cod_art", "Cod").replaceAll("sre_art-crs_art", "Stock").replaceAll("spr_art+crs_art-sps_art-srr_art", "Reserva"))
            connection = oledb.open("DRIVER={Progress OpenEdge 11.7 Driver};Dsn=tlmplus1V11;uid=userSQL;pwd=userSQL;host=servidor;port=2613;db=tlmplus1", process.arch.includes("64"));
            connection.query("SELECT gcpplin_0.num_cpp, gcpplin_0.cod_art, gcpplin_0.fee_lpp, gcpplin_0.cpe_lpp, gcpplin_0.cse_lpp FROM TLMPLUS1.PUB.gcpplin gcpplin_0 WHERE gcpplin_0.cer_lpp=0")
                .then(data2 => {
                    localforage.setItem("RivaColdCompra", JSON.stringify(data2).replaceAll("cod_art", "Cod").replaceAll("fee_lpp", "Entrega").replaceAll("cpe_lpp", "Pedido").replaceAll("cse_lpp", "Servido").replaceAll("num_cpp", "NumPedido"))
                    data1 && data2 ? uploadStockAzure(data1, data2) : null
                })
        })
}

function uploadStockAzure(data, data2) {
    const config = {
        authentication: {
            options: { userName: "gestorbcloud", password: "BCSYSTEMS&bccloud08918" },
            type: "default",
        },
        server: "bccloud.database.windows.net",
        options: { database: "bccloud", encrypt: true },
    };
    const connection = new Connection(config);
    connection.on("connect", function () {
        const requestDelete = new Request("DROP TABLE dbo.RivaColdStock;CREATE TABLE dbo.RivaColdStock (Cod varchar(255),Stock varchar(255),Reserva varchar(255));DROP TABLE dbo.RivaColdCompra;CREATE TABLE dbo.RivaColdCompra (NumPedido varchar(255), Cod varchar(255),Entrega varchar(255), Pedido varchar(255), Servido varchar(255))", function (error) {
            error ? console.log(error) : null
        });
        requestDelete.on("requestCompleted", function () {
            let j = 0;
            SQLrequestInsert(j, data, data2, connection)
        })
        connection.execSql(requestDelete);
    })
    connection.connect();
    connection.close();
}
function SQLrequestInsertTime(connection) {
    const os = require("os")
    requestInsertTime = new Request("UPDATE dbo.GMActualización SET Fecha='" + os.userInfo().username.toUpperCase().slice(0, 3) + " " + new Date().toString().slice(4, 24) + "' WHERE DB='RivaColdStock'", function (error) {
        error ? console.log(error) : null
    })
    connection.execSql(requestInsertTime);
    localforage.getItem("GMActualización").then(function (value) {
        GMActualización = JSON.parse(value)
        GMActualización[0]["Fecha"] = os.userInfo().username.toUpperCase().slice(0, 3) + " " + new Date().toString().slice(4, 24)
        localforage.setItem("GMActualización", JSON.stringify(GMActualización))
    })
}
function SQLrequestInsert(j, data, data2, connection) {
    StringData = ""
    data.length < 999 + j * 1000 ? len = data.length : len = 999 + j * 1000
    Slice = data.slice(0 + j * 1000, len)
    for (item of Slice) {
        StringData = StringData + ",('" + item["cod_art"] + "'," + item["sre_art-crs_art"] + "," + item["spr_art+crs_art-sps_art-srr_art"] + ")"
    }
    requestInsert = new Request("INSERT INTO dbo.RivaColdStock VALUES " + StringData.replace(",", ""), function (error) {
        error ? console.log(error) : null
    })
    requestInsert.on("requestCompleted", function () {
        if (j < Math.round(data.length / 1000)) {
            j++
            SQLrequestInsert(j, data, data2, connection)
        } else {
            let j = 0;
            SQLrequestInsert2(j, data2, connection)
        }
    });
    connection.execSql(requestInsert)
}

function SQLrequestInsert2(j, data, connection) {
    StringData = ""
    data.length < 999 + j * 1000 ? len = data.length : len = 999 + j * 1000
    Slice = data.slice(0 + j * 1000, len)
    for (item of Slice) {
        StringData = StringData + ",('" + item["num_cpp"] + "','" + item["cod_art"] + "','" + item["fee_lpp"].slice(0, 10) + "'," + item["cpe_lpp"] + "," + item["cse_lpp"] + ")"
    }
    requestInsert1 = new Request("INSERT INTO dbo.RivaColdCompra VALUES " + StringData.replace(",", ""), function (error) {
        error ? console.log(error) : null
    })
    requestInsert1.on("requestCompleted", function () {
        if (j < Math.round(data.length / 1000) - 1) {
            j++
            SQLrequestInsert2(j, data, connection)
        } else {
            SQLrequestInsertTime(connection)
            document.getElementById("Button_Actualizacion").innerHTML = "<button type='button' class='btn btn-primary'onclick='Reload()'>Refrescar</button>"
        }
    });
    connection.execSql(requestInsert1);
}
function Reload() { location.reload() }

var MostrarStock = false

function MostrarXStock() {
    MostrarStock = MostrarStock ? false : true
    document.getElementById("Table_Modelo_body").getElementsByTagName("th")[1].getElementsByTagName("button")[0].className = MostrarStock ? "btn btn-primary" : "btn btn-danger"
    Busqueda()
}


function Busqueda() {
    sp = input_search.value.toUpperCase();
    Table_Recambio_body.innerHTML = "";
    if (sp) {
        DBTarifaX = DBTarifa.filter(item => {
            for (text of sp.split(" ")) {
                if ((item.Ref2 + item.Ref + item.Descripción + item.Observación).toUpperCase().indexOf(text) == -1) {
                    return false
                }
            } return true
        })
        for (j in DBTarifaX) {
            StockDisp = 0
            StockRes = 0
            DBStockFilter = DBStock.filter(item => item.Cod == DBTarifaX[j]["Ref2"])
            for (Stock of DBStockFilter) {
                StockDisp = StockDisp + parseFloat(Stock["Stock"])
                StockRes = StockRes + parseFloat(Stock["Reserva"])
            }
            if (!MostrarStock || DBStockFilter.length > 0) {
                Observación = DBTarifaX[j]["Observación"] != null ? "<br>" + DBTarifaX[j]["Observación"] : ""
                StockRes < 0 ? StockRes = StockRes + " ?" : null
                StockDisp < 0 ? StockDisp = StockDisp + " ?" : null
                Price = DBTarifaX[j]["Precio Venta"] ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(DBTarifaX[j]["Precio Venta"])) : "-"
                Table_Recambio_body.insertAdjacentHTML("beforeend", "<tr><th>" + DBTarifaX[j]["Ref"] + "</th><th>" + DBTarifaX[j]["Descripción"] + Observación + "</th><th>" + "<div class='dropdown'><button id='buttondropdown_" + j + "' type='button' data-bs-toggle='dropdown' aria-expanded='false'>" + StockDisp + " & " + StockRes + "</button><ul class='dropdown-menu' id='dropdown_" + j + "'></ul></div>" + "</th><th>" + Price + "</th></tr>")
                DBCompraFilter = DBCompra.filter(item => parseFloat(item.Cod) === parseFloat(DBTarifaX[j]["Ref2"]))
                ButtonStock("buttondropdown_" + j, "dropdown_" + j)
            }
        }
    }
}

function ButtonStock(button_id, dropdown_id) {
    DBCompraFilter.length == 0 ? document.getElementById(button_id).outerHTML = `<button id='${button_id}' type='button'>${StockDisp} & ${StockRes}</button>` : null
    document.getElementById(button_id).className = DBCompraFilter.length > 0 ? StockDisp > 0 ? "btn btn-primary dropdown-toggle" : StockRes > 0 ? "btn btn-warning dropdown-toggle" : "btn btn-danger dropdown-toggle" : StockDisp > 0 ? "btn btn-primary" : StockRes > 0 ? "btn btn-warning" : "btn btn-danger"
    lenk = DBCompraFilter.length
    for (k in DBCompraFilter) {
        klenk = parseFloat(lenk) - parseFloat(k) - 1;
        (new Date() - new Date(DBCompraFilter[klenk]["Entrega"])) > 2000000000 ? FechaEntrega = "No disponible" : FechaEntrega = new Date(DBCompraFilter[klenk]["Entrega"]).toLocaleDateString('en-GB')
        Pedido = parseFloat(DBCompraFilter[klenk]["Pedido"])
        Servido = parseFloat(DBCompraFilter[klenk]["Servido"])
        NumPedido = parseFloat(DBCompraFilter[klenk]["NumPedido"])
        Pendiente = Pedido - Servido
        Disponible = StockRes >= Pendiente ? Pendiente : StockRes > 0 ? StockRes : 0
        document.getElementById(dropdown_id).insertAdjacentHTML("beforeend", `<li><a class='dropdown-item'>Núm.Pedido: ${NumPedido}; Plazo de salida fábrica: ${FechaEntrega};  Disponible: ${Disponible}; Pdte.Recibir: ${Pendiente}; Total: ${Pedido}</a></li>`)
        document.getElementById(dropdown_id).getElementsByTagName("li")[k].style.backgroundColor = StockRes >= Pendiente ? "greenyellow" : StockRes > 0 ? "orange" : "red"
        StockRes = StockRes - Pendiente
    }
}

const TextoParametro = [
    "UNIDAD CONDENSADORA", "EVAPORADOR", "EVAPORADOR CON VÁLVULA INCORPORADA", "VÁLVULAS EXPANSIÓN Y SOLENOIDE EN DOTACIÓN", "CUADRO DE GESTIÓN EVAPORADOR", "CUADRO DE POTENCIA Y GESTIÓN EVAPORADOR", "EVAPORADOR ESTÁTICO", "BANDEJA DE DESAGÜE",
]
function ImportHTML() {
    HTML = ImportacionCodigo + "," + ImportacionDescripcion + "," + ImportacionPrecio + ";"
    for (i = 0; i < ImportacionUnidad.split("_A_").length - 1; i++) {
        HTML += "&#10;" + "," + TextoParametro[0] + " " + ImportacionUnidad.split("_A_")[i] + ",;"
    } for (i = 0; i < ImportacionEvaporador.split("_A_").length - 1; i++) {
        HTML += "&#10;" + "," + TextoParametro[1] + " " + ImportacionEvaporador.split("_A_")[i] + ",;"
    } for (i = 0; i < ImportacionEvaporadorValv.split("_A_").length - 1; i++) {
        HTML += "&#10;" + "," + TextoParametro[2] + " " + ImportacionEvaporadorValv.split("_A_")[i] + ",;"
    } for (i = 0; i < ImportacionEvaporadorEstatico.split("_A_").length - 1; i++) {
        HTML += "&#10;" + "," + TextoParametro[6] + " " + ImportacionEvaporadorEstatico.split("_A_")[i] + ",;"
        HTML += "&#10;" + "," + TextoParametro[7]
        HTML += "&#10;" + "," + ImportacionResistencia
    }
    HTML += "&#10;" + "," + TextoParametro[3] + ",;"
    ImportacionCuadroPotencia ? HTML += "&#10;" + "," + TextoParametro[4] + ",;" : null
    HTML += "&#10;" + "," + TextoParametro[5] + ",;"
    document.getElementById("textareaImportacion").innerHTML = HTML
    CopyHTML()
    HTML = ImportacionCodigo + "&#10;" + ImportacionPrecio + "&#10;" + ImportacionDescripcion
    for (i = 0; i < ImportacionUnidad.split("_A_").length - 1; i++) {
        HTML += "&#10;" + TextoParametro[0] + " " + ImportacionUnidad.split("_A_")[i]
    } for (i = 0; i < ImportacionEvaporador.split("_A_").length - 1; i++) {
        HTML += "&#10;" + TextoParametro[1] + " " + ImportacionEvaporador.split("_A_")[i]
    } for (i = 0; i < ImportacionEvaporadorValv.split("_A_").length - 1; i++) {
        HTML += "&#10;" + TextoParametro[2] + " " + ImportacionEvaporadorValv.split("_A_")[i]
    } for (i = 0; i < ImportacionEvaporadorEstatico.split("_A_").length - 1; i++) {
        HTML += "&#10;" + TextoParametro[6] + " " + ImportacionEvaporadorEstatico.split("_A_")[i]
        HTML += "&#10;" + TextoParametro[7]
        HTML += "&#10;" + ImportacionResistencia.split("_A_")[i]
    }
    HTML += "&#10;" + TextoParametro[3]
    ImportacionCuadroGestion && !ImportacionCuadroPotencia ? HTML += "&#10;" + TextoParametro[4] : null
    ImportacionCuadroPotenciaYGestion || (ImportacionCuadroPotencia & ImportacionCuadroGestion) ? HTML += "&#10;" + TextoParametro[5] : null
    document.getElementById("textareaImportacion").innerHTML = HTML
}
function CopyHTML() {
    navigator.clipboard.writeText(document.getElementById("textareaImportacion").innerText);
}