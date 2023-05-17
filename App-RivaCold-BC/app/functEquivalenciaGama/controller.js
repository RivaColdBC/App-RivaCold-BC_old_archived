const S_Marca_A = document.getElementById("S_Marca_A");
const S_Marca_B = document.getElementById("S_Marca_B");
const S_Tipo_A = document.getElementById("S_Tipo_A");
const S_Tipo_B = document.getElementById("S_Tipo_B");
const S_Gama_A = document.getElementById("S_Gama_A");
const S_Gama_B = document.getElementById("S_Gama_B");
const S_Aplicación_A = document.getElementById("S_Aplicación_A");
const S_Aplicación_B = document.getElementById("S_Aplicación_B");
const S_Refrigerante_A = document.getElementById("S_Refrigerante_A");
const S_Refrigerante_B = document.getElementById("S_Refrigerante_B");
const TablaEqBody = document.getElementById("Table_body");
var DB_A; var DB_B;
var ArrayDB = [{ "Marca": [], "Aplicacion": [], "Refrigerante": [] }, { "Marca": [], "Aplicacion": [], "Refrigerante": [] }];
const localforage = require("localforage");

function SeleccionarMarca() {
  S_Tipo_B.value = S_Tipo_A.value
  return localforage.getItem(`RivaCold${S_Tipo_A.value}`).then(function (valueA) {
    return localforage.getItem(`RivaCold${S_Tipo_B.value}`).then(function (valueB) {
      DB_A = JSON.parse(valueA).sort(function (a, b) { if (a.Ref > b.Ref) { return +1; } else { return -1; } }).sort(function (a, b) { if (a.Refrigerante > b.Refrigerante) { return -1; } else { return +1; } }).sort(function (a, b) { if (a.Aplicación > b.Aplicación) { return 1; } else { return -1; } }).sort(function (a) { if (a.Volumen) { return -1; } })
      DB_B = JSON.parse(valueB).sort(function (a, b) { if (a.Ref > b.Ref) { return -1; } else { return +1; } }).sort(function (a, b) { if (a.Refrigerante > b.Refrigerante) { return 1; } else { return -1; } }).sort(function (a, b) { if (a.Aplicación > b.Aplicación) { return 1; } else { return -1; } }).sort(function (a) { if (a.Volumen) { return -1; } })
      SeleccionarTipo("A")
      SeleccionarTipo("B")
      ListadoModelo()
    })
  })
}

function SeleccionarTipo(Modelo) {
  DBDuplicate = [...new Set(eval(`DB_${Modelo}`).map((item) => item.Marca))];
  eval("S_Marca_" + Modelo).innerHTML = "";
  for (Marca of DBDuplicate) {
    if (Marca != null) {
      Opcion = document.createElement("option");
      Opcion.text = Marca;
      Opcion.value = Marca;
      eval("S_Marca_" + Modelo).add(Opcion);
    }
  }
  SeleccionarGama(Modelo);
}
function SeleccionarGama(Modelo) {
  ArrayDB[Modelo == "A" ? 0 : 1]["Marca"] = eval("DB_" + Modelo).filter((item) => item.Marca == eval("S_Marca_" + Modelo).value);
  DBDuplicate = [...new Set(ArrayDB[Modelo == "A" ? 0 : 1]["Marca"].map((item) => item.Gama))].sort()
  eval("S_Gama_" + Modelo).innerHTML = "";
  for (Gama of DBDuplicate) {
    Opcion = document.createElement("option");
    Opcion.text = Gama;
    Opcion.value = Gama;
    eval("S_Gama_" + Modelo).add(Opcion);
  }
  SeleccionarAplicación(Modelo);
  SeleccionarFreon(Modelo);
}

function SeleccionarAplicación(Modelo) {
  ArrayDB[Modelo == "A" ? 0 : 1]["Aplicacion"] = ArrayDB[Modelo == "A" ? 0 : 1]["Marca"].filter((item) => item.Gama == eval("S_Gama_" + Modelo).value);
  DBDuplicate = [...new Set(ArrayDB[Modelo == "A" ? 0 : 1]["Aplicacion"].map((item) => item.Aplicación))].sort();
  eval("S_Aplicación_" + Modelo).disabled = false;
  eval("S_Aplicación_" + Modelo).innerHTML = "";
  for (Aplicacion of DBDuplicate) {
    if (Aplicacion != null) {
      Opcion = document.createElement("option");
      Opcion.text = Aplicacion;
      Opcion.value = Aplicacion;
      eval("S_Aplicación_" + Modelo).add(Opcion);
    }
  }
  if (eval("S_Aplicación_" + Modelo).length == 0) {
    eval("S_Aplicación_" + Modelo).disabled = true
  } else if (eval("S_Aplicación_" + Modelo).length != 1) {
    Opcion = document.createElement("option");
    Opcion.text = "Aplicación";
    Opcion.value = "0";
    eval("S_Aplicación_" + Modelo).add(Opcion, eval("S_Aplicación_" + Modelo)[0]);
  }
  eval("S_Aplicación_" + Modelo).selectedIndex = 0;
}

function SeleccionarFreon(Modelo) {
  eval("S_Refrigerante_" + Modelo).disabled = false;
  eval("S_Refrigerante_" + Modelo).innerHTML = "";
  DBDuplicate = [...new Set(ArrayDB[Modelo == "A" ? 0 : 1]["Aplicacion"].map((item) => item.Refrigerante))].sort()
  for (Refrigerante of DBDuplicate) {
    if (Refrigerante != null) {
      Opcion = document.createElement("option");
      Opcion.text = Refrigerante;
      Opcion.value = Refrigerante;
      eval("S_Refrigerante_" + Modelo).add(Opcion);
    }
  }
  if (eval("S_Refrigerante_" + Modelo).length == 0) {
    eval("S_Refrigerante_" + Modelo).disabled = true
  } else if (eval("S_Refrigerante_" + Modelo).length > 1) {
    Opcion = document.createElement("option");
    Opcion.text = "Refrigerante";
    Opcion.value = "0";
    eval("S_Refrigerante_" + Modelo).add(Opcion, eval("S_Refrigerante_" + Modelo)[0]);
  }
  eval("S_Refrigerante_" + Modelo).selectedIndex = 0;

}

function ListadoModelo() {
  DBMarcaA = DB_A
    .filter((item) => item.Gama == S_Gama_A.value)
    .filter((item) => item.Marca == S_Marca_A.value)
  TablaEqBody.innerHTML = "";
  document.getElementById("Select_Tamb").innerHTML = ""
  PFField = Object.getOwnPropertyNames(DBMarcaA[0]).sort().reverse();
  Row = 0
  Select_Tamb = []
  for (i in DBMarcaA) {
    if (S_Aplicación_A.value == DBMarcaA[i]["Aplicación"] || S_Aplicación_A.value == "0" || S_Aplicación_A.disabled || DBMarcaA[i]["Aplicación"] == "DUAL" || DB_B[k]["Aplicación"] == "DUAL") {
      if (S_Refrigerante_A.value == DBMarcaA[i]["Refrigerante"] || S_Refrigerante_A.disabled || S_Refrigerante_A.value == "0") {
        DB_BFilter = DB_B.filter(item => item.Marca == S_Marca_B.value).filter(item => item.Gama == S_Gama_B.value)
        TablaEqBody.insertAdjacentHTML('beforeend', `<tr id='Row_${i}'><th/><th>${DBMarcaA[i]["Ref"]}</th><th><select/></th><th id='S_PF_${DBMarcaA[i]["Ref"]}'></th><th><select/></th><th/><th/><th></th><th/><th/></tr>`)
        for (j in PFField) {
          if (PFField[j].startsWith("PC_") && DBMarcaA[i][PFField[j]] != null) {
            Opcion = document.createElement("option");
            Opcion.text = PFField[j].split("_")[1] + "  " + PFField[j].split("_")[2];
            Opcion.value = parseFloat(DBMarcaA[i][PFField[j]]);
            document.getElementById("Table_body").getElementsByTagName("select")[2 * Row].add(Opcion);
            if (Select_Tamb.indexOf(PFField[j].split("_")[1]) == -1) {
              Opcion = document.createElement("option");
              Opcion.text = PFField[j].split("_")[1]
              Opcion.value = parseFloat(PFField[j].split("_")[1])
              document.getElementById("Select_Tamb").add(Opcion)
              Select_Tamb.push(PFField[j].split("_")[1])
            }
          }
        }
        TablaEqBody.getElementsByTagName("tr")[Row].getElementsByTagName("th")[0].insertAdjacentHTML("afterbegin", "<button type='button' onclick='EliminarFila(" + i + ")'><i class='bi bi-x-square' style='color:red'/></button>");
        list_gama = TablaEqBody.getElementsByTagName("tr")[Row].getElementsByTagName("select")[1];
        list_gama.innerHTML = "";
        for (k in DB_B) {
          if (DB_B[k]["Gama"] == S_Gama_B.value && DB_B[k]["Marca"] == S_Marca_B.value) {
            if (((S_Aplicación_B.value == DB_B[k]["Aplicación"] || S_Aplicación_B.value == "0") && DB_B[k]["Aplicación"] == DBMarcaA[i]["Aplicación"]) || DBMarcaA[i]["Aplicación"] == "DUAL" || DB_B[k]["Aplicación"] == "DUAL" || S_Aplicación_B.disabled) {
              if (S_Refrigerante_B.value == DB_B[k]["Refrigerante"] || S_Refrigerante_B.disabled || S_Refrigerante_B.value == "0") {
                Opcion = document.createElement("option");
                Opcion.text = DB_B[k]["Ref"];
                Opcion.value = k;
                list_gama.add(Opcion);
              }
            }
          }
        }
        Row += 1
      }
    }
  }
  MarcaA_CondTrabajo()
  return MarcaB_Equivalencia();
}

function DescuentoX(Modelo) {
  document.getElementById("Descuento_" + Modelo).value = (parseFloat(document.getElementById("Descuento_" + Modelo).value) || 0) + " %"
}

function Ordenar() {
  OrderArray = []
  for (i = 0, len = TablaEqBody.getElementsByTagName("tr").length; i < len; i++) {
    OrderArray[i] = []
    OrderArray[i]["HTML"] = TablaEqBody.getElementsByTagName("tr")[i].outerHTML
    OrderArray[i]["Potencia"] = parseFloat(TablaEqBody.getElementsByTagName("tr")[i].getElementsByTagName("th")[3].innerHTML)
  }
  OrderArray.sort(function (a, b) { if (a.Potencia > b.Potencia) { return +1; } else { return -1; } })
  for (i = 0, len = TablaEqBody.getElementsByTagName("tr").length; i < len; i++) {
    TablaEqBody.getElementsByTagName("tr")[i].outerHTML = OrderArray[i]["HTML"]
  }
}



function MarcaA_CondTrabajo() {
  for (i = 0, len = TablaEqBody.getElementsByTagName("tr").length; i < len; i++) {
    TablaEqBody.getElementsByTagName("tr")[i].getElementsByTagName("th")[3].innerHTML = parseFloat(TablaEqBody.getElementsByTagName("tr")[i].getElementsByTagName("select")[0].value).toFixed(0) + " W"
  }
}

function MarcaB_Equivalencia() {
  DBMarcaA = DB_A.filter((item) => item.Gama == S_Gama_A.value).filter((item) => item.Marca == S_Marca_A.value);
  console.log(DBMarcaA)
  DescuentoA = 1
  Dto1 = 1 - (parseFloat(document.getElementById("Descuento_A_1").value) || 0) / 100
  Dto2 = 1 - (parseFloat(document.getElementById("Descuento_A_2").value) || 0) / 100
  Dto3 = 1 - (parseFloat(document.getElementById("Descuento_A_3").value) || 0) / 100
  DescuentoA = Dto1 * Dto2 * Dto3
  Descuento = 1
  Dto1 = 1 - (parseFloat(document.getElementById("Descuento_B_1").value) || 0) / 100
  Dto2 = 1 - (parseFloat(document.getElementById("Descuento_B_2").value) || 0) / 100
  Dto3 = 1 - (parseFloat(document.getElementById("Descuento_B_3").value) || 0) / 100
  Descuento = Dto1 * Dto2 * Dto3
  return localforage.getItem("RivaCold" + S_Tipo_B.value, function (err, value) {
    MarcaBField = Object.getOwnPropertyNames(DB_B[0]);
    for (i = 0, len = TablaEqBody.getElementsByTagName("tr").length; i < len; i++) {
      if (TablaEqBody.getElementsByTagName("tr")[i].getElementsByTagName("select")[1].length == 0) {
        document.getElementById(TablaEqBody.getElementsByTagName("tr")[i].id).style.display = "none";
      } else {
        TablaEqBodyTri = TablaEqBody.getElementsByTagName("tr")[i]
        TablaEqBodyTrith = TablaEqBodyTri.getElementsByTagName("th")
        TablaEqBodyTriSelect = TablaEqBodyTri.getElementsByTagName("select")
        Tamb = parseFloat(TablaEqBodyTriSelect[0].selectedOptions[0].innerHTML.split("  ")[0]) + DT;
        Tcamara = parseFloat(TablaEqBodyTriSelect[0].selectedOptions[0].innerHTML.split("  ")[1]);
        if (TablaEqBodyTriSelect[1].value) {
          TablaEqBodyTrith[5].innerHTML = Interpol(Tamb, Tcamara, DB_B, MarcaBField, TablaEqBodyTriSelect[1].value);
          TablaEqBodyTrith[6].innerHTML = ((parseFloat(TablaEqBodyTrith[3].innerHTML) / parseFloat(TablaEqBodyTrith[5].innerHTML) - 1) * 100).toFixed(0) + " %";
          TablaEqBodyTrith[6].innerHTML == "NaN %" ? TablaEqBodyTrith[6].innerHTML = "-" : null
          TablaEqBodyTrith[6].style.backgroundColor = Math.abs(parseFloat(TablaEqBodyTrith[6].innerHTML)) > 30 ? "darkorange" : ""
          TablaEqBodyTrith[7].innerHTML = parseFloat(DBMarcaA[parseFloat(TablaEqBody.getElementsByTagName("tr")[i].id.split("_")[1])]["Precio"]) ? NumberFormatEUR(parseFloat(DBMarcaA[TablaEqBody.getElementsByTagName("tr")[i].id.split("_")[1]]["Precio"]) * DescuentoA) : "-"
          TablaEqBodyTrith[8].innerHTML = parseFloat(DB_B[TablaEqBodyTriSelect[1].value]["Precio"]) ? NumberFormatEUR(parseFloat(DB_B[TablaEqBodyTriSelect[1].value]["Precio"]) * Descuento) : "-"
          Precio_A = TablaEqBodyTrith[7].innerHTML.split("+").length > 1 ? parseFloat(TablaEqBodyTrith[7].innerHTML.replace(".", "")) + parseFloat(TablaEqBodyTrith[7].innerHTML.split("+")[1].replace(".", "")) : parseFloat(TablaEqBodyTrith[7].innerHTML.replace(".", ""))
          TablaEqBodyTrith[9].innerHTML = parseFloat(Precio_A) && parseFloat(TablaEqBodyTrith[8].innerHTML) ? TablaEqBodyTrith[9].innerHTML = ((Precio_A / parseFloat(TablaEqBodyTrith[8].innerHTML.replace(".", "")) - 1) * 100).toFixed(0) + " %" : "-"
        }
      }
    }
  })
}

function ListadoOptimizar() {
  for (i = 0, TablaLen = TablaEqBody.getElementsByTagName("tr").length; i < TablaLen; i++) {
    min = 100000;
    TablaFila = TablaEqBody.getElementsByTagName("tr")[i]
    TablaSelect = TablaFila.getElementsByTagName("select")
    for (head = 0, TablaSelect0length = TablaSelect[0].length; head < TablaSelect0length; head++) {
      TablaSelect[0].selectedIndex = head
      PFHead = TablaSelect[0].getElementsByTagName("option")[head].innerHTML
      for (j = 0, TablaSelect1length = TablaSelect[1].length; j < TablaSelect1length; j++) {
        k = TablaSelect[1].getElementsByTagName("option")[j].value;
        ArrayEq = Interpol(parseFloat(PFHead.split("  ")[0]) + DT, parseFloat(PFHead.split("  ")[1]), DB_B, MarcaBField, k);
        ArrayEqDiff = parseFloat(ArrayEq) / parseFloat(TablaSelect[0].value) - 1;
        ArrayEqDiff < 0 ? ArrayEqDiff = -ArrayEqDiff : null
        if (min > ArrayEqDiff) {
          min = ArrayEqDiff;
          minJ = k;
          minhead = head;
        }
      }
    }
    if (min != 100000) {
      TablaSelect[1].value = minJ;
      TablaSelect[0].selectedIndex = minhead
    }
  }
  MarcaA_CondTrabajo()
  return MarcaB_Equivalencia()
}
function ListadoOptimizarTamb() {
  for (i = 0, TablaLen = TablaEqBody.getElementsByTagName("tr").length; i < TablaLen; i++) {
    min = 100000;
    TablaFila = TablaEqBody.getElementsByTagName("tr")[i]
    TablaSelect = TablaFila.getElementsByTagName("select")
    for (head = 0, TablaSelect0length = TablaSelect[0].length; head < TablaSelect0length; head++) {
      TablaSelect[0].selectedIndex = head
      PFHead = TablaSelect[0].getElementsByTagName("option")[head].innerHTML
      DB_Afilter = DB_A.filter(item => item.Ref == TablaFila.getElementsByTagName("th")[1].innerHTML)

      Tcam = S_Tipo_A.value == "Eq" ? DB_Afilter[0]["Aplicación"] == "HBP" ? 12 : DB_Afilter[0]["Aplicación"] == "MBP" ? 0 : DB_Afilter[0]["Aplicación"] == "LBP" ? -20 : 0
        : S_Tipo_A.value == "Central" ? DB_Afilter[0]["Aplicación"] == "HBP" ? 0 : DB_Afilter[0]["Aplicación"] == "MBP" ? -10 : DB_Afilter[0]["Aplicación"] == "LBP" ? -30 : -10 : 0

      if (Tcam != null && parseFloat(PFHead.split("  ")[1]) == Tcam) {
        if (document.getElementById("Select_Tamb").value == parseFloat(PFHead.split("  ")[0])) {
          for (j = 0, TablaSelect1length = TablaSelect[1].length; j < TablaSelect1length; j++) {
            k = TablaSelect[1].getElementsByTagName("option")[j].value;
            ArrayEq = Interpol(parseFloat(PFHead.split("  ")[0]) + DT, parseFloat(PFHead.split("  ")[1]), DB_B, MarcaBField, k);
            ArrayEqDiff = parseFloat(ArrayEq) / parseFloat(TablaSelect[0].value) - 1;
            ArrayEqDiff < 0 ? ArrayEqDiff = -ArrayEqDiff : null
            if (min > ArrayEqDiff) {
              min = ArrayEqDiff;
              minJ = k;
              minhead = head;
            }
          }
        }
      }
    }
    if (min != 100000) {
      TablaSelect[1].value = minJ;
      TablaSelect[0].selectedIndex = minhead
    }
  }
  MarcaA_CondTrabajo()
  return MarcaB_Equivalencia()
}



function EliminarFila(i) {
  document.getElementById(`Row_${i}`).outerHTML = "";
}

var DT = 0
function Delta_T() {
  document.getElementById("Delta_T").value = parseFloat(document.getElementById("Delta_T").value) ? parseFloat(document.getElementById("Delta_T").value) + " K" : "0 k"
  DT = parseFloat(document.getElementById("Delta_T").value)
}

function RegistroFavorito() {
  document.getElementById("accordion_Marca").innerHTML = ""
  ComparativaFilter = RivaColdComparativa.map((item) => item.Marca2);
  ComparativaDuplicate = ComparativaFilter.filter((item, index) => ComparativaFilter.indexOf(item) === index).sort()
  HTMLComparativa = [], HTMLMarca = []
  for (i in RivaColdComparativa) {
    HTMLMarca[i] = RivaColdComparativa[i]["Marca2"]
    HTMLComparativa[i] = `<tr><th>${RivaColdComparativa[i]["Descripción"]}</th><th>${RivaColdComparativa[i]["Marca1"]}</th><th>${RivaColdComparativa[i]["Gama1"]}</th><th>${RivaColdComparativa[i]["Aplicación1"]}</th><th>${RivaColdComparativa[i]["Refrigerante1"]}</th><th>${RivaColdComparativa[i]["Marca2"]}</th><th>${RivaColdComparativa[i]["Gama2"]}</th><th>${RivaColdComparativa[i]["Aplicación2"]}</th><th>${RivaColdComparativa[i]["Refrigerante2"]}</th><th><button onclick='AplicarFavorito(${i})' data-bs-dismiss='modal'><i class='bi bi-subtract'/></button></th></tr>`
  }
  for (Marca of ComparativaDuplicate) {
    document.getElementById("accordion_Marca").insertAdjacentHTML("beforeend", `<div class="accordion-item"><h2 class="accordion-header" id="heading${Marca}" ><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${Marca}" aria-expanded="false" aria-controls="collapse${Marca}">${Marca}</button></h2><div id="collapse${Marca}" class="accordion-collapse collapse" aria-labelledby="heading${Marca}" data-bs-parent="#accordionExample"><div class="accordion-body"><table class="table"><thead><tr><th>Descripción</th><th>Marca A</th><th>Gama A</th><th>Apl.A</th><th>Refr.A</th><th>Marca B</th><th>Gama B</th><th>Apl.B</th><th>Refr.B</th><th>Aplicar</th></tr></thead><tbody></tbody></table></div></div></div>`)
    for (i in HTMLComparativa) {
      HTMLMarca[i] == Marca ? document.getElementById(`collapse${Marca}`).getElementsByTagName("tbody")[0].insertAdjacentHTML("beforeend", HTMLComparativa[i]) : null
    }
  }
}

function AplicarFavorito(i) {
  DT = parseFloat(RivaColdComparativa[i]["DT"])
  document.getElementById("Delta_T").value = DT + " K"
  document.getElementById("Descuento_A_1").value = RivaColdComparativa[i]["Descuento1_1"] ? parseFloat(RivaColdComparativa[i]["Descuento1_1"]) + " %" : 0 + " %"
  document.getElementById("Descuento_A_2").value = RivaColdComparativa[i]["Descuento1_2"] ? parseFloat(RivaColdComparativa[i]["Descuento1_2"]) + " %" : 0 + " %"
  document.getElementById("Descuento_A_3").value = RivaColdComparativa[i]["Descuento1_3"] ? parseFloat(RivaColdComparativa[i]["Descuento1_3"]) + " %" : 0 + " %"
  document.getElementById("Descuento_B_1").value = RivaColdComparativa[i]["Descuento2_1"] ? parseFloat(RivaColdComparativa[i]["Descuento2_1"]) + " %" : 0 + " %"
  document.getElementById("Descuento_B_2").value = RivaColdComparativa[i]["Descuento2_2"] ? parseFloat(RivaColdComparativa[i]["Descuento2_2"]) + " %" : 0 + " %"
  document.getElementById("Descuento_B_3").value = RivaColdComparativa[i]["Descuento2_3"] ? parseFloat(RivaColdComparativa[i]["Descuento2_3"]) + " %" : 0 + " %"
  S_Tipo_A.value = RivaColdComparativa[i]["Tipo1"]
  SeleccionarTipo("A")
  S_Marca_A.value = RivaColdComparativa[i]["Marca1"]
  SeleccionarGama("A")
  S_Gama_A.value = RivaColdComparativa[i]["Gama1"]
  SeleccionarAplicación("A");
  SeleccionarFreon("A");
  S_Refrigerante_A.value = RivaColdComparativa[i]["Refrigerante1"] ? RivaColdComparativa[i]["Refrigerante1"] : 0
  S_Aplicación_A.value = RivaColdComparativa[i]["Aplicación1"] ? RivaColdComparativa[i]["Aplicación1"] : 0
  S_Tipo_B.value = RivaColdComparativa[i]["Tipo2"]
  SeleccionarTipo("B")
  S_Marca_B.value = RivaColdComparativa[i]["Marca2"]
  SeleccionarGama("B")
  S_Gama_B.value = RivaColdComparativa[i]["Gama2"]
  SeleccionarAplicación("B");
  SeleccionarFreon("B");
  S_Refrigerante_B.value = RivaColdComparativa[i]["Refrigerante2"] ? RivaColdComparativa[i]["Refrigerante2"] : 0
  S_Aplicación_B.value = RivaColdComparativa[i]["Aplicación2"] ? RivaColdComparativa[i]["Aplicación2"] : 0
  return ListadoModelo()
}

function ExchangingSelect() {
  select = document.getElementById("TablaEq").getElementsByTagName("select")
  for (i = 0, ilen = select.length; i < ilen; i++) {
    select[0].outerHTML = select[0].length > 0 ? select[0].getElementsByTagName("option")[select[0].selectedIndex].innerHTML : "No disponible"
  }
}

SeleccionarMarca();
localforage.getItem("RivaColdComparativa").then(function (value) {
  RivaColdComparativa = JSON.parse(JSON.stringify(JSON.parse(value), (key, value) => (value == null) ? '' : value))
  $('#Registro').modal("show")
  RegistroFavorito()
})
