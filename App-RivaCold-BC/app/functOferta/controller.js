var RivaColdDB;
var Table = JSON.parse(localStorage.getItem("TableOferta"));
var Reference = JSON.parse(localStorage.getItem("TextoModelo"));
var Cabecera = JSON.parse(localStorage.getItem("DatosOferta"));

const list_gama = document.getElementById("list_Gama");
const list_type = document.getElementById("list_type");
const list_modelo = document.getElementById("list_modelo");

function Display_Tabla(Table, j) {
  dTable = document.getElementById(Table);
  len = dTable.getElementsByTagName("textarea").length;
  if (dTable.getElementsByTagName("th")[j].style.display == "none") {
    dTable.getElementsByTagName("th")[j].style.display = "";
    for (k = 0; k < len; k++) {
      dTable.getElementsByTagName("td")[j + 7 * k].style.display = "";
    }
  } else {
    dTable.getElementsByTagName("th")[j].style.display = "none";
    for (k = 0; k < len; k++) {
      dTable.getElementsByTagName("td")[j + 7 * k].style.display = "none";
    }
  }
}

Display_DescuentoPP();
function Display_DescuentoPP() {
  document.getElementById("DescuentoPPC").style.display =
    document.getElementById("DescuentoPPC").style.display == "none"
      ? ""
      : "none";
  document.getElementById("tdDescuentoPP").style.display =
    document.getElementById("tdDescuentoPP").style.display == "none"
      ? ""
      : "none";
}
function Display_Portes() {
  document.getElementById("Coste_Portes").style.display =
    document.getElementById("Coste_Portes").style.display == "none"
      ? ""
      : "none";
  document.getElementById("label_Portes").style.display =
    document.getElementById("label_Portes").style.display == "none"
      ? ""
      : "none";
}

function Display_Impuesto(Display) {
  function DTrue() {
    document.getElementById("Table_Impuesto").style.display = "";
    document.getElementById("PrecioTotalIva").style.display = "";
    document.getElementById("LineaDivisionImpuesto").style.visibility = "";
    document.getElementById("button_DescuentoPP").style.display = "";
    document.getElementById("button_IGIC").style.display = "";
  }
  function Dfalse() {
    document.getElementById("Table_Impuesto").style.display = "none";
    document.getElementById("PrecioTotalIva").style.display = "none";
    document.getElementById("LineaDivisionImpuesto").style.visibility =
      "hidden";
    document.getElementById("button_DescuentoPP").style.display = "none";
    document.getElementById("button_IGIC").style.display = "none";
  }
  if (Display == 0) {
    DTrue();
  } else if (Display == 1) {
    Dfalse();
  } else {
    if (document.getElementById("Table_Impuesto").style.display == "none") {
      DTrue();
    } else {
      Dfalse();
    }
  }
}

function DisableInput(idcheck, iddisable) {
  document.getElementById(iddisable).disabled = document.getElementById(idcheck)
    .checked
    ? true
    : false;
}

function SeleccionarModelo() {
  localforage.getItem("RivaCold" + list_type.value, function (err, value) {
    RivaColdDB = JSON.parse(value).sort(function (a) {
      if (a.Volumen) {
        return -1;
      } else {
        return +1;
      }
    });
    list_type.value == "Tarifa0000"
      ? (DBFilter = RivaColdDB.map((item) => item.Gama))
      : (DBFilter = RivaColdDB.filter((item) => item.Marca == "RivaCold").map(
          (item) => item.Gama
        ));
    DBDuplicate = DBFilter.filter(
      (item, index) => DBFilter.indexOf(item) === index
    ).sort();
    list_gama.innerHTML = "";
    for (i in DBDuplicate) {
      option_gama = document.createElement("option");
      option_gama.text = DBDuplicate[i];
      list_gama.add(option_gama);
    }
    SeleccionarGama();
  });
}

function SeleccionarGama() {
  list_modelo.innerHTML = "";
  const DBFilter = RivaColdDB.filter(
    (item) => item.Gama == list_gama.value
  ).map((item) => item.Ref);
  const DBDuplicate = DBFilter.filter(
    (item, index) => DBFilter.indexOf(item) === index
  ).sort();
  for (i = 0, len = DBDuplicate.length; i < len; i++) {
    option_modelo = document.createElement("option");
    option_modelo.text = DBDuplicate[i];
    list_modelo.add(option_modelo);
  }
  SeleccionarProducto();
}

function SeleccionarProducto() {
  document.getElementById("Precio").value = "";
  document.getElementById("Cantidad").value = 1;
  document.getElementById("PrecioNeto").value = "";
  document.getElementById("RefModelo").value = list_modelo.value;
  DBFilter = RivaColdDB.filter((item) => item.Ref == list_modelo.value);
  for (i = 0, len = DBFilter.length; i < len; i++) {
    document.getElementById("Precio").value =
      list_type.value == "Tarifa0000"
        ? DBFilter[0]["Precio Venta"]
        : DBFilter[0]["Precio"];
    document.getElementById("textoModelo").innerHTML =
      list_type.value === "Tarifa0000" && DBFilter[0]["Observación"]
        ? DBFilter[0]["Descripción"] + "\n" + DBFilter[0]["Observación"]
        : DBFilter[0]["Descripción"];
  }
  CalculoPrecio();
}

const Ddto1 = document.getElementById("dto1");
const Ddto2 = document.getElementById("dto2");
const Ddto3 = document.getElementById("dto3");
const DdtoF = document.getElementById("dto.Final");
const DPrecio = document.getElementById("Precio");

function CalculoDescuento() {
  Ddto1.value = PerCent1coma(Ddto1.value, 2);
  Ddto2.value = PerCent1coma(Ddto2.value, 2);
  Ddto3.value = PerCent1coma(Ddto3.value, 2);
  DdtoF.value = PerCent1coma(
    (1 -
      (1 - ParseNumber(Ddto1.value) / 100) *
        (1 - ParseNumber(Ddto2.value) / 100) *
        (1 - ParseNumber(Ddto3.value) / 100)) *
      100,
    2
  );
  ParseNumber(DdtoF.value) > 100
    ? (DdtoF.value = PerCent1coma(100, 2))
    : ParseNumber(DdtoF.value) < 0
    ? (DdtoF.value = PerCent1coma(0, 2))
    : null;
  CalculoPrecio();
}

function IGIC() {
  document.getElementById("Placelabel_IVA").innerHTML =
    document.getElementById("Placelabel_IVA").innerHTML == "IGIC"
      ? "IVA"
      : "IGIC";
  document.getElementById("IVA").value =
    document.getElementById("Placelabel_IVA").innerHTML == "IGIC"
      ? PerCent1coma(7, 0)
      : PerCent1coma(21, 0);
  GuardarDatos();
  ModifTable();
}

const dCantidad = document.getElementById("Cantidad");
const dPrecioNeto = document.getElementById("PrecioNeto");

function CalculoPrecio() {
  if (isNaN(ParseNumber(DPrecio.value))) {
    DPrecio.value = "";
  } else {
    DPrecio.value = NumberFormatEUR(DPrecio.value);
    Precio = ParseNumber(DPrecio.value);
    dPrecioNeto.value = NumberFormatEUR(
      Precio * (1 - ParseNumber(DdtoF.value) / 100)
    );
    !isNaN(ParseNumber(dCantidad.value))
      ? (document.getElementById("PrecioNetoTotal").value = NumberFormatEUR(
          ParseNumber(dPrecioNeto.value) * ParseNumber(dCantidad.value)
        ))
      : null;
  }
}
const Table_Detalle = document.getElementById("Table_Detalle");
const Table_Detalle_tbody = Table_Detalle.getElementsByTagName("tbody")[0];
const Table_Detalle_tbody_th = Table_Detalle_tbody.getElementsByTagName("th");
const Table_Detalle_th = Table_Detalle.getElementsByTagName("th");
const Table_Detalle_td = Table_Detalle.getElementsByTagName("td");
const Table_Detalle_input = Table_Detalle.getElementsByTagName("input");
const Table_Detalle_textarea = Table_Detalle.getElementsByTagName("textarea");

function RegistrarModelo() {
  if (Table == null) {
    Table = [];
    Reference = [];
  }
  j = ParseNumber(Table_Detalle_tbody_th.length);
  Table[j] = [
    document.getElementById("RefModelo").value,
    document.getElementById("Cantidad").value,
    document.getElementById("Precio").value,
    PerCent1coma(document.getElementById("dto.Final").value, 0),
    document.getElementById("PrecioNeto").value,
    document.getElementById("PrecioNetoTotal").value,
  ];
  Reference[j] = document.getElementById("textoModelo").value;
  localStorage.setItem("TableOferta", JSON.stringify(Table));
  localStorage.setItem("TextoModelo", JSON.stringify(Reference));
  PushDB();
}
const dDescuentoPP = document.getElementById("DescuentoPP");
const dIVA = document.getElementById("IVA");
const dCoste_Portes = document.getElementById("Coste_Portes");
const dBaseImponible = document.getElementById("BaseImponible");
const dImpuestoIVA = document.getElementById("ImpuestoIVA");
const dTotalOfertaIVA = document.getElementById("TotalOfertaIVA");

function PushDB() {
  ClearTable();
  let TotalOfertaPrecio = 0;
  let itemCount = "01";
  for (i = 0, Tablelen = Table.length; i < Tablelen; i++) {
    if (Table[i][0]) {
      item = itemCount;
      itemCount = ("00" + (ParseNumber(itemCount) + 1)).slice(-3);
    } else {
      item = "";
    }
    Table_Detalle_tbody.insertRow().innerHTML = `<th>${item}</th>
      <td><input value="${Table[i][0] || ""}"></td>
      <td><textarea></textarea></td>
      <td><input style='text-align:center' value="${
        Table[i][0] ? parseFloat(Table[i][1]) || "1" : ""
      }"></td>
      <td><input style='text-align:center' value="${
        Table[i][0] ? FormatEUR(Table[i][2]) : ""
      }"></td>
      <td><input style='text-align:center' value="${
        Table[i][0] ? PerCent1coma(Table[i][3], 2) || "0.00 %" : ""
      }"></td>
      <td><input style='text-align:center' value="${
        Table[i][0] ? FormatEUR(Table[i][4]) : ""
      }"></td>
      <td><input style='text-align:center' value="${
        Table[i][0] ? FormatEUR(Table[i][5]) : ""
      }"></td>`;
    Table_Detalle_th[i + 8].insertAdjacentHTML(
      "beforeend",
      `<button><i class='bi bi-x-octagon'style='color:red;font-size:15px;vertical-align:bottom' onclick='BorrarLinea(${i})'></i></button>`
    );
    if (i) {
      document
        .getElementById("Table_Detalle")
        .getElementsByTagName("td")
        [7 * i + 1].insertAdjacentHTML(
          "beforeend",
          `<button><i class='bi bi-arrow-up-square'style='color: green;font-size:15px;margin-right:10px' onclick='MoveItem(${i},+1)'/></button>`
        );
    }
    TotalOfertaPrecio += Table[i][5];
    Table_Detalle_textarea[i].innerHTML = Reference[i];
    Table_Detalle_textarea[i].rows = 0;
    Table_Detalle_textarea[i].rows = ParseNumber(
      document
        .getElementById("Table_Detalle")
        .getElementsByTagName("textarea")
        [i].textContent.split("\n").length + 1
    );
    Table[i][0] ? CheckStock(i) : null;
  }
  !dDescuentoPP.value ? (dDescuentoPP.value = PerCent1coma(0, 0)) : null;
  !dIVA.value ? (dIVA.value = PerCent1coma(21, 0)) : null;

  if (ParseNumber(dCoste_Portes.value) > 0) {
    dCoste_Portes.value = NumberFormatEUR(dCoste_Portes.value);
    TotalOfertaPrecio += ParseNumber(
      document.getElementById("Coste_Portes").value
    );
    document.getElementById("Coste_Portes").style.display = "";
    document.getElementById("label_Portes").style.display = "";
  } else {
    dCoste_Portes.value = "0 €";
    document.getElementById("Coste_Portes").style.display = "none";
    document.getElementById("label_Portes").style.display = "none";
  }
  dDescuentoPP.value = PerCent1coma(dDescuentoPP.value, 0);
  dIVA.value = PerCent1coma(dIVA.value, 0);
  document.getElementById("TotalOferta").textContent =
    FormatEUR(TotalOfertaPrecio);
  dBaseImponible.textContent = FormatEUR(
    TotalOfertaPrecio * (1 - ParseNumber(dDescuentoPP.value) / 100)
  );
  dImpuestoIVA.textContent = FormatEUR(
    ParseNumber(dBaseImponible.textContent) * (ParseNumber(dIVA.value) / 100)
  );
  dTotalOfertaIVA.textContent = FormatEUR(
    ParseNumber(dBaseImponible.textContent) *
      (1 + ParseNumber(dIVA.value) / 100)
  );
  Display_Tabla("Table_Detalle", 4);
  Display_Tabla("Table_Detalle", 4);
  Display_Tabla("Table_Detalle", 5);
  Display_Tabla("Table_Detalle", 5);
  SaveRegisterLocal(Cabecera, Table, Reference);
}

function CheckStock(i) {
  Stock = 0;
  DBTarifaFilter = DBTarifa.filter(function (event) {
    if (event.Ref == null) {
      return;
    }
    return event.Ref.indexOf(Table_Detalle_input[6 * i].value) > -1;
  });
  for (
    j = 0, lenDBTarifaFilter = DBTarifaFilter.length;
    j < lenDBTarifaFilter;
    j++
  ) {
    DBStockFilter = DBStock.filter(
      (item) => item.Cod == DBTarifaFilter[j]["Ref2"]
    );
    for (
      k = 0, lenDBStockFilter = DBStockFilter.length;
      k < lenDBStockFilter;
      k++
    ) {
      Stock = Stock + ParseNumber(DBStockFilter[k]["Stock"]);
    }
  }
  if (Stock > 0) {
    Table_Detalle_td[7 * i + 1].insertAdjacentHTML(
      "beforeend",
      `<i class="bi bi-cart-check" style="color: green;font-size:15px">${Stock}u</i>`
    );
  } else {
    Plazo = "";
    for (k = 0, len = DBGama.length; k < len; k++) {
      document
        .getElementById("Table_Detalle")
        .getElementsByTagName("input")
        [6 * i].value.startsWith(DBGama[k]["Gama"])
        ? (Plazo = DBGama[k]["Plazo_Entrega"] + "S")
        : null;
    }
    Plazo
      ? Table_Detalle_td[7 * i + 1].insertAdjacentHTML(
          "beforeend",
          `<i class="bi bi-cart-x" style="color: red;font-size:15px">${Plazo}</i>`
        )
      : null;
  }
}

function ClearDB() {
  ClearTable();
  localStorage.removeItem("TableOferta");
  localStorage.removeItem("TextoModelo");
  localStorage.removeItem("DatosOferta");
  Table = [];
  Reference = [];
  Cabecera = [];
  DatosCabecera();
  Initialización();
  GuardarDatos();
  ModifTable();
  OF();
}

function Initialización() {
  date = new Date();
  Today =
    ("00" + date.getDate()).slice(-2) +
    "/" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    date.getFullYear();
  ValidDay =
    ("00" + date.getDate(date.setDate(date.getDate() + 30))).slice(-2) +
    "/" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    date.getFullYear();
  document.getElementById("FechaActual").value = Today;
  document.getElementById("FechaValidez").value = ValidDay;
  document.getElementById("Oferta_Situacion").value = "Pendiente";
  document.getElementById("Oferta_Embalaje").value = "Tipo estándar incluido";
  document.getElementById("Oferta_FormaPago").value = "La habitual";
  document.getElementById("Oferta_PlazoEntrega").value = "A confirmar";
}

function OF() {
  const os = require("os");
  NOfertaCheck = 0;
  for (n = 1; n < 1000; n++) {
    for (i = 0, len = Registro.length; i < len; i++) {
      if (
        Registro[i]["NOferta"] ==
        "OF_" +
          os.userInfo().username.toUpperCase().slice(-3) +
          "_" +
          ("0000" + n).slice(-4)
      ) {
        NOfertaCheck = 1;
        break;
      }
    }
    if (NOfertaCheck == 0) {
      document.getElementById("Oferta_NumOferta").value =
        "OF_" +
        os.userInfo().username.toUpperCase().slice(0, 3) +
        "_" +
        ("0000" + n).slice(-4);
      document.getElementById("Oferta_Solicitado").value = os
        .userInfo()
        .username.toUpperCase()
        .slice(0, 3);
      break;
    }
    NOfertaCheck = 0;
  }
}

function ClearTable() {
  for (i = 2, len = Table_Detalle.rows.length; i < len; i++) {
    Table_Detalle.deleteRow(2);
  }
}

function ModifTable() {
  if (Table_Detalle.rows.length > 2 && Table) {
    for (i = 0; i < Table.length; i++) {
      Table[i][0] = Table_Detalle_input[6 * i].value || "";
      Table[i][1] =
        parseFloat(Table_Detalle_input[1 + 6 * i].value).toFixed(0) || "";
      Table[i][2] = ParseNumber(Table_Detalle_input[2 + 6 * i].value) || "";
      Table[i][3] =
        ParseNumber(Table_Detalle_input[3 + 6 * i].value) > 100
          ? 100
          : ParseNumber(Table_Detalle_input[3 + 6 * i].value) || "";
      Table[i][4] = Table[i][2] * (1 - Table[i][3] / 100) || "";
      Table[i][5] = Table[i][4] * Table[i][1] || "";
      Reference[i] = Table_Detalle_textarea[i].value;
    }
  }
  localStorage.setItem("TableOferta", JSON.stringify(Table));
  localStorage.setItem("TextoModelo", JSON.stringify(Reference));
  PushDB();
}

function AñadirComplemento() {
  document
    .getElementById("ComplementoModelo")
    .insertAdjacentHTML(
      "afterbegin",
      "<div class='row' id='RowComplemento'><div class='col-6'><input type='text' class='form-control' placeholder='Complemento'/></div><div class='col-6'><input onchange='ModifComplemento()' type='text' class='form-control' placeholder='Precio (€ o %)'></div></div>"
    );
  ModifComplemento();
}

function CondicionEntrega() {
  document.getElementById("Oferta_PlazoEntrega").value =
    document.getElementById("EntregaInmediata").checked
      ? "Entrega Inmediata"
      : document.getElementById("PlazoEntrega").value;
  document.getElementById("Oferta_Portes").value =
    document.getElementById("list_Portes").value;
  document.getElementById("Oferta_Embalaje").value =
    document.getElementById("list_Embalaje").value;
  document.getElementById("Oferta_FormaPago").value =
    document.getElementById("list_FormadePago").value;
  document.getElementById("Oferta_Dir1").innerHTML = document.getElementById(
    "list_DireccionEnvio"
  ).value;
  DatosCabecera();
  GuardarDatos();
}

function BorrarLinea(n) {
  Table.splice(n, 1);
  Reference.splice(n, 1);
  localStorage.setItem("TableOferta", JSON.stringify(Table));
  localStorage.setItem("TextoModelo", JSON.stringify(Reference));
  PushDB();
}

function MoveItem(n, dir) {
  TempArray = [];
  for (j = 0; j < 6; j++) {
    TempArray[j] = Table[n][j];
    Table[n][j] = Table[n - dir][j];
    Table[n - dir][j] = TempArray[j];
  }
  TempArray[0] = Reference[n];
  Reference[n] = Reference[n - dir];
  Reference[n - dir] = TempArray[0];
  localStorage.setItem("TableOferta", JSON.stringify(Table));
  localStorage.setItem("TextoModelo", JSON.stringify(Reference));
  PushDB();
}
const Campo = [
  "Oferta_NumOferta",
  "Oferta_CIF",
  "Oferta_NCliente",
  "Oferta_RazónSocial",
  "Oferta_Dirección",
  "Oferta_CP",
  "Oferta_Pais",
  "Oferta_Telf",
  "Oferta_Fax",
  "Oferta_Email",
  "Oferta_Solicitante",
  "Oferta_Situacion",
  "Oferta_Solicitud",
  "Oferta_Referencia",
  "Oferta_Referencia2",
  "Oferta_Referencia3",
  "Oferta_Solicitado",
  "Oferta_PlazoEntrega",
  "Oferta_Portes",
  "Oferta_Embalaje",
  "Oferta_FormaPago",
  "Oferta_Observacion",
  "Oferta_Dir1",
  "Oferta_Dir2",
  "Oferta_Dir3",
  "Oferta_Tel2",
  "Oferta_Fax2",
  "DescuentoPP",
  "IVA",
  "FechaActual",
  "FechaValidez",
  "Coste_Portes",
];

function DatosCabecera() {
  if (Cabecera) {
    for (i = 0, Campolen = Campo.length; i < Campolen; i++) {
      document.getElementById([Campo[i]]).value = Cabecera[i]
        ? Cabecera[i]
        : null;
    }
  } else {
    for (i = 0, Campolen = Campo.length; i < Campolen; i++) {
      document.getElementById([Campo[i]]).value = null;
    }
  }
}

function GuardarDatos() {
  Cabecera = [];
  for (i = 0; i < Campo.length; i++) {
    Cabecera[i] = document.getElementById([Campo[i]]).value.replace(";", "");
  }
  if (
    DBCliente.map((item) => item.Cliente).indexOf(
      parseFloat(document.getElementById("Oferta_NCliente").value)
    ) != -1
  ) {
    if (
      DBCliente[
        DBCliente.map((item) => item.Cliente).indexOf(
          parseFloat(document.getElementById("Oferta_NCliente").value)
        )
      ]["Pais"] == "ES"
    ) {
      document.getElementById("IVA").value = "21 %";
      Display_Impuesto(0);
    } else {
      document.getElementById("IVA").value = "0 %";
      Display_Impuesto(1);
    }
  } else {
    document.getElementById("IVA").value = "21 %";
    Display_Impuesto(0);
  }
  localStorage.setItem("DatosOferta", JSON.stringify(Cabecera));
  SaveRegisterLocal(Cabecera, Table, Reference);
}

function AltaTexto() {
  j = ParseNumber(Table_Detalle_tbody_th.length);
  Table[j] = ["", "", "", "", "", ""];
  Reference[j] = "";
  localStorage.setItem("TableOferta", JSON.stringify(Table));
  localStorage.setItem("TextoModelo", JSON.stringify(Reference));
  PushDB();
}

const localforage = require("localforage");
localforage.getItem("RivaColdStock").then(function (value) {
  DBStock = JSON.parse(value);
  localforage.getItem("RivaColdTarifa0000").then(function (value) {
    DBTarifa = JSON.parse(value);
    localforage.getItem("RivaColdGama").then(function (value) {
      DBGama = JSON.parse(value);
      localforage.getItem("RegOferta").then(function (value) {
        Registro = JSON.parse(value);
        localforage.getItem("RivaColdCliente").then(function (value) {
          DBCliente = JSON.parse(value);
          if (!Table || Table.length < 0) {
            ClearDB();
            GuardarDatos();
            OF();
          }
          SeleccionarModelo();
          DatosCabecera();
          ModifTable();
          GuardarDatos();
        });
      });
    });
  });
});
