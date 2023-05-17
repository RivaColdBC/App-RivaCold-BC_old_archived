const List = [{
    Title: "", ImageData: "", TextBefore: "", TextAfter: "", Display: ""
}, {
    Title: "Entrada Oferta y ficha",
    TextBefore: "Te adjunto la oferta y la ficha técnica."
}, {
    Title: "Entrada Oferta y fichas",
    TextBefore: "Te adjunto la oferta y las fichas técnicas."
}, {
    Title: "Selección por potencia",
    TextBefore: "Se ha realizado la selección según equipo <strong>???</strong>, <strong>???</strong>, temperatura ambiente +43ºC, temperatura de cámara <strong>???</strong> ºC y potencia frigorífica de <strong>???</strong> kW"
}, {
    Title: "Selección por dimensión",
    TextBefore: "Se ha realizado la selección según equipo <strong>???</strong>, <strong>???</strong>, temperatura ambiente +43ºC, temperatura de cámara <strong>???</strong> ºC y dimensión de <strong>???</strong> m3",
}, {
    Title: "Interconnexion Master-Slaves Carel",
    TextBefore: "Los equipos se interconectan mediante la conexión Máster-Slave mediante el opcional OPT-N-BS con conexión RS485.",
}, {
    Title: "Interconnexion Master-Slaves Dixell",
    TextBefore: "Los equipos se interconectan mediante la conexión Máster-Slave con conexión RS485.",
}, {
    Title: "Condición de cálculo",
    ImageData: ["60-100-60.jpg", "80-100-60.jpg", "100-100-60.jpg", "100-100-100.jpg"],
    TextBefore: "Las condiciones de cálculo son:",
    TextAfter: "Si alguna de las condiciones no fuera correcta indícamelo.",
}, {
    Title: "Plazo de entrega",
    TextBefore: "El plazo de entrega es de <strong>???</strong> semanas laborables a confirmar en el momento del pedido y siempre sujeto a disponibilidad de componentes.",
}, {
    Title: "Stock disponible",
    TextBefore: "El plazo de entrega es inmediato (salvo venta).",
},]

for (i = 1; i < List.length; i++) {
    SelectImage = ""; ImageSrc = ""
    if (List[i].ImageData && List[i].ImageData.length > 1) {
        SelectImage = `<select class="form-select" onchange="changeSrc(${i})" id="select_${i}">`
        for (image in List[i].ImageData) { SelectImage += `<option value="${image}">${List[i].ImageData[image]}</option>` }
        SelectImage += `</select>`
        ImageSrc = `<br><img class="img-fluid" src="./resources/${List[i].ImageData[0]}"><br>`
    } else if (List[i].ImageFolder) {
        ImageSrc = `<img class="img-fluid" src="./resources/${List[i].ImageData}"><br>`
    }
    document.getElementById("text").insertAdjacentHTML(
        "beforeend", `<div id="div_${i}" style="display:${List[i].Display || ""}">
        ${List[i].TextBefore || ""}${ImageSrc || ""}${List[i].TextAfter || ""}
        <br><br></div>`
    )
    document.getElementById("menu").insertAdjacentHTML(
        "beforeend", `<button type="button" class="btn btn-primary" onclick="displayLabel(${i})">${List[i].Title}</button>${SelectImage}`
    )
}
function displayLabel(i) {
    document.getElementById(`div_${i}`).style.display = document.getElementById(`div_${i}`).style.display == "" ? "none" : ""
}
function changeSrc(i) {
    document.getElementById(`div_${i}`).getElementsByTagName("img")[0].src = `./resources/${List[i].ImageData[document.getElementById(`select_${i}`).value]}`
} 
