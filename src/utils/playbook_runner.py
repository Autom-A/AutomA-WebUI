from io import TextIOWrapper
from ansible_runner import run
from datetime import datetime
from os.path import join,exists,isfile
from socket import SocketIO 
from utils.configuration import Configuration
from utils.custom_exceptions import PathDoesNotExist

class SingletonRunnerEnv():
    """Sigleton of the SocketIO class
    """
    _instance = {}

    def __new__(class_, *args, **kwargs):
        if class_ not in class_._instance:
            class_._instance[class_] = super(SingletonRunnerEnv, class_).__new__(class_, *args, **kwargs)
        return class_._instance[class_]

class RunnerEnv(SingletonRunnerEnv):
    
    socketio : SocketIO = None
    fileio : TextIOWrapper = None

    def set_socketio(self,socketio):
        self.socketio = socketio

    def set_logfile(self,logfile : str):
        self.logfile = logfile

def run_ansible_playbook(socketio : SocketIO):
    """This function call runner function from ansible to run the playbook.master.yml with 
        the inventory.yml

    Raises:
        PathDoesNotExist: If the path of playbook.master.yml or inventory.yml does not exist
    """
    
    config = Configuration()
    generated_path = config.get("path_generated")
    playbook_path = join(generated_path,'playbook.master.yml')
    inventory_path = join(generated_path,'inventory.yml')
    log_path = config.get("path_logs")

    filename = f"{datetime.now().strftime('%Y%m%d_%Hh%M')}.log"

    runner_env = RunnerEnv()
    runner_env.set_socketio(socketio)
    runner_env.set_logfile(join(log_path,filename))

    if not exists(playbook_path) or not isfile(playbook_path):
        raise PathDoesNotExist(f"The following path does not exist : {playbook_path}")
    if not exists(inventory_path) or not isfile(inventory_path):
        raise PathDoesNotExist(f"The following path does not exist : {inventory_path}")

    run(
        playbook=playbook_path,
        inventory=inventory_path,
        extravars={},
        event_handler=realtime_log,
        quiet= True,
        )

def realtime_log(event_data):
    logstr : str = event_data["stdout"].strip()

    if len(logstr) > 0:
        runner_env = RunnerEnv()
    
        strtime : str = f"\u001b[1;34m{datetime.now().ctime()}\u001b[0m"

        logstrlines : list = logstr.split("\n")
        for line in logstrlines:
            runner_env.socketio.emit('logEvent', {'data': f"{strtime} {line}"})

            with open(runner_env.logfile,"a") as fs:
                fs.write(f"{strtime} {line}\n")


    if event_data["event"] == "playbook_on_stats":
        # Retrieve status of the Ansible runner
        stats = event_data["event_data"]

        has_error = len(stats["failures"]) > 0 or len(stats["dark"]) > 0

        if has_error:
            print("Le playbook a rencontré des erreurs lors de son exécution.")
        else:
            print("Le playbook s'est exécuté avec succès.") 
