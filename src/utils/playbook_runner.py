from ansible_runner import run
from os.path import join,exists,isfile
from utils.configuration import Configuration
from utils.custom_exceptions import PathDoesNotExist

def run_ansible_playbook():
    """This function call runner function from ansible to run the playbook.master.yml with 
        the inventory.yml

    Raises:
        PathDoesNotExist: If the path of playbook.master.yml or inventory.yml does not exist
    """
    
    config = Configuration()
    generated_path = config.get("path_generated")
    playbook_path = join(generated_path,'playbook.master.yml')
    inventory_path = join(generated_path,'inventory.yml')

    if not exists(playbook_path) or not isfile(playbook_path):
        raise PathDoesNotExist(f"The following path does not exist : {playbook_path}")
    if not exists(inventory_path) or not isfile(inventory_path):
        raise PathDoesNotExist(f"The following path does not exist : {inventory_path}")

    runner = run(
        playbook=playbook_path,
        inventory=inventory_path,
        extravars={},
        event_handler=realtime_log,
        quiet= True,
        )




def realtime_log(event_data):
    print(event_data['stdout'])

    if event_data["event"] == "playbook_on_stats":
        # Retrieve status of the Ansible runner
        stats = event_data["event_data"]

        has_error = len(stats["failures"]) > 0 or len(stats["dark"]) > 0

        if has_error:
            print("Le playbook a rencontré des erreurs lors de son exécution.")
        else:
            print("Le playbook s'est exécuté avec succès.") 
