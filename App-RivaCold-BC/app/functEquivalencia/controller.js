const List_MarcaA = document.getElementById("List_MarcaA");
const List_MarcaB = document.getElementById("List_MarcaB");
const List_Type = document.getElementById("List_Type");
const List_Gama = document.getElementById("List_Gama");
const List_Modelo = document.getElementById("List_Modelo");
const List_Equiv = document.getElementById("List_Equiv");
var DB, ConfiguracionArray
const localforage = require("localforage");

function SeleccionarMarca() {
  return localforage.getItem(`RivaCold${List_Type.value}`).then(function (value) {
    DB = JSON.parse(value).filter(item => item.Marca != null).sort(function (a) { if (a.Volumen) { return -1; } else return +1 })
    List_MarcaA.innerHTML = "";
    List_MarcaB.innerHTML = "";
    DBFilter = DB.map((item) => item.Marca);
    DBDuplicate = DBFilter.filter((item, index) => DBFilter.indexOf(item) == index);
    for (Marca of DBDuplicate) {
      OpcionA = document.createElement("option");
      OpcionA.text = Marca;
      OpcionA.value = Marca;
      List_MarcaA.add(OpcionA);
      OpcionB = document.createElement("option");
      OpcionB.text = Marca;
      OpcionB.value = Marca;
      List_MarcaB.add(OpcionB);
    }
    document.getElementById("RangoPos").value = "+20%";
    document.getElementById("RangoNeg").value = "-10%";
    Table();
    SeleccionarProveedor();
  })
}

function Table() {
  text1 = document.getElementById("tabla_text1")
  text2 = document.getElementById("tabla_text2")
  if (List_Type.value == "Eq") {
    text1.innerText = "Temperatura Ambiente";
    text2.innerText = "Temperatura de Cámara";
  } else if (List_Type.value == "Evap") {
    text1.innerText = "Salto Térmico ΔT";
    text2.innerText = "Temperatura de Cámara";
  } else if (List_Type.value == "Cond") {
    text1.innerText = "Salto Térmico ΔT";
    text2.innerText = "Temperatura Ambiente";
  } else if (List_Type.value == "Central") {
    text1.innerText = "Temperatura Ambiente";
    text2.innerText = "Temperatura de Evaporación";
  }
}

function SeleccionarProveedor() {
  List_Gama.innerHTML = "";
  DBFilter = DB.filter((item) => item.Marca == List_MarcaA.value).map((item) => item.Gama);
  DBDuplicate = DBFilter.filter((item, index) => DBFilter.indexOf(item) == index).sort();
  for (Gama of DBDuplicate) {
    Opcion = document.createElement("option");
    Opcion.text = Gama;
    Opcion.value = Gama;
    List_Gama.add(Opcion);
  }
  SeleccionarGama();
}

function SeleccionarGama() {
  List_Modelo.innerHTML = "";
  DBFilter = DB.filter((item) => item.Marca == List_MarcaA.value).filter((item) => item.Gama == List_Gama.value).map((item) => item.Ref);
  DBDuplicate = DBFilter.filter((item, index) => DBFilter.indexOf(item) == index).sort();
  for (Modelo of DBDuplicate) {
    Opcion = document.createElement("option");
    Opcion.text = Modelo;
    Opcion.value = Modelo;
    List_Modelo.add(Opcion);
  }
  TextoConfiguracion()
  SeleccionarModelo();
}

function TextoConfiguracion() {
  DBFilterA = DB.filter(item => item.Ref == List_Modelo.value)
  ConfiguracionTexto = ""
  ConfiguracionArray = {
    "buttonConfig1": false,
    "buttonConfig2": false,
    "buttonConfig3": false,
    "buttonConfig4": false,
    "buttonConfig5": false,
    "buttonConfig6": false,
    "buttonConfig7": false,
    "buttonConfig8": false,
    "buttonConfig9": false,
    "buttonConfig10": false,
    "buttonVentilador": false,
    "buttonAplicacion": false
  }
  for (j = 1; j < 10; j++) {
    Object.getOwnPropertyNames(DBFilterA[0]).includes(`Config${j}`) ? DBFilterA[0][`Config${j}`] ?
      ConfiguracionTexto = `${ConfiguracionTexto}<tr id='buttonConfig${j}'><th>${DBFilterA[0][`Config${j}`]}</th><th><button onclick='DisableConfig(buttonConfig${j})'><i class='bi bi-backspace'></i></button></th></tr>` : ConfiguracionArray[`buttonConfig${j}`] = true : ConfiguracionArray[`buttonConfig${j}`] = true;
  }
  DBFilterA[0]["Aplicación"] ? ConfiguracionTexto += `<tr id='buttonAplicacion'><th>Aplicación: ${DBFilterA[0]["Aplicación"]}</th><th><button onclick='DisableConfig(buttonAplicacion)'><i class='bi bi-backspace'></i></button></th></tr>` : ConfiguracionArray["buttonAplicacion"] = true
  ConfiguracionTexto += DBFilterA[0]["Refrigerante"] ? `<tr><th>Refrigerante: ${DBFilterA[0]["Refrigerante"]}</th><th></th></tr>` : ""
  ConfiguracionTexto += DBFilterA[0]["Ficha producto_Expansión"] ? `<tr><th>Expansión: ${DBFilterA[0]["Ficha producto_Expansión"]}</th><th></th></tr>` : ""
  ConfiguracionTexto += DBFilterA[0]["Desescarche_Tipo"] ? `<tr><th>Desescarche: ${DBFilterA[0]["Desescarche_Tipo"]}</th><th></th></tr>` : ""
  DBFilterA[0]["Motoventilador_Número de ventilador"] ? ConfiguracionTexto += `<tr><th>Núm de ventilador: ${DBFilterA[0]["Motoventilador_Número de ventilador"]}</th><th><button onclick='DisableConfig(buttonVentilador)'><i class='bi bi-backspace'></i></button></th></tr>` : ConfiguracionArray["buttonVentilador"] = true
  document.getElementById("Table_Type_Body").innerHTML = ConfiguracionTexto

}
function SeleccionarModelo() {
  List_Equiv.innerHTML = "";
  DBFilterA = DB.filter(item => item.Ref == List_Modelo.value)
  MarcaAField = Object.getOwnPropertyNames(DBFilterA[0]).sort().reverse();
  DBFilterB = DB.filter(item => item.Marca == List_MarcaB.value)
  MarcaBField = Object.getOwnPropertyNames(DBFilterB[0]).sort().reverse();
  PDiffStorage = 999999, PRefStorage = "", NDiffStorage = -999999, NRefStorage = ""
  for (j in DBFilterB) {
    if (ConfiguracionArray["buttonConfig1"] ||
      DBFilterA[0]["Config1"] == DBFilterB[j]["Config1"] ||
      (!DBFilterB[j]["Config1"] && !DBFilterA[0]["Config1"])) {
      if (ConfiguracionArray["buttonConfig2"] ||
        DBFilterA[0]["Config2"] == DBFilterB[j]["Config2"] ||
        (!DBFilterB[j]["Config2"] && !DBFilterA[0]["Config2"])) {
        if (ConfiguracionArray["buttonConfig3"] ||
          DBFilterA[0]["Config3"] == DBFilterB[j]["Config3"] ||
          (!DBFilterB[j]["Config3"] && !DBFilterA[0]["Config3"])) {
          if (ConfiguracionArray["buttonConfig6"] ||
            (DBFilterA[0]["Config6"] == "Centrifugo" && DBFilterB[j]["Centrifugo"]) ||
            DBFilterA[0]["Config6"] == DBFilterB[j]["Config6"] ||
            DBFilterA[0]["Config6"] != "Centrifugo") {
            if (ConfiguracionArray["buttonAplicacion"] ||
              DBFilterA[0]["Aplicación"] == DBFilterB[j]["Aplicación"] ||
              (!DBFilterB[j]["Aplicación"] && !DBFilterA[0]["Aplicación"]) ||
              (DBFilterA[0]["Aplicación"] == "Dual" && (DBFilterB[j]["Aplicación"] == "MBP" ||
                DBFilterB[j]["Aplicación"] == "LBP")) ||
              (DBFilterB[j]["Aplicación"] == "Dual" && (DBFilterA[0]["Aplicación"] == "MBP" ||
                DBFilterA[0]["Aplicación"] == "LBP"))) {
              if (ConfiguracionArray["buttonVentilador"] ||
                DBFilterA[0]["Motoventilador_Número de ventilador"] == DBFilterB[j]["Motoventilador_Número de ventilador"] ||
                !DBFilterB[j]["Motoventilador_Número de ventilador"] || !DBFilterA[0]["Motoventilador_Número de ventilador"]) {
                Diff = ListadoEquivalencia(DBFilterA[0], DBFilterB, MarcaAField, MarcaBField, j);
                if (parseFloat(Diff) >= 0) {
                  if (parseFloat(Diff) <= PDiffStorage) {
                    PDiffStorage = parseFloat(Diff)
                    PRefStorage = DBFilterB[j]["Ref"]
                    PStockStorage = DBFilterB[j]["Ficha producto_Stock disponible"] == "Si" ? true : false;
                  }
                } else {
                  if (parseFloat(Diff) >= NDiffStorage) {
                    NDiffStorage = parseFloat(Diff)
                    NRefStorage = DBFilterB[j]["Ref"]
                    NStockStorage = DBFilterB[j]["Ficha producto_Stock disponible"] == "Si" ? true : false;
                  }
                }
                if (parseFloat(document.getElementById("RangoNeg").value) <= parseFloat(Diff) && parseFloat(document.getElementById("RangoPos").value) >= parseFloat(Diff)) {
                  option_modelo = document.createElement("option");
                  DBFilterB[j]["Ficha producto_Stock disponible"] == "Si" ? option_modelo.style.backgroundColor = "lime" : null
                  option_modelo.text = DBFilterB[j]["Ref"] + " " + Diff;
                  List_Equiv.add(option_modelo);
                }
              }
            }
          }
        }
      }
    }
  }
  if (List_Equiv.length == 0) {
    if (PRefStorage) {
      PStockStorage ? option_modelo.style.backgroundColor = "lime" : null
      option_modelo = document.createElement("option");
      option_modelo.text = PRefStorage + " " + PDiffStorage + "%";
      List_Equiv.add(option_modelo);
    }
    if (NRefStorage) {
      NStockStorage ? option_modelo.style.backgroundColor = "lime" : null
      option_modelo = document.createElement("option");
      option_modelo.text = NRefStorage + " " + NDiffStorage + "%";
      List_Equiv.add(option_modelo);
    }
  } else if (List_Equiv.length > 8) {
    List_Equiv.size = 8;
    List_Equiv.size = List_Equiv.length;
  }
  if (List_Equiv.length > 1) {
    Ordenar = []
    for (i = 0, len = List_Equiv.length; i < len; i++) {
      Ordenar[i] = []
      Ordenar[i]["Diff"] = parseFloat(List_Equiv[i].text.split(" ")[1])
      Ordenar[i]["text"] = List_Equiv[i].text
      Ordenar[i]["color"] = List_Equiv[i].style.backgroundColor
    }
    Ordenar.sort(function (a, b) { if (a.Diff > b.Diff) { return -1; } })
    for (i = 0, len = List_Equiv.length; i < len; i++) {
      List_Equiv[i].text = Ordenar[i]["text"]
      List_Equiv[i].style.backgroundColor = Ordenar[i]["color"]
    }
  }
  List_Equiv.selectedIndex = 0;
  DatosEquivalencia();
}

function ListadoEquivalencia(DBFilterA, DBFilterB, MarcaAField, MarcaBField, j) {
  PFEq1 = 0; PFEq2 = 0; PFEq3 = 0;
  PFModelo1 = 0; PFModelo2 = 0; PFModelo3 = 0;
  for (MarcaFielditem of MarcaAField) {
    if (MarcaFielditem.startsWith("PC_") && DBFilterA[MarcaFielditem]) {
      Interp = Interpol(
        parseFloat(MarcaFielditem.split("_")[1]) + parseFloat(document.getElementById("Delta_T").value),
        parseFloat(MarcaFielditem.split("_")[2]),
        DBFilterB,
        MarcaBField,
        j);
      if (parseFloat(Interp) > 0) {
        if (Interp.split(" ").length == 2) {
          PFEq1 = PFEq1 + parseFloat(Interp)
          PFModelo1 = PFModelo1 + parseFloat(DBFilterA[MarcaFielditem])
        } else if (Interp.split(" ")[2] == "(*)") {
          PFEq2 = PFEq2 + parseFloat(Interp)
          PFModelo2 = PFModelo2 + parseFloat(DBFilterA[MarcaFielditem])
        } else {
          PFEq3 = PFEq3 + parseFloat(Interp)
          PFModelo3 = PFModelo3 + parseFloat(DBFilterA[MarcaFielditem])
        }
      }
    }
  }
  if (PFEq1 / PFModelo1) { return ((PFEq1 / PFModelo1 - 1) * 100).toFixed(2) + "%"; }
  else if (PFEq2 / PFModelo2) { return ((PFEq2 / PFModelo2 - 1) * 100).toFixed(2) + "%"; }
  else { return ((PFEq3 / PFModelo3 - 1) * 100).toFixed(2) + "%"; }
}

const Tabla_PF_tbody = document.getElementById("Table_PF").getElementsByTagName("tbody")
const Tabla_Price_tbody = document.getElementById("Table_Price").getElementsByTagName("tbody")
function DatosEquivalencia() {
  Tabla_PF_tbody[0].innerHTML = ""
  Tabla_Price_tbody[0].innerHTML = ""
  DBFilterA = DB.filter(item => item.Ref == List_Modelo.value)
  MarcaAField = Object.getOwnPropertyNames(DBFilterA[0]).sort(function (a, b) {
    if (a.split("_")[0] == "PC") {
      if (parseFloat(a.split("_")[1] > parseFloat(b.split("_")[1]))) {
        return -1;
      }
      else if (parseFloat(a.split("_")[1] == parseFloat(b.split("_")[1]))) {
        if (parseFloat(a.split("_")[2] <= parseFloat(b.split("_")[2]))) { return -1; }
        else { return 1; }
      }
      else {
        return 1;
      }
    } else { return -1; }
  })
  DBFilterB = DB.filter(item => item.Ref == List_Equiv.value.split(" ")[0])
  if (DBFilterB.length) {
    MarcaBField = Object.getOwnPropertyNames(DBFilterB[0]).sort().reverse();
    MarcaAPrecio = DBFilterA[0]["Precio"] ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(DBFilterA[0]["Precio"])) : "No disponible";
    MarcaBPrecio = DBFilterB[0]["Precio"] ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(DBFilterB[0]["Precio"])) : "No disponible";
    Tabla_Price_tbody[0].insertRow().innerHTML = "<th scope='row'>" + MarcaAPrecio + "</th><td>" + MarcaBPrecio + "</td>";
    for (k = 0, MarcaAFieldlength = MarcaAField.length; k < MarcaAFieldlength; k++) {
      if (MarcaAField[k].startsWith("PC_") && DBFilterA[0][MarcaAField[k]]) {
        PFModelo = parseFloat(DBFilterA[0][MarcaAField[k]]).toFixed(0) + " W";
        Tamb = parseFloat(MarcaAField[k].split("_")[1]);
        Tcamara = parseFloat(MarcaAField[k].split("_")[2]);
        PFEq = Interpol(Tamb + parseFloat(document.getElementById("Delta_T").value), Tcamara, DBFilterB, MarcaBField, 0);
        Tamb = MarcaAField[k].split("_")[1];
        Tcamara = MarcaAField[k].split("_")[2];
        Diff = ((parseFloat(PFEq) / parseFloat(PFModelo) - 1) * 100).toFixed(2) + " %";
        (PFEq != "-" && Tamb != "25°C" && Tamb != "20°C") || document.getElementById("BotonMostrarPF").checked ? document.getElementById("Table_PF").getElementsByTagName("tbody")[0].insertRow().innerHTML = "<th>" + Tamb + "</th><th>" + Tcamara + "</th><th>" + PFModelo + "</th><th>" + PFEq + "</th><th>" + Diff + "</th>" : null;
      }
    }
  }
  ArrayTable = []
  Tabla_PF_tbody_tr = Tabla_PF_tbody[0].getElementsByTagName("tr")
  for (i = 0, len = Tabla_PF_tbody_tr.length; i < len; i++) {
    ArrayTable[i] = []
    ArrayTable[i]["Tamb"] = Tabla_PF_tbody_tr[i].getElementsByTagName("th")[0].textContent
    ArrayTable[i]["Tcamara"] = Tabla_PF_tbody_tr[i].getElementsByTagName("th")[1].textContent
    ArrayTable[i]["HTML"] = Tabla_PF_tbody_tr[i].innerHTML
  }
  ArrayTable.sort(function (a, b) { if (a.Tamb > b.Tamb) { return -1 } else if (a.Tamb == b.Tamb) { if (+a.Tcamara > +b.Tcamara) { return 1 } else { return -1 } } else { return 1 } })

  for (i = 0, len = Tabla_PF_tbody_tr.length; i < len; i++) {
    Tabla_PF_tbody_tr[i].innerHTML = ArrayTable[i]["HTML"]
  }
}


function RangoEq(Direccion, Rango) {
  ValueRango = parseFloat(document.getElementById(Rango).value);
  Simbolo = ValueRango + Direccion > 0 ? "+" : null;
  document.getElementById(Rango).value = Simbolo + parseFloat(ValueRango + Direccion) + "%";
  SeleccionarModelo();
}

function Delta_T() {
  document.getElementById("Delta_T").value = parseFloat(document.getElementById("Delta_T").value) ? parseFloat(document.getElementById("Delta_T").value) + " K" : "0 K"

}
function DisableConfig(id) {
  document.getElementById(id.id).outerHTML = ""
  ConfiguracionArray[id.id] = true

  SeleccionarModelo()
}

SeleccionarMarca();