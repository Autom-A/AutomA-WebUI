/** 
* Render globally all recommendations based on session storage recommendations
*/

const TYPE_TABLE_ENUM = {
    "RECOMMENDATIONS" : 0,
    "INVENTORY" : 1
}

const TYPE_STORAGE = {
    "SESSION": 0,
    "LOCAL": 1
}

function renderTable(containerID, storageItemName, tableType, storageType) {
    let container = document.getElementById(containerID)

    // clear table before filling
    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }

    let allItems;
    switch (storageType) {
        case TYPE_STORAGE.SESSION:
            allItems = JSON.parse(sessionStorage.getItem(storageItemName))
            break
        case TYPE_STORAGE.LOCAL:
            allItems = JSON.parse(localStorage.getItem(storageItemName))
            break
        default:
            print("renderTable() : Switch case default (no storage)")
            break;
    }

    switch (tableType) {
        case TYPE_TABLE_ENUM.INVENTORY:
            if (allItems != null) allItems = allItems.hosts
            break;
    }

    if (allItems == null) allItems = []

    for (let i = 0; i < allItems.length; i++) {
        const item = allItems[i];
        let tableLine;
        switch (tableType) {
            case TYPE_TABLE_ENUM.RECOMMENDATIONS:
                tableLine = renderRecommendationLine(item)
                break;
            case TYPE_TABLE_ENUM.INVENTORY:
                tableLine = renderInventoryLine(item)
                break
            default:
                print("renderTable() : Switch case default")
                break;
        }
        container.appendChild(tableLine)
    }
}

/**
 * Check the radio btn of a recommendation line
 * @param {uuid} _id id of recommendation 
 */
function checkRadioBtn(_id) {
    let recommendation_line = document.getElementById(_id)
    let radio_btn = recommendation_line.querySelector("#r-radio-btn")
    radio_btn.innerText = RADIO_BUTTON_CHECKED_VALUE
}

/** 
* Render recommendation line adding elements to the DOM
* @param {Recommendation} item Recommendation retrieve by the back
*/
function renderRecommendationLine(item) {
    let line = document.createElement("tr")
    line.setAttribute("id", item["_id"])
    
    let c_selected = generateButtonRadio(line, item["_id"]);

    line.onclick = (event) => {
        if(event.originalTarget.getAttribute("skipEvent") != 1) {
            getQuestion(line.getAttribute("id"))
        }

        event.originalTarget.setAttribute("skipEvent","0")
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

    let a = document.createElement("a")
    a.setAttribute("id","r-radio-btn")
    a.classList.add("prevent-select", "material-symbols-outlined")
    a.innerText = innerRadioValue

    a.onclick = () => {
        if (a.innerText == RADIO_BUTTON_CHECKED_VALUE) {
            a.innerText = RADIO_BUTTON_UNCHECKED_VALUE
            a.setAttribute("skipEvent","1")
            unSavedIdSelected(id)
        }
    }

    c_selected.appendChild(a)
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
            let container = document.getElementById(containerID)
            container.appendChild(lineToAdd)
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
    let labelPasswordKeyfile = document.getElementById("label-password-keyfile");
    let selectConnectionMethod = document.getElementById("select-connection");
    if (selectConnectionMethod.value == "0") {
        labelPasswordKeyfile.innerText = "Password";
    } else if (selectConnectionMethod.value == "1") {
        labelPasswordKeyfile.innerText = "Keyfile";
    }
}

function addHostInTable() {
    let hostItem = retrieveInventoryTableInput();
    
    let inventory = JSON.parse(localStorage.getItem("inventory"));
    if (inventory == null) inventory = {"hosts":[]}
    else {
        hosts = inventory.hosts
        for (let i = 0; i < hosts.length; i++) {
            const host = hosts[i];
            if (host.hostname == hostItem.hostname) {
                M.toast({ html: 'ERROR : An host with the same name already exists', classes: 'rounded' });
                return;
            } else if (host.ip == hostItem.ip && host.port == hostItem.port) {
                M.toast({ html: 'ERROR : An host with the same pair ip:port already exists', classes: 'rounded' });
                return;
            } else if (hostItem.ip < 0 || hostItem.ip > 65535) {
                M.toast({ html: 'ERROR : The port specified is not correct, out from the range [0:65535[', classes: 'rounded' });
                return;
            } else if (hostItem.hostname.length == 0 || hostItem.ip.length == 0 || hostItem.passwordOrKeyfile.length == 0
                        || hostItem.username.length == 0 || hostItem.sudoPassword.length == 0 || hostItem.sudoUsername.length == 0) {
                M.toast({ html: 'ERROR : All fields must be filled', classes: 'rounded' });
                return;
            }
        }
    }

    inventory.hosts.push(hostItem)
    localStorage.setItem("inventory", JSON.stringify(inventory))

    addLineInTable(hostItem, TYPE_TABLE_ENUM.INVENTORY);
}