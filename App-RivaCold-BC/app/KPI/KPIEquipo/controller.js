date = new Date();
document.getElementById("FechaTabla").value = 1900 + date.getYear()
function PasswordX() {
    Password = document.getElementById("Password").value
    getHash(Password).then(hash => {
        if (hash == "f488be54a899f0d783cd7d162bd6ae635488d8eb01ae50d2d379746cb0077e8d") {
            document.getElementById("FechaTabla").disabled = false
            document.getElementById("Ref").disabled = false
            tablaEquipo()
        } else {
            document.getElementById("FechaTabla").disabled = true
            document.getElementById("Ref").disabled = true
        }
    })
}


function ActualizacionGoManage() {
    const oledb = require("node-adodb");
    oledb.PATH = "./resources/adodb.js";
    const connection = oledb.open(
        "DRIVER={Progress OpenEdge 11.7 Driver};Dsn=tlmplus1V11;uid=userSQL;pwd=userSQL;host=servidor;port=2613;db=tlmplus1",
        process.arch.includes("64"));
    connection.query("SELECT gvallin.cod_art,gvallin.can_abl,gvallin.det_art,gvallin.ref_art,gvallin.fec_alb,gvallin.nom_mar,gvallin.num_alb FROM tlmplus1.PUB.gvallin WHERE gvallin.can_abl>0").then(data => {
        DBVenta = data
        localforage.setItem("RivaColdVenta", JSON.stringify(data)).then(document.getElementById("Carga").innerHTML = "Carga completa.")
        PasswordX()
    }).catch(error => {
        document.getElementById("Carga").innerHTML = DBVenta ?
            "Error de carga de base de datos, procede a utilizar el base de datos local." : "Error de carga de base de datos, no disponible para su uso."
    })
}

function tablaEquipo() {
    document.getElementById("Carga").innerHTML = ""
    document.getElementById("div_table").innerHTML = ""
    Ref = document.getElementById("Ref").value
    DBpush = []
    k = 0
    Fecha = document.getElementById("FechaTabla").value
    for (i = 0, DBlen = DBVenta.length; i < DBlen; i++) {
        check = false
        if (DBVenta[i]["fec_alb"].slice(0, 4) == Fecha && DBVenta[i]["nom_mar"].startsWith("RIVACOLD") && DBVenta[i]["ref_art"].startsWith(Ref)) {
            for (j = 0, DBplen = DBpush.length; j < DBplen; j++) {
                if (DBVenta[i]["ref_art"] == DBpush[j]["ref_art"] || DBVenta[i]["cod_art"] == DBpush[j]["cod_art"]) {
                    DBpush[j]["venta_" + parseFloat(DBVenta[i]["fec_alb"].slice(5, 7))] = (DBpush[j]["venta_" + parseFloat(DBVenta[i]["fec_alb"].slice(5, 7))] ? DBpush[j]["venta_" + parseFloat(DBVenta[i]["fec_alb"].slice(5, 7))] : 0) + parseFloat(DBVenta[i]["can_abl"])
                    DBpush[j]["Total"] += parseFloat(DBVenta[i]["can_abl"])
                    check = true
                }
            }
            if (!check) {
                DBpush[k] = {}
                DBpush[k]["ref_art"] = DBVenta[i]["ref_art"]
                DBpush[k]["fec_alb"] = DBVenta[i]["fec_alb"]
                DBpush[k]["cod_art"] = DBVenta[i]["cod_art"]
                DBpush[k]["det_art"] = DBVenta[i]["det_art"]
                DBpush[k]["Total"] = 0
                for (l = 0, DBTarifalen = DBTarifa.length; l < DBTarifalen; l++) {
                    if (DBpush[k]["cod_art"] == DBTarifa[l]["Ref2"]) {
                        DBpush[k]["cod_Grupo"] = DBTarifa[l]["Cód# Grupo"]
                        DBpush[k]["cod_subGrupo"] = DBTarifa[l]["Cód# Subgrupo"]
                    }
                }
                i--; k++;
            }
        }
    }
    DBpush = DBpush.sort(function (a, b) { if (a.ref_art >= b.ref_art) { return +1; } else { return -1 } }).sort(function (a, b) { if (a.cod_Grupo >= b.cod_Grupo) { return +1; } else { return -1 } })
    for (j = 0, DBplen = DBpush.length; j < DBplen; j++) {
        check = false
        for (i = 0, len = Cod_Grupo.length; i < len; i++) {
            Cod_Grupo[i][0] == DBpush[j]["cod_Grupo"] && Cod_Grupo[i][2] ? check = true : null
        }
        if (check) {
            dtable.insertAdjacentHTML("beforeend", "<tr><th>" + DBpush[j]["ref_art"] + "</th></tr>")
            venta_total = 0
            for (i = 1; i < 13; i++) {
                venta = DBpush[j]["venta_" + i] ? DBpush[j]["venta_" + i] : ""
                venta_total += venta ? parseFloat(venta) : 0
                dtabletr[dtabletr.length - 1].insertAdjacentHTML("beforeend", "<th>" + venta + "</th>")
            }
            dtabletr[dtabletr.length - 1].insertAdjacentHTML("beforeend", "<th>" + venta_total + "</th>")
        }
    }
}

var Orden = true
var Point = null
const dtable = document.getElementById("div_table")
const dtabletr = dtable.getElementsByTagName("tr")

function Ordenar(method, num) {
    Point == method + num ? null : Orden = true
    arrayHTML = []
    for (i = 0, trlength = dtabletr.length; i < trlength; i++) {
        arrayHTML[i] = []
        arrayHTML[i]["html"] = dtabletr[i].innerHTML
        if (method == "Ref") {
            arrayHTML[i]["Order"] = dtabletr[i].getElementsByTagName("th")[0].innerHTML
        } else if (method == "month") {
            arrayHTML[i]["Order"] = dtabletr[i].getElementsByTagName("th")[num].innerHTML ? parseFloat(dtabletr[i].getElementsByTagName("th")[num].innerHTML) : 0
        } else if (method == "Total") {
            arrayHTML[i]["Order"] = parseFloat(dtabletr[i].getElementsByTagName("th")[13].innerHTML)
        }
    }
    Orden ? arrayHTML.sort(function (a, b) { if (a.Order <= b.Order) { return 1 } return -1 }) :
        arrayHTML.sort(function (a, b) { if (a.Order >= b.Order) { return 1 } return -1 })
    for (i = 0, trlength = dtabletr.length; i < trlength; i++) {
        dtabletr[i].innerHTML = arrayHTML[i]["html"]
    }
    Orden = !Orden
    Point = method + num
}

const localforage = require("localforage");
localforage.getItem("RivaColdVenta", function (err, value) {
    DBVenta = JSON.parse(value)
    localforage.getItem("RivaColdTarifa0000").then(function (value) {
        DBTarifa = JSON.parse(value)
        ActualizacionGoManage()
    })
})

const Cod_Grupo = [
    ["00", "Grupo 00", false],
    ["0000", "Grupo/Subgrupo Genérico", false],
    ["01", "SISTEMI ERMETICI", false],
    ["02", "UNITA COND. ARIA", false],
    ["03", "UNITA COND. ACQUA", false],
    ["04", "UNITA S/COMPR.", false],
    ["05", "ACCESSORI - Optional [OPT]", true],
    ["06", "SPLIT", true],
    ["07", "MONOBLOCCHI", true],
    ["08", "UC CARENATE", true],
    ["09", "CENTRALI", true],
    ["10", "CHILLER", true],
    ["11", "MACCHINE VITE", false],
    ["12", "COMPRESSORI", false],
    ["13", "UNITA DI POTENZA", false],
    ["14", "UNITA MISTE", false],
    ["15", "ARMADI SC", false],
    ["16", "AC NAUTICA", false],
    ["17", "TAV. REFRIGERATI TD", false],
    ["18", "MOTOVENTILATORI", false],
    ["19", "ACCESSORI X MOTOVENT", false],
    ["20", "ACCESSORI X COMPR.", false],
    ["21", "SEMILAVORATI RV4", false],
    ["22", "DONAU", false],
    ["23", "POMPE DI CALORE", false],
    ["24", "TRASPORTO REFRIGER.", false],
    ["25", "SUB-ASSEMBLY", false],
    ["26", "UNITA COND. MEA", false],
    ["27", "BLACK RIVIERA", false],
    ["36", "EVAP. VENT RV5 SERIE", false],
    ["37", "CONDENSATORI", false],
    ["38", "CONDENSATORI VENT.", false],
    ["39", "EVAPORATORI VENT.", true],
    ["40", "EVAP.C/VALV. O C/CAP", false],
    ["41", "EVAPORATORI STATICI", true],
    ["42", "BATTERIE EVAP.", false],
    ["43", "Scambiatori ad acqua", false],
    ["44", "SEMILAVORATI RV5", false],
    ["45", "COLLETTORI RV5", false],
    ["46", "VASCHETTE", false],
    ["47", "QUADRI ELETTRICI", false],
    ["48", "CABLAGGI ELETTRICI", false],
    ["49", "MOTORI ELETTRICI", false],
    ["50", "Hartermo", false],
    ["51", "Prodigy", false],
    ["52", "Johnson Control", false],
    ["53", "Castel", false],
    ["54", "Danfoss", false],
    ["55", "Fornitori minori", false],
    ["56", "Prodotti generici", false],
    ["57", "Antivibranti", false],
    ["58", "OLI", false],
    ["59", "GAS", false],
    ["60", "COMPONENTI&CONTROLLI", false],
    ["61", "SCAMBIATORI ACQUA", false],
    ["62", "Sanital", false],
    ["63", "Neotecnica", false],
    ["64", "Elettro Italia", false],
    ["65", "Swep", false],
    ["66", "Emirel", false],
    ["67", "Carel", false],
    ["70", "ADESIVI ED ETICHETTE", false],
    ["71", "MATERIALE ELETTRICO", false],
    ["72", "FERRAMENTA", false],
    ["73", "MAT.PRIME E TUBI", false],
    ["74", "MAT.LAVORAZIONI MECC", false],
    ["76", "ISOLANTI", false],
    ["77", "LAMIERE", false],
    ["78", "IMBALLI", false],
    ["82", "MAT.C/LAVORO CLIENTI", false],
    ["91", "MATERIAL.USO INTERNO", false],
    ["92", "ASSIE.FITTIZI(NOLAM)", false],
    ["95", "TEST SALA PROVE", false],
    ["96", "MATERIALE VARIO", false],
    ["97", "CANCELLERIA", false],
    ["98", "MANUALI E CATALOGHI", false],
    ["99", "CODICI GENERICI", false],
    ["AC", "ACCESORIOS VARIOS", false],
    ["AL", "ALUPLAST COQUILLA AISLANT", false],
    ["GR", "GREEN COQUILLA AISLANTE", false],
    ["IS", "ISOKLIMA COQUILLA AISLANT", false],
    ["KL", "KL COQUILLA AISLANTE", false],
    ["KT", "KT COQUILLA AISLANTE B1", false],
    ["P0", "QE SERIE BASE", false],
    ["P1", "QE PLUS LCD", false],
    ["P2", "QE EXPERT", false],
    ["P3", "QE PLUS EXPERT", false],
    ["P4", "QE U.COND.", false],
    ["P5", "QE S/CONTROL ELECTRONICO", false],
    ["P6", "QE C/CONTROL ELECTRONICO", false],
    ["P7", "ELECTRONICA DE CONTROL", false],
    ["P8", "OTROS Y ACCESORIOS", false],
    ["P9", "UMIDIFICATORI", false],
    ["PE", "PE COQUILLA POLIETILENO RECUBIERTO", false],
    ["PT", "PAINTED COQUILLA AISLANTE", false],
    ["PX", "PAINTED COQUILLA AISLANTE", false],
    ["TH", "TH COQUILLA AISLANTE", false],
    ["TK", "TK COQUILLA AISLANTE", false],
    ["UN", "Grupo UN", false],
    ["V0", "VIT - MINIBARS", false],
    ["V1", "VIT - FRIGO&FREEZERS", false],
    ["V2", "VIT - CONGELADORES", false],
    ["V3", "VIT - CASSETO INOX", false],
    ["V4", "VIT - 3 WAYS", false],
    ["V5", "VIT - PORTATILES", false],
    ["V6", "VIT - TOP LOADING", false],
    ["V7", "VIT - WINE", false],
    ["V8", "VIT - EQUIPOS & COMPONENTS", false],
    ["V9", "VIT - ICE MAKER", false],
    ["VA", "VIT - BAG IN BOX", false],
    ["VB", "VIT - MILK COOLERS", false],
    ["VC", "VIT - HAIR", false],
    ["VD", "VIT - SAFE", false],
    ["VE", "VIT - CUSTOM FRIGO", false],
    ["VF", "VIT - AA  CLIMA", false],
    ["VG", "VIT - INCASSO", false],
    ["VH", "VIT - OPCIONALES", false],
    ["VI", "VIT - REPUESTOS", false],
]