from flask import Flask
from flask_cors import CORS
from os.path import abspath, join
from src.utils.configuration import Configuration
from src.utils.sockets import socketio
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

db = SQLAlchemy()
STATIC_FOLDER = join(abspath("."),"ressources","static")

def create_app():
    
    # RETRIEVE CONFIGURATION
    config = Configuration()
    config.read_configuration()

    flask_app = Flask(__name__, static_folder=STATIC_FOLDER)
    flask_app.config['SECRET_KEY'] = config.get("server_secret")
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.sqlite'

    socketio.init_app(flask_app)
    db.init_app(flask_app)
    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(flask_app)
    from .models import User
    
    with flask_app.app_context():
        db.create_all()

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    from .main import main as main_blueprint
    from .auth import auth as auth_blueprint

    flask_app.register_blueprint(auth_blueprint)
    flask_app.register_blueprint(main_blueprint)
    CORS(flask_app,resources={r"*":{"origins": "*"}})
    
    return flask_app