from src import create_app
from src.utils.configuration import Configuration
flask_app = create_app()
config = Configuration()
config.read_configuration()
if __name__ == "__main__":
    flask_app.run(host=config.get("server_ip_backend"),
              port=config.get("server_port"),
              debug=True
              )