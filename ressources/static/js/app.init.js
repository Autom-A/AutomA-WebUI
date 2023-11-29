
const SELECTED_ID_STORAGE = "SELECTED_ID_STORAGE"
const RADIO_BUTTON_CHECKED_VALUE = "radio_button_checked"
const RADIO_BUTTON_UNCHECKED_VALUE = "radio_button_unchecked"
/**
 * Wait that the page load to init JS components and to use font
 */
document.addEventListener('DOMContentLoaded', function () {
    let mod = document.getElementById("os-selector-modal")
    M.Modal.init(mod, {});

    let tabs = document.getElementById("recommendation-inventory-tabs")
    M.Tabs.init(tabs,{})

    let inventory_form  = document.getElementById("inventory-input")
    let select_inventory = inventory_form.querySelector("#select-connection")
    select_inventory.onchange = fillAuthFromConnectionMethodValue
    fillAuthFromConnectionMethodValue()

    M.FormSelect.init(select_inventory, {})

    select_os_model_open()

    setTimeout(() => {
        document.getElementById("radio_button_unchecked").innerText = "radio_button_unchecked"
    }, 250)

});

function environment_selected_toggle() {
    document.getElementById("os-not-selected").classList.toggle("hide")
    document.getElementById("os-selected").classList.toggle("hide")
    document.getElementById("os-version").classList.add('hide')
}

function valid_environment() {
    get_recommendation_list()
    environment_selected_toggle()
}

function addHost() {
    let hostItem = retrieveInventoryTableInput()
    sendHost(hostItem)
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

function runBtnToogle(setDisabled) {
    let btnGroup = document.getElementById("run-and-expand-btn").querySelectorAll("a")
    btnGroup.forEach(el => {
        if (setDisabled) el.setAttribute("disabled","")
        else el.removeAttribute("disabled")
    });
}