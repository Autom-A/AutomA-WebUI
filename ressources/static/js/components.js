var MATERIALIZE_FIFO = []

function render_recommendations() {
    let recommendation_container = document.getElementById("recommendations-container")

    // clear table before filling
    while (recommendation_container.firstChild) {
        question_body.removeChild(recommendation_container.lastChild);
    }

    let all_recommendations = JSON.parse(localStorage.getItem("recommendations"))
    for (let i = 0; i < all_recommendations.length; i++) {
        const one_recommendation = all_recommendations[i];
        let r_line = render_recommendation_line(one_recommendation)
        recommendation_container.appendChild(r_line)
    }
}

function render_recommendation_line(one_recommendation) {
    let line = document.createElement("tr")
    line.setAttribute("id", one_recommendation["_id"])

    line.onclick = () => {
        get_question(line.getAttribute("id"))
    }

    let c_selected = document.createElement("th")
    c_selected.innerHTML = `<a id="r-radio-btn" class=material-symbols-outlined>radio_button_unchecked</a>`
    line.appendChild(c_selected)

    line.appendChild(render_recommendation_atome(one_recommendation["id"]))
    line.appendChild(render_recommendation_atome(one_recommendation["name"]))
    line.appendChild(render_recommendation_atome(one_recommendation["category"]))
    line.appendChild(render_recommendation_atome(one_recommendation["level"]))
    line.appendChild(render_recommendation_atome(one_recommendation["from"]))

    return line
}

function render_recommendation_atome(text_displayed) {
    let atome = document.createElement("th")
    atome.innerText = text_displayed
    return atome
}

function render_question(_id) {
    // Check if modal for this question already exists
    let question_modal = document.getElementById(`q-${_id}`)
    if (question_modal != undefined) {
        M.Modal.getInstance(question_modal).open()
    } else {
        let question_container = document.getElementById("question-container")

        let template = document.getElementById("template-question-modal")
        question_modal = template.content.cloneNode(true).querySelector("div")
        question_modal.setAttribute("id", `q-${_id}`)

        let question_data = JSON.parse(localStorage.getItem(_id))

        let question_title = question_modal.querySelector("#question-title")
        question_title.innerText = question_data.title

        let question_description = question_modal.querySelector("#question-description")
        question_description.innerText = question_data.description

        let question_body = question_modal.querySelector('#question-body')
        for (let i = 0; i < question_data.questions.length; i++) {
            let field = render_question_field(_id, i, question_data.questions[i])
            question_body.appendChild(field)
        }

        question_body.appendChild(render_question_btn(_id))

        question_container.appendChild(question_modal)

        while (MATERIALIZE_FIFO.length > 0) {
            let todo = MATERIALIZE_FIFO.pop()
            switch (todo.element_type) {
                case "formselect":
                    let el = document.getElementById(todo.id)
                    M.FormSelect.init(el,{})
                    break;
                default:
                    break;
            }
        }

        M.Modal.init(question_modal)
        M.Modal.getInstance(question_modal).open()
    }
}

function render_question_btn(_id) {
    let div = document.createElement("div")
    div.classList.add(["right-align"])

    let btn = document.createElement("a")
    btn.classList.add(["btn-floating"])

    let icon = document.createElement("i")
    icon.classList.add(["material-icons"])
    icon.innerText = "check"

    btn.appendChild(icon)
    div.appendChild(btn)

    return div
}

function render_question_field(_id, index, one_field) {
    return parse_type(one_field.type)(_id,index,one_field)
}

function parse_type(input_type){
    switch (input_type) {
        case "str":
            return render_field_str
        case "list<str>":
            return render_field_list_str
        default:
            if (input_type.includes("choice<str>")) return render_field_choice_str
    }
}

function render_field_str(_id, index, one_field) {
    let div = document.createElement("div")
    div.classList.add("input-field")

    let input = document.createElement("input")
    input.setAttribute("type", "text")
    input.setAttribute("id", `${_id}-${index}`)

    let label = document.createElement("label")
    label.innerText = one_field.title
    label.setAttribute("for", `${_id}-${index}`)

    div.appendChild(input)
    div.appendChild(label)

    return div
}

function render_field_list_str(_id,index,one_field) {
    let div_row = document.createElement("div")
    div_row.classList.add("row")

    let div_col = document.createElement("div")
    div_col.classList.add(["input-field","col","s12"])

    let title = document.createElement("p")
    title.classList.add(["caption"])
    title.innerText = one_field.title

    let chips = document.createElement("div")
    chips.classList.add(["chips","chips-placeholder"])
    chips.setAttribute("id", `${_id}-${index}`)

    let chips_opt = {
        placeholder: `Enter ${one_field.name.replace("_"," ")}`,
        secondaryPlaceholder: '+More',
    }
    M.Chips.init(chips,chips_opt)

    div_col.appendChild(title)
    div_col.appendChild(chips)

    div_row.appendChild(div_col)
    return div_row
}

function render_field_choice_str(_id, index, one_field) {
    let choices_to_parse = one_field.type.replace("choice<str>","") 
    choices_to_parse = choices_to_parse.replace("[","").replace("]","")
    let choices_allowed = choices_to_parse.split(",")

    let div_row = document.createElement("div")
    div_row.classList.add(["row"])

    let div_col = document.createElement("div")
    div_col.classList.add(["input-field","col", "s12"])

    let select_choice = document.createElement("select")
    select_choice.setAttribute("id",`${_id}-${index}`)

    let option_dis = document.createElement("option")
    option_dis.value = ""
    option_dis.setAttribute('disabled','')
    option_dis.setAttribute('selected','')
    option_dis.innerText = "Choose your options"

    select_choice.appendChild(option_dis)

    for (let i = 0; i < choices_allowed.length; i++) {
        const one_choice = choices_allowed[i];
        
        let option_choice = document.createElement("option")
        option_choice.value = one_choice
        option_choice.innerText = one_choice

        console.log(one_choice);

        select_choice.appendChild(option_choice)
    }

    let label = document.createElement("label")
    label.innerText = one_field.title
    label.setAttribute("for",`${_id}-${index}`)
    label.setAttribute("style","top:215px !important;") 

    div_col.appendChild(select_choice)
    div_col.appendChild(label)

    div_row.appendChild(div_col)

    MATERIALIZE_FIFO.push({element_type:"formselect", id: select_choice.id})

    return div_row
}