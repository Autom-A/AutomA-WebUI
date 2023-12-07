/** 
* Render globally all recommendations based on session storage recommendations
*/

const TYPE_TABLE_ENUM = {
    "RECOMMENDATIONS" : 0,
    "INVENTORY" : 1
}

function renderTable(containerID, storageItemName, tableType) {
    let container = document.getElementById(containerID)

    // clear table before filling
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }

    let allItems = JSON.parse(sessionStorage.getItem(storageItemName))
    for (let i = 0; i < allItems.length; i++) {
        const item = allItems[i];
        let tableLine;
        switch (tableType) {
            case TYPE_TABLE_ENUM.RECOMMENDATIONS:
                tableLine = renderRecommendationLine(item)
                var elems = document.querySelectorAll('.dropdown-trigger');
                M.Dropdown.init(elems, {});
                break;
            case TYPE_TABLE_ENUM.INVENTORY:
                tableLine = renderInventoryLine(item)
            default:
                print("renderTable() : Switch case default")
                break;
        }
        container.appendChild(tableLine)
    }
}

/** 
* Render recommendation line adding elements to the DOM
* @param {Recommendation} item Recommendation retrieve by the back
*/
function renderRecommendationLine(item) {
    let line = document.createElement("tr")
    line.setAttribute("id", item["_id"])
    
    let c_selected = generateButtonRadio(line, item["_id"]);

    line.onclick = () => {
        if(c_selected.innerText == RADIO_BUTTON_UNCHECKED_VALUE) {
            getQuestion(line.getAttribute("id"))
        } else {
            c_selected.children[0].innerText = RADIO_BUTTON_UNCHECKED_VALUE
            unSavedIdSelected(item["_id"])
        }
    }


    line.appendChild(renderCell(item["id"]))
    line.appendChild(renderCell(item["name"]))
    line.appendChild(renderCell(item["category"]))
    line.appendChild(renderCell(item["level"]))
    line.appendChild(renderCell(item["from"]))

    return line
}

/** 
* Generate button radio and fill it from local storage
* @param {Recommendation} line - Recommendation line HTML
* @param {string} id - ID Item
* @returns {HTMLElement} th element containing a element with radio.
*/
function generateButtonRadio(line, id) {
    let c_selected = document.createElement("th");
    let ids = JSON.parse(localStorage.getItem(SELECTED_ID_STORAGE))
    let innerRadioValue = RADIO_BUTTON_UNCHECKED_VALUE
    if(ids && ids.length && ids.findIndex(val => val == id) != -1) {
        innerRadioValue = RADIO_BUTTON_CHECKED_VALUE
    }
    c_selected.innerHTML = `<a id="r-radio-btn" class=material-symbols-outlined>${innerRadioValue}</a>`;
    line.appendChild(c_selected);
    return c_selected;
}

/** 
* Unsave id from the local storage
* @param {string} id - ID Item
*/
function unSavedIdSelected(_id) {
    let ids = JSON.parse(localStorage.getItem(SELECTED_ID_STORAGE))
    if(ids && ids.length) {
        ids = ids.filter((val) => val != _id)
        localStorage.setItem(SELECTED_ID_STORAGE,JSON.stringify(ids))
    }
}

/** 
* Render inventory line adding elements to the DOM
* @param {Inventory} host Host from inventory
*/
function renderInventoryLine(host) {
    let line = document.createElement("tr")
    line.setAttribute("id", host["hostname"])

    line.appendChild(renderCell(host["hostname"]))
    line.appendChild(renderCell(host["ip"]))
    line.appendChild(renderCell(host["port"]))

    if (host["connection"] == "0") line.appendChild(renderCell("Password based"))
    else if (host["connection"] == "1") line.appendChild(renderCell("Keyfile based"))
    
    line.appendChild(renderCell(host["username"]))
    line.appendChild(renderCell(host["passwordOrKeyfile"]))
    line.appendChild(renderCell(host["sudoUsername"]))
    line.appendChild(renderCell(host["sudoPassword"]))

    return line
}

/** 
* Render cell 
* @param {Recommendation} textDisplayed Text added in the celle
*/
function renderCell(textDisplayed) {
    let cell = document.createElement("th")
    cell.innerText = textDisplayed
    return cell
}

function addLineInTable(item, tableType) {
    let lineToAdd;
    let containerID;
    switch (tableType) {
        case TYPE_TABLE_ENUM.INVENTORY:
            lineToAdd = renderInventoryLine(item)
            containerID = "inventory-container"
            break;
        default:
            print("addLineInTable() : Switch case default")
            break;
    }

    if (lineToAdd != null) {
        let container = document.getElementById(containerID)
        container.insertBefore(lineToAdd, container.firstChild)
    }
}

function retrieveInventoryTableInput() {
    let inventoryInput = document.getElementById("inventory-input")

    let hostname = inventoryInput.querySelector("#input-name").value
    let ip = inventoryInput.querySelector("#input-ip").value
    let port = inventoryInput.querySelector("#input-port").value
    let connection = inventoryInput.querySelector("#select-connection").value
    let username = inventoryInput.querySelector("#input-username").value
    let passwordOrKeyfile = inventoryInput.querySelector("#input-password-keyfile").value
    let sudoUsername = inventoryInput.querySelector("#input-sudo-username").value
    let sudoPassword = inventoryInput.querySelector("#input-sudo-password").value
    
    let host = {
        "hostname": hostname,
        "ip": ip,
        "port": parseInt(port),
        "connection": parseInt(connection),
        "username": username,
        "passwordOrKeyfile": passwordOrKeyfile,
        "sudoUsername": sudoUsername,
        "sudoPassword": sudoPassword
    }

    return host
}

function fillAuthFromConnectionMethodValue() {
    let labelPasswordKeyfile = document.getElementById("label-password-keyfile")
    let selectConnectionMethod = document.getElementById("select-connection")
    if (selectConnectionMethod.value == "0") {
        labelPasswordKeyfile.innerText = "Password"
    } else if (selectConnectionMethod.value == "1") {
        labelPasswordKeyfile.innerText = "Keyfile"
    }
}
