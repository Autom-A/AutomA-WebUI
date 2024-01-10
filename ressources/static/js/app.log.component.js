const socket = io();
socket.on("connect", () => { })
socket.on("logEvent", (logData) => {
    addLogLine(logData)
})

let hasToScroll = true

function setBtnToReopenLog() {
    if (localStorage.getItem("openLogHelp") == "true" || localStorage.getItem("openLogHelp") == null) {
        let taps = document.querySelectorAll('.tap-target');
        M.TapTarget.init(taps, {onClose : () => {
            localStorage.setItem("openLogHelp","false")
            document.getElementById("btn-modal-log-target").parentElement.style.display = "none"
            document.querySelector("html").style["overflow-y"] = "scroll"
        }});
        
        M.TapTarget.getInstance(document.getElementById("btn-modal-log-target")).open()
        document.querySelector("html").style["overflow-y"] = "hidden"
    }
    document.getElementById("btn-modal-log").classList.remove("invisible")
}

function openLogModal() {
    let logModal = M.Modal.getInstance(document.getElementById("log-modal"))
    logModal.open()
}

function addLogLine(logData) {
    logContainer = document.getElementsByClassName("log-container").item(0)

    let logLine = logData.data.split("\n")

    for (let i = 0; i < logLine.length; i++) {
        let logPart = logLine[i].trim();

        if (logPart.length > 0) {
            p = paragraphColor(logPart)
            logContainer.appendChild(p)

            autoScroll(logContainer)
        }
    }
}

function disableAutoScroll() {
    hasToScroll = false
}

function activateAutoScroll() {
    hasToScroll = true
}

function autoScroll(container) {
    if (hasToScroll) container.scrollTop = container.scrollHeight
}

function paragraphColor(logPart) {
    let p = document.createElement("p")
    p.classList.add("no-margin")

    const fontModifier = {
        "0" : "normal",
        "1" : "bold"
    }
    
    const colorModifier = {
        "30" : "black",
        "31" : "red",
        "32" : "green",
        "33" : "amber",
        "34" : "blue",
        "35" : "purple",
        "36" : "cyan",
        "37" : "white"
    }

    let regex = /(\u001b\[([0-9]);([0-9][0-9])m([^\u001b]+)\u001b\[0m)|([^\u001b]+)/g;
    let groups = [...logPart.matchAll(regex)]

    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        
        let span = document.createElement("span");
        if (group[2] == undefined || group[3] == undefined ){
            span.innerText = group[0]
        } else {
            span.innerText = group[4]
            span.classList.add(fontModifier[group[2]],`${colorModifier[group[3]]}-text`)
        }

        p.appendChild(span)
    }

    return p
}