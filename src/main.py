from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from os.path import abspath, join
from utils.id_management import RecommendationID
from utils.custom_exceptions import AnswerIsRequired, IDDoesNotExist, PathDoesNotExist, VariableIDNotDefined, VariablePathNotDefined, WrongAnswerType
from utils.playbook_renderer import playbook_render_write
from utils.questions_parser import check_answers, list_anssi_recommendations, list_categories, read_questions_file
from utils.recommendations_selected import RecommendationsSelected
from utils.supported_systems import SupportedSystems

STATIC_FOLDER = join(abspath("."),"ressources","static")
flask_app = Flask(__name__, static_folder=STATIC_FOLDER)

CORS(flask_app,resources={r"/api/*":{"origins": "*"}})

SERVER_IP = "127.0.0.1"
SERVER_PORT = "9123"
PLAYBOOK_LOCATION = "./playbooks"

try:
    # GENERATE FILE THAT CONTAINS PAIR ID/PATH OF EACH RECOMMENDATIONS
    recommendation_id = RecommendationID()
    recommendation_id.set_id_file_location("id_management.yml")
    recommendation_id.set_playbooks_location(PLAYBOOK_LOCATION)

    available_recommendations = recommendation_id.get_available_playbooks()
    recommendation_id.attribute_new_playbooks(available_recommendations)

    # SINGLETON TO SERVE PATH TO ALL FUNCTIONS
    supported_systems = SupportedSystems()
    supported_systems.set_playbooks_location(PLAYBOOK_LOCATION)
except PathDoesNotExist as path_does_not_exist:
    print(path_does_not_exist)
except VariablePathNotDefined as variable_path_not_defined:
    print(variable_path_not_defined)
except Exception as e:
    print(e.with_traceback())


@flask_app.route("/")
def index():
    return render_template("index.html")

@flask_app.route("/app")
def app():
    return render_template("app.html",SERVER_IP=SERVER_IP, SERVER_PORT=SERVER_PORT)


@flask_app.route("/api/selector/os", methods=['GET'])
def get_os():
    try:
        return jsonify(supported_systems.get_os())
    except VariablePathNotDefined as variable_path_not_defined:
        return jsonify({"ERROR":variable_path_not_defined.args}), 400

@flask_app.route("/api/selector/os", methods=['POST'])
def post_os():
    try:
        os = request.get_json().get("os")
        if not os:
            return jsonify({"ERROR":"os variable not found"})
        else:
            supported_systems.set_os(os)
            return jsonify({"SUCCESS":"os has been selected"}), 200
    except VariablePathNotDefined as variable_path_not_defined:
        return jsonify({"ERROR":variable_path_not_defined.args}), 400
    except Exception as e:
        print(e)
        return jsonify({"ERROR":"An error occured"}), 400

@flask_app.route("/api/selector/os_type", methods=['GET'])
def get_os_type():
    try:
        return jsonify(supported_systems.get_os_type())
    except PathDoesNotExist as path_does_not_exist:
        return jsonify({"ERROR":path_does_not_exist.args}), 400
    except VariablePathNotDefined as variable_path_not_defined:
        return jsonify({"ERROR":variable_path_not_defined.args}), 400
    
@flask_app.route("/api/selector/os_type", methods=['POST'])
def post_os_type():
    try:
        os = request.get_json().get("os_type")
        if not os:
            return jsonify({"ERROR":"os type variable not found"})
        else:
            supported_systems.set_os_type(os)
            return jsonify({"SUCCESS":"os type has been selected"}), 200
    except VariablePathNotDefined as variable_path_not_defined:
        return jsonify({"ERROR":variable_path_not_defined.args}), 400
    except Exception as e:
        print(e)
        return jsonify({"ERROR":"An error occured"}), 400
        
@flask_app.route("/api/selector/os_version", methods=['GET'])
def get_os_version():
    try:
        return jsonify(supported_systems.get_os_version())
    except PathDoesNotExist as path_does_not_exist:
        return jsonify({"ERROR":path_does_not_exist.args}), 400
    except VariablePathNotDefined as variable_path_not_defined:
        return jsonify({"ERROR":variable_path_not_defined.args}), 400

@flask_app.route("/api/selector/os_version", methods=['POST'])
def post_os_version():
    try:
        os = request.get_json().get("os_version")
        if not os:
            return jsonify({"ERROR":"os version variable not found"})
        else:
            supported_systems.set_os_version(os)
            return jsonify({"SUCCESS":"os version has been selected"}), 200
    except VariablePathNotDefined as variable_path_not_defined:
        return jsonify({"ERROR":variable_path_not_defined.args}), 400
    except Exception as e:
        print(e)
        return jsonify({"ERROR":"An error occured"}), 400
    
@flask_app.route("/api/recommendations", methods=['GET'])
def get_recommendations():
    try:
        all_recommendations = []
        for category in list_categories(supported_systems):
            recommendations_in_cat = list_anssi_recommendations(category,supported_systems)
            # must use generic function to allow more directory than just ANSSI
            for level in recommendations_in_cat:
                for recommendation in recommendations_in_cat[level]:
                    split_name = recommendation.split("_")
                    name = " ".join(split_name[1:])
                    level_name = " ".join(level.split("_")[1:])
                    r_id = recommendation_id.get_id_from_path(join(supported_systems.get_entire_path(),category,"ANSSI",level,recommendation))
                    all_recommendations.append({"id":split_name[0],
                                                "name":name,
                                                "category":category,
                                                "level":level_name,
                                                "from":"ANSSI",
                                                "_id": r_id})
                    
        return jsonify(all_recommendations), 200
    except PathDoesNotExist as path_does_not_exist:
        return jsonify({"ERROR":path_does_not_exist.args}), 400
    except Exception as e:
        print(e.with_traceback())
        return jsonify({"ERROR":"An error occured"}), 400 

@flask_app.route("/api/question",methods=['GET'])
def get_question():
    try:
        r_id = request.args["_id"]
        r_path = recommendation_id.get_path_from_id(r_id)
        question_data = read_questions_file(join(supported_systems._playbooks_location,r_path))
        return jsonify(question_data)
    except PathDoesNotExist as path_does_not_exist:
        return jsonify({"ERROR":path_does_not_exist.args}), 400
    except Exception as e:
        print(e)
        return jsonify({"ERROR":"An error occured"}), 400


@flask_app.route("/api/playbooks/render", methods=['POST'])
def render_playbook():
    try:
        recommendations_selected = request.get_json()
        recommendations_path_selected = []
        for recommendation in recommendations_selected:
            recommendation_path = recommendation_id.get_path_from_id(recommendation)
            recommendations_path_selected.append(recommendation_path)

            answers_to_inject = check_answers(recommendation_path, recommendations_selected.get(recommendation))
            playbook_render_write(recommendation_path,answers_to_inject)

        # Keep path for next steps
        RecommendationsSelected(recommendations_path_selected)

        nb_playbooks = len(recommendations_selected)
        return jsonify({"SUCCESS": f"{nb_playbooks} playbook{'s'*(nb_playbooks%1)} {'has'*(nb_playbooks%1+1)}{'have'*(nb_playbooks%1)} been generated"})
    except IDDoesNotExist as id_does_not_exist:
        return jsonify({"ERROR":id_does_not_exist.args}), 400
    except VariableIDNotDefined as variable_id_not_defined:
        return jsonify({"ERROR":variable_id_not_defined.args}), 400
    except WrongAnswerType as wrong_answer_type:
        return jsonify({"ERROR":wrong_answer_type.args}), 400
    except AnswerIsRequired as answer_is_required:
        return jsonify({"ERROR":answer_is_required.args}), 400
    except Exception as e:
        print(e.with_traceback())
        return jsonify({"ERROR":"An error occured"}), 400
    
@flask_app.route("/api/playbook/launcher/run", methods=['POST'])
def run_playbook_launcher():
    recommendation_selected = RecommendationsSelected()
    with open("./playbook.master.yml","w") as playbook_master_file:
        playbook_master_file.write("---\n")
        for recommendation in recommendation_selected._recommendations_selected:
            recommendation_path = join(supported_systems._playbooks_location,recommendation)
            playbook_master_file.write(f"- import_playbook: \"{recommendation_path}\"\n")

    return jsonify({"SUCCESS":""})

@flask_app.route("/api/playbook/launcher/download", methods=['GET'])
def download_playbook_launcher():
    pass

flask_app.run(host=SERVER_IP, port=SERVER_PORT, debug=True)
