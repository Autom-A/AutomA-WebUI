
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

