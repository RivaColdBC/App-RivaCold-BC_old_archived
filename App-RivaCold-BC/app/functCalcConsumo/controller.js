const dInput = document.getElementsByTagName("input")

function Unidad() {
    for (i = 0, ilen = dInput.length; i < ilen; i++) {
        dInput[i].value = parseFloat(dInput[i].value) + " " + dInput[i].name
    }
}

function CalcPotencia() {
    function Calc(tb) {
        document.getElementById("COP" + tb).value = (parseFloat(document.getElementById("Pf" + tb).value) / parseFloat(document.getElementById("Pc" + tb).value)).toFixed(2)
        document.getElementById("Ced" + tb).value = (parseFloat(document.getElementById("Pc" + tb).value) * parseFloat(document.getElementById("Tf" + tb).value) / 1000).toFixed(2)
        document.getElementById("Qed" + tb).value = (parseFloat(document.getElementById("Ced" + tb).value) * parseFloat(document.getElementById("Ce" + tb).value)).toFixed(2)
        document.getElementById("Qea" + tb).value = (parseFloat(document.getElementById("Qed" + tb).value) * 365).toFixed(2)
    }
    Calc("_1")
    Calc("_2")
    document.getElementById("Diff").value = document.getElementById("Qea_1").value - document.getElementById("Qea_2").value
    Unidad()
}
CalcPotencia()