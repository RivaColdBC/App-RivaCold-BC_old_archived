1date = new Date();
dateYear = date.getYear()
dateMonth = date.getMonth()
dateDay = date.getDay()
dateDate = date.getDate()

document.getElementById("FechaTabla").value = (1900 + dateYear) + "-" + (1900 + dateYear)

function PasswordX() {
    Password = document.getElementById("Password").value
    getHash(Password).then(hash => {
        if (hash == "e5764823a731b76ad36a86e07086502d5be9472355e316fa2caed3195257b918") {
            document.getElementById("FechaTabla").disabled = false
            tablaEquipo()
        } else {
            document.getElementById("FechaTabla").disabled = true
        }
    })
}


function ActualizacionGoManage() {
    const oledb = require("node-adodb");
    oledb.PATH = "./resources/adodb.js";
    const connection = oledb.open(
        "DRIVER={Progress OpenEdge 11.7 Driver};Dsn=tlmplus1V11;uid=userSQL;pwd=userSQL;host=servidor;port=2613;db=tlmplus1",
        process.arch.includes("64"));
    connection.query("SELECT gcfacab.bru_fcc,gcfacab.cod_delp,gcfacab.tip_fcc,gcfacab.tot_imp,gcfacab.fec_fcc,gcfacab.cod_tfa FROM tlmplus1.PUB.gcfacab").then(data => {
        DBFacturacion = data
        localforage.setItem("RivaColdFacturación", JSON.stringify(data)).then(document.getElementById("Carga").innerHTML = "Carga completa.")
        PasswordX()
    }).catch(error => {
        document.getElementById("Carga").innerHTML = DBFacturacion ?
            "Error de carga de base de datos, procede a utilizar el base de datos local." : "Error de carga de base de datos, no disponible para su uso."
    })
}

function tablaEquipo() {
    document.getElementById("Carga").innerHTML = ""
    document.getElementById("div_table").innerHTML = ""
    Fecha1 = document.getElementById("FechaTabla").value.split("-")[0]
    Fecha2 = document.getElementById("FechaTabla").value.split("-")[1]
    TotalAnterior = 0
    for (year = Fecha1; year <= Fecha2; year++) {
        ImponibleTotal = 0; TotalTotal = 0; ImponibleSujetiPasivoTotal = 0; TotalSujetiPasivoTotal = 0; ImponibleNavionalTotal = 0; TotalNavionalTotal = 0
        for (month = 0; month < 12; month++) {
            ImponibleSujetoPasivo = 0; ImponibleNacional = 0; TotalSujetoPasivo = 0; TotalNacional = 0;
            Total = 0; Imponible = 0; Imponible0 = 0;
            for (i = 0, ilen = DBFacturacion.length; i < ilen; i++) {
                fec_fcc = new Date(DBFacturacion[i]["fec_fcc"])
                if (fec_fcc.getYear() + 1900 == year && fec_fcc.getMonth() == month) {
                    if (DBFacturacion[i]["cod_delp"] == 0) {
                        if (!DBFacturacion[i]["tip_fcc"]) {
                            Imponible += -parseFloat(DBFacturacion[i]["bru_fcc"])
                            Total += -parseFloat(DBFacturacion[i]["tot_imp"])
                            DBFacturacion[i]["bru_fcc"] == DBFacturacion[i]["tot_imp"] ? Imponible0 += -parseFloat(DBFacturacion[i]["bru_fcc"]) : null
                            DBFacturacion[i]["cod_tfa"] == "04" ? ImponibleSujetoPasivo += -parseFloat(DBFacturacion[i]["bru_fcc"]) : ImponibleNacional += -parseFloat(DBFacturacion[i]["bru_fcc"])
                            DBFacturacion[i]["cod_tfa"] == "04" ? TotalSujetoPasivo += -parseFloat(DBFacturacion[i]["tot_imp"]) : TotalNacional += -parseFloat(DBFacturacion[i]["tot_imp"])
                        } else {
                            Imponible += parseFloat(DBFacturacion[i]["bru_fcc"])
                            Total += parseFloat(DBFacturacion[i]["tot_imp"])
                            DBFacturacion[i]["bru_fcc"] == DBFacturacion[i]["tot_imp"] ? Imponible0 += parseFloat(DBFacturacion[i]["bru_fcc"]) : null
                            DBFacturacion[i]["cod_tfa"] == "04" ? ImponibleSujetoPasivo += parseFloat(DBFacturacion[i]["bru_fcc"]) : ImponibleNacional += parseFloat(DBFacturacion[i]["bru_fcc"])
                            DBFacturacion[i]["cod_tfa"] == "04" ? TotalSujetoPasivo += parseFloat(DBFacturacion[i]["tot_imp"]) : TotalNacional += parseFloat(DBFacturacion[i]["tot_imp"])
                        }
                    }
                }
            }
            document.getElementById("div_table").insertAdjacentHTML("beforeend",
                "<tr><td>" + ("0" + (month + 1)).slice(-2) + " " + year + "</td><td>" + NumberFormatEUR(Imponible) + "</td><td>" + NumberFormatEUR(Total) + "</td><td>" + NumberFormatEUR(ImponibleSujetoPasivo) + "</td><td>" + NumberFormatEUR(TotalSujetoPasivo) + "</td><td>" + NumberFormatEUR(ImponibleNacional) + "</td><td>" + NumberFormatEUR(TotalNacional) + "</td></tr>")
            ImponibleTotal += Imponible; TotalTotal += Total;
            ImponibleSujetiPasivoTotal += ImponibleSujetoPasivo; TotalSujetiPasivoTotal += TotalSujetoPasivo;
            ImponibleNavionalTotal += ImponibleNacional; TotalNavionalTotal += TotalNacional
        }
        document.getElementById("div_table").insertAdjacentHTML("beforeend",
            "<tr><td><strong>Total " + year + "</td><td><strong>" + NumberFormatEUR(ImponibleTotal) + "</td><td><strong>" + NumberFormatEUR(TotalTotal) + "</td><td><strong>" + NumberFormatEUR(ImponibleSujetiPasivoTotal) + "</td><td><strong>" + NumberFormatEUR(TotalSujetiPasivoTotal) + "</td><td><strong>" + NumberFormatEUR(ImponibleNavionalTotal) + "</td><td><strong>" + NumberFormatEUR(TotalNavionalTotal) + "</td></tr>")
    }
}
const localforage = require("localforage");
localforage.getItem("RivaColdFacturación", function (err, value) {
    DBFacturacion = JSON.parse(value)
    ActualizacionGoManage()
})


