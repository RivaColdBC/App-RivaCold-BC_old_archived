function getHash(str, algo = "SHA-256") {
    strBuf = new TextEncoder().encode(str);
    return crypto.subtle.digest(algo, strBuf).then(hash => {
        window.hash = hash;
        result = '';
        view = new DataView(hash);
        for (i = 0, ilen = hash.byteLength; i < ilen; i += 4) {
            result += ('00000000' + view.getUint32(i).toString(16)).slice(-8);
        }
        return result;
    });
}
