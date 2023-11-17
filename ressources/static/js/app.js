/**
 * Wait that the page load to init JS components and to use font
 */
document.addEventListener('DOMContentLoaded', function () {
    let mod = document.getElementById("os-selector-modal")
    M.Modal.init(mod, {});
    select_os_model_open()

    setTimeout(() => {
        document.getElementById("radio_button_unchecked").innerText = "radio_button_unchecked"
        document.getElementById("navigate_next").innerText = "navigate_next"
    }, 250)
});

function select_os_model_open() {
    let mod = document.getElementById("os-selector-modal")
    M.Modal.getInstance(mod).open();
    get_os()
}

function environment_selected_toggle() {
    document.getElementById("os-not-selected").classList.toggle("hide")
    document.getElementById("os-selected").classList.toggle("hide")
}

function valid_environment() {
    get_recommendation_list()
    environment_selected_toggle()
}