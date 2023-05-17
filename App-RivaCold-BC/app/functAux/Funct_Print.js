function PrintFichaTecnica() {
    document.title = "FT_" + document.getElementById("list_modelo").value
    window.print();
}
function PrintEquivalencia() {
    document.title = "EQ_" + document.getElementById("List_Modelo").value
    window.print();
}
function PrintStock() {
    document.title = document.getElementById("List_Gama").style.display == "none" ? "ST_SEARCH_" + document.getElementById("FunctBusqueda").value : document.getElementById("List_Mod").style.display == "none" ? "ST_GAMA_" + document.getElementById("List_Gama").value : "ST_" + document.getElementById("List_Mod").value
    window.print();
}
function PrintEqGama() {
    Aplicación_A = document.getElementById("S_Aplicación_A").selectedIndex > 0 ? " " + document.getElementById("S_Aplicación_A").value : ""
    Aplicación_B = document.getElementById("S_Aplicación_B").selectedIndex > 0 ? " " + document.getElementById("S_Aplicación_B").value : ""
    Refrigerante_A = document.getElementById("S_Refrigerante_A").selectedIndex > 0 ? " " + document.getElementById("S_Refrigerante_A").value : ""
    Refrigerante_B = document.getElementById("S_Refrigerante_B").selectedIndex > 0 ? " " + document.getElementById("S_Refrigerante_B").value : ""
    document.title = "EQ_" + document.getElementById("S_Gama_A").value + Aplicación_A + Refrigerante_A + "_vs_" + document.getElementById("S_Gama_B").value + Aplicación_B + Refrigerante_B
    window.print();
}
function PrintCalculadora() {
    document.title = "Demanda frigorífica_" + document.getElementById("Select_Prederminado").getElementsByTagName("option")[document.getElementById("Select_Prederminado").value].textContent + "_" + document.getElementById("Dimensión").value
    window.print();
}


function Print5() {
    window.print();
    document.getElementById("imagen_logo").style.display = "flex"
    location.reload();
}


function PrintOferta() {
    document.title = document.getElementById("Oferta_NumOferta").value
    const Table = JSON.parse(localStorage.getItem("TableOferta"));
    const Reference = JSON.parse(localStorage.getItem("TextoModelo"));
    tamañopapel = 40;
    RowTable = 0;
    ddetalle = document.getElementById("Table_Detalle")
    dtextarea = ddetalle.getElementsByTagName("textarea")
    for (i = 0, n = 0, ilen = dtextarea.length; i < ilen; i++) {
        RowTable += dtextarea[i].rows;
    }
    pagina = ~~(RowTable / tamañopapel + 1);
    if (pagina > 1) {
        OcultarPrecio = ddetalle.getElementsByTagName("th")[4].style.display == "none" ? true : false
        OcultarDescuento = ddetalle.getElementsByTagName("th")[5].style.display == "none" ? true : false
        thead = ddetalle.getElementsByTagName("thead")[0].innerHTML;
        document.getElementById("Oferta_Tabla").innerHTML = "";
        RowTable = 0;
        Count = 0;
        for (i = 0; i < ilen; i++) {
            RowTable == 0 ?
                document.getElementById("Oferta_Tabla").insertAdjacentHTML("beforebegin", '<div class="row" id="Table_row_Detalle' + n + '"><div class="col-6"><label style="font: bolder 10pt Arial;">DETALLE:</label></div><div class="col-6" style="text-align:right"><label style="font: bolder 10pt Arial;">Página ' + (n + 1) + " de " + parseFloat(pagina) + '</label></div><table id="Table_Detalle' + n + '"><thead id="thead_Detalle" class = "table-group-divider"> ' + thead + '</thead><tbody id="tbody_Detalle" class="table-group-divider"><tr><td></td></tr></tbody></table></div>') : null
            document.getElementById(["Table_Detalle" + n]).getElementsByTagName("tbody")[0].insertRow().innerHTML = "<th>" + ("00" + (i + 1)).slice(-3) + "</th><td><input></td><td><textarea></textarea></td><td><input style='text-align:center'></td><td><input style='text-align:center'></td><td><input style='text-align:center'></td><td><input style='text-align:center'></td><td><input style='text-align:center'></td>";
            ddetallen = document.getElementById(["Table_Detalle" + n])
            for (j = 0; j < 6; j++) {
                ddetallen.getElementsByTagName("input")[j + 6 * Count].value = Table[i][j];
            }
            ddetallen.getElementsByTagName("textarea")[Count].innerHTML = Reference[i];
            ddetallen.getElementsByTagName("textarea")[Count].rows = 0;
            ddetallen.getElementsByTagName("textarea")[Count].rows = parseFloat(ddetallen.getElementsByTagName("textarea")[Count].textContent.split("\n").length + 1);
            RowTable += ddetallen.getElementsByTagName("textarea")[Count].rows;
            Count += 1;
            if (RowTable > tamañopapel || (i + 2 == ilen && Count > 15)) {
                document.getElementById(["Table_row_Detalle" + n]).insertAdjacentHTML("afterend", "<header>" + document.getElementsByTagName("header")[0].innerHTML + "</header>");
                CloneHTML("header", "input", n);
                CloneHTML("header", "textarea", n);
                ddetallen.getElementsByTagName("textarea")[Count - 1].rows =
                    tamañopapel - RowTable - document.getElementById(["Table_Detalle" + n]).getElementsByTagName("textarea")[Count - 1].rows + 9;
                document.getElementById(["Table_row_Detalle" + n]).insertAdjacentHTML("afterend", '<p style="text-align:right;font: bolder 10pt Arial;">Suma y Sigue</p>');
                n += 1;
                RowTable = 0;
                Count = 0;
            }
        }
    }
    if (pagina == 1) {
        n = "";
        Count = ilen;
    } else {
        for (i = 0; i < pagina; i++) {
            if (OcultarPrecio) { OcultarDisplayTabla(["Table_Detalle" + i], 4); }
            if (OcultarDescuento) { OcultarDisplayTabla(["Table_Detalle" + i], 5); }
        }
    }
    document.getElementById(["Table_Detalle" + n]).insertAdjacentHTML('beforeend', '<textarea></textarea>')
    document.getElementById(["Table_Detalle" + n]).getElementsByTagName("textarea")[Count].rows = tamañopapel - RowTable - document.getElementById(["Table_Detalle" + n]).getElementsByTagName("textarea")[Count].rows + 7;
    window.print();
    location.reload();

}

function CloneHTML(Tag, Element, n) {
    for (l = 0, lenheader = document.getElementsByTagName(Tag)[0].getElementsByTagName(Element).length; l < lenheader; l++) {
        document.getElementsByTagName(Tag)[n + 1].getElementsByTagName(Element)[l].value = document.getElementsByTagName(Tag)[0].getElementsByTagName(Element)[l].value;
    }
}

function OcultarDisplayTabla(Table, j) {
    document.getElementById(Table).getElementsByTagName("th")[j].style.display = "none";
    for (k = 0, klen = document.getElementById(Table).getElementsByTagName("textarea").length; k < klen; k++) {
        document.getElementById(Table).getElementsByTagName("td")[j + 7 * k].style.display = "none";
    }
}
