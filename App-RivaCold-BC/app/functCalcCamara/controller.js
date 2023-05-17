const dCarga_Termica = document.getElementById("Carga_Termica")
const dCarga_Interna = document.getElementById("Carga_Interna")
const dCarga_Producto = document.getElementById("Carga_Producto")
const dCarga_Aire = document.getElementById("Carga_Aire")
const dCarga_Resp = document.getElementById("Carga_Resp")
const dCarga_Fan = document.getElementById("Carga_Fan")
const dCarga_Otra = document.getElementById("Carga_Otra")
const dCarga_Total = document.getElementById("Carga_Total")

const Dimensión = document.getElementById("Dimensión")
const dSelect_Product = document.getElementById("Select_Product")
const dTemp_Cong = document.getElementById("Temp_Cong")
const dCP_NCong = document.getElementById("CP_NCong")
const dCP_Cong = document.getElementById("CP_Cong")
const dCP_Latente = document.getElementById("CP_Latente")
const dCP_Resp = document.getElementById("CP_Resp")
const dSelect_Prederminado = document.getElementById("Select_Prederminado")
const dTemp_Camara = document.getElementById("Temp_Camara")
const dTemp_Carga = document.getElementById("Temp_Carga")
const dRen_Diario = document.getElementById("Ren_Diario")
const dDelta_A = document.getElementById("Delta_A")
const dDelta_B = document.getElementById("Delta_B")
const dDelta_C = document.getElementById("Delta_C")
const dDelta_D = document.getElementById("Delta_D")
const dDelta_Ceiling = document.getElementById("Delta_Ceiling")
const dDelta_Floor = document.getElementById("Delta_Floor")
const dMaterial_A = document.getElementById("Material_A")
const dMaterial_B = document.getElementById("Material_B")
const dMaterial_C = document.getElementById("Material_C")
const dMaterial_D = document.getElementById("Material_D")
const dMaterial_Ceiling = document.getElementById("Material_Ceiling")
const dMaterial_Floor = document.getElementById("Material_Floor")
const dTemp_Amb = document.getElementById("Temp_Amb")
const dHR_Amb = document.getElementById("HR_Amb")
const dHR_Camara = document.getElementById("HR_Camara")
const dLength_A_C = document.getElementById("Length_A_C")
const dLength_B_D = document.getElementById("Length_B_D")
const dHeight = document.getElementById("Height")
const dDensidad = document.getElementById("Densidad")
const dTime_Cong = document.getElementById("Time_Cong")
const dTime_Comp = document.getElementById("Time_Comp")
const dVol_Util = document.getElementById("Vol_Util")
const dCP_Envoltorio = document.getElementById("CP_Envoltorio")
const dEnvoltorio = document.getElementById("Envoltorio")
const dOtras_Cargas = document.getElementById("Otras_Cargas")
const dPuerta_Check1 = document.getElementById("Puerta_Check1")
const dPuerta_Ancho1 = document.getElementById("Puerta_Ancho1")
const dPuerta_Altura1 = document.getElementById("Puerta_Altura1")
const dSelect_Trafico1 = document.getElementById("Select_Trafico1")
const dPuerta_Check2 = document.getElementById("Puerta_Check2")
const dPuerta_Ancho2 = document.getElementById("Puerta_Ancho2")
const dPuerta_Altura2 = document.getElementById("Puerta_Altura2")
const dSelect_Trafico2 = document.getElementById("Select_Trafico2")
const dPuerta_Check3 = document.getElementById("Puerta_Check3")
const dPuerta_Ancho3 = document.getElementById("Puerta_Ancho3")
const dPuerta_Altura3 = document.getElementById("Puerta_Altura3")
const dSelect_Trafico3 = document.getElementById("Select_Trafico3")
const dDistanciaEVUC = document.getElementById("DistanciaEVUC")
const dAbatimiento = document.getElementById("Abatimiento")

const TablaProducto = [
    ["CATALOGO", 0, 1670, 3220, 155, 0],
    ["DAIRY PRODUCTS", -5.88, 1420, 2970, 155, 0],
    ["FRUIT", -1.68, 1900, 3780, 282, 0.03],
    ["EGG", -0.6, 1750, 3630, 252, 0],
    ["FISH", -2.2, 180, 3660, 257, 0],
    ["MEAT", -2, 1590, 3300, 201, 0],
    ["VEGETABLES", -0.92, 1940, 3860, 290, 0.06],
    ["MILK", -0.6, 1940, 3880, 293, 0],
    ["NUTS", -2, 890, 2000, 15, 0],
    ["VINE", -2, 1464, 3765, 293, 0]
]
const TablaPrederminado = [
    [-20, -7, 10, 100, 5],
    [0, 25, 10, 80, 10],
    [12, 25, 1, 60, 16]
]
function CatalogoPreterminado() {
    Select_Prederminado = dSelect_Prederminado.value
    dTemp_Camara.value = TablaPrederminado[Select_Prederminado][0]
    dTemp_Carga.value = TablaPrederminado[Select_Prederminado][1]
    dRen_Diario.value = TablaPrederminado[Select_Prederminado][2]
    dDelta_A.value = TablaPrederminado[Select_Prederminado][3]
    dDelta_B.value = TablaPrederminado[Select_Prederminado][3]
    dDelta_C.value = TablaPrederminado[Select_Prederminado][3]
    dDelta_D.value = TablaPrederminado[Select_Prederminado][3]
    dDelta_Ceiling.value = TablaPrederminado[Select_Prederminado][3]
    dDelta_Floor.value = TablaPrederminado[Select_Prederminado][3]
    CalcPotencia()
    Unidad()
}
function CatalogProduct() {
    for (i = 0, ilen = TablaProducto.length; i < ilen; i++) {
        Opcion = document.createElement("option");
        Opcion.text = TablaProducto[i][0];
        Opcion.value = i;
        Select_Product.add(Opcion);
    }
}

function PreterminadoProducto() {
    Select_Product = dSelect_Product.value
    dTemp_Cong.value = TablaProducto[Select_Product][1]
    dCP_Cong.value = TablaProducto[Select_Product][2]
    dCP_NCong.value = TablaProducto[Select_Product][3]
    dCP_Latente.value = TablaProducto[Select_Product][4]
    dCP_Resp.value = TablaProducto[Select_Product][5]
    CalcPotencia()
    Unidad()
}

const xArray = ["Carga Térmica", "Carga Aire", "Carga Interna", "Carga Producto", "Carga Respiración", "Carga Vetilación", "Carga Seguridad"];
const layout = { height: 400, margin: { "t": 10, "b": 10, "l": 10, "r": 10 }, automargin: true, showlegend: false, font: { size: 15 } };

function CalcPotencia() {
    Temp_Amb = parseFloat(dTemp_Amb.value)
    Temp_Camara = parseFloat(dTemp_Camara.value)
    HR_Amb = parseFloat(dHR_Amb.value)
    HR_Camara = parseFloat(dHR_Camara.value)
    Temp_Cong = parseFloat(dTemp_Cong.value)
    Temp_Carga = parseFloat(dTemp_Carga.value)
    Length_A_C = parseFloat(dLength_A_C.value)
    Length_B_D = parseFloat(dLength_B_D.value)
    Height = parseFloat(dHeight.value)
    Delta_A = parseFloat(dDelta_A.value) / 1000
    Delta_B = parseFloat(dDelta_B.value) / 1000
    Delta_C = parseFloat(dDelta_C.value) / 1000
    Delta_D = parseFloat(dDelta_D.value) / 1000
    Delta_Ceiling = parseFloat(dDelta_Ceiling.value) / 1000
    Delta_Floor = parseFloat(dDelta_Floor.value) / 1000
    Material_A = parseFloat(dMaterial_A.value)
    Material_B = parseFloat(dMaterial_B.value)
    Material_C = parseFloat(dMaterial_C.value)
    Material_D = parseFloat(dMaterial_D.value)
    Material_Ceiling = parseFloat(dMaterial_Ceiling.value)
    Material_Floor = parseFloat(dMaterial_Floor.value)
    Densidad = parseFloat(dDensidad.value)
    Time_Cong = parseFloat(dTime_Cong.value)
    Time_Comp = parseFloat(dTime_Comp.value)
    Ren_Diario = parseFloat(dRen_Diario.value) / 100
    Vol_Util = parseFloat(dVol_Util.value) / 100
    CP_NCong = parseFloat(dCP_NCong.value)
    CP_Cong = parseFloat(dCP_Cong.value)
    CP_Envoltorio = parseFloat(dCP_Envoltorio.value)
    CP_Resp = parseFloat(dCP_Resp.value)
    CP_Latente = parseFloat(dCP_Latente.value) * 1000
    Envoltorio = parseFloat(dEnvoltorio.value) / 100
    Volumen = Length_A_C * Length_B_D * Height
    Dimensión.value = (Volumen).toFixed(2)
    PesoDiario = Densidad * Volumen * Vol_Util * Ren_Diario
    Otras_Cargas = parseFloat(dOtras_Cargas.value) / 100
    AirAmb = CalcAirParameter(Temp_Amb, HR_Amb)
    AirCamara = CalcAirParameter(Temp_Camara, HR_Camara)
    Select_Prederminado = dSelect_Prederminado.value
    //Selector puertas 
    Puerta_Check1 = dPuerta_Check1.checked
    dPuerta_Ancho1.value = Volumen > 12 ? (Length_A_C / 3).toFixed(2) : Length_A_C / 3 > 0.8 ? (Length_A_C / 3).toFixed(2) : 0.8
    Puerta_Ancho1 = parseFloat(dPuerta_Ancho1.value)
    dPuerta_Altura1.value = Volumen > 12 ? 2.2 : (0.733 * Height).toFixed(2)
    Puerta_Altura1 = parseFloat(dPuerta_Altura1.value)
    dSelect_Trafico1.value = dAbatimiento.checked ? "75_110_110" : Select_Prederminado == 2 ? "300_365_365" : "150_200_200"
    Select_Trafico1 = dSelect_Trafico1.value
    Puerta_Check2 = dPuerta_Check2.checked
    Puerta_Ancho2 = parseFloat(dPuerta_Ancho2.value)
    Puerta_Altura2 = parseFloat(dPuerta_Altura2.value)
    dAbatimiento.checked ? dSelect_Trafico2.value = "75_110_110" : null
    Select_Trafico2 = dSelect_Trafico2.value
    Puerta_Check3 = dPuerta_Check3.checked
    Puerta_Ancho3 = parseFloat(dPuerta_Ancho3.value)
    Puerta_Altura3 = parseFloat(dPuerta_Altura3.value)
    dAbatimiento.checked ? dSelect_Trafico3.value = "75_110_110" : null
    Select_Trafico3 = dSelect_Trafico3.value
    //Distancia entre el evaporador y la unidad condensadora
    DistanciaEVUC = parseFloat(dDistanciaEVUC.value) * 0.003 < 0.06 ? 1 : 1 - parseFloat(dDistanciaEVUC.value) * 0.003
    //Sumatorio total de las potencias
    Carga_Resp = Temp_Camara > Temp_Cong ? Select_Prederminado == 2 ? CP_Resp * Densidad * Volumen * Vol_Util * (24 / Time_Cong) / 50 : CP_Resp * Densidad * Volumen * Vol_Util * (24 / Time_Cong) : 0;
    Carga_Interna = Length_A_C * Length_B_D * TablaPrederminado[Select_Prederminado][4]
    Carga_Termica = (
        (Length_A_C + Delta_B + Delta_D) * (Height + Delta_Ceiling + Delta_Floor) / (Material_A * Delta_A) +
        (Length_B_D + Delta_A + Delta_C) * (Height + Delta_Ceiling + Delta_Floor) / (Material_B * Delta_B) +
        (Length_A_C + Delta_B + Delta_D) * (Height + Delta_Ceiling + Delta_Floor) / (Material_C * Delta_C) +
        (Length_B_D + Delta_A + Delta_C) * (Height + Delta_Ceiling + Delta_Floor) / (Material_D * Delta_D) +
        (Length_A_C + Delta_B + Delta_D) * (Length_B_D + Delta_A + Delta_C) / (Material_Ceiling * Delta_Ceiling) +
        (Length_A_C + Delta_B + Delta_D) * (Length_B_D + Delta_A + Delta_C) / (Material_Floor * Delta_Floor))
        * (Temp_Amb - Temp_Camara) * (24 / Time_Cong)
    CargaProducto = Temp_Carga > Temp_Cong ? Temp_Cong > Temp_Camara ? CP_NCong * (Temp_Carga - Temp_Cong) + CP_Cong * (Temp_Cong - Temp_Camara) + CP_Latente : CP_NCong * (Temp_Carga - Temp_Camara) : CP_Cong * (Temp_Carga - Temp_Camara)
    Carga_Producto = (PesoDiario * CargaProducto + PesoDiario * Envoltorio * CP_Envoltorio * (Temp_Carga - Temp_Camara)) / (24 * 3600) * (24 / Time_Cong) * (24 / Time_Comp)
    Carga_Aire = (Puerta_Check1 * (Puerta_Ancho1 * Math.pow(Puerta_Altura1, 1.5) * Select_Trafico1.toString().split("_")[Select_Prederminado]) + Puerta_Check2 * (Puerta_Ancho2 * Math.pow(Puerta_Altura2, 1.5) * Select_Trafico2.toString().split("_")[Select_Prederminado]) + Puerta_Check3 * (Puerta_Ancho3 * Math.pow(Puerta_Altura3, 1.5) * Select_Trafico3.toString().split("_")[Select_Prederminado])) * (AirAmb[1] / AirAmb[0] - AirCamara[1] / AirCamara[0]) / (24 * 3600)
    Carga_Fan = Volumen * 5
    Carga_Total = (parseFloat(Carga_Termica) + parseFloat(Carga_Interna) + parseFloat(Carga_Producto) + parseFloat(Carga_Aire) + parseFloat(Carga_Resp) + parseFloat(Carga_Fan)) * (1 + Otras_Cargas) / DistanciaEVUC
    Carga_Otra = Carga_Total * Otras_Cargas / DistanciaEVUC
    dCarga_Termica.value = Carga_Termica.toFixed(0) 
    dCarga_Interna.value = Carga_Interna.toFixed(0)
    dCarga_Producto.value = Carga_Producto.toFixed(0)
    dCarga_Aire.value = Carga_Aire.toFixed(0)
    dCarga_Resp.value = Carga_Resp.toFixed(0)
    dCarga_Fan.value = Carga_Fan.toFixed(0)
    dCarga_Otra.value = Carga_Otra.toFixed(0)
    dCarga_Total.value = Carga_Total.toFixed(0)
    //Graficas de las potencias
    yArray = [Carga_Termica, Carga_Aire, Carga_Interna, Carga_Producto, Carga_Resp, Carga_Fan, Carga_Otra];
    data = [{ labels: xArray, values: yArray, hole: .3, type: "pie", textinfo: "label+percent", textposition: 'inside' }];
    Plotly.newPlot("myPlotPotencia", data, layout)
    //Control de las cámaras de ColdKit.
    dTable_seleccion_camara.style.display = "none"
    dSeleccion_camara.style.display = "none"
    ddropdown_camara.innerHTML = ""
    document.getElementById("Suelo_Aislamiento_Check").checked ? RivaColdCamaraFilter = RivaColdCamara.filter(item => item.Suelo == "NO") : RivaColdCamaraFilter = RivaColdCamara.filter(item => item.Suelo == "SI")
    CamaraColdkit(RivaColdCamaraFilter, 10, 0)
    //Control de los equipos segun seleccion.
    Aplicacion = Select_Prederminado == 0 ? "LBP" : Select_Prederminado == 1 ? "MBP" : Select_Prederminado == 2 ? "HBP" : null
    RivaColdEqFilter = RivaColdEq.filter(item => item.Marca == "RivaCold").filter(item => item["Ficha producto_Stock disponible"] == "Si").filter(item => item.Aplicación == Aplicacion)
    dTable_seleccion_equipo.style.display = "none"
    dSeleccion_equipo.style.display = "none"
    ddropdown_equipo.innerHTML = ""
    EquipoRivaCold(RivaColdEqFilter, 10, 0)
}

function EquipoRivaCold(RivaColdEqFilter, n, num) {
    const DBField = Object.getOwnPropertyNames(RivaColdEqFilter[0]);
    Tamb = Temp_Amb
    Tcamara = Temp_Camara
    for (i = 0, len = RivaColdEqFilter.length; i < len; i++) {
        PFList = Interpol(Tamb, Tcamara, RivaColdEqFilter, DBField, i)
        Diff = (parseFloat(PFList) / Carga_Total - 1) * 100
        if (Diff > 0 && Diff < n) {
            TextoPerfil = ""
            for (j = 1; j < 10; j++) {
                RivaColdEqFilter[i]["Config" + j] ? TextoPerfil = TextoPerfil + "Caracterítica: " + RivaColdEqFilter[i]["Config" + j] + "<br>" : null
            }
            RivaColdEqFilter[i]["Precio"] ? TextoPerfil = TextoPerfil + "P.V.: " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(RivaColdEqFilter[i]["Precio"])) + "<br>" : null
            ddropdown_equipo.insertAdjacentHTML("beforeend",
                "<li><a class='dropdown-item' onclick='ShowSelectionEquipo(" + num + ")'>" +
                "Código: " + RivaColdEqFilter[i]["Ref"] + "<br>" + TextoPerfil +
                "Potencia frigorifica: " + PFList + " (" + Diff.toFixed(2) + " %)" +
                "</a></li>"
            )
            num += 1
        }
    }
    num < 5 && n < 100 ? EquipoRivaCold(RivaColdEqFilter, n + 5, num) : null
}

function CamaraColdkit(RivaColdCamaraFilter, n, num) {
    num = 0
    for (i = 0, len = RivaColdCamaraFilter.length; i < len; i++) {
        relacionG = parseFloat(RivaColdCamaraFilter[i]["Grosor"]) - 1000 * Delta_A
        relacionH = parseFloat(RivaColdCamaraFilter[i]["AlturaI"]) - 1000 * Height
        relacionL1 = parseFloat(RivaColdCamaraFilter[i]["LargoI"]) - 1000 * Length_A_C
        relacionA1 = parseFloat(RivaColdCamaraFilter[i]["AnchoI"]) - 1000 * Length_B_D
        relacionL2 = parseFloat(RivaColdCamaraFilter[i]["LargoI"]) - 1000 * Length_B_D
        relacionA2 = parseFloat(RivaColdCamaraFilter[i]["AnchoI"]) - 1000 * Length_A_C
        if (relacionG >= -n && relacionG <= n) {
            if (relacionH >= -10 * n && relacionH <= 10 * n) {
                if ((relacionL1 >= -20 * n && relacionL1 <= 20 * n && relacionA1 >= -20 * n && relacionA1 <= 20 * n) ||
                    (relacionL2 >= -20 * n && relacionL2 <= 20 * n && relacionA2 >= -20 * n && relacionA2 <= 20 * n)) {
                    TextoPerfil = ""
                    RivaColdCamaraFilter[i]["Perfil Sanitario_VT"] > 0 ? TextoPerfil = TextoPerfil + "Perfil Sanit. Vert.+Techo: " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(RivaColdCamaraFilter[i]["Perfil Sanitario_VT"])) + "<br>" : null
                    RivaColdCamaraFilter[i]["Perfil Sanitario_VST"] > 0 ? TextoPerfil = TextoPerfil + "Perfil Sanit. Vert.+Suelo+Techo: " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(RivaColdCamaraFilter[i]["Perfil Sanitario_VST"])) + "<br>" : null
                    RivaColdCamaraFilter[i]["Perfil Sanitario_S"] > 0 ? TextoPerfil = TextoPerfil + "Perfil Sanit. Suelo: " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(RivaColdCamaraFilter[i]["Perfil Sanitario_S"])) + "<br>" : null
                    RivaColdCamaraFilter[i]["Suelo"] == "Si" ? TextoPuerta = "800x1900x140" : TextoPuerta = "800x1900x80"
                    document.getElementById("dropdown_camara").insertAdjacentHTML("beforeend",
                        "<li><a class='dropdown-item' onclick='ShowSelectionCamara(" + num + ")'>" +
                        "Marca: " + RivaColdCamaraFilter[i]["Gama"] + "<br>" +
                        "Código: " + RivaColdCamaraFilter[i]["Codigo"] + "<br>" +
                        "Espesor: " + RivaColdCamaraFilter[i]["Grosor"] + " mm<br>" +
                        "Vol. Int.: " + RivaColdCamaraFilter[i]["VolumenI"].toFixed(2) + " m3<br>" +
                        "Dim. Int.: " + RivaColdCamaraFilter[i]["AlturaI"] + "x" + RivaColdCamaraFilter[i]["AnchoI"] + "x" + RivaColdCamaraFilter[i]["LargoI"] + " mm<br>" +
                        "Dim. Ext.: " + RivaColdCamaraFilter[i]["AlturaE"] + "x" + RivaColdCamaraFilter[i]["AnchoE"] + "x" + RivaColdCamaraFilter[i]["LargoE"] + " mm<br>" +
                        "Dim. Puerta: " + TextoPuerta + " mm<br>" +
                        "P.V. Cámara: " + new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(RivaColdCamaraFilter[i]["Precio"])) + "<br>" +
                        TextoPerfil + "</a></li>"
                    )
                    num += 1
                }
            }
        }
    }
    num < 5 && n < 100 ? CamaraColdkit(RivaColdCamaraFilter, n + 5, num) : null
}

const dTable_seleccion_camara = document.getElementById("Table_seleccion_camara")
const dSeleccion_camara = document.getElementById("Seleccion_camara")
const ddropdown_camara = document.getElementById("dropdown_camara")
const dTable_seleccion_equipo = document.getElementById("Table_seleccion_equipo")
const dSeleccion_equipo = document.getElementById("Seleccion_equipo")
const ddropdown_equipo = document.getElementById("dropdown_equipo")

function ShowSelectionCamara(num) {
    dTable_seleccion_camara.style.display = ""
    dSeleccion_camara.style.display = ""
    dSeleccion_camara.innerHTML = ddropdown_camara.getElementsByTagName('a')[num].innerHTML
}
function ShowSelectionEquipo(num) {
    dTable_seleccion_equipo.style.display = ""
    dSeleccion_equipo.style.display = ""
    dSeleccion_equipo.innerHTML = ddropdown_equipo.getElementsByTagName('a')[num].innerHTML
}

const dInput = document.getElementsByTagName("input")
function Unidad() {
    for (i = 0, ilen = dInput.length; i < ilen; i++) {
        dInput[i].value = parseFloat(dInput[i].value) + " " + dInput[i].name
    }
}
function Aislamiento_Suelo() {
    if (document.getElementById("Suelo_Aislamiento_Check").checked) {
        dDelta_Floor.value = 300
        dMaterial_Floor.value = 6.66
    } else {
        dDelta_Floor.value = dDelta_Ceiling.value
        dMaterial_Floor.value = dMaterial_Ceiling.value
    }
}

const Coef =
    [[-5800.2206, 1.3914993, -0.048640239, 0.000041764768, -0.000000014452093, 0, 6.5459673],
    [-5674.5359, 6.3925247, -0.009677843, 0.00000062215701, 0.0000000020747825, -0.0000000000009484024, 4.1635019]]
const P = 101325

function CalcAirParameter(Temp, HR) {
    Temp = parseFloat(Temp)
    HR = parseFloat(HR) / 100
    TempK = Temp + 273.16
    n = Temp < 0 ? 1 : 0
    Pws = Math.exp(Coef[n][0] / TempK + Coef[n][1] + Coef[n][2] * TempK + Coef[n][3] * Math.pow(TempK, 2) + Coef[n][4] * Math.pow(TempK, 3) + Coef[n][5] * Math.pow(TempK, 4) + Coef[n][6] * Math.log(TempK))
    W = 0.62198 * HR * Pws / (P - HR * Pws)
    v = 0.2870551882 * TempK / P * 1000 * (1 + 1.6078 * W)
    h = 1.006 * Temp + W * (2501 + 1.88 * (Temp))
    return [v, h * 1000]
}
function Grosor() {
    dDelta_Ceiling.value == dDelta_Floor.value ? dDelta_Floor.value = dDelta_A.value : null
    dDelta_Ceiling.value = dDelta_A.value
    dDelta_B.value = dDelta_A.value
    dDelta_C.value = dDelta_A.value
    dDelta_D.value = dDelta_A.value
}
function Material() {
    dMaterial_B.value = dMaterial_A.value
    dMaterial_C.value = dMaterial_A.value
    dMaterial_D.value = dMaterial_A.value
    dMaterial_Ceiling.value = dMaterial_A.value
    dMaterial_Floor.value = dMaterial_A.value
}

var RivaColdCamara = []
const localforage = require("localforage");
localforage.getItem("RivaColdCamara").then(function (value) {
    RivaColdCamara = JSON.parse(value)
    localforage.getItem("RivaColdEq").then(function (value) {
        RivaColdEq = JSON.parse(value)
        CatalogProduct()
        PreterminadoProducto()
    })
})