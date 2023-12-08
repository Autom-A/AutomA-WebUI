/* 
    Script to API Request
*/

/**
 * Retrieve informations
 */

function getOs() {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/selector/os`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let list = JSON.parse(xhttp.responseText);
            fillSelector("os-selection", list, verifyOs);
        } else if (xhttp.readyState == 4 && xhttp.status == 400) {
            M.toast({ html: 'ERROR : Your selection is not correct', classes: 'rounded' });
        }
    }
    xhttp.open("GET", endpoint, true);
    xhttp.send();
}

function getOsType() {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/selector/os_type`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let list = JSON.parse(xhttp.responseText);
            fillSelector("os-type", list, verifyOsType);
        } else if (xhttp.readyState == 4 && xhttp.status == 400) {
            M.toast({ html: 'ERROR : Your selection is not correct', classes: 'rounded' });
        }
    }
    xhttp.open("GET", endpoint, true);
    xhttp.send();
}

function getOsVersion() {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/selector/os_version`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let list = JSON.parse(xhttp.responseText);
            fillSelector("os-version", list, verifyOsVersion);
        } else if (xhttp.readyState == 4 && xhttp.status == 400) {
            M.toast({ html: 'ERROR : Your selection is not correct', classes: 'rounded' });
        }
    }
    xhttp.open("GET", endpoint, true);
    xhttp.send();
}

function getRecommendationList() {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/recommendations`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let recommendations = JSON.parse(xhttp.responseText);
            sessionStorage.setItem("recommendations", JSON.stringify(recommendations))
            renderTable("recommendations-container", "recommendations", TYPE_TABLE_ENUM.RECOMMENDATIONS, TYPE_STORAGE.SESSION)
        } else if (this.readyState == 4 && this.status == 400) {
            M.toast({ html: 'ERROR : Can\'t retrieve the recommendation list', classes: 'rounded' });
        }
    }
    xhttp.open("GET", endpoint, true);
    xhttp.send();
}

function getQuestion(_id) {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/question?_id=${_id}`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let question = JSON.parse(xhttp.responseText);
            renderQuestion(_id, question)
        } else if (this.readyState == 4 && this.status == 400) {
            M.toast({ html: 'ERROR : Can\'t retrieve the question', classes: 'rounded' });
        }
    }
    xhttp.open("GET", endpoint, true);
    xhttp.send();
}

/**
 * Setting and verifying informations
 */
function verifyOs(value) {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/selector/os`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            getOsType()
        } else if (this.readyState == 4 && this.status == 400) {
            M.toast({ html: 'ERROR : Your selection is not correct', classes: 'rounded' });
        }
    }
    xhttp.open("POST", endpoint, true);
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send(JSON.stringify({ "os": value }));
}

function verifyOsType(value) {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/selector/os_type`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (value) {
            if (this.readyState == 4 && this.status == 200) {
                getOsVersion()
            } else if (this.readyState == 4 && this.status == 400) {
                M.toast({ html: 'ERROR : Your selection is not correct', classes: 'rounded' });
            }
        } else {
            resetChildSelector('os-version')
        }
    }
    xhttp.open("POST", endpoint, true);
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send(JSON.stringify({ "os_type": value }));
}

function verifyOsVersion(value) {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/selector/os_version`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (value) {
            if (this.readyState == 4 && this.status == 200) {
                removeValidButtonAttribute('disabled')
            } else if (this.readyState == 4 && this.status == 400) {
                M.toast({ html: 'ERROR : Your selection is not correct', classes: 'rounded' });
            }
        } else {
            setValidButtonDisabledAttribute("disabled", true)
        }
    }
    xhttp.open("POST", endpoint, true);
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send(JSON.stringify({ "os_version": value }));
}

/** 
 * API Methods to generate and download
 * 
 * 
*/

/** 
* Launch generation with the selected answers written in local storage
*/
function generatePlaybooks() {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/playbooks/render`;
    let xhttp = new XMLHttpRequest();
    let recommendations = {};
    let recommendationsIdSelected = JSON.parse(localStorage.getItem(SELECTED_ID_STORAGE))
    recommendationsIdSelected.forEach(id => {
        let answers = JSON.parse(localStorage.getItem(id))
        if (answers) {
            recommendations[id] = answers
        }
    });
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let rep = JSON.parse(xhttp.responseText)
            M.toast({ html: rep["SUCCESS"], classes: 'rounded' });
            runBtnToogle()
        } else if (this.readyState == 4 && this.status == 400) {
            M.toast({ html: 'ERROR : Can\'t generate playbook', classes: 'rounded' });
        }
    }
    xhttp.open("POST", endpoint, true);
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send(JSON.stringify(recommendations));
}


function sendInventory() {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/inventory/hosts`;
    let xhttp = new XMLHttpRequest();

    let inventory = localStorage.getItem("inventory");
    if (inventory == null) inventory = {"hosts": []}
    else {
        inventory = JSON.parse(inventory)
    }

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let rep = JSON.parse(xhttp.responseText)
            M.toast({ html: rep["SUCCESS"], classes: 'rounded' });
        } else if (this.readyState == 4 && this.status == 400) {
            M.toast({ html: 'ERROR : Inventory can\'t be added', classes: 'rounded' });
        }
    }
    xhttp.open("POST", endpoint, true);
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send(JSON.stringify(inventory));
}


function runPlaybook() {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/playbook/launcher/run`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            addLineInTable(hostItem, TYPE_TABLE_ENUM.INVENTORY)
        } else if (this.readyState == 4 && this.status == 400) {
            M.toast({ html: 'ERROR : You must add host in your inventory', classes: 'rounded' });
            M.Tabs.getInstance(document.getElementById("recommendation-inventory-tabs")).select("inventory")
        }
    }
    xhttp.open("POST", endpoint, true);
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send();
}

function generateAction() {
    generatePlaybooks();
    sendInventory();
}