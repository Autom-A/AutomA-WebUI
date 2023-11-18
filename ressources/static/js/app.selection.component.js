/* 
 This script is used for the modal selection component
*/

function select_os_model_open() {
    let mod = document.getElementById("os-selector-modal")
    M.Modal.getInstance(mod).open();
    get_os()
}


/** 
* Fill selector with values and bind verification function
* @param {type} type - name of the selector
* @param {type} values - values
* @param {type} verificationFunction - values
*/
function fillSelector(type, values, verificationFunction) {
    let select_item = document.getElementById(type);
    //Reinit to clean if you already had options loaded 
    reinitSelector(select_item)

    //Bind verification method (request to the back)
    select_item.onchange = () => {
        verificationFunction(select_item.value);
    }

    //fill selector
    for (let i = 0; i < values.length; i++) {
        const element = values[i];
        let op = document.createElement("option");
        op.value = element;
        op.innerText = element;

        select_item.appendChild(op);
    }
    //reinit selector, remove hide class
    M.FormSelect.init(select_item, {});
}

function removeValidButtonAttribute(attributeName) {
    document.getElementById("valid").removeAttribute(attributeName)
}

/** 
* Change disabled attribute in validation button
* @param {type} bool - value of disabled attribute
*/
function setValidButtonDisabledAttribute(attributeName,bool) {
    document.getElementById("valid").setAttribute(attributeName, bool)
}



/** 
* Reinit selector options, remove all options except the first one.
* @summary Remove all options in the dom except the first because in our case this first option is
used as a placeholder for the moment
* @param {type} selector - selector to clean
*/
function reinitSelector(selector) {
    selector.value = ''
    selector.dispatchEvent(new Event('change'))
    let options = selector.getElementsByTagName("option");
    for (let i = 1; i < options.length; i++) {
        options[i].remove()
    }
}

/** 
* Reset child 
* @summary In our workflow reset a child selector has to reinit a child ONLY if the child
is already visible
* @param {type} childName - child name selector 
*/
function resetChildSelector(childName) {
    let selector = document.getElementById(childName);
    if (!selector.classList.contains("hide")) {
        reinitSelector(selector)
        M.FormSelect.init(selector, {});
    }
}