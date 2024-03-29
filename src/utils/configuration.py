from uuid import uuid4
from yaml import safe_load

from os import listdir, mkdir
from os.path import join, exists, isdir, abspath

from src.utils.custom_exceptions import IDDoesNotExist, PathDoesNotExist, VariableIDNotDefined, VariablePathNotDefined
from src.utils.path import list_dir_in_dir

class SingletonConfiguration():
    """Sigleton of the Configuration class
    """
    _instance = {}

    def __new__(class_, *args, **kwargs):
        if class_ not in class_._instance:
            class_._instance[class_] = super(SingletonConfiguration, class_).__new__(class_, *args, **kwargs)
        return class_._instance[class_]

class Configuration(SingletonConfiguration):
    """This class read configuration file and retrieve variables. If a variable is not present
        the variable is set with a default value.
    """
    _config = {}

    def get(self, config_key):
        """return the config value of the key specified in arg
        """
        return self._config.get(config_key)
    
    def read_configuration(self):
        """Read the configuration file and set required variables
        """
        config_path = join(abspath("."),"config.yml")

        if not exists(config_path):
            print("WARNING - Config file does not exist - Setting default value")

            self._config["server_ip_frontend"] = "127.0.0.1"
            self._config["server_ip_backend"] = "0.0.0.0"
            self._config["server_port"] = 9123
            self._config["server_secret"] = 'secret'
            self._config["path_generated"] = join(abspath("."),"generated")
            self._config["path_playbooks"] = join(abspath("."),"playbooks")
            self._config["path_logs"] = join(abspath("."),"logs")
            self._config["server_user"] = 'admin'
            self._config["server_password"] = 'admin123'

        else:
            with open(config_path) as config_file:
                config = safe_load(config_file)

                if config.get("server") and config.get("server").get("user"):
                    self._config["server_user"] = config.get("server").get("user")
                else:
                    print("WARNING - No username supplied - using default 'admin'")
                    self._config["server_user"] = 'admin'

                if config.get("server") and config.get("server").get("password"):
                    self._config["server_password"] = config.get("server").get("password")
                else:
                    print("WARNING - No password supplied - using default 'admin123'")
                    self._config["server_password"] = 'admin123'

                if config.get("server") and config.get("server").get("ip_backend"):
                    self._config["server_ip_backend"] = config.get("server").get("ip_backend")
                else:
                    print("WARNING - No backend_ip supplied - using default '0.0.0.0'")
                    self._config["server_ip_backend"] = "0.0.0.0"

                if config.get("server") and config.get("server").get("ip_frontend"):
                    self._config["server_ip_frontend"] = config.get("server").get("ip_frontend")
                else:
                    print("WARNING - No server ip supplied - using default '127.0.0.1'")
                    self._config["server_ip_frontend"] = "127.0.0.1"

                if config.get("server") and config.get("server").get("port"):
                    self._config["server_port"] = config.get("server").get("port")
                else:
                    print("WARNING - No server port supplied - using default 9123")
                    self._config["server_port"] = "9123"

                if config.get("server") and config.get("server").get("secret"):
                    self._config["server_secret"] = config.get("server").get("secret")
                else:
                    print("WARNING - No secret token - using default 'secret'. PLEASE CHANGE IT")
                    self._config["server_secret"] = 'secret'

                if config.get("path") and config.get("path").get("generated"):
                    self._config["path_generated"] = join(abspath("."),config.get("path").get("generated"))
                else:
                    print("WARNING - No path for 'generated' dir - using default 'generated'")
                    self._config["path_generated"] = join(abspath("."),"generated")

                if config.get("path") and config.get("path").get("playbooks"):
                    self._config["path_playbooks"] = join(abspath("."),config.get("path").get("playbooks"))
                else:
                    print("WARNING - No path for 'playbooks' dir - using default 'playbooks'")
                    self._config["path_playbooks"] = join(abspath("."),"playbooks")

                if config.get("path") and config.get("path").get("logs"):
                    self._config["path_logs"] = join(abspath("."),config.get("path").get("logs"))
                else:
                    print("WARNING - No path for 'playbooks' dir - using default 'playbooks'")
                    self._config["path_logs"] = join(abspath("."),"logs")

        if not exists(self._config.get("path_generated")): mkdir(self._config.get("path_generated"))
        if not exists(self._config.get("path_playbooks")): mkdir(self._config.get("path_playbooks"))
        if not exists(self._config.get("path_logs")): mkdir(self._config.get("path_logs"))
