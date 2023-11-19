/** 
* Render globally all recommendations based on session storage recommendations
*/
function renderRecommendations() {
    let recommendation_container = document.getElementById("recommendations-container")

    // clear table before filling
    while (recommendation_container.firstChild) {
        question_body.removeChild(recommendation_container.lastChild);
    }

    let all_recommendations = JSON.parse(sessionStorage.getItem("recommendations"))
    for (let i = 0; i < all_recommendations.length; i++) {
        const one_recommendation = all_recommendations[i];
        let r_line = renderRecommendationLine(one_recommendation)
        recommendation_container.appendChild(r_line)
    }
}

/** 
* Render recommendation line adding elements to the DOM
* @param {Recommendation} one_recommendation Recommendation retrieve by the back
*/
function renderRecommendationLine(one_recommendation) {
    let line = document.createElement("tr")
    line.setAttribute("id", one_recommendation["_id"])

    line.onclick = () => {
        get_question(line.getAttribute("id"))
    }

    let c_selected = document.createElement("th")
    c_selected.innerHTML = `<a id="r-radio-btn" class=material-symbols-outlined>radio_button_unchecked</a>`
    line.appendChild(c_selected)

    line.appendChild(renderRecommendationAtome(one_recommendation["id"]))
    line.appendChild(renderRecommendationAtome(one_recommendation["name"]))
    line.appendChild(renderRecommendationAtome(one_recommendation["category"]))
    line.appendChild(renderRecommendationAtome(one_recommendation["level"]))
    line.appendChild(renderRecommendationAtome(one_recommendation["from"]))

    return line
}

/** 
* Render cell 
* @param {Recommendation} text_displayed Text added in the celle
*/
function renderRecommendationAtome(text_displayed) {
    let atome = document.createElement("th")
    atome.innerText = text_displayed
    return atome
}

