date = new Date();
function PasswordX() {
    Password = document.getElementById("Password").value
    getHash(Password).then(hash => {
        if (hash == "f488be54a899f0d783cd7d162bd6ae635488d8eb01ae50d2d379746cb0077e8d") {
            document.getElementById("SearchCliente").disabled = false
            document.getElementById("SearchDelegado").disabled = false
            document.getElementById("FechaInicio").disabled = false
            document.getElementById("FechaFinal").disabled = false
            document.getElementById("Select_Provincia").disabled = false
            document.getElementById("FechaAltaCliente").disabled = false
            document.getElementById("navbar").style.display = ""
        } else {
            document.getElementById("SearchCliente").disabled = true
            document.getElementById("SearchDelegado").disabled = true
            document.getElementById("FechaInicio").disabled = true
            document.getElementById("FechaFinal").disabled = true
            document.getElementById("Select_Provincia").disabled = true
            document.getElementById("FechaAltaCliente").disabled = true
            document.getElementById("navbar").style.display = "none"
        }
    })
}

function ActualizacionGoManage() {
    const oledb = require("node-adodb");
    oledb.PATH = "./resources/adodb.js";
    const connection = oledb.open(
        "DRIVER={Progress OpenEdge 11.7 Driver};Dsn=tlmplus1V11;uid=userSQL;pwd=userSQL;host=servidor;port=2613;db=tlmplus1",
        process.arch.includes("64"));
    connection.query("SELECT gvpccab_0.cod_cli,gvpccab_0.bru_cpc,gvpccab_0.fec_cpc FROM tlmplus1.PUB.gvpccab gvpccab_0")
        .then(data => {
            Pedido = data
            connection.query("SELECT gvofcab_0.cod_cli,gvofcab_0.tot_ofe,gvofcab_0.fec_ofe FROM tlmplus1.PUB.gvofcab gvofcab_0")
                .then(data => {
                    AñoActual = date.getFullYear(); Oferta = data;
                    for (i = 0, ClienteLength = DBCliente.length; i < ClienteLength; i++) {
                        for (j = AñoActual - 10; j <= AñoActual; j++) {
                            DBCliente[i]["Pedido" + j] = 0
                            DBCliente[i]["Oferta" + j] = 0
                            for (k = 1; k <= 12; k++) {
                                DBCliente[i]["Pedido_" + j + "_" + k] = 0
                                DBCliente[i]["Oferta_" + j + "_" + k] = 0
                            }
                        }
                        PedidoFilter = Pedido.filter(item => item.cod_cli == DBCliente[i]["Cliente"])
                        for (j = 0, PedidoLength = PedidoFilter.length; j < PedidoLength; j++) {
                            Fecha = (PedidoFilter[j]["fec_cpc"]).split("-")[0]
                            DBCliente[i]["Pedido" + Fecha] += PedidoFilter[j]["bru_cpc"]
                            DBCliente[i]["Pedido_" + Fecha + "_" + parseFloat((PedidoFilter[j]["fec_cpc"]).split("-")[1])] += PedidoFilter[j]["bru_cpc"]
                        }
                        OfertaFilter = Oferta.filter(item => item.cod_cli == DBCliente[i]["Cliente"])
                        for (j = 0, OfertaLength = OfertaFilter.length; j < OfertaLength; j++) {
                            Fecha = (OfertaFilter[j]["fec_ofe"]).split("-")[0]
                            DBCliente[i]["Oferta" + Fecha] += OfertaFilter[j]["tot_ofe"]
                            DBCliente[i]["Oferta_" + Fecha + "_" + parseFloat((OfertaFilter[j]["fec_ofe"]).split("-")[1])] += OfertaFilter[j]["tot_ofe"]
                        }
                    }
                    localforage.setItem("RivaColdCliente", JSON.stringify(DBCliente)).then(document.getElementById("Carga").innerHTML = "Carga completa.")
                })
        }).catch(error => {
            document.getElementById("Carga").innerHTML = DBCliente ? "Error de carga de base de datos, procede a utilizar el base de datos local." : document.getElementById("Carga").innerHTML = "Error de carga de base de datos, no disponible para su uso."
        })
}

function SelectProvincia() {
    DBClientefiltro = DBCliente.map((item) => item.Provincia)
    DBClientefiltromap = DBClientefiltro.filter(item => item != null).filter((item, index) => DBClientefiltro.indexOf(item) === index).sort();
    for (i = 0, len = DBClientefiltromap.length; i < len; i++) {
        Opcion = document.createElement("option");
        Opcion.text = DBClientefiltromap[i].toUpperCase();
        Opcion.value = DBClientefiltromap[i];
        document.getElementById("Select_Provincia").add(Opcion);
    }
}

const div_table = document.getElementById("div_table")

function tablekpi() {
    DBClienteFilter = JSON.parse(JSON.stringify(DBCliente))
    FechaInicio = parseFloat(document.getElementById("FechaInicio").value)
    FechaFinal = parseFloat(document.getElementById("FechaFinal").value)
    SearchCliente = document.getElementById("SearchCliente").value
    SearchDelegado = document.getElementById("SearchDelegado").value
    Select_Provincia = document.getElementById("Select_Provincia").value
    FechaAltaCliente = document.getElementById("FechaAltaCliente").value
    Select_Provincia ? DBClienteFilter = DBClienteFilter.filter(item => item.Provincia == Select_Provincia) : null
    SearchDelegado ? DBClienteFilter = DBClienteFilter.filter(item => item.Representante == SearchDelegado) : null
    SearchCliente ? DBClienteFilter = DBClienteFilter.filter(item => item.Cliente == SearchCliente) : null
    FechaAltaCliente ? DBClienteFilter = DBClienteFilter.filter(item => parseFloat(item.Fecha_Alta) == FechaAltaCliente) : null
    Select_Provincia || SearchDelegado || SearchCliente || FechaAltaCliente ? null : DBClienteFilter = []
    div_table.innerHTML = ""
    document.getElementById("headFecha").innerHTML = ""
    document.getElementById("headTotal").innerHTML = ""
    document.getElementById("Carga").style.display = "none"
    if (FechaInicio == FechaFinal) {
        table("_" + FechaInicio + "_", 1, 12)
    } else {
        table("", FechaInicio, FechaFinal)
    }
    function table(Add, FechaInicio, FechaFinal) {
        for (k = 0, len = DBClienteFilter.length; k < len; k++) {
            colspan = 0
            div_table.insertAdjacentHTML('beforeend', `<tr class="Nombre" id="Nombre_${k}"></tr><tr class="valor" id="valor_${k}"></tr>`)
            table_tbody_tr0 = div_table.getElementsByTagName("tr")[2 * k]
            table_tbody_tr1 = div_table.getElementsByTagName("tr")[2 * k + 1]
            for (j = FechaInicio; j <= FechaFinal; j++) {
                DBClienteFilter[k]["Oferta" + Add + j] == 0 ? diff = "-" : diff = (DBClienteFilter[k]["Pedido" + Add + j] / DBClienteFilter[k]["Oferta" + Add + j] * 100).toFixed(1)
                Simbolo = DBClienteFilter[k]["Pedido" + Add + j] - DBClienteFilter[k]["Pedido" + Add + (j - 1)] > 0 ? '<i class="bi bi-arrow-up-right"/>' : '<i class="bi bi-arrow-down-right"/>'
                table_tbody_tr1.insertAdjacentHTML("beforeend", "<th></th>")
                LineEnableArray[1][0] ? table_tbody_tr1.getElementsByTagName("th")[j - FechaInicio].insertAdjacentHTML("beforeend", NumberFormatEUR(DBClienteFilter[k]["Pedido" + Add + j]) + "<br>") : null
                LineEnableArray[1][1] ? table_tbody_tr1.getElementsByTagName("th")[j - FechaInicio].insertAdjacentHTML("beforeend", NumberFormatEUR(DBClienteFilter[k]["Oferta" + Add + j]) + "<br>") : null
                LineEnableArray[1][2] ? table_tbody_tr1.getElementsByTagName("th")[j - FechaInicio].insertAdjacentHTML("beforeend", diff + " %" + "<br>") : null
                LineEnableArray[1][3] ? table_tbody_tr1.getElementsByTagName("th")[j - FechaInicio].insertAdjacentHTML("beforeend", NumberFormatEUR(DBClienteFilter[k]["Pedido" + Add + j] - DBClienteFilter[k]["Pedido" + Add + (j - 1)]) + " " + Simbolo) : null
                DBClienteFilter[k]["Oferta" + Add + j] == 0 ? DBClienteFilter[k]["Pedido" + Add + j] == 0 ? table_tbody_tr1.getElementsByTagName("th")[colspan].style.backgroundColor = "white" : table_tbody_tr1.getElementsByTagName("th")[colspan].style.backgroundColor = "dodgerblue" : table_tbody_tr1.getElementsByTagName("th")[colspan].style.backgroundColor = "red"
                parseFloat(diff) > 30 || parseFloat(DBClienteFilter[k]["Pedido" + Add + j]) > 5000 ? parseFloat(diff) > 0 ? table_tbody_tr1.getElementsByTagName("th")[colspan].style.backgroundColor = "green" : table_tbody_tr1.getElementsByTagName("th")[colspan].style.backgroundColor = "darkorange" : null
                colspan += 1
            }
            table_tbody_tr0.insertAdjacentHTML("beforeend", `<th colspan='${colspan}'>${("00000" + DBClienteFilter[k]["Cliente"]).slice(-5) + " - " + DBClienteFilter[k]["Razón Social"]}<button type='button' onclick=' EliminarCliente(${k})'><i class='bi bi-backspace' style='font-size: 15px'></i></button></th>`)
        }
        if (DBClienteFilter.length) {
            for (j = FechaInicio; j <= FechaFinal; j++) {
                nCol = parseFloat(j - FechaInicio)
                document.getElementById("headFecha").insertAdjacentHTML("beforeend",
                    "<th>Pedido<button type='button' onclick='OrdenarCliente(0," + nCol + ")'><i class='bi bi-bar-chart' style='font-size: 10px'></i></button>" +
                    "<br>Oferta<button type='button' onclick='OrdenarCliente(1," + nCol + ")'><i class='bi bi-bar-chart' style='font-size: 10px'></i></button>" +
                    "<br>" + j + "<button type='button' onclick='OrdenarCliente(3," + nCol + ")'><i class='bi bi-bar-chart' style='font-size: 10px'></i></button></th>")
            }
            TotalPedido = []
            TotalOferta = []
            for (j = FechaInicio - 1; j <= FechaFinal; j++) {
                TotalPedido[j] = 0
                TotalOferta[j] = 0
                for (i = 0, DBClienteFilterlength = DBClienteFilter.length; i < DBClienteFilterlength; i++) {
                    TotalPedido[j] += DBClienteFilter[i]["Pedido" + Add + j]
                    TotalOferta[j] += DBClienteFilter[i]["Oferta" + Add + j]
                }
            }
            for (j = FechaInicio; j <= FechaFinal; j++) {
                Simbolo = TotalPedido[j] - TotalPedido[j - 1] > 0 ? '<i class="bi bi-arrow-up-right"/>' : '<i class="bi bi-arrow-down-right"/>'
                document.getElementById("headTotal").insertAdjacentHTML("beforeend", "<th></th>")
                LineEnableArray[0][0] ? document.getElementById("headTotal").getElementsByTagName("th")[j - FechaInicio].insertAdjacentHTML("beforeend", NumberFormatEUR(TotalPedido[j]) + "<br>") : null
                LineEnableArray[0][1] ? document.getElementById("headTotal").getElementsByTagName("th")[j - FechaInicio].insertAdjacentHTML("beforeend", NumberFormatEUR(TotalOferta[j]) + "<br>") : null
                LineEnableArray[0][2] ? document.getElementById("headTotal").getElementsByTagName("th")[j - FechaInicio].insertAdjacentHTML("beforeend", PerCent(TotalPedido[j], TotalOferta[j], 1) + "<br>") : null
                LineEnableArray[0][3] ? document.getElementById("headTotal").getElementsByTagName("th")[j - FechaInicio].insertAdjacentHTML("beforeend", NumberFormatEUR(TotalPedido[j] - TotalPedido[j - 1]) + " " + Simbolo) : null
                document.getElementById("headTotal").getElementsByTagName("th")[j - FechaInicio].style.backgroundColor = TotalPedido[j] - TotalPedido[j - 1] > 0 ? "green" : "red"
            }
        }
    }
    MostrarCliente()
}
function MostrarCliente() {
    FechaInicio = parseFloat(document.getElementById("FechaInicio").value)
    FechaFinal = parseFloat(document.getElementById("FechaFinal").value)
    if (FechaInicio == FechaFinal) {
        FechaInicio = 1
        FechaFinal = 12
    }
    table = document.getElementById("div_table")
    for (i = 0, len = (table.getElementsByTagName("tr").length / 2); i < len; i++) {
        color = true
        for (j = 0; j <= FechaFinal - FechaInicio; j++) {
            if (table.getElementsByTagName("tr")[2 * i + 1].getElementsByTagName("th")[j].style.backgroundColor != "white") {
                color = false
            }
        }
        if (color) {
            if (table.getElementsByTagName("tr")[2 * i].style.display == "none") {
                table.getElementsByTagName("tr")[2 * i].style.display = ""
                table.getElementsByTagName("tr")[2 * i + 1].style.display = ""
            } else {
                table.getElementsByTagName("tr")[2 * i].style.display = "none"
                table.getElementsByTagName("tr")[2 * i + 1].style.display = "none"
            }
        }

    }
}

const tabletr = document.getElementById("div_table").getElementsByTagName("tr")

function EliminarCliente(k) {
    document.getElementById(`Nombre_${k}`).outerHTML = ""
    document.getElementById(`valor_${k}`).outerHTML = ""
}

function OrdenarCliente(method, year) {
    arrayHTML = []
    for (i = 0, trlength = tabletr.length / 2; i < trlength; i++) {
        arrayHTML[i] = []
        arrayHTML[i]["Nombre"] = tabletr[2 * i].innerHTML
        arrayHTML[i]["valorF"] = tabletr[2 * i + 1].innerHTML
        arrayHTML[i]["Order"] = parseFloat(tabletr[2 * i + 1].getElementsByTagName("th")[year].innerHTML.split("<br>")[method].split(",")[0].replaceAll(".", ""))
        console.log(arrayHTML[i]["Order"])
    }
    arrayHTML.sort(function (a, b) { if (a.Order > b.Order) { return -1 } return +1 })
    for (i = 0, trlength = tabletr.length / 2; i < trlength; i++) {
        tabletr[2 * i].innerHTML = arrayHTML[i]["Nombre"]
        tabletr[2 * i + 1].innerHTML = arrayHTML[i]["valorF"]
    }
}

var LineEnableArray = [[true, true, true, true], [true, true, true, true],];
function LineEnable(id1, id2) {
    LineEnableArray[id1][id2] = !LineEnableArray[id1][id2]
    tablekpi()
}

var DBCliente
const localforage = require("localforage");
localforage.getItem("RivaColdCliente", function (err, value) {
    DBCliente = JSON.parse(value)
    DBCliente = DBCliente.sort(function (a, b) {
        if (parseFloat(a.Cliente) > parseFloat(b.Cliente)) { return 1; } else { return -1 }
    })
    SelectProvincia()
    ActualizacionGoManage()
})

document.getElementById("FechaInicio").value = date.getFullYear() - 5
document.getElementById("FechaFinal").value = date.getFullYear()