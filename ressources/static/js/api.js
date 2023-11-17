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
        if (this.readyState == 4 && this.status == 200) {
            get_os_version()
        } else if (this.readyState == 4 && this.status == 400) {
            M.toast({ html: 'ERROR : Your selection is not correct', classes: 'rounded' });
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
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("valid").classList.toggle("hide")
        } else if (this.readyState == 4 && this.status == 400) {
            M.toast({ html: 'ERROR : Your selection is not correct', classes: 'rounded' });
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
        if (this.readyState == 4 && this.status == 200) {
            let list = JSON.parse(xhttp.responseText);
            let select_item = document.getElementById("os-selection");

            select_item.onchange = () => {
                verify_os(select_item.value);
            }

            for (let i = 0; i < list.length; i++) {
                const element = list[i];
                let op = document.createElement("option");
                op.value = element;
                op.innerText = element;

                select_item.appendChild(op);
            }

            M.FormSelect.init(select_item, {});
        } else if (this.readyState == 4 && this.status == 400) {
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
        if (this.readyState == 4 && this.status == 200) {
            let list = JSON.parse(xhttp.responseText);
            let select_item = document.getElementById("os-type");

            select_item.onchange = () => {
                verify_os_type(select_item.value);
            }

            for (let i = 0; i < list.length; i++) {
                const element = list[i];
                let op = document.createElement("option");
                op.value = element;
                op.innerText = element;

                select_item.appendChild(op);
            }

            M.FormSelect.init(select_item, {});
        } else if (this.readyState == 4 && this.status == 400) {
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
        if (this.readyState == 4 && this.status == 200) {
            let list = JSON.parse(xhttp.responseText);
            let select_item = document.getElementById("os-version");

            select_item.onchange = () => {
                verify_os_version(select_item.value);
            }

            for (let i = 0; i < list.length; i++) {
                const element = list[i];
                let op = document.createElement("option");
                op.value = element;
                op.innerText = element;

                select_item.appendChild(op);
            }

            M.FormSelect.init(select_item, {});
        } else if (this.readyState == 4 && this.status == 400) {
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
            localStorage.setItem("recommendations",JSON.stringify(recommendations))
            render_recommendations()
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
            localStorage.setItem(_id,JSON.stringify(question))
            render_question(_id)

        } else if (this.readyState == 4 && this.status == 400) {
            M.toast({ html: 'ERROR : Can\'t retrieve the question', classes: 'rounded' });
        }
    }
    xhttp.open("GET", endpoint, true);
    xhttp.send();
}