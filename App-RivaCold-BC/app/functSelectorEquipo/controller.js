var DB
const Tabla_tbody = document.getElementById("Tabla_tbody")
const Field = [
    "Marca", "Aplicación", "Refrigerante", "Config1", "Config2", "Config3", "Config4", "Config5", "Config6", "Config7", "Config8", "Config9", "Compresor_Voltaje"
]
var FieldTable
const localforage = require("localforage");

function SeleccionarTipo() {
    FieldTable = []
    S_Tipo = document.querySelector('input[name=B_Tipo]:checked').value
    localforage.getItem("RivaCold" + S_Tipo, function (err, value) {
        DB = JSON.parse(value).sort(function (a) { if (a.Volumen) { return -1; } });
        document.getElementById("Tabla_tbody").innerHTML = ""
        const DBField = Object.getOwnPropertyNames(DB[0]).sort().reverse();
        for (i = 0, len = Field.length; i < len; i++) {
            if (DBField.indexOf(Field[i]) != -1) {
                DBConfig = DB.map((item) => item[Field[i]]);
                DBConfig = DBConfig.filter((item, index) => DBConfig.indexOf(item) === index);
                if (DBConfig.length > 1) {
                    document.getElementsByTagName("tbody")[0].insertAdjacentHTML("beforeend", '<tr><th  colspan="3" id="D_' + Field[i] + '"><input type="radio" class="btn-check" name="B_' + Field[i] + '" id="' + Field[i] + 'Empty" value="" autocomplete="off" checked /><label class="btn btn-outline-primary" for="' + Field[i] + 'Empty">Todo</label></th></tr>')
                    FieldTable.push(Field[i])
                    for (j = 0, len2 = DBConfig.length; j < len2; j++) {
                        DBConfig[j] ? document.getElementById("D_" + Field[i]).insertAdjacentHTML("beforeend", '<input type="radio" class="btn-check" name="B_' + Field[i] + '" id="' + DBConfig[j] + '" value="' + DBConfig[j] + '" autocomplete="off"/><label class="btn btn-outline-primary" for="' + DBConfig[j] + '">' + DBConfig[j] + '</label>') : null
                    }
                }
            }
        }
        document.getElementById("RivaCold").checked = true
        FiltroEquipo()
    })
}
function FiltroEquipo() {
    let DBFilter = DB
    len = FieldTable.length
    for (i = 0; i < len; i++) {
        VConfig = document.getElementsByTagName("tbody")[0].getElementsByTagName("tr")[i].querySelector('input[name=B_' + FieldTable[i] + ']:checked').value
        VConfig ? DBFilter = DBFilter.filter(item => item[FieldTable[i]] == VConfig) : null
    }
    VConfig = document.querySelector('input[name=B_Stock]:checked').value
    VConfig != "Todo" ? DBFilter = DBFilter.filter(item => item["Ficha producto_Stock"] == VConfig) : null
    document.getElementsByTagName("tbody")[1].innerHTML = ""
    Tamb = parseFloat(document.getElementById("TempAmbiente").value)
    Tcamara = parseFloat(document.getElementById("TempCamara").value)
    PFSelect = parseFloat(document.getElementById("PotenciaFrig").value)
    Intervalo = parseFloat(document.getElementById("Intervalo").value)
    document.getElementById("TempAmbiente").value = Tamb + " °C"
    document.getElementById("TempCamara").value = Tcamara + " °C"
    document.getElementById("PotenciaFrig").value = PFSelect + " W"
    document.getElementById("Intervalo").value = Intervalo + " %"
    const DBField = Object.getOwnPropertyNames(DBFilter[0]);
    for (i = 0, len = DBFilter.length; i < len; i++) {
        PFList = Interpol(Tamb, Tcamara, DBFilter, DBField, i)
        Diff = (parseFloat(PFList) / parseFloat(PFSelect) - 1) * 100
        if ((document.querySelector('input[name=B_Mostrar]:checked').value == "Si") ||
            (document.querySelector('input[name=B_Mostrar]:checked').value == "NoP" && PFList != "-") ||
            (document.querySelector('input[name=B_Mostrar]:checked').value == "NoE" && Math.abs(Diff) < Intervalo)) {
            document.getElementById("Table_tbody_2").insertAdjacentHTML("beforeend", '<tr><th>' + DBFilter[i]["Ref"] + '</th><th>' + PFList + '</th><th>' + (Diff).toFixed(0) + " %" + '</th></tr>')
        }
    }
    OrdenarTabla("Table_tbody_2")
    const Tabla_tbody = document.getElementById("Tabla_tbody")
    len = Tabla_tbody.getElementsByTagName("input").length
    for (i = 0; i < len; i++) {
        Tabla_tbody.getElementsByTagName("input")[i].disabled = false
        Tabla_tbody.getElementsByTagName("label")[i].style.color = ""
        Tabla_tbody.getElementsByTagName("label")[i].style.backgroundColor = ""
        if ((!DBFilter.some(item => item[Tabla_tbody.getElementsByTagName("input")[i].name.replace("B_", "")] == Tabla_tbody.getElementsByTagName("input")[i].value))) {
            if (Tabla_tbody.getElementsByTagName("input")[i].value != "") {
                Tabla_tbody.getElementsByTagName("input")[i].disabled = true
                Tabla_tbody.getElementsByTagName("label")[i].style.backgroundColor = "black"
                Tabla_tbody.getElementsByTagName("label")[i].style.color = "white"
            }
        }
    }
}

function OrdenarTabla(Ntbody) {
    let ArrayTable = []
    tbody = document.getElementById(Ntbody)
    const tbody_tr = tbody.getElementsByTagName("tr")
    for (i = 0, len = tbody_tr.length; i < len; i++) {
        ArrayTable[i] = []
        ArrayTable[i]["Diff"] = parseFloat(tbody_tr[i].getElementsByTagName("th")[2].innerHTML)
        ArrayTable[i]["HTML"] = tbody_tr[i].innerHTML
    }
    ArrayTable.sort((a, b) => {
        if (a.Diff < b.Diff) {
            return +1;
        }
        if (a.Diff > b.Diff) {
            return -1;
        }
        return 0;
    });

    for (i = 0, len = tbody_tr.length; i < len; i++) {
        tbody_tr[i].innerHTML = ArrayTable[i]["HTML"]
    }
}

SeleccionarTipo()
