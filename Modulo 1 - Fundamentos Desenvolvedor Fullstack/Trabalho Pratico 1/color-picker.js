
window.addEventListener("load", start);

function start() {
    document.getElementById("picker-red").addEventListener('change', didChangePickerValue)
    document.getElementById("picker-green").addEventListener('change', didChangePickerValue)
    document.getElementById("picker-blue").addEventListener('change', didChangePickerValue)
    didChangePickerValue()
}

function didChangePickerValue() {
    var inputRed = document.getElementById("input-red")
    var inputGreen = document.getElementById("input-green")
    var inputBlue = document.getElementById("input-blue")
    switch (this.id) {
        case 'picker-red':
            inputRed.value = this.value
            break
        case 'picker-green':
            inputGreen.value = this.value
            break
        case 'picker-blue':
            inputBlue.value = this.value
            break
    }

    document.getElementById("squareColor").style.backgroundColor = "rgb("+inputRed.value+","+inputGreen.value+","+inputBlue.value+")"
}