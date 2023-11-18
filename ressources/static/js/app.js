/**
 * Wait that the page load to init JS components and to use font
 */
document.addEventListener('DOMContentLoaded', function () {
    let mod = document.getElementById("os_selector_modal")
    M.Modal.init(mod, {});
    select_os_model_open()

    setTimeout(() => {
        document.getElementById("radio_button_unchecked").innerText = "radio_button_unchecked"
        document.getElementById("navigate_next").innerText = "navigate_next"
    }, 250)
});

function select_os_model_open() {
    let mod = document.getElementById("os_selector_modal")
    M.Modal.getInstance(mod).open();
    get_os()
}

function environment_selected_toggle() {
    document.getElementById("os_not_selected").classList.toggle("hide")
    document.getElementById("os_selected").classList.toggle("hide")
}

function valid_environment() {
    get_question_list()
    environment_selected_toggle()
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
        if(value) {
            if (this.readyState == 4 && this.status == 200) {
                get_os_version()
            } else if (this.readyState == 4 && this.status == 400) {
                M.toast({ html: 'ERROR : Your selection is not correct', classes: 'rounded' });
            }
        } else {
            reinitSelector(document.getElementById('os_version'))
            M.FormSelect.init(document.getElementById('os_version'), {});
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
        if(value) {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("valid").removeAttribute("disabled");
            } else if (this.readyState == 4 && this.status == 400) {
                M.toast({ html: 'ERROR : Your selection is not correct', classes: 'rounded' });
            }
        } else {
            document.getElementById("valid").setAttribute('disabled', true)
            
        }
    }
    xhttp.open("POST", endpoint, true);
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send(JSON.stringify({ "os_version": value }));
}
/**
 * Retrieve informations
 */
function get_os() {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/selector/os`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        fillSelector("os_selection", xhttp, verify_os);
    }
    xhttp.open("GET", endpoint, true);
    xhttp.send();
}

function get_os_type() {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/selector/os_type`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        fillSelector("os_type", xhttp, verify_os_type);
    }
    xhttp.open("GET", endpoint, true);
    xhttp.send();
}

function get_os_version() {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/selector/os_version`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        fillSelector("os_version", xhttp, verify_os_version);
    }
    xhttp.open("GET", endpoint, true);
    xhttp.send();
}

function fillSelector(type, xhttp, functionToVerify, childName) {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        let list = JSON.parse(xhttp.responseText);
        let select_item = document.getElementById(type);
        reinitSelector(select_item)

        select_item.onchange = (e) => {
            functionToVerify(select_item.value);
        }

        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let op = document.createElement("option");
            op.value = element;
            op.innerText = element;

            select_item.appendChild(op);
        }

        M.FormSelect.init(select_item, {});
    } else if (xhttp.readyState == 4 && xhttp.status == 400) {
        M.toast({ html: 'ERROR : Your selection is not correct', classes: 'rounded' });
    }
}

function reinitSelector(selector) {
    selector.value = ''
    selector.dispatchEvent(new Event('change'))
    let options =  selector.getElementsByTagName("option");
    for(let i = 1; i<options.length; i ++) {
        options[i].remove()
    }
}

function get_question_list() {
    let endpoint = `http://${SERVER_IP}:${SERVER_PORT}/api/questions`;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let recommandations = JSON.parse(xhttp.responseText);
            display_questions(recommandations)
        } else if (this.readyState == 4 && this.status == 400) {
            M.toast({ html: 'ERROR : Can\'t retrieve the question list', classes: 'rounded' });
        }
    }
    xhttp.open("GET", endpoint, true);
    xhttp.send();
}

/**
 * 
 */

function add_line(recommandation) {
    let line = document.createElement("tr")

    let c_id = document.createElement("th")
    c_id.innerText = recommandation["id"]
    line.appendChild(c_id)

    let c_name = document.createElement("th")
    c_name.innerText = recommandation["name"]
    line.appendChild(c_name)

    let c_category = document.createElement("th")
    c_category.innerText = recommandation["category"]
    line.appendChild(c_category)

    let c_level = document.createElement("th")
    c_level.innerText = recommandation["level"]
    line.appendChild(c_level)

    let c_from = document.createElement("th")
    c_from.innerText = recommandation["from"]
    line.appendChild(c_from)

    return line
}
function display_questions(recommandations) {
    let question_body = document.getElementById("question-body")
    while (question_body.firstChild) {
        question_body.removeChild(question_body.lastChild);
    }

    for (let i = 0; i < recommandations.length; i++) {
        const recommandation = recommandations[i];
        question_body.appendChild(add_line(recommandation))
    }
}