const localforage = require("localforage");

const TablaEvaporador = [
  ["", null, null, null],
  ["Item", null, "input", "++"],
  ["Servicio", null, "input", "Servicio_++"],
  ["Temp Cámara", "ºC", "input", "0 ºC"],
  ["Demanda frigorífica", "W", "input", "1000 W"],
  ["Distancia", "m", "input", "10 m"],
  ["Evaporador", null, "select", null],
  ["Temp Aire", "ºC", "input", "DB"],
  ["Humedad Aire", "%", "input", "DB"],
  ["Caudal Agua", "m3/h", "input", "DB"],
  ["Temp Glicol Entrada", "ºC", "input", "DB"],
  ["Temp Glicol Salida", "ºC", "input", "DB"],
  ["Perdida de Presión", "kPa", "input", "DB"],
  ["Potencia frigorífica", "W", "input", "DB"],
];
const TablaEquipo = [
  ["", null, null, null],
  ["Item", null, "input", "++"],
  ["Servicio", null, "input", "Servicio_++"],
  ["Temp Ambiente", "ºC", "input", "43 ºC"],
  ["Temp Cámara", "ºC", "input", "-20 ºC"],
  ["Demanda frigorífica", "W", "input", "1000 W"],
  ["Distancia", "m", "input", "10 m"],
  ["Equipo", null, "input", null],
  ["Potencia frigorífica", "W", "input", "1000 W"],
  ["Calor a disipar", "W", "input", null],
  ["ΔT", "K", "input", "5 K"],
  ["Caudal Agua", "m3/h", "input", null],
];

var tbodyComp = document
  .getElementById("tabla_componente")
  .getElementsByTagName("tbody")[0];
var tbodyEvap = document
  .getElementById("table_evaporador_glicol")
  .getElementsByTagName("tbody")[0];
var tbodyEquip = document
  .getElementById("table_equipo_glicol")
  .getElementsByTagName("tbody")[0];

function thead(thead_id, Tabla) {
  HTML = "";
  for (i = 0, len = Tabla.length; i < len; i++) {
    HTML += "<th>" + Tabla[i][0] + "</th>";
  }
  document
    .getElementById(thead_id)
    .getElementsByTagName("thead")[0]
    .insertAdjacentHTML("beforeend", "<tr>" + HTML + "</tr>");
}

function formato() {
  cp =
    (parseFloat(document.getElementById("Chiller_%Glicol").value) / 100) *
      2600 +
    (1 - parseFloat(document.getElementById("Chiller_%Glicol").value) / 100) *
      4186;
  if (
    document
      .getElementById("table_evaporador_glicol")
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr").length > 0
  ) {
    document.getElementById("table_evaporador_glicol").style.display = "";
    document.getElementById("table_chiller").style.display = "";
    document.getElementById("tabla_componente").style.display = "";
  } else {
    document.getElementById("table_evaporador_glicol").style.display = "none";
    document.getElementById("tabla_componente").style.display = "none";
  }
  if (
    document
      .getElementById("table_equipo_glicol")
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr").length > 0
  ) {
    document.getElementById("table_equipo_glicol").style.display = "";
    document.getElementById("table_chiller").style.display = "";
  } else {
    document.getElementById("table_equipo_glicol").style.display = "none";
  }
  if (
    document
      .getElementById("table_evaporador_glicol")
      .getElementsByTagName("tbody")[0]
      .getElementsByTagName("tr").length +
      document
        .getElementById("table_equipo_glicol")
        .getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr").length ==
    0
  ) {
    document.getElementById("table_chiller").style.display = "none";
  }
  for (
    i = 0, ilen = tbodyEvap.getElementsByTagName("tr").length;
    i < ilen;
    i++
  ) {
    for (j = 0, jlen = TablaEvaporador.length; j < jlen; j++) {
      th = tbodyEvap.getElementsByTagName("tr")[i].getElementsByTagName("th")[
        j
      ];
      input = th.getElementsByTagName("input")[0];
      inputComp = tbodyComp
        .getElementsByTagName("tr")
        [i].getElementsByTagName("input");
      TablaEvaporador[j][0] == "Servicio"
        ? (inputComp[0].value = input.value)
        : null;
      TablaEvaporador[j][0] == "Evaporador"
        ? (inputComp[1].value =
            DBEvapGlicol[th.getElementsByTagName("select")[0].value]["Ref"])
        : null;
      TablaEvaporador[j][0] == "Evaporador"
        ? (inputComp[2].value =
            DBEvapGlicol[th.getElementsByTagName("select")[0].value][
              "Potencia Desescarche"
            ] + " W")
        : null;
      TablaEvaporador[j][0] == "Evaporador"
        ? (inputComp[3].value =
            DBEvapGlicol[th.getElementsByTagName("select")[0].value][
              "Potencia Ventilador"
            ] + " W")
        : null;
      TablaEvaporador[j][0] == "Evaporador"
        ? (cpdefault = (parseFloat(x) / 100) * 2600 + (1 - x / 100) * 4186)
        : null;
      TablaEvaporador[j][0] == "Caudal Agua"
        ? (input.value =
            ((parseFloat(input.value) * cpdefault) / cp).toFixed(2) + " m3/h")
        : null;
      TablaEvaporador[j][0] == "Caudal Agua"
        ? (inputComp[5].value = parseFloat(input.value) + " m3/h")
        : null;
      TablaEvaporador[j][0] == "Demanda frigorífica"
        ? (Demanda = parseFloat(input.value))
        : null;
      TablaEvaporador[j][0] == "Distancia"
        ? (Distancia = parseFloat(input.value))
        : null;
      TablaEvaporador[j][0] == "Potencia frigorífica"
        ? (Potencia = parseFloat(input.value))
        : null;
      TablaEvaporador[j][0] == "Temp Cámara"
        ? (Tcam = parseFloat(input.value))
        : null;
      TablaEvaporador[j][0] == "Temp Aire"
        ? (Taire = parseFloat(input.value))
        : null;
      TablaEvaporador[j][0] == "Temp Glicol Entrada"
        ? (Tent = parseFloat(input.value))
        : null;
      TablaEvaporador[j][0] == "Temp Glicol Salida"
        ? (Tsal = parseFloat(input.value))
        : null;
    }
    inputComp[4].value =
      parseFloat(inputComp[2].value) < 3000 &&
      parseFloat(inputComp[3].value) < 500
        ? "ECP 202 EXPERT"
        : parseFloat(inputComp[2].value) < 6000 &&
          parseFloat(inputComp[3].value) < 550
        ? "ECP300 EXPERT U VD 6"
        : parseFloat(inputComp[2].value) < 12000 &&
          parseFloat(inputComp[3].value) < 3000
        ? "ECP300 EXPERT U VD 12"
        : "No disponible";
    inputComp[6].value =
      parseFloat(inputComp[5].value) <= 0.275 * 0.75
        ? "AB-QM 10"
        : parseFloat(inputComp[5].value) <= 0.45 * 0.75
        ? "AB-QM 15"
        : parseFloat(inputComp[5].value) <= 0.9 * 0.75
        ? "AB-QM 20"
        : parseFloat(inputComp[5].value) <= 1.7 * 0.75
        ? "AB-QM 25"
        : parseFloat(inputComp[5].value) <= 3.2 * 0.75
        ? "AB-QM 32"
        : parseFloat(inputComp[5].value) <= 7.5 * 0.75
        ? "AB-QM 40"
        : parseFloat(inputComp[5].value) <= 12.5 * 0.75
        ? "AB-QM 50"
        : parseFloat(inputComp[5].value) <= 20 * 0.75
        ? "AB-QM 65"
        : parseFloat(inputComp[5].value) <= 28 * 0.75
        ? "AB-QM 80"
        : parseFloat(inputComp[5].value) <= 38 * 0.75
        ? "AB-QM 100"
        : parseFloat(inputComp[5].value) <= 90 * 0.75
        ? "AB-QM 125"
        : parseFloat(inputComp[5].value) <= 145 * 0.75
        ? "AB-QM 150"
        : parseFloat(inputComp[5].value) <= 200 * 0.75
        ? "AB-QM 200"
        : parseFloat(inputComp[5].value) <= 300 * 0.75
        ? "AB-QM 250"
        : parseFloat(inputComp[5].value) <= 300
        ? "AB-QM 250 (Rango superior!)"
        : "No disponible";
    for (j = 0, lenj = TablaEvaporador.length; j < lenj; j++) {
      input = tbodyEvap
        .getElementsByTagName("tr")
        [i].getElementsByTagName("th")
        [j].getElementsByTagName("input")[0];
      TablaEvaporador[j][0] == "Potencia frigorífica"
        ? (input.style.backgroundColor =
            Demanda * (Distancia * 0.003 + 1) <= Potencia ? "" : "Red")
        : null;
      TablaEvaporador[j][0] == "Temp Cámara"
        ? (input.style.backgroundColor = Tcam > Tent ? "" : "Red")
        : null;
      TablaEvaporador[j][0] == "Temp Aire"
        ? (input.style.backgroundColor = Taire > Tent ? "" : "Red")
        : null;
      TablaEvaporador[j][0] == "Temp Glicol Entrada"
        ? (input.style.backgroundColor = Tent < Tsal ? "" : "Red")
        : null;
      if (TablaEvaporador[j][0] == "Evaporador") {
        select = tbodyEvap
          .getElementsByTagName("tr")
          [i].getElementsByTagName("th")
          [j].getElementsByTagName("select")[0];
        for (
          k = 0, lenselect = select.getElementsByTagName("option").length;
          k < lenselect;
          k++
        ) {
          option = select.getElementsByTagName("option")[k];
          option.style.backgroundColor =
            DBEvapGlicol[option.value]["Potencia frigorífica"] >=
            Demanda * (Distancia * 0.003 + 1)
              ? ""
              : "Red";
          option.style.backgroundColor =
            (DBEvapGlicol[option.value]["Potencia frigorífica"] / Demanda) *
              (Distancia * 0.003 + 1) >
            1
              ? (DBEvapGlicol[option.value]["Potencia frigorífica"] / Demanda) *
                  (Distancia * 0.003 + 1) >
                2
                ? ""
                : "lime"
              : "Red";
          DBEvapGlicol[option.value]["Temp Glicol Entrada"] <= Tcam
            ? null
            : (option.style.backgroundColor = "Red");
        }
      }
      if (TablaEvaporador[j][1]) {
        input.value = parseFloat(input.value) + " " + TablaEvaporador[j][1];
      }
    }
  }
  for (
    i = 0, ilen = tbodyEquip.getElementsByTagName("tr").length;
    i < ilen;
    i++
  ) {
    for (j = 0, jlen = TablaEquipo.length; j < jlen; j++) {
      th = tbodyEquip.getElementsByTagName("tr")[i].getElementsByTagName("th")[
        j
      ];
      input = th.getElementsByTagName("input")[0];
      TablaEquipo[j][0] == "Calor a disipar"
        ? (input.value =
            parseFloat(
              tbodyEquip
                .getElementsByTagName("tr")
                [i].getElementsByTagName("th")
                [j - 1].getElementsByTagName("input")[0].value
            ) *
              1.5 +
            " W")
        : null;
      TablaEquipo[j][0] == "Caudal Agua"
        ? (input.value =
            (
              ((parseFloat(
                tbodyEquip
                  .getElementsByTagName("tr")
                  [i].getElementsByTagName("th")
                  [j - 2].getElementsByTagName("input")[0].value
              ) /
                parseFloat(
                  tbodyEquip
                    .getElementsByTagName("tr")
                    [i].getElementsByTagName("th")
                    [j - 1].getElementsByTagName("input")[0].value
                ) /
                cp) *
                3600) /
              1000
            ).toFixed(2) + " m3/h")
        : null;
      if (TablaEquipo[j][1]) {
        input.value = parseFloat(input.value) + " " + TablaEquipo[j][1];
      }
    }
  }
  document.getElementById("Chiller_Potencia").style.backgroundColor =
    parseFloat(document.getElementById("Chiller_Demanda").value) >
    parseFloat(document.getElementById("Chiller_Potencia").value)
      ? "red"
      : "";
  document.getElementById("Chiller_CaudalUnit").style.backgroundColor =
    parseFloat(
      document.getElementById("Chiller_CaudalUnit").value.split("-")[0]
    ) <= parseFloat(document.getElementById("Chiller_Caudal").value) &&
    parseFloat(document.getElementById("Chiller_Caudal").value) <=
      parseFloat(
        document.getElementById("Chiller_CaudalUnit").value.split("-")[1]
      )
      ? ""
      : "red";
  document.getElementById("Chiller_Simult").style.backgroundColor =
    parseFloat(document.getElementById("Chiller_Simult").value) < 75
      ? "red"
      : "";
}

function addLine(type) {
  tabla =
    type == "evap" ? TablaEvaporador : type == "equip" ? TablaEquipo : null;
  tbody =
    type == "evap"
      ? document
          .getElementById("table_evaporador_glicol")
          .getElementsByTagName("tbody")[0]
      : type == "equip"
      ? document
          .getElementById("table_equipo_glicol")
          .getElementsByTagName("tbody")[0]
      : null;
  trid =
    tbody.getElementsByTagName("tr").length == 0
      ? "tr_" + type + "_0"
      : tbody.getElementsByTagName("tr")[
          tbody.getElementsByTagName("tr").length - 1
        ].id;
  tbody.insertAdjacentHTML(
    "beforeend",
    "<tr id='tr_" +
      type +
      "_" +
      (parseFloat(trid.split("_")[2]) + 1) +
      "'></tr>"
  );
  tr =
    tbody.getElementsByTagName("tr")[
      tbody.getElementsByTagName("tr").length - 1
    ];
  for (i = 0, ilen = tabla.length; i < ilen; i++) {
    tr.insertAdjacentHTML("beforeend", "<th></th>");
    if (i == 0) {
      tr.getElementsByTagName("th")[i].insertAdjacentHTML(
        "beforeend",
        "<button onclick='deteleRow(" +
          (parseFloat(trid.split("_")[2]) + 1) +
          ",0)'><i class='bi bi-backspace-reverse'/></button>"
      );
    } else if (tabla[i][2] == "input") {
      tr.getElementsByTagName("th")[i].insertAdjacentHTML(
        "beforeend",
        "<input>"
      );
      tabla[i][3]
        ? (tr
            .getElementsByTagName("th")
            [i].getElementsByTagName("input")[0].value = tabla[i][3])
        : null;
      tabla[i][3] == "++"
        ? (tr
            .getElementsByTagName("th")
            [i].getElementsByTagName("input")[0].value =
            tbodyEvap.getElementsByTagName("tr").length +
            tbodyEquip.getElementsByTagName("tr").length)
        : null;
      tabla[i][3] && tabla[i][3].split("_")[1] == "++"
        ? (tr
            .getElementsByTagName("th")
            [i].getElementsByTagName("input")[0].value =
            tabla[i][3].split("_")[0] +
            " " +
            (tbodyEvap.getElementsByTagName("tr").length +
              tbodyEquip.getElementsByTagName("tr").length))
        : null;
    } else if (tabla[i][2] == "select") {
      if (tabla[i][0] == "Evaporador") {
        tr.getElementsByTagName("th")[i].insertAdjacentHTML(
          "beforeend",
          "<select onchange='SelectEvaporador()'></select>"
        );
        for (j = 0, EvapLen = DBEvapGlicol.length; j < EvapLen; j++) {
          Opcion = document.createElement("option");
          Opcion.text = DBEvapGlicol[j]["Ref"];
          Opcion.value = j;
          tr.getElementsByTagName("th")
            [i].getElementsByTagName("select")[0]
            .add(Opcion);
        }
      } else {
        tr.getElementsByTagName("th")[i].insertAdjacentHTML(
          "beforeend",
          "<select></select>"
        );
      }
    }
  }
  type == "evap"
    ? tbodyComp.insertAdjacentHTML(
        "beforeend",
        "<tr id='tr_comp_" +
          (parseFloat(trid.split("_")[2]) + 1) +
          "'><th><input/></th><th><input/></th><th><input/></th><th><input/></th><th><input></th><th><input></th><th><input></th></tr>"
      )
    : null;
  type == "evap" ? SelectEvaporador() : null;
  formato();
  SelectChiller();
  formato();
}

function SelectEvaporador() {
  tr = tbodyEvap.getElementsByTagName("tr");
  for (i = 0, tablelen = tr.length; i < tablelen; i++) {
    j = tr[i].getElementsByTagName("select")[0].value;
    for (k = 0, evaplen = TablaEvaporador.length; k < evaplen; k++) {
      if (TablaEvaporador[k][3] == "DB" && TablaEvaporador[k][2] == "input") {
        tr[i]
          .getElementsByTagName("th")
          [k].getElementsByTagName("input")[0].value =
          DBEvapGlicol[j][TablaEvaporador[k][0]];
      }
    }
  }
}

function SelectChiller() {
  Demanda = 0;
  Caudal = 0;
  for (
    i = 0, ilen = tbodyEvap.getElementsByTagName("tr").length;
    i < ilen;
    i++
  ) {
    for (j = 0, jlen = TablaEvaporador.length; j < jlen; j++) {
      input = tbodyEvap
        .getElementsByTagName("tr")
        [i].getElementsByTagName("th")
        [j].getElementsByTagName("input")[0];
      TablaEvaporador[j][0] == "Potencia frigorífica"
        ? (Demanda += parseFloat(input.value))
        : null;
      TablaEvaporador[j][0] == "Caudal Agua"
        ? (Caudal += parseFloat(input.value))
        : null;
    }
  }
  for (
    i = 0, len = tbodyEquip.getElementsByTagName("tr").length;
    i < len;
    i++
  ) {
    for (j = 0, lenj = TablaEquipo.length; j < lenj; j++) {
      input = tbodyEquip
        .getElementsByTagName("tr")
        [i].getElementsByTagName("th")
        [j].getElementsByTagName("input")[0];
      TablaEquipo[j][0] == "Calor a disipar"
        ? (Demanda += parseFloat(input.value))
        : null;
      TablaEquipo[j][0] == "Caudal Agua"
        ? (Caudal += parseFloat(input.value))
        : null;
    }
  }
  document.getElementById("Chiller_Demanda").value =
    Demanda.toFixed(0) + " " + "W";
  document.getElementById("Chiller_Caudal").value =
    Caudal.toFixed(2) + " " + "m3/h";
  document.getElementById("Chiller_Potencia").value =
    document.getElementById("Chiller_nModelo").value *
      document.getElementById("Chiller_Modelo").value +
    " W";
  document.getElementById("Chiller_Simult").value =
    (
      (parseFloat(document.getElementById("Chiller_Potencia").value) /
        parseFloat(document.getElementById("Chiller_Demanda").value)) *
      100
    ).toFixed(2) + " %";
  document.getElementById("Chiller_CaudalUnit").value =
    document.getElementById("Chiller_Bomba").value.split("-")[0] +
    " - " +
    document.getElementById("Chiller_Bomba").value.split("-")[1] +
    " m3/h";
  document.getElementById("Chiller_%Glicol").value =
    parseFloat(document.getElementById("Chiller_%Glicol").value) + " %";
}

function deteleRow(id, method) {
  if (method == 0) {
    document.getElementById("tr_evap_" + id).outerHTML = "";
    document.getElementById("tr_comp_" + id).outerHTML = "";
    SelectEvaporador();
  } else if (method == 1) {
    document.getElementById("tr_equip_" + id).outerHTML = "";
  }
  SelectChiller();
  formato();
}

function ClearProyect() {
  clearHTML("RivaColdCentralChiller");
  location.reload();
}

localforage
  .getItem("RivaColdEvapGlicol", function (err, value) {
    DBEvapGlicol = JSON.parse(value);
  })
  .then(
    thead("table_evaporador_glicol", TablaEvaporador),
    thead("table_equipo_glicol", TablaEquipo),
    writeHTML("saveZone", "RivaColdCentralChiller"),
    (tbodyComp = document
      .getElementById("tabla_componente")
      .getElementsByTagName("tbody")[0]),
    (tbodyEvap = document
      .getElementById("table_evaporador_glicol")
      .getElementsByTagName("tbody")[0]),
    (tbodyEquip = document
      .getElementById("table_equipo_glicol")
      .getElementsByTagName("tbody")[0])
  );
