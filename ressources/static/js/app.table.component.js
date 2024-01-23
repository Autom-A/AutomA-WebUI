/** 
* Render globally all recommendations based on session storage recommendations
*/

const TYPE_TABLE_ENUM = {
    "RECOMMENDATIONS": 0,
    "INVENTORY": 1
}

const TYPE_STORAGE = {
    "SESSION": 0,
    "LOCAL": 1
}

const TYPE_INPUT = {
    "TEXT": 0,
    "SELECT": 1,
}

/**
 * Render a table. This function call the right table renderer according to the tableType arg.
 * @param {string} containerID - Container where the table must be append
 * @param {string} storageItemName - Name of the item to retrieve
 * @param {TYPE_TABLE_ENUM} tableType - RECOMMENDATIONS or INVENTORY
 * @param {TYPE_STORAGE} storageType - SESSION or LOCAL - stands for sessionStorage and localStorage
 */
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
        if (event.target.getAttribute("skipEvent") != 1) {
            getQuestion(line.getAttribute("id"))
        }

        event.target.setAttribute("skipEvent", "0")
    }

    line.appendChild(c_selected);

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
    if (ids && ids.length && ids.findIndex(val => val == id) != -1) {
        innerRadioValue = RADIO_BUTTON_CHECKED_VALUE
    }

    let a = document.createElement("a")
    a.setAttribute("id", "r-radio-btn")
    a.classList.add("prevent-select", "material-symbols-outlined", "clickable")
    a.innerText = innerRadioValue

    a.onclick = () => {
        if (a.innerText == RADIO_BUTTON_CHECKED_VALUE) {
            a.innerText = RADIO_BUTTON_UNCHECKED_VALUE
            a.setAttribute("skipEvent", "1")
            unSavedIdSelected(id)
        }
    }

    c_selected.appendChild(a)
    return c_selected;
}

/** 
* Unsave id from the local storage
* @param {string} id - ID Item
*/
function unSavedIdSelected(_id) {
    let ids = JSON.parse(localStorage.getItem(SELECTED_ID_STORAGE))
    if (ids && ids.length) {
        ids = ids.filter((val) => val != _id)
        localStorage.setItem(SELECTED_ID_STORAGE, JSON.stringify(ids))
    }
}

/** 
* Render inventory line adding elements to the DOM
* @param {Inventory} host Host from inventory
*/
function renderInventoryLine(host) {
    let line = document.createElement("tr")
    line.setAttribute("id", host["hostname"])

    line.appendChild(renderDeleteHostLineBtn())

    line.appendChild(renderCell(host["hostname"]))
    line.appendChild(renderCell(host["ip"]))
    line.appendChild(renderCell(host["port"]))

    if (host["connection"] == 0) line.appendChild(renderCell("Password based"))
    else if (host["connection"] == 1) line.appendChild(renderCell("Keyfile based"))

    line.appendChild(renderCell(host["username"]))
    line.appendChild(renderCell(host["passwordOrKeyfile"]))
    line.appendChild(renderCell(host["sudoUsername"]))
    line.appendChild(renderCell(host["sudoPassword"]))

    line.onclick = () => {
        switchEditInventoryLine(line)
    }

    return line
}

/**
 * This function render a input line to replace the text line
 * @param {*} line text line to "transform" to a input line
 */
function switchEditInventoryLine(line) {
    if (line.getAttribute("hidden") || line.parentNode == null) return

    let editLine = document.createElement("tr")
    editLine.setAttribute("id", `${line.id}-edit`)

    editLine.appendChild(renderDeleteHostLineBtn())
    editLine.appendChild(renderEditCell("hostname", line.id, TYPE_INPUT.TEXT, line.childNodes[1].innerText))
    editLine.appendChild(renderEditCell("ip", line.id, TYPE_INPUT.TEXT, line.childNodes[2].innerText))
    editLine.appendChild(renderEditCell("port", line.id, TYPE_INPUT.TEXT, line.childNodes[3].innerText))
    editLine.appendChild(renderEditCell("connection", line.id, TYPE_INPUT.SELECT, line.childNodes[4].innerText))
    editLine.appendChild(renderEditCell("username", line.id, TYPE_INPUT.TEXT, line.childNodes[5].innerText))
    editLine.appendChild(renderEditCell("password-keyfile", line.id, TYPE_INPUT.TEXT, line.childNodes[6].innerText))
    editLine.appendChild(renderEditCell("sudo-username", line.id, TYPE_INPUT.TEXT, line.childNodes[7].innerText))
    editLine.appendChild(renderEditCell("sudo-password", line.id, TYPE_INPUT.TEXT, line.childNodes[8].innerText))

    editLine.appendChild(renderValidHostModificationBtn(`${line.id}-edit`))

    line.parentNode.insertBefore(editLine, line.nextSibling);
    line.setAttribute("hidden", "true")

    while (MATERIALIZE_FIFO.length > 0) {
        let todo = MATERIALIZE_FIFO.pop()
        switch (todo.element_type) {
            case "formselect":
                let el = document.getElementById(todo.id)
                M.FormSelect.init(el, { dropdownOptions: { container: document.body } })
                break
            default:
                break
        }
    }
}

/**
 * Render a cell (th) that allow user to modify a value
 * @param {string} colname The name of the column
 * @param {string} hostname The name of the host
 * @param {TYPE_INPUT} inputType The type of the input
 * @param {string|int} userValue The value already given by the user
 * @returns a input cell (th) for the column and the host given. 
 */
function renderEditCell(colname, hostname, inputType, userValue) {
    let editCell = document.createElement("th");

    let divRow = document.createElement("div");
    divRow.classList.add("row", "edit-cell");

    let divInput = document.createElement("div");
    divInput.classList.add("input-field", "col", "s12");

    switch (inputType) {
        case TYPE_INPUT.TEXT:
            let input = document.createElement("input");
            input.id = `input-${colname}-${hostname}`;
            input.setAttribute("type", "text");

            let label = document.createElement("label");
            label.setAttribute("for", `input-${colname}-${hostname}`);
            label.innerText = userValue

            divInput.appendChild(input);
            divInput.appendChild(label);
            break;

        case TYPE_INPUT.SELECT:
            let select = document.createElement("select")
            select.id = `select-connection-${hostname}`

            let opt1 = document.createElement("option")
            opt1.innerText = "Password based"
            opt1.value = 0

            let opt2 = document.createElement("option")
            opt2.innerText = "Keyfile based"
            opt2.value = 1

            if (userValue == "Password based") opt1.setAttribute("selected", "")
            else opt2.setAttribute("selected", "")

            select.appendChild(opt1)
            select.appendChild(opt2)

            divInput.appendChild(select)

            MATERIALIZE_FIFO.push({ element_type: "formselect", id: select.id })
            break;
        default:
            break;
    }

    divRow.appendChild(divInput);

    editCell.appendChild(divRow);

    return editCell
}

/** 
* Render text cell 
* @param {string} textDisplayed Text added in the celle
*/
function renderCell(textDisplayed) {
    let cell = document.createElement("th")
    cell.innerText = textDisplayed
    return cell
}

/**
 * Add a new line in the table
 * @param {} item the item that will be used to display information in the line
 * @param {TYPE_TABLE_ENUM} tableType RECOMMENDATIONS or INVENTORY
 */
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
}

/**
 * Retrieve information filled in the input line
 * @param {string} inputId the unique identifier of the line
 * @param {string} suffix an optionnal argument to specifiy an suffix. Is used on edit lines
 * @returns an host object
 */
function retrieveInventoryTableInput(inputId, suffix = "") {
    let inventoryInput = document.getElementById(inputId)

    let hostname = inventoryInput.querySelector(`#input-hostname${suffix}`).value.trim()
    let ip = inventoryInput.querySelector(`#input-ip${suffix}`).value.trim()
    let port = inventoryInput.querySelector(`#input-port${suffix}`).value.trim()
    let connection = inventoryInput.querySelector(`#select-connection${suffix}`).value.trim()
    let username = inventoryInput.querySelector(`#input-username${suffix}`).value.trim()
    let passwordOrKeyfile = inventoryInput.querySelector(`#input-password-keyfile${suffix}`).value.trim()
    let sudoUsername = inventoryInput.querySelector(`#input-sudo-username${suffix}`).value.trim()
    let sudoPassword = inventoryInput.querySelector(`#input-sudo-password${suffix}`).value.trim()

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

/**
 * Add a host in the inventory table. Value are retrieved by the input form
 */
function addHostInTable() {
    let hostItem = retrieveInventoryTableInput("inventory-input");
    let checkFQDNOrIP = isValidFQDNOrIP(hostItem.ip);
    if (hostItem.hostname.length == 0 || hostItem.ip.length == 0 || hostItem.passwordOrKeyfile.length == 0
        || hostItem.username.length == 0 || hostItem.sudoPassword.length == 0 || hostItem.sudoUsername.length == 0) {
            
        M.toast({ html: 'ERROR : All fields must be filled', classes: 'rounded' });
        return;
    }
    if (!checkFQDNOrIP) {
        M.toast({ html: 'ERROR : The syntax of your IP address or FQDN is not correct', classes: 'rounded' });
        return;
    }
    let inventory = JSON.parse(localStorage.getItem("inventory"));
    if (inventory == null) inventory = { "hosts": [] }
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
            } else if (hostItem.port < 0 || hostItem.port > 65535) {
                M.toast({ html: 'ERROR : The port specified is not correct, out from the range [0:65535]', classes: 'rounded' });
                return;
            }
        }
    }

    inventory.hosts.push(hostItem)
    localStorage.setItem("inventory", JSON.stringify(inventory))

    addLineInTable(hostItem, TYPE_TABLE_ENUM.INVENTORY);
}

/**
 * Render the btn 'Ok' when the user selects a line to edit host
 * @param {string} inputId the unique identifier of the line
 * @returns the cell that contains a btn
 */
function renderValidHostModificationBtn(inputId) {
    let th = document.createElement("th");

    let rowDiv = document.createElement("div");
    rowDiv.classList.add("row", "edit-cell");

    let colDiv = document.createElement("div");
    colDiv.classList.add("input-field", "col", "s12");

    let btn = document.createElement("a");
    btn.classList.add("waves-effect", "waves-light", "btn");
    btn.innerText = "Ok";

    btn.onclick = () => {
        modifyHost(inputId);
    }

    colDiv.appendChild(btn);
    rowDiv.append(colDiv);
    th.appendChild(rowDiv);

    return th;
}

/**
 * Modify a host with new values 
 * @param {string} inputId id of the host to modify
 */
function modifyHost(inputId) {
    let hostObj = undefined;
    let hostname = inputId.replace("-edit", "")
    modifiedHost = retrieveInventoryTableInput(inputId, "-" + hostname);
    let inventory = JSON.parse(localStorage.getItem("inventory"))

    for (let i = 0; i < inventory.hosts.length; i++) {
        const host = inventory.hosts[i];

        if (host.hostname == hostname) {
            hostObj = host
            if (modifiedHost.hostname.length > 0) {
                let checkModifFQDNOrIP = isValidFQDNOrIP(modifiedHost.ip);
                if (!checkModifFQDNOrIP) {
                    M.toast({ html: 'ERROR : The syntax of your IP address or FQDN is not correct', classes: 'rounded' });
                    return;
                }
                for (let i = 0; i < inventory.hosts.length; i++) {
                    const el = inventory.hosts[i];
                    if (el.hostname == modifiedHost.hostname) {
                        M.toast({ html: 'ERROR : An host with the same name already exists', classes: 'rounded' });
                        return;
                    }
                }
                host.hostname = modifiedHost.hostname;
            }
            if (!isNaN(modifiedHost.port) || modifiedHost.ip.length > 0) {

                let tmpIP = host.ip;
                if (modifiedHost.ip.length > 0) {
                    tmpIP = modifiedHost.ip;
                }
                let tmpPort = host.port;
                if (!isNaN(modifiedHost.port)) {
                    tmpPort = modifiedHost.port;
                }

                if (!isNaN(modifiedHost.port)) {
                    if (modifiedHost.port < 0 || modifiedHost.port > 65535) {
                        M.toast({ html: 'ERROR : The port specified is not correct, out from the range [0:65535]', classes: 'rounded' });
                        return;
                    }
                }

                for (let i = 0; i < inventory.hosts.length; i++) {
                    const el = inventory.hosts[i];
                    if (tmpIP.ip == el.ip && tmpPort.port == el.port) {
                        M.toast({ html: 'ERROR : An host with the same pair ip:port already exists', classes: 'rounded' });
                        return;
                    }
                }

                if (modifiedHost.ip.length > 0) {
                    host.ip = modifiedHost.ip;
                }

                if (!isNaN(modifiedHost.port)) {
                    host.port = modifiedHost.port;
                }

            }

            if (modifiedHost.username.length > 0) {
                host.username = modifiedHost.username;
            }

            if (modifiedHost.passwordOrKeyfile.length > 0) {
                host.passwordOrKeyfile = modifiedHost.passwordOrKeyfile;
            }

            if (modifiedHost.sudoUsername.length > 0) {
                host.sudoUsername = modifiedHost.sudoUsername;
            }

            if (modifiedHost.sudoPassword.length > 0) {
                host.sudoPassword = modifiedHost.sudoPassword;
            }

            host.connection = modifiedHost.connection
        }
    }

    localStorage.setItem("inventory", JSON.stringify(inventory))

    let textLine = document.getElementById(hostname);
    textLine.childNodes.item(1).innerText = hostObj.hostname;
    textLine.childNodes.item(2).innerText = hostObj.ip;
    textLine.childNodes.item(3).innerText = hostObj.port;

    if (hostObj.connection == 0) textLine.childNodes.item(4).innerText = "Password based";
    else if (hostObj.connection == 1) textLine.childNodes.item(4).innerText = "Keyfile based";

    textLine.childNodes.item(5).innerText = hostObj.username;
    textLine.childNodes.item(6).innerText = hostObj.passwordOrKeyfile;
    textLine.childNodes.item(7).innerText = hostObj.sudoUsername;
    textLine.childNodes.item(8).innerText = hostObj.sudoPassword;

    textLine.removeAttribute("hidden")
    document.getElementById(inputId).remove();
}

/**
 * Render a btn which delete a host line
 * @returns the cell containing the delete btn
 */
function renderDeleteHostLineBtn(){
    let deleteLineBtn = document.createElement('th');

    let a = document.createElement("a")
    a.classList.add("prevent-select", "material-symbols-outlined", "vertical-align", "clickable");
    a.innerText = "delete_forever";

    a.onclick = () => {
        let lineID = a.parentElement.parentElement.id;
        if (lineID.endsWith("-edit")) {
            document.getElementById(lineID).remove();

            lineID = lineID.replace("-edit", "");
            document.getElementById(lineID).remove();
        } else {
            document.getElementById(lineID).remove();
        }

        const oldInventory = JSON.parse(localStorage.getItem("inventory"));
        const newInventory = { "hosts": [] };

        for (let i = 0; i < oldInventory.hosts.length; i++) {
            const host = oldInventory.hosts[i];

            if (host.hostname != lineID) {
                newInventory.hosts.push(host);
            }
        }

        localStorage.setItem("inventory",JSON.stringify(newInventory));
    }

    deleteLineBtn.appendChild(a);

    return deleteLineBtn;
}

/**
 * Remove all host from the table
 */
function deleteAllHosts() {
    const inventory = { "hosts": [] };
    localStorage.setItem("inventory", JSON.stringify(inventory));

    let hostsBody = document.getElementById("inventory-container");

    while (hostsBody.firstChild) {
        hostsBody.removeChild(hostsBody.firstChild);
    }
}

/**
 * Sort a table
 * @param {TYPE_TABLE_ENUM} tableType the table type
 * @param {boolean} order true for ASC, false for DESC
 * @param {string} colName on which column do the sort 
 */
function sortBy(tableType, order, colName) {
    let array;
    let containerID;
    let storageItemName;
    let storageType;
    switch (tableType) {
        case TYPE_TABLE_ENUM.RECOMMENDATIONS:
            array = JSON.parse(sessionStorage.getItem("recommendations"))
            containerID = "recommendations-container";
            storageItemName = "recommendations";
            storageType = TYPE_STORAGE.SESSION;
            break;
        case TYPE_TABLE_ENUM.INVENTORY:
            array = JSON.parse(localStorage.getItem("inventory")).hosts;
            containerID = "inventory-container";
            storageItemName = "inventory";
            storageType = TYPE_STORAGE.LOCAL;
            break;
        default:
            return;
    }
    
    if (array.length == 0) {
        return;
    }

    array.sort(dynamicSort(colName,order))

    sessionStorage.setItem("lastSort" ,JSON.stringify({"colName":colName, "order":order}))

    switch (tableType) {
        case TYPE_TABLE_ENUM.RECOMMENDATIONS:
            sessionStorage.setItem("recommendations",JSON.stringify(array))
            break;
        case TYPE_TABLE_ENUM.INVENTORY:
            localStorage.setItem("inventory",JSON.stringify({"hosts":array}))
            break;
        default:
            return;
    }
    renderTable(containerID,storageItemName,tableType,storageType)
}

/**
 * This function allows to sort any array of object (only with 1 depth)
 * @param {string} colName column to compare
 * @param {string} order either ASC either DESC
 * @returns 1,-1 or 0
 */
function dynamicSort(colName, order) {
    var sortOrder;
    if (order == "ASC") sortOrder = 1;
    else if (order == "DESC") sortOrder = -1;
    else return 0

    return (a,b) => {
        let compareResult = (a[colName] > b[colName]) ? 1 : (b[colName] > a[colName]) ? - 1 : 0;
        return compareResult * sortOrder;
    }
}

function askToSort(tableType, colName) {
    lastSortRequest = JSON.parse(sessionStorage.getItem("lastSort"))

    let order = "ASC"
    if (lastSortRequest != null && lastSortRequest.colName == colName) {
        order = (lastSortRequest.order == "ASC" ? "DESC" : "ASC");
    }

    sortBy(tableType,order,colName)

    let containerClassName;
    switch (tableType) {
        case TYPE_TABLE_ENUM.RECOMMENDATIONS:
            containerClassName = "recommendations-head";
            break;
        case TYPE_TABLE_ENUM.INVENTORY:
            containerClassName = "inventory-head";
            break;
        default:
            break;
    }

    let headCellIcons = document.getElementsByClassName(containerClassName).item(0).querySelectorAll(".sort-icon")
    headCellIcons.forEach(headCellIcon => {
        if (headCellIcon.id == colName) {
            headCellIcon.classList.remove("invisible")
            headCellIcon.innerText = (order == "ASC" ? "arrow_drop_down" : "arrow_drop_up")
        } else headCellIcon.classList.add("invisible")
    });
}
/**
 * Check if IP or FQDN as valid syntax
 * @param {string} inputIPorFQDN IP or FQDN to check 
 * @returns boolean indicator if syntax are true or false 
 */
function isValidFQDNOrIP(inputIPorFQDN) {
    const fqdnRegex = /^([a-zA-Z0-9_-]{3,}\.){1,}[a-zA-Z]{2,}$/;
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
    if (fqdnRegex.test(inputIPorFQDN) || ipRegex.test(inputIPorFQDN)) {
      return true;
    } 
    else {
      return false;
    }
  }