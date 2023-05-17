const DBx = [[], [], [], []]
localforage.getItem("RivaColdEq", function (err, value1) {
    DBx[0] = JSON.parse(value1)
})
localforage.getItem("RivaColdEvap", function (err, value2) {
    DBx[1] = JSON.parse(value2)
})
localforage.getItem("RivaColdCond", function (err, value3) {
    DBx[2] = JSON.parse(value3)
})
localforage.getItem("RivaColdCentral", function (err, value4) {
    DBx[3] = JSON.parse(value4)
})

function Busqueda1(idsearch, idresult) {
    Didresult = document.getElementById(idresult);
    sp = document.getElementById(idsearch).value;
    if (sp) {
        Didresult.innerHTML = "";
        for (i in DBx) {
            DBFilter = DBx[i].filter(item => item.Ref != null).filter(item => ("x" + item.Ref).toLowerCase().indexOf(sp.toLowerCase()) > -1);
            for (item of DBFilter) {
                option_modelo = document.createElement("option");
                option_modelo.text = item["Ref"];
                option_modelo.value = i + "_A_" + item["Marca"] + "_A_" + item["Gama"] + "_A_" + item["Ref"];
                Didresult.add(option_modelo);
            }
        }
    }
}

function Aplicar1(idresult) {
    Didresult = document.getElementById(idresult).value
    document.getElementById("List_Type").selectedIndex = Didresult.split("_A_")[0];
    SeleccionarMarca().then(() => {
        document.getElementById("List_MarcaA").value = Didresult.split("_A_")[1];
        SeleccionarProveedor();
        document.getElementById("List_Gama").value = Didresult.split("_A_")[2];
        SeleccionarGama();
        document.getElementById("List_Modelo").value = Didresult.split("_A_")[3];
        TextoConfiguracion()
        SeleccionarModelo();
    })
}