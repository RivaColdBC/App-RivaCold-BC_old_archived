function Interpol(Tamb, Tcamara, MarcaB, MarcaBField, i) {
    MarcaBFieldlength = MarcaBField.length
    for (item of MarcaBField) {
        if (MarcaB[i][item] && Tamb == parseFloat(item.split("_")[1]) && Tcamara == parseFloat(item.split("_")[2])) {
            return parseFloat(MarcaB[i][item]).toFixed(0) + " W";
        }
    }
    positive = false, negative = false;
    for (item of MarcaBField) {
        if (Tcamara == parseFloat(item.split("_")[2]) && item.startsWith("PC_")) {
            for (iamb = 1; iamb < 30; iamb++) {
                if (Tamb + iamb == parseFloat(item.split("_")[1]) && MarcaB[i][item] && !positive) {
                    Tambip = Tamb + iamb;
                    PFeqip = parseFloat(MarcaB[i][item]);
                    positive = true;
                }
                if (Tamb - iamb == parseFloat(item.split("_")[1]) && MarcaB[i][item] && !negative) {
                    Tambin = Tamb - iamb;
                    PFeqin = parseFloat(MarcaB[i][item]);
                    negative = true;
                }
            }
        }
    }
    if (positive && negative) {
        return Interpolacion(Tamb, Tambip, Tambin, PFeqip, PFeqin) + " W (*)";
    } else if (positive && !negative) {
        for (item of MarcaBField) {
            if (Tcamara == parseFloat(item.split("_")[2]) && item.startsWith("PC_")) {
                for (iamb = 1; iamb < 30; iamb++) {
                    if (Tambip + iamb == parseFloat(item.split("_")[1]) && MarcaB[i][item]) {
                        return (Interpolacion(Tamb, Tambip, Tambip + iamb, PFeqip, parseFloat(MarcaB[i][item])) + " W (+)");
                    }
                }
            }
        }
    } else if (!positive && negative) {
        for (item of MarcaBField) {
            if (Tcamara == parseFloat(item.split("_")[2]) && item.startsWith("PC_")) {
                for (iamb = 1; iamb < 30; iamb++) {
                    if (Tambin - iamb == parseFloat(item.split("_")[1]) && MarcaB[i][item]
                    ) { return (Interpolacion(Tamb, Tambin - iamb, Tambin, parseFloat(MarcaB[i][item]), PFeqin) + " W (-)"); }
                }
            }
        }
    } else {
        for (item of MarcaBField) {
            if (Tamb == parseFloat(item.split("_")[1]) && item.startsWith("PC_")) {
                for (icamara = 1; icamara < 30; icamara++) {
                    if (Tcamara + icamara == parseFloat(item.split("_")[2]) && MarcaB[i][item] && !positive) {
                        Tcamaraip = Tcamara + icamara;
                        PFeqip = parseFloat(MarcaB[i][item]);
                        positive = 1;
                    }
                }
            }
            if (Tamb == parseFloat(item.split("_")[1]) && item.startsWith("PC_")) {
                for (icamara = 1; icamara < 30; icamara++) {
                    if (
                        Tcamara - icamara == parseFloat(item.split("_")[2]) &&
                        MarcaB[i][item] &&
                        !negative
                    ) {
                        Tcamarain = Tcamara - icamara;
                        PFeqin = parseFloat(MarcaB[i][item]);
                        negative = 1;
                    }
                }
            }
        }

        if (positive && negative) {
            return (
                Interpolacion(Tcamara, Tcamaraip, Tcamarain, PFeqip, PFeqin) + "W (*)"
            );
        } else if (positive && !negative) {
            for (item of MarcaBField) {
                if (
                    Tamb == parseFloat(item.split("_")[1]) &&
                    item.startsWith("PC_")
                ) {
                    for (icamara = 1; icamara < 30; icamara++) {
                        if (
                            parseFloat(Tcamaraip) + icamara ==
                            parseFloat(item.split("_")[2]) &&
                            MarcaB[i][item]
                        ) {
                            Tcamarain = parseFloat(Tcamaraip) + icamara;
                            PFeqin = parseFloat(MarcaB[i][item]);
                            return (
                                Interpolacion(Tcamara, Tcamaraip, Tcamarain, PFeqip, PFeqin) +
                                " W (+)"
                            );
                        }
                    }
                }
            }
        } else if (!positive && negative) {
            for (item of MarcaBField) {
                if (
                    Tamb == parseFloat(item.split("_")[1]) &&
                    item.startsWith("PC_")
                ) {
                    for (icamara = 1; icamara < 30; icamara++) {
                        if (
                            parseFloat(Tcamarain) - icamara == parseFloat(item.split("_")[2]) && MarcaB[i][item]
                        ) {
                            Tcamaraip = parseFloat(Tcamarain) - icamara;
                            PFeqip = parseFloat(MarcaB[i][item]);
                            return (
                                Interpolacion(Tcamara, Tcamaraip, Tcamarain, PFeqip, PFeqin) +
                                " W (-)"
                            );
                        }
                    }
                }
            }
        }
    }
    return "-";
}

function Interpolacion(x, x1, x2, y1, y2) {
    y = (y1 - ((y1 - y2) * (x1 - x)) / (x1 - x2)).toFixed(0);
    return y;
}