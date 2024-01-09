const socket = io();

socket.on("connect", () => { })

socket.on("logEvent", (logData) => {
    addLogLine(logData)
})

function addLogLine(logData) {
    logContainer = document.getElementsByClassName("log-container")[0]

    let logLine = logData.data.split("\n")

    for (let i = 0; i < logLine.length; i++) {
        let logPart = logLine[i].trim();

        if (logPart.length > 0) {
            p = paragraphColor(logPart)
            logContainer.appendChild(p)
        }
    }
}

function paragraphColor(logPart) {
    let p = document.createElement("p")

    const fontModifier = {
        "0" : "normal",
        "1" : "bold"
    }
    
    const colorModifier = {
        "30" : "black",
        "31" : "red",
        "32" : "green",
        "33" : "yellow",
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