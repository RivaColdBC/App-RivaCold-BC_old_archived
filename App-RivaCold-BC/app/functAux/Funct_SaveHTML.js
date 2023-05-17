function saveHTML(id, StorageItem) {
    localStorage.setItem(StorageItem + "HTML", document.getElementById(id).innerHTML)
    loopSave("input", id, StorageItem)
    loopSave("select", id, StorageItem)
}

function loopSave(Tag, id, StorageItem) {
    Array = []
    for (i = 0, ilen = document.getElementById(id).getElementsByTagName(Tag).length; i < ilen; i++) {
        Array[i] = document.getElementById(id).getElementsByTagName(Tag)[i].value
    }
    localStorage.setItem(StorageItem + Tag, JSON.stringify(Array))
}

function writeHTML(id, StorageItem) {
    if (localStorage.getItem(StorageItem + "HTML")) {
        document.getElementById(id).innerHTML = localStorage.getItem(StorageItem + "HTML")
        loopWrite("input", id, StorageItem)
        loopWrite("select", id, StorageItem)
    }
}
function loopWrite(Tag, id, StorageItem) {
    Array = JSON.parse(localStorage.getItem(StorageItem + Tag))
    for (i = 0, ilen = document.getElementById(id).getElementsByTagName(Tag).length; i < ilen; i++) {
        document.getElementById(id).getElementsByTagName(Tag)[i].value = Array[i]
    }
}
function clearHTML(StorageItem) {
    localStorage.removeItem(StorageItem + "HTML");
    localStorage.removeItem(StorageItem + "input");
}