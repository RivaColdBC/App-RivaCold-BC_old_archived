const ArrayDB = [
  "RivaColdEq",
  "RivaColdEvap",
  "RivaColdCond",
  "RivaColdCentral",
];
const ArrayRivaCold = [
  "RivaColdEq",
  "RivaColdEvap",
  "RivaColdCond",
  "RivaColdCentral",
  "RivaColdOPT",
  "RivaColdTarifa0000",
];
const ArrayCliente = ["RivaColdCliente"];
var DBSearch;

function Busqueda2(idsearch, idresult) {
  const Didresult = document.getElementById(idresult);
  sp = document.getElementById(idsearch).value;
  if (sp) {
    RegLocal1 = [];
    RegLocal2 = [];
    Didresult.innerHTML = "";
    return localforage.getItem(
      "RivaCold" + document.getElementById("list_type").value,
      function (err, value) {
        DBFilter = JSON.parse(value).sort(function (a) {
          if (a.Vol) {
            return -1;
          } else {
            return +1;
          }
        });
        for (j = 0; j < DBFilter.length; j++) {
          if (
            (
              DBFilter[j]["Ref2"] +
              DBFilter[j]["Ref"] +
              DBFilter[j]["Descripción"] +
              DBFilter[j]["RefAux"]
            )
              .toUpperCase()
              .indexOf(sp.toUpperCase()) > -1
          ) {
            option_modelo = document.createElement("option");
            option_modelo.text = DBFilter[j]["Ref"];
            if (list_type.value === "Tarifa0000") {
              option_modelo.value =
                DBFilter[j]["Ref"] +
                "_AA_" +
                DBFilter[j]["Descripción"] +
                "_AA_" +
                parseFloat(DBFilter[j]["Precio Venta"]);
            } else {
              option_modelo.value =
                DBFilter[j]["Ref"] +
                "_AA_" +
                DBFilter[j]["Descripción"] +
                "_AA_" +
                parseFloat(DBFilter[j]["Precio"]);
            }
            Didresult.add(option_modelo);
          }
        }
      }
    );
  }
}

function Busqueda3(idsearch, idresult) {
  RegLocal = [];
  i = 0;
  document.getElementById(idresult).innerHTML = "";
  sp = document.getElementById(idsearch).value.split(" ");
  return localforage.getItem(ArrayCliente[0], function (err, value) {
    DBSearch = JSON.parse(value).sort();
    for (j in DBSearch) {
      check = true;
      for (item of sp) {
        if (
          (
            DBSearch[j]["Cliente"] +
            DBSearch[j]["C#I#F#"] +
            DBSearch[j]["Nombre"] +
            DBSearch[j]["Razón Social"] +
            parseFloat(DBSearch[j]["Teléfono"])
          )
            .toUpperCase()
            .indexOf(item.toUpperCase()) == -1
        ) {
          check = false;
        }
      }
      if (check) {
        const list_modelo = document.getElementById(idresult);
        option_modelo = document.createElement("option");
        option_modelo.text = DBSearch[j]["Razón Social"];
        list_modelo.add(option_modelo);
        RegLocal[i] = j;
        i += 1;
      }
    }
    sessionStorage.setItem("SearchRegister3", JSON.stringify(RegLocal));
  });
}
function Seleccionar2(idresult) {
  document.getElementById("RefModelo").value = document
    .getElementById(idresult)
    .value.split("_AA_")[0];
  document.getElementById("textoModelo").value = document
    .getElementById(idresult)
    .value.split("_AA_")[1];
  document.getElementById("Precio").value = document
    .getElementById(idresult)
    .value.split("_AA_")[2];
}

function Seleccionar3(idresult) {
  return localforage.getItem(ArrayCliente[0], function (err, value) {
    DBSearch = JSON.parse(value).sort();
    Register = JSON.parse(sessionStorage.getItem("SearchRegister3"));
    i = document.getElementById(idresult).selectedIndex;
    j = Register[i];
    document.getElementById("DatosCliente").innerHTML =
      "Numero de cliente: " +
      DBSearch[j]["Cliente"] +
      "\nC.I.F.: " +
      DBSearch[j]["C#I#F#"] +
      "\nRazón Social: " +
      DBSearch[j]["Razón Social"] +
      "\nDirección: " +
      DBSearch[j]["Dirección"] +
      "\nC.P: " +
      DBSearch[j]["C#P"] +
      "\nPoblación: " +
      DBSearch[j]["Población"] +
      "\nProvincia: " +
      DBSearch[j]["Provincia"] +
      "\nTeléfono: " +
      (DBSearch[j]["Teléfono"] || "")
        .toString()
        .replace(/\W/gi, "")
        .replace(/(.{3})/g, "$1 ") +
      "\nFax: " +
      (DBSearch[j]["fax_telc"] || "")
        .toString()
        .replace(/\W/gi, "")
        .replace(/(.{3})/g, "$1 ") +
      "\nCorreo: " +
      DBSearch[j]["ema_telc"] +
      "\nPara: " +
      DBSearch[j]["nom_telc"] +
      "\nPaís: " +
      DBSearch[j]["Pais"] +
      "\nForma de Pago: " +
      DBSearch[j]["nom_fpg"] +
      "\nObservación: " +
      DBSearch[j]["Observaciones"];
    document.getElementById("DatosCliente").rows = 0;
    document.getElementById("DatosCliente").rows = parseFloat(
      document.getElementById("DatosCliente").scrollHeight / 24
    ).toFixed(0);
  });
}

function Aplicar2(idresult) {
  return localforage.getItem(ArrayCliente[0], function (err, value) {
    DBSearch = JSON.parse(value).sort();
    Register = JSON.parse(sessionStorage.getItem("SearchRegister3"));
    i = document.getElementById(idresult).selectedIndex;
    j = Register[i];
    document.getElementById("Oferta_NCliente").value = (
      "00000" + parseFloat(DBSearch[j]["Cliente"])
    ).slice(-5);
    document.getElementById("Oferta_CIF").value = DBSearch[j]["C#I#F#"];
    document.getElementById("Oferta_RazónSocial").value =
      DBSearch[j]["Razón Social"].toUpperCase();
    document.getElementById("Oferta_Dirección").value =
      DBSearch[j]["Dirección"].toUpperCase();
    document.getElementById("Oferta_CP").value =
      DBSearch[j]["C#P"] + " - " + DBSearch[j]["Población"].toUpperCase();
    document.getElementById("Oferta_Pais").value =
      DBSearch[j]["Provincia"].toUpperCase() +
      " - " +
      DBSearch[j]["Pais"].toUpperCase();
    document.getElementById("Oferta_Telf").value = (
      DBSearch[j]["Teléfono"] || ""
    )
      .toString()
      .replace(/\W/gi, "")
      .replace(/(.{3})/g, "$1 ")
      .trim();
    document.getElementById("Oferta_Tel2").value = (
      DBSearch[j]["Teléfono"] || ""
    )
      .toString()
      .replace(/\W/gi, "")
      .replace(/(.{3})/g, "$1 ")
      .trim();
    document.getElementById("Oferta_Fax").value = (
      DBSearch[j]["fax_telc"] || ""
    )
      .toString()
      .replace(/\W/gi, "")
      .replace(/(.{3})/g, "$1 ")
      .trim();
    document.getElementById("Oferta_Fax2").value = (
      DBSearch[j]["fax_telc"] || ""
    )
      .toString()
      .replace(/\W/gi, "")
      .replace(/(.{3})/g, "$1 ")
      .trim();
    document.getElementById("Oferta_Email").value = DBSearch[j]["ema_telc"];
    document.getElementById("Oferta_Solicitante").value = (
      DBSearch[j]["nom_telc"] || ""
    )
      .toString()
      .trim();
    document.getElementById("Oferta_Portes").value = DBSearch[j]["des_coe"];
    document.getElementById("Oferta_Dir1").value = DBSearch[j]["nom_cen1"];
    document.getElementById("Oferta_Dir2").value = DBSearch[j]["dir_cen1"];
    document.getElementById("Oferta_FormaPago").value = DBSearch[j]["nom_fpg"];
    if (DBSearch[j]["Pais"].toUpperCase() === "ES") {
      document.getElementById("IVA").value = "21 %";
    } else {
      document.getElementById("IVA").value = "0 %";
      Display_Impuesto();
    }
    GuardarDatos();
  });
}

function AppereSearch() {
  if (document.getElementById("ModalBuscador").style.display == "none") {
    document.getElementById("ModalBuscador").style.display = "";
    document.getElementById("ModalOpcion").style.display = "none";
  } else {
    document.getElementById("ModalBuscador").style.display = "none";
    document.getElementById("ModalOpcion").style.display = "";
  }
}
