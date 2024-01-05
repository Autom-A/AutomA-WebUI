var MATERIALIZE_FIFO = []

const TYPES_QUESTION_ENUM = {
    "str": 1,
    "list<str>": 2,
    "choice<str>": 3
}

/** 
* If the modal template is already instatiated, the function open it else it creates 
* the modal. It takes the configuration of the question to choose which elements need to 
* be added to the modal (select, input, chips, ...)
* @summary Display a modal template and fill it from config question
* @param {_id} _id - question UUID
*/
function renderQuestion(_id, question_data) {

    // Check if there are any questions
    if(question_data.questions.length == 0) {
        localStorage.setItem(_id, JSON.stringify([]))
        storeSelectedIds(_id)

        checkRadioBtn(_id)
        return
    }

    // Check if modal for this question already exists
    let question_modal = document.getElementById(`q-${_id}`)
    if (question_modal != undefined) {
        M.Modal.getInstance(question_modal).open()
    } else {
        let question_container = document.getElementById("question-container")

        let template = document.getElementById("template-question-modal")
        question_modal = template.content.cloneNode(true).querySelector("div")
        question_modal.setAttribute("id", `q-${_id}`)
        question_modal.classList.add("question-modal")


        let question_title = question_modal.querySelector("#question-title")
        question_title.innerText = question_data.title

        let question_description = question_modal.querySelector("#question-description")
        question_description.innerText = question_data.description

        let question_body = question_modal.querySelector('#question-body')
        for (let i = 0; i < question_data.questions.length; i++) {
            let answer = getAnswersValues(_id,i)
            let field = renderQuestionField(_id, i, question_data.questions[i], answer)
            question_body.appendChild(field)
        }

        question_body.appendChild(renderQuestionBtn(_id,question_data))

        question_container.appendChild(question_modal)

        //Init Materialize component who needs to be initialize
        initializeMaterializeComponent()

        M.Modal.init(question_modal)
        M.Modal.getInstance(question_modal).open()
    }
}
/** 
* Get answer value by id recommendation and index question from local storage
* @param {string} id - id of recommendation
* @param {number} indexQuestion - index of the question
* @returns {answer} answer - if exists or null
*/
function getAnswersValues(id,indexQuestion) {
    let localStorageData = JSON.parse(localStorage.getItem(id)) 
    if(localStorageData) {
        let answerValue = localStorageData.find((val) => val.index == indexQuestion)
        return answerValue ? answerValue : null
    }
    return null;
}

/** 
* Initialize Material components. This function need to be called after adding components
to the DOM. This method is useful because in our case, our components are returned
by our functions before adding them to the DOM. Some errors appears with Select component
* with this workflow.
* It's base on global scope variable 'MATERIALIZE_FIFO'
* @summary Initialize Material components wich need to be added to the DOM before
* init
*/
function initializeMaterializeComponent() {
    while (MATERIALIZE_FIFO.length > 0) {
        let todo = MATERIALIZE_FIFO.pop()
        switch (todo.element_type) {
            case "formselect":
                let el = document.getElementById(todo.id)
                M.FormSelect.init(el, {dropdownOptions:{container:document.body}})
                break
            default:
                break
        }
    }
}

/** 
* Create validation button and bind it with the click event.
*/
function renderQuestionBtn(_id,question_data) {
    let div = document.createElement("div")
    div.classList.add(["right-align"])

    let btn = document.createElement("a")
    btn.classList.add(["btn-floating"])

    btn.onclick = () => {
        let nb_questions = question_data.questions.length

        for (let i = 0; i < nb_questions; i++) {
            let input = document.getElementById(`${_id}-${i}`)
            switch (parseInt(input.getAttribute("question-type"))) {
                case TYPES_QUESTION_ENUM["str"]:
                    retrieveStr(input,question_data.questions[i])
                    break;
                case TYPES_QUESTION_ENUM["list<str>"]:
                    retrieveListStrData(input,question_data.questions[i])
                    break;
                case TYPES_QUESTION_ENUM["choice<str>"]:
                    retrieveStr(input,question_data.questions[i])
                    break;
                default:
                    console.log("rien....");
                    break;
            }
        }

        checkRadioBtn(_id)

        let question_modal = document.getElementById(`q-${_id}`)
        M.Modal.getInstance(question_modal).close()
    }

    let icon = document.createElement("i")
    icon.classList.add(["material-icons"])
    icon.innerText = "check"

    btn.appendChild(icon)
    div.appendChild(btn)

    return div
}

/** 
* Render question from 'render_field_str' method in case of 'str' : input
* Render question from 'render_field_list_str' method in case of 'list<str>' : chips
* Render question from 'render_field_choice_str' method in case of 'choice<str>' : select
* @summary Render question depending on the answer type
* @param {_id} _id - UUID of the recommendation
* @param {index} index - Index of question 
* @param {one_field} one_field - configuration of the answer
* @param {answerStored} answerStored - answer if exists or null
* @returns {HTMLElement} HTMLElement - Brief description of the returning value here.
*/
function renderQuestionField(_id, index, one_field, answerStored) {
    switch (one_field.type) {
        case "str":
            return renderFieldStr(_id, index, one_field,answerStored)
        case "list<str>":
            return renderFieldListStr(_id, index, one_field,answerStored)
        default:
            if (one_field.type.includes("choice<str>")) return renderFieldChoiceStr(_id, index, one_field,answerStored)
    }

    console.log(`ERROR : the type : ${one_field.type} is not implemented`);
}


/** 
* Render question method in case of 'str' : it creates an input
* @param {_id} _id - UUID of the recommendation
* @param {index} index - Index of question 
* @param {one_field} one_field - configuration of the answer
* @param {answerStored} answerStored - answer if exists or null
* @returns {HTMLElement} HTMLElement - Brief description of the returning value here.
*/
function renderFieldStr(_id, index, one_field,answerStored) {
    let div = document.createElement("div")
    div.classList.add("input-field", "col", "s12")

    let input = document.createElement("input")
    input.setAttribute("type", "text")
    input.setAttribute("id", `${_id}-${index}`)
    input.setAttribute("question-type", TYPES_QUESTION_ENUM["str"])

    let label = document.createElement("label")
    label.innerText = one_field.title
    label.setAttribute("for", `${_id}-${index}`)
    if(answerStored?.value) {
        input.value = answerStored.value
        label.classList.add("active")
    }

    div.appendChild(input)
    div.appendChild(label)

    return div
}

/** 
* Render question method in case of 'list<str>' : it creates a chips element
* @param {_id} _id - UUID of the recommendation
* @param {index} index - Index of question 
* @param {one_field} one_field - configuration of the answer
* @param {answerStored} answerStored - answer if exists or null
* @returns {HTMLElement} HTMLElement - Brief description of the returning value here.
*/
function renderFieldListStr(_id, index, one_field,answerStored) {
    let div_row = document.createElement("div")
    div_row.classList.add("row")

    let div_col = document.createElement("div")
    div_col.classList.add("input-field", "col", "s12")

    let title = document.createElement("p")
    title.classList.add(["caption"])
    title.innerText = one_field.title

    let deleteBtn = document.createElement('a')
    deleteBtn.classList.add("prevent-select", "material-symbols-outlined", "vertical-align", "clickable")
    deleteBtn.innerText = "delete_forever"

    deleteBtn.onclick = () => {
        let chipsInstance = M.Chips.getInstance(document.getElementById(`${_id}-${index}`))

        const size = chipsInstance.chipsData.length;
        for (let i = 0; i < size; i++) {
            chipsInstance.deleteChip(0);
        }
    }

    let chips = document.createElement("div")
    chips.classList.add("chips", "chips-placeholder")
    chips.setAttribute("id", `${_id}-${index}`)
    chips.setAttribute("question-type", TYPES_QUESTION_ENUM["list<str>"])


    let chips_opt = {
        placeholder: `Press enter`,
        secondaryPlaceholder: '+ More',
    }


    let chipsInstance = M.Chips.init(chips, chips_opt)

    div_col.appendChild(title)
    div_col.appendChild(deleteBtn)
    div_col.appendChild(chips)

    if(answerStored?.value) {
        answerStored?.value.forEach((val, index) => {
            chipsInstance.addChip({tag:val, id:index})
        })
    }

    div_row.appendChild(div_col)
    return div_row
}

/** 
* Render question method in case of 'choice<str>' : it creates a select element
* The Select element is an 
* @param {_id} _id - UUID of the recommendation
* @param {index} index - Index of question 
* @param {one_field} one_field - configuration of the answer
* @param {answerStored} answerStored  answer if exists or null
* @returns {HTMLElement} HTMLElement - Brief description of the returning value here.
*/
function renderFieldChoiceStr(_id, index, one_field, answerStored) {
    //Parse type in order to get options
    let choices_to_parse = one_field.type.replace("choice<str>", "")
    choices_to_parse = choices_to_parse.replace("[", "").replace("]", "")
    let choices_allowed = choices_to_parse.split(",")

    //Create element
    let div_row = document.createElement("div")
    div_row.classList.add(["row"])

    let div_col = document.createElement("div")
    div_col.classList.add("input-field", "col", "s12")

    let select_choice = document.createElement("select")
    select_choice.setAttribute("id", `${_id}-${index}`)
    select_choice.setAttribute("question-type", TYPES_QUESTION_ENUM["choice<str>"])


    let option_dis = document.createElement("option")
    option_dis.value = ""
    option_dis.setAttribute('disabled', '')
    option_dis.setAttribute('selected', '')
    option_dis.innerText = "Choose your options"

    select_choice.appendChild(option_dis)

    for (let i = 0; i < choices_allowed.length; i++) {
        const one_choice = choices_allowed[i];

        let option_choice = document.createElement("option")
        option_choice.value = one_choice
        option_choice.innerText = one_choice


        select_choice.appendChild(option_choice)
    }

    
    let label = document.createElement("label")
    label.innerText = one_field.title
    label.setAttribute("for", `${_id}-${index}`)
    label.setAttribute("style", "top:215px !important;")

    div_col.appendChild(select_choice)
    div_col.appendChild(label)

    div_row.appendChild(div_col)

    if(answerStored?.value) {
        select_choice.value = answerStored.value
        label.classList.add("active")
    }


    MATERIALIZE_FIFO.push({ element_type: "formselect", id: select_choice.id })

    return div_row
}


/** 
* Get data from chips in case of 'list<str>', it takes values from a chips elements and
add it to the local storage
* @param {input_component} inputComponent - Chips element
* @param {configType} configType - Configuration of the field
*/
function retrieveListStrData(inputComponent, configType) {
    let chipInstance = M.Chips.getInstance(inputComponent)

    let dataToSave = []
    chipInstance.chipsData.forEach(chip => {
        dataToSave.push(chip.tag)
    });

    storeAnswerInLocalStorage(inputComponent, dataToSave, configType)
}

/** 
* Get data from input in case of 'str', it takes valueand
add it to the local storage
* @param {input_component} inputComponent - Chips element
* @param {configType} configType - Configuration of the field
*/
function retrieveStr(input,question_data) {
    storeAnswerInLocalStorage(input, input.value, question_data)
}

/** 
* Update local storage with a new value. If the answer value is empty, it's remove from local storage.
If there's already a value present, we update this value.
* @summary Update local storage with a new value.
* @param {inputComponent} inputComponent - inputComponent is a DOM Element, it has an id : UUIDRecommendation-index
* @param {dataToSave} dataToSave - Data already process for the back, this value will be sent
* @param {configType} configType - config type of the question
*/
function storeAnswerInLocalStorage(inputComponent, dataToSave, configType) {
    let { id, valueFormat } = formatValueToStore(inputComponent, dataToSave, configType)

    storeAnswerData(id, valueFormat, dataToSave)
    storeSelectedIds(id)
}

/** 
* Manage selected IDS. Based on verification about storage item with UUID of the recommendation.
* If an item with the same id does not exists, we remove the id from the data
* We also check the local storage to create it if it's not exists.
* @summary Manage selected IDS stored in store
* @param {ParamDataTypeHere} id - ID of recommendation
*/
function storeSelectedIds(id) {
    let localStorageData = JSON.parse(localStorage.getItem(SELECTED_ID_STORAGE))
    if(!localStorageData) {
        localStorageData = []
        localStorage.setItem(SELECTED_ID_STORAGE,JSON.stringify(localStorageData))
    }

    isDataToSave = localStorage.getItem(id)
    //The localstorage exists, we need to save the answer but the id recommendation does not exist
    if(isDataToSave && localStorageData.findIndex(val => val == id) == -1) {
        localStorageData.push(id);
        localStorage.setItem(SELECTED_ID_STORAGE,JSON.stringify(localStorageData))
    } //There's no data, we are in case of delete, we delete only if the id exists in the array
        else if(!isDataToSave && localStorageData.findIndex(val => val == id) != -1) {
        localStorageData = localStorageData.filter((val) => val != id);
        localStorage.setItem(SELECTED_ID_STORAGE,JSON.stringify(localStorageData))
    }
}


/** 
 * Store answer data to localStorage
 * 
* @param {inputComponent} id - Id of recommendation
* @param {inputComponent} valueFormat - Data formated by our function to be store
* @param {inputComponent} dataToSave - data to check if it's not empty in order to remove local storage
*/
function storeAnswerData(id, valueFormat, dataToSave) {
    let localStorageData = localStorage.getItem(id) ? JSON.parse(localStorage.getItem(id)) : ''
    let indexInLocalStorage = localStorageData ? localStorageData.findIndex(val => val.index == valueFormat.index) : -1

    if (dataToSave.length != [] && dataToSave) {
        // It's the first answer for this recommendation
        if (!localStorageData) localStorage.setItem(id, JSON.stringify([valueFormat]));

        // It's not the first answer for this recommendation but first answer at this question
        else if (localStorageData && indexInLocalStorage == -1) {
            localStorageData.push(valueFormat)
            localStorage.setItem(id, JSON.stringify(localStorageData))
        }

        // There's a answer already written
        else if (localStorageData && indexInLocalStorage != -1) {
            localStorageData[indexInLocalStorage] = valueFormat
            localStorage.setItem(id, JSON.stringify(localStorageData))
        }
    } else if (localStorageData && indexInLocalStorage != -1) {
        localStorageData = localStorageData.filter((val) => val.index != indexInLocalStorage)
        //After filter no more data in this recommendation
        if (!localStorageData.length) {
            localStorage.removeItem(id)
        } else {
            //Update the local storage with the filtered version
            localStorage.setItem(id, JSON.stringify(localStorageData))
        }
    }
}


/** 
 * Format a value in order to be store in local storage. It's a JSON format with three keys :
 * value, formatType, index 
 * 
* @param {inputComponent} inputComponent - Input component is needed to retrieve the index of answer and id recommendation
* @param {inputComponent} dataToSave - Data in value
* @param {inputComponent} configType - Configuration of this answer to send type answer to the back
* @returns {string} Object - id, valueFormat
*/
function formatValueToStore(inputComponent, dataToSave, configType) {
    let idFromHtml = inputComponent.id.split('-')
    let index = idFromHtml.pop()
    let id = idFromHtml.join("-")
    let valueFormat = {
        index: parseInt(index),
        value: dataToSave,
        formatType: configType.type,
    }
    return { id, valueFormat }
}
