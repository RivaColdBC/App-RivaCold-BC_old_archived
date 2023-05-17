function NumberFormatEUR(num) {
    if (num) {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(ParseNumber(num))
    } else {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(0))
    }
} function FormatEUR(num) {
    if (num) {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(num))
    } else {
        return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(parseFloat(0))
    }
}

function ParseNumber(num) {
    if (num) {
        num = num.toString()
    } else {
        return 0
    }
    if (num.split(",").length == 1) {
        return parseFloat(num)
    }
    return parseFloat(num.split(",")[0].replace(".", "")) + parseFloat("0." + num.split(",")[1])
}

function PerCent(A, B, Fixed) {
    if (A && B) {
        return (ParseNumber(A) / ParseNumber(B) * 100).toFixed(Fixed) + " %"
    } else if (B) {
        return ((0).toFixed(Fixed) + " %")
    }
    return ("- %")
}

function PerCent1(A, Fixed) {
    if (A) {
        return (ParseNumber(A)).toFixed(Fixed) + " %"
    } return ((0).toFixed(Fixed) + " %")

}

function PerCent1coma(A, Fixed) {
    if (A) {
        return ((ParseNumber(A)).toFixed(Fixed) + " %").replace(".", ",")
    } return ((0).toFixed(Fixed) + " %").replace(".", ",")
}

