from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from os.path import abspath, join
from utils.id_management import RecommendationID
from utils.custom_exceptions import PathDoesNotExist, VariablePathNotDefined
from utils.questions_parser import list_anssi_recommendations, list_categories, read_questions_file
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
    except PathDoesNotExist as e:
        return jsonify({"ERROR":e.args}), 400
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
    except PathDoesNotExist as e:
        return jsonify({"ERROR":e.args}), 400
    except Exception as e:
        print(e)
        return jsonify({"ERROR":"An error occured"}), 400


flask_app.run(host=SERVER_IP, port=SERVER_PORT, debug=True)
