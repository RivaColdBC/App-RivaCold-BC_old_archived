RegLocalCabecera = JSON.parse(localStorage.getItem("RegLocalCabecera"))
RegLocalDatos = JSON.parse(localStorage.getItem("RegLocalDatos"))
function RegistroOfertaLocal() {
    table_registro_oferta_local_tbody.innerHTML = "";
    Count = 6
    if (RegLocalCabecera.length > 0) {
        for (i = 0, j = -1; i < RegLocalCabecera.length; i++) {
            table_registro_oferta_local_tbody.insertRow().innerHTML = "<td/><td/><td/><td/><td/><td style='text-align:center'/>";
            j += 1;
            table_registro_oferta_local_td[j * Count + 0].innerText = j + 1;
            table_registro_oferta_local_td[j * Count + 1].innerText = RegLocalCabecera[i][0];
            table_registro_oferta_local_td[j * Count + 2].innerText = RegLocalCabecera[i][13];
            table_registro_oferta_local_td[j * Count + 3].innerText = RegLocalCabecera[i][3];
            table_registro_oferta_local_td[j * Count + 4].innerText = RegLocalCabecera[i][29];
            table_registro_oferta_local_td[j * Count + 5].insertAdjacentHTML("beforeend", `<button><i class='bi bi-clipboard-plus'style='color:green;font-size:15px;' onclick='AccederRegistroLocal("${RegLocalCabecera[i][0] + "_AvA_" + RegLocalCabecera[i][29]}")' data-bs-dismiss='modal'/></button>`);
        }
    }
}
function AccederRegistroLocal(NOferta) {
    for (i = 0; i < RegLocalCabecera.length; i++) {
        if (RegLocalCabecera[i][0] == NOferta.split("_AvA_")[0] && RegLocalCabecera[i][29] == NOferta.split("_AvA_")[1]) {
            for (n = 0; n < Campo.length; n++) {
                document.getElementById([Campo[n]]).value = RegLocalCabecera[i][n];
            }
        }
    }
    var Count = 0;
    Table = [];
    Reference = [];
    for (i = 0; i < RegLocalDatos.length; i++) {
        if (RegLocalDatos[i][7] == NOferta) {
            Table[Count] = [];
            Table[Count][0] = RegLocalDatos[i][0] || ""
            Table[Count][1] = parseFloat(RegLocalDatos[i][1]).toFixed(0) || ""
            Table[Count][2] = parseFloat(RegLocalDatos[i][2]) || ""
            Table[Count][3] = parseFloat(RegLocalDatos[i][3]) || ""
            Table[Count][4] = Table[Count][2] * (1 - Table[Count][3] / 100) || ""
            Table[Count][5] = Table[Count][4] * Table[Count][1] || ""
            Reference[Count] = RegLocalDatos[i][6]
            Count += 1;
        }
    }
    localStorage.setItem("TableOferta", JSON.stringify(Table));
    localStorage.setItem("TextoModelo", JSON.stringify(Reference));
    PushDB();
    GuardarDatos();
}

function SaveRegisterLocal(cab, tab, ref) {
    if (cab[0]) {
        date = new Date();
        Today = ("00" + date.getDate()).slice(-2) + "/" + ("00" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear();
        if (tab.length && ref.length) {
            for (i = 0; i < tab.length; i++) {
                tab[i][6] = ref[i]
                tab[i][7] = document.getElementById("Oferta_NumOferta").value + "_AvA_" + document.getElementById("FechaActual").value
            }
            RegDatos = []
            if (RegLocalDatos) {
                for (i = 0; i < RegLocalDatos.length; i++) {
                    if (RegLocalDatos[i][7] != tab[0][7]) {
                        RegDatos.push(RegLocalDatos[i])
                    }
                }
            }
            for (i = 0; i < tab.length; i++) {
                RegDatos.push(tab[i])
            }
            localStorage.setItem("RegLocalDatos", JSON.stringify(RegDatos))
            RegLocalDatos = JSON.parse(localStorage.getItem("RegLocalDatos"))
        }
        RegCab = []
        if (RegLocalCabecera) {
            for (i = 0; i < RegLocalCabecera.length; i++) {
                if (RegLocalCabecera[i][0] != cab[0]) {
                    RegCab.push(RegLocalCabecera[i])
                } else if (RegLocalCabecera[i][29] != cab[29]) {
                    RegCab.push(RegLocalCabecera[i])
                }
            }
        }
        RegCab.push(cab)
        localStorage.setItem("RegLocalCabecera", JSON.stringify(RegCab))
        RegLocalCabecera = JSON.parse(localStorage.getItem("RegLocalCabecera"))
    }
}

function BorrarRegistroLocal() {
    RegLocalCabecera = []
    RegLocalDatos = []
    localStorage.removeItem("RegLocalCabecera")
    localStorage.removeItem("RegLocalDatos")
    RegistroOfertaLocal()
}
const table_registro_oferta_local_tbody = document.getElementById("table_registro_oferta_local").getElementsByTagName("tbody")[0]
const table_registro_oferta_local_td = document.getElementById("table_registro_oferta_local").getElementsByTagName("tbody")[0].getElementsByTagName("td")