date = new Date();
dateYear = date.getYear()
dateMonth = date.getMonth()
dateDay = date.getDay()
dateDate = date.getDate()

document.getElementById("FechaTabla").value = (1899 + dateYear) + "-" + (1900 + dateYear)
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
    connection.query("SELECT gvfacab.bru_fac,gvfacab.cod_delo,gvfacab.tip_fac,gvfacab.tot_imp,gvfacab.fec_fac FROM tlmplus1.PUB.gvfacab").then(data => {
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
    ImponibleAnterior = 0
    TotalAnterior = 0
    for (year = Fecha1; year <= Fecha2; year++) {
        ImponibleTotal = 0
        TotalTotal = 0
        for (month = 0; month < 12; month++) {
            Total = 0; Imponible = 0; Imponible0 = 0; AbonoTotal = 0; AbonoImponible = 0;
            for (i = 0, ilen = DBFacturacion.length; i < ilen; i++) {
                fec_fac = new Date(DBFacturacion[i]["fec_fac"])
                if (fec_fac.getYear() + 1900 == year && fec_fac.getMonth() == month) {
                    if (DBFacturacion[i]["cod_delo"] == 0) {
                        if (DBFacturacion[i]["tip_fac"] == "A") {
                            Imponible += -parseFloat(DBFacturacion[i]["bru_fac"])
                            Total += -parseFloat(DBFacturacion[i]["tot_imp"])
                            DBFacturacion[i]["bru_fac"] == DBFacturacion[i]["tot_imp"] ? Imponible0 += -parseFloat(DBFacturacion[i]["bru_fac"]) : null
                            AbonoTotal += parseFloat(DBFacturacion[i]["tot_imp"])
                            AbonoImponible += parseFloat(DBFacturacion[i]["bru_fac"])
                        } else {
                            Imponible += parseFloat(DBFacturacion[i]["bru_fac"])
                            Total += parseFloat(DBFacturacion[i]["tot_imp"])
                            DBFacturacion[i]["bru_fac"] == DBFacturacion[i]["tot_imp"] ? Imponible0 += parseFloat(DBFacturacion[i]["bru_fac"]) : null
                        }
                    }
                }
            }
            ImponibleInterpol = ""; TotalInterpol = ""
            if (year == dateYear + 1900 && month == dateMonth) {
                monthDate = new Date(year, month + 1, 0).getDate()
                for (i = 1, ilen = monthDate, laboralday = 0, laboraltoday = 0; i < ilen; i++) {
                    if ((monthDate + i) % 7 != 0 && (monthDate + i) % 7 != 6) {
                        laboralday++
                    } if ((dateDay + i) % 7 != 0 && (dateDay + i) % 7 != 6 && dateDate > i) {
                        laboraltoday++
                    }
                }
                ImponibleInterpol = Imponible / (laboraltoday - 1) * laboralday
                TotalInterpol = Total / (laboraltoday - 1) * laboralday
            }
            flecha1 = ((Imponible / ImponibleAnterior - 1) * 100).toFixed(2) > 0 ? "<i class='bi bi-arrow-up-right'></i>" : "<i class='bi bi-arrow-down-right'></i>"
            flecha2 = ((Total / TotalAnterior - 1) * 100).toFixed(2) > 0 ? "<i class='bi bi-arrow-up-right'></i>" : "<i class='bi bi-arrow-down-right'></i>"
            document.getElementById("div_table").insertAdjacentHTML("beforeend",
                "<tr><td>" + ("0" + (month + 1)).slice(-2) + " " + year + "</td><td>" + NumberFormatEUR(Imponible) +
                (ImponibleInterpol ? "<br><strong>(" + NumberFormatEUR(ImponibleInterpol) + ")</strong>" : "") + "</td><td>" +
                ((Imponible / ImponibleAnterior - 1) * 100).toFixed(2) + " % " + flecha1 +
                (ImponibleInterpol ? "<br><strong>(" + ((ImponibleInterpol / ImponibleAnterior - 1) * 100).toFixed(2) + " %)</strong>" : "") + "</td><td>" + NumberFormatEUR(Total) + (TotalInterpol ? "<br><strong>(" + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(TotalInterpol) + ")</strong>" : "") + "</td><td>" +
                ((Total / TotalAnterior - 1) * 100).toFixed(2) + " % " + flecha2 +
                (TotalInterpol ? "<br><strong>(" + ((TotalInterpol / TotalAnterior - 1) * 100).toFixed(2) + " %)</strong>" : "") + "</td><td>" +
                "<div class='dropdown'><button type='button' data-bs-toggle='dropdown' class='btn btn-primary dropdown-toggle' aria-expanded='false'>Detalle<ul class='dropdown-menu'><li><a class='dropdown-item'>Impuesto: 0%" + " Imponible: " + NumberFormatEUR(Imponible0) + " Total: " + NumberFormatEUR(Imponible0) + "</a></li><li><a class='dropdown-item'>Impuesto: 21%" + " Imponible: " + NumberFormatEUR(Imponible - Imponible0) + " Total: " + NumberFormatEUR(Total - Imponible0) + "</a></li><li><a class='dropdown-item'>Abono: Imponible: " + NumberFormatEUR(AbonoImponible) + " Total: " + NumberFormatEUR(AbonoTotal) + "</a></li></ul></button></div></tr>")
            ImponibleAnterior = Imponible; TotalAnterior = Total
            ImponibleTotal += Imponible; TotalTotal += Total
        }
        document.getElementById("div_table").insertAdjacentHTML("beforeend",
            "<tr><td><strong>Total " + year + "</strong></td><td colspan='2'>" +
            NumberFormatEUR(ImponibleTotal) +
            (fec_fac.getYear() + 1900 == year ? "<br><strong>(" + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(ImponibleTotal * 365 / Math.floor((date - new Date(year, 0, 0)) / (1000 * 60 * 60 * 24))) + ")</strong>" : "") +
            "</td><td colspan='2'>" +
            NumberFormatEUR(TotalTotal) +
            (fec_fac.getYear() + 1900 == year ? "<br><strong>(" + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(TotalTotal * 365 / Math.floor((date - new Date(year, 0, 0)) / (1000 * 60 * 60 * 24))) + ")</strong>" : "") +
            "</td><td></td></tr>")
    }
}
const localforage = require("localforage");
localforage.getItem("RivaColdFacturación", function (err, value) {
    DBFacturacion = JSON.parse(value)
    ActualizacionGoManage()
})


