/* 
    Script to API Request
*/

/**
 * Retrieve informations
 */

function get_os() {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/selector/os`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let list = JSON.parse(xhttp.responseText);
            fillSelector("os-selection", list, verify_os);
        } else if (xhttp.readyState == 4 && xhttp.status == 400) {
            M.toast({ html: 'ERROR : Your selection is not correct', classes: 'rounded' });
        }
    }
    xhttp.open("GET", endpoint, true);
    xhttp.send();
}

function get_os_type() {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/selector/os_type`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let list = JSON.parse(xhttp.responseText);
            fillSelector("os-type", list, verify_os_type);
        } else if (xhttp.readyState == 4 && xhttp.status == 400) {
            M.toast({ html: 'ERROR : Your selection is not correct', classes: 'rounded' });
        }
    }
    xhttp.open("GET", endpoint, true);
    xhttp.send();
}

function get_os_version() {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/selector/os_version`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let list = JSON.parse(xhttp.responseText);
            fillSelector("os-version", list, verify_os_version);
        } else if (xhttp.readyState == 4 && xhttp.status == 400) {
            M.toast({ html: 'ERROR : Your selection is not correct', classes: 'rounded' });
        }
    }
    xhttp.open("GET", endpoint, true);
    xhttp.send();
}

function get_recommendation_list() {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/recommendations`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let recommendations = JSON.parse(xhttp.responseText);
            sessionStorage.setItem("recommendations", JSON.stringify(recommendations))
            renderRecommendations()
        } else if (this.readyState == 4 && this.status == 400) {
            M.toast({ html: 'ERROR : Can\'t retrieve the recommendation list', classes: 'rounded' });
        }
    }
    xhttp.open("GET", endpoint, true);
    xhttp.send();
}

function get_question(_id) {
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
function verify_os(value) {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/selector/os`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            get_os_type()
        } else if (this.readyState == 4 && this.status == 400) {
            M.toast({ html: 'ERROR : Your selection is not correct', classes: 'rounded' });
        }
    }
    xhttp.open("POST", endpoint, true);
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send(JSON.stringify({ "os": value }));
}

function verify_os_type(value) {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/selector/os_type`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (value) {
            if (this.readyState == 4 && this.status == 200) {
                get_os_version()
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

function verify_os_version(value) {
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
function launchGenerate() {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/playbooks/render`;
    let xhttp = new XMLHttpRequest();
    let recommendations = {};
    let recommendationsIdSelected = JSON.parse(localStorage.getItem(SELECTED_ID_STORAGE))
    recommendationsIdSelected.forEach(id => {
        let answers = JSON.parse(localStorage.getItem(id))
        if(answers) {
            recommendations[id] = answers
        }
    });
    xhttp.onreadystatechange = function () {

    }
    xhttp.open("POST", endpoint, true);
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send(JSON.stringify(recommendations));
}


