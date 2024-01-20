
const SELECTED_ID_STORAGE = "SELECTED_ID_STORAGE"
const RADIO_BUTTON_CHECKED_VALUE = "radio_button_checked"
const RADIO_BUTTON_UNCHECKED_VALUE = "radio_button_unchecked"
/**
 * Wait that the page load to init JS components and to use font
 */
document.addEventListener('DOMContentLoaded', function () {
    let mod = document.getElementById("os-selector-modal")
    M.Modal.init(mod, {});

    let mod2 = document.getElementById("log-modal")
    M.Modal.init(mod2, {onCloseEnd: setBtnToReopenLog});

    let tabs = document.getElementById("recommendation-inventory-tabs")
    M.Tabs.init(tabs,{})

    let inventory_form  = document.getElementById("inventory-input")
    let select_inventory = inventory_form.querySelector("#select-connection")
    select_inventory.onchange = fillAuthFromConnectionMethodValue
    fillAuthFromConnectionMethodValue()

    M.FormSelect.init(select_inventory, {})

    selectOsModelOpen()

    let dropdowns = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdowns, {"constrainWidth":false});

    const fontMI = new FontFace(
        "MaterialIcons",
        "url(/static/font/MaterialIcons-Regular.ttf)",
        {
            style: "normal",
            weight: "400",
            stretch: "condensed",
        },
    );

    const fontMSO = new FontFace(
        "MaterialSymbolsOutlined",
        "url(/static/font/MaterialSymbolsOutlined.ttf)",
        {
            style: "normal",
            weight: "400",
            stretch: "condensed",
        },
    ); 
    
    document.fonts.add(fontMI);
    document.fonts.add(fontMSO);

    setIconsAfterFontsLoaded(fontMI, fontMSO)
});

function environmentSelectedToggle() {
    document.getElementById("os-not-selected").classList.toggle("hide")
    document.getElementById("os-selected").classList.toggle("hide")
    document.getElementById("os-version").classList.add('hide')
}

function validEnvironment() {
    getRecommendationList()
    environmentSelectedToggle()

    renderTable("inventory-container","inventory",TYPE_TABLE_ENUM.INVENTORY, TYPE_STORAGE.LOCAL)
}

function fillAuthFromConnectionMethodValue() {
    let labelPasswordKeyfile = document.getElementById("label-password-keyfile");
    let selectConnectionMethod = document.getElementById("select-connection");
    if (selectConnectionMethod.value == "0") {
        labelPasswordKeyfile.innerText = "Password";
        passwordInput.type = "password";
    } else if (selectConnectionMethod.value == "1") {
        labelPasswordKeyfile.innerText = "Keyfile";
        passwordInput.type = "text";
    }
}

function runBtnToogle(setDisabled) {
    let btnGroup = document.getElementById("run-and-expand-btn").querySelectorAll("a")
    btnGroup.forEach(el => {
        if (setDisabled) el.setAttribute("disabled","")
        else el.removeAttribute("disabled")
    });
}

async function setIconsAfterFontsLoaded(fontMI, fontMSO) {
    await fontMI.load()
    await fontMSO.load()
}