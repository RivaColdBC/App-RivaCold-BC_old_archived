date = new Date();
dateYear = date.getYear()
dateMonth = date.getMonth()
dateDay = date.getDay()
dateDate = date.getDate()
document.getElementById("FechaTabla").value = (1900 + dateYear) + "-" + (1900 + dateYear)

function PasswordX() {
    Password = document.getElementById("Password").value
    getHash(Password).then(hash => {
        if (hash == "bf7f3123e5ce0d91932441d2fc9c14cafaa43f5f4f6c90b52041c1b65259cfda") {
            document.getElementById("FechaTabla").disabled = false
            document.getElementById("CodProveedor").disabled = false
            tablaEquipo()
        } else {
            document.getElementById("FechaTabla").disabled = true
            document.getElementById("CodProveedor").disabled = true
        }
    })
}

function ActualizacionGoManage() {
    const oledb = require("node-adodb");
    oledb.PATH = "./resources/adodb.js";
    const connection = oledb.open(
        "DRIVER={Progress OpenEdge 11.7 Driver};Dsn=tlmplus1V11;uid=userSQL;pwd=userSQL;host=servidor;port=2613;db=tlmplus1",
        process.arch.includes("64"));
    connection.query("SELECT gcfacab.num_fcc,gcfacab.ref_fcc,gcfacab.fec_fcc,gcfacab.cod_pro,gcfacab.tot_imp FROM tlmplus1.PUB.gcfacab").then(data => {
        RivaColdFactura_F = data.sort(function (a, b) { if (a.num_fcc > b.num_fcc) { return +1; } else { return -1; } });
        localforage.setItem("RivaColdFactura_F", JSON.stringify(RivaColdFactura_F))
        connection.query("SELECT gcpalin.cod_art,gcpalin.can_all,gcpalin.num_fcc,gcpalin.ref_all,gcpalin.dep_all,gcpalin.imp_bruto FROM tlmplus1.PUB.gcpalin").then(data => {
            RivaColdFactura_AC = data.filter(item => item.cod_art != "").filter(item => item.can_all > 0).sort(function (a, b) { if (a.num_fcc > b.num_fcc) { return +1; } else { return -1; } })
            localforage.setItem("RivaColdFactura_AC", JSON.stringify(RivaColdFactura_AC))
            connection.query("SELECT gvallin.cod_art,gvallin.can_abl FROM tlmplus1.PUB.gvallin").then(data => {
                RivaColdFactura_AV = data.filter(item => item.cod_art != "").filter(item => item.can_abl > 0)
                localforage.setItem("RivaColdFactura_AV", JSON.stringify(RivaColdFactura_AV))
                console.log("DB got")
                PasswordX()
            })
        })
    })
}

function tablaEquipo() {
    document.getElementById("Carga").innerHTML = ""
    document.getElementById("div_table").innerHTML = ""
    Fecha1 = document.getElementById("FechaTabla").value.split("-")[0]
    Fecha2 = document.getElementById("FechaTabla").value.split("-")[1]
    CodPro = document.getElementById("CodProveedor").value
    RivaColdFactura_AC_V = JSON.parse(JSON.stringify(RivaColdFactura_AC))
    RivaColdFactura_AV_V = JSON.parse(JSON.stringify(RivaColdFactura_AV))
    for (i = 0, ilen = RivaColdFactura_AV_V.length; i < ilen; i++) {
        for (j = 0, jlen = RivaColdFactura_AC_V.length; j < jlen; j++) {
            if (RivaColdFactura_AV_V[i]["can_abl"] > 0) {
                if (RivaColdFactura_AC_V[j]["can_all"] > 0 && RivaColdFactura_AV_V[i]["cod_art"] == RivaColdFactura_AC_V[j]["cod_art"]) {
                    RivaColdFactura_AC_V[j]["can_all"] = RivaColdFactura_AC_V[j]["can_all"] - RivaColdFactura_AV_V[i]["can_abl"]
                    if (RivaColdFactura_AC_V[j]["can_all"] < 0) {
                        RivaColdFactura_AV_V[i]["can_abl"] = -RivaColdFactura_AC_V[j]["can_all"]
                        RivaColdFactura_AC_V[j]["can_all"] = 0
                    } else {
                        RivaColdFactura_AV_V[i]["can_abl"] = 0
                        break
                    }
                }
            } else {
                break
            }
        }
    }
    RivaColdFactura_F_X = RivaColdFactura_F.filter(item => item.fec_fcc.slice(0, 4) >= Fecha1 && item.fec_fcc.slice(0, 4) <= Fecha2).filter(item => item.tot_imp > 0)
    CodPro ? RivaColdFactura_F_X = RivaColdFactura_F_X.filter(item => item.cod_pro == CodPro) : null
    for (i = 0, ilen = RivaColdFactura_F_X.length; i < ilen; i++) {
        ImporteRestante = 0
        RivaColdFactura_AC_X = RivaColdFactura_AC.filter(item => item.num_fcc == RivaColdFactura_F_X[i]["num_fcc"])
        RivaColdFactura_AC_V_X = RivaColdFactura_AC_V.filter(item => item.num_fcc == RivaColdFactura_F_X[i]["num_fcc"])
        for (j = 0, jlen = RivaColdFactura_AC_X.length; j < jlen; j++) {
            ImporteRestante += RivaColdFactura_AC_X[j]["imp_bruto"] * (RivaColdFactura_AC_X[j]["can_all"] - RivaColdFactura_AC_V_X[j]["can_all"]) / RivaColdFactura_AC_X[j]["can_all"]
        }
        document.getElementById("div_table").insertAdjacentHTML("beforeend", "<tr><td>" + RivaColdFactura_F_X[i]["fec_fcc"] + "</td><td>" + RivaColdFactura_F_X[i]["num_fcc"] + "</td><td>" + RivaColdFactura_F_X[i]["ref_fcc"] + "</td><td>" + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(RivaColdFactura_F_X[i]["tot_imp"]) + "</td><td>" + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(ImporteRestante) + "</td><td>" + (ImporteRestante / RivaColdFactura_F_X[i]["tot_imp"] * 100).toFixed(2) + " %</td><td><div class='dropdown'><button type='button' data-bs-toggle='dropdown' class='btn btn-primary dropdown-toggle' aria-expanded='false'>Detalle<ul class='dropdown-menu'><li><table class='table table-striped'><thead><tr><td>Artículo</td><td>Ref.Fabricante</td><td>Descripción</td><td>Cant.Comprado</td><td>Cant.Restante</td><td>Precio</td><td>Importe Restante</td></tr></thead><tbody></tbody></table></li></ul></button></div></td></tr>")
        for (j = 0, jlen = RivaColdFactura_AC_X.length; j < jlen; j++) {
            document.getElementById("div_table").getElementsByTagName("ul")[i].getElementsByTagName("tbody")[0].insertAdjacentHTML("beforeend",
                "<tr><td>" + RivaColdFactura_AC_X[j]["cod_art"] + "</td><td>" + RivaColdFactura_AC_X[j]["ref_all"] + "</td><td>" + RivaColdFactura_AC_X[j]["dep_all"] + "</td><td>" + RivaColdFactura_AC_X[j]["can_all"] + "</td><td>" + RivaColdFactura_AC_V_X[j]["can_all"] + "</td><td>" + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(RivaColdFactura_AC_X[j]["imp_bruto"]) + "</td><td>" + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(RivaColdFactura_AC_X[j]["imp_bruto"] * RivaColdFactura_AC_V_X[j]["can_all"] / RivaColdFactura_AC_X[j]["can_all"]) + "</td></tr>")
        }
    }

}

const localforage = require("localforage");
localforage.getItem("RivaColdFactura_AC", function (err, value) {
    RivaColdFactura_AC = JSON.parse(value)
    localforage.getItem("RivaColdFactura_AV", function (err, value) {
        RivaColdFactura_AV = JSON.parse(value)
        localforage.getItem("RivaColdFactura_F", function (err, value) {
            RivaColdFactura_F = JSON.parse(value)
            ActualizacionGoManage()
            //tablaEquipo()
        })
    })
})