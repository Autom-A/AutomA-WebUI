from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from os.path import abspath, join
from utils.id_management import RecommendationID
from utils.custom_exceptions import PathDoesNotExist, VariablePathNotDefined
from utils.questions_parser import list_anssi_recommandations, list_categories, read_questions_file
from utils.supported_systems import SupportedSystems

STATIC_FOLDER = join(abspath("."),"ressources","static")
flask_app = Flask(__name__, static_folder=STATIC_FOLDER)
CORS(flask_app)

SERVER_IP = "127.0.0.1"
SERVER_PORT = "9123"
PLAYBOOK_LOCATION = "./playbooks"


recommendation_id = RecommendationID()
recommendation_id.set_id_file_location("id_management.yml")
recommendation_id.set_playbooks_location(PLAYBOOK_LOCATION)
try:
    all_r = recommendation_id.through_playbooks()
    new_r = recommendation_id.attribute_new_playbooks(all_r)
except Exception as e:
    print(e.with_traceback())

supported_systems = SupportedSystems()
supported_systems.set_playbooks_location(PLAYBOOK_LOCATION)

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
    except VariablePathNotDefined as e:
        return jsonify({"ERROR":e.args}), 400

@flask_app.route("/api/selector/os", methods=['POST'])
def post_os():
    try:
        os = request.get_json().get("os")
        if not os:
            return jsonify({"ERROR":"os variable not found"})
        else:
            supported_systems.set_os(os)
            return jsonify({"SUCCESS":"os has been selected"}), 200
    except VariablePathNotDefined as e:
        return jsonify({"ERROR":e.args}), 400
    except Exception as e:
        print(e)
        return jsonify({"ERROR":"An error occured"}), 400

@flask_app.route("/api/selector/os_type", methods=['GET'])
def get_os_type():
    try:
        return jsonify(supported_systems.get_os_type())
    except VariablePathNotDefined or PathDoesNotExist as e:
        return jsonify({"ERROR":e.args}), 400
    
@flask_app.route("/api/selector/os_type", methods=['POST'])
def post_os_type():
    try:
        os = request.get_json().get("os_type")
        if not os:
            return jsonify({"ERROR":"os type variable not found"})
        else:
            supported_systems.set_os_type(os)
            return jsonify({"SUCCESS":"os type has been selected"}), 200
    except VariablePathNotDefined as e:
        return jsonify({"ERROR":e.args}), 400
    except Exception as e:
        print(e)
        return jsonify({"ERROR":"An error occured"}), 400
        
@flask_app.route("/api/selector/os_version", methods=['GET'])
def get_os_version():
    try:
        return jsonify(supported_systems.get_os_version())
    except VariablePathNotDefined or PathDoesNotExist as e:
        return jsonify({"ERROR":e.args}), 400

@flask_app.route("/api/selector/os_version", methods=['POST'])
def post_os_version():
    try:
        os = request.get_json().get("os_version")
        if not os:
            return jsonify({"ERROR":"os version variable not found"})
        else:
            supported_systems.set_os_version(os)
            return jsonify({"SUCCESS":"os version has been selected"}), 200
    except VariablePathNotDefined as e:
        return jsonify({"ERROR":e.args}), 400
    except Exception as e:
        print(e)
        return jsonify({"ERROR":"An error occured"}), 400
    
@flask_app.route("/api/recommandations", methods=['GET'])
def get_recommandations():
    try:
        all_recommandations = []
        for category in list_categories(supported_systems):
            recommandations_in_cat = list_anssi_recommandations(category,supported_systems)
            for level in recommandations_in_cat:
                for recommandation in recommandations_in_cat[level]:
                    split_name = recommandation.split("_")
                    name = " ".join(split_name[1:])
                    level_name = " ".join(level.split("_")[1:])
                    all_recommandations.append({"id":split_name[0],
                                                "name":name,
                                                "category":category,
                                                "level":level_name,
                                                "from":"ANSSI",
                                                "path":join(category,"ANSSI",level,recommandation)})
                    
        return jsonify(all_recommandations), 200
    except PathDoesNotExist as e:
        return jsonify({"ERROR":e.args}), 400
    except Exception as e:
        print(e)
        return jsonify({"ERROR":"An error occured"}), 400 

@flask_app.route("/api/question",methods=['GET'])
def get_question():
    try:
        recommandation = request.args["recommandation"]
        question_data = read_questions_file(join(supported_systems.get_entire_path(),recommandation,"questions.yml"))
        return jsonify(question_data)
    except PathDoesNotExist as e:
        return jsonify({"ERROR":e.args}), 400
    except Exception as e:
        print(e)
        return jsonify({"ERROR":"An error occured"}), 400


flask_app.run(host=SERVER_IP, port=SERVER_PORT, debug=True)
