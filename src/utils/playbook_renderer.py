from jinja2 import Environment, FileSystemLoader
from os.path import join, exists, isdir
from src.utils.custom_exceptions import PathDoesNotExist
from src.utils.supported_systems import SupportedSystems

def playbook_render_write(dir_path: str, variables: dict):
    """This function take the playbook.yml.j2 template to inject into all answers from
    user input. After this, the function is writing the playbook as 'playbook.yml'
    in the directory

    Args:
        dir_path (str): The path of the recommendation where template is stored
        variables (dict): A dict containing variable names and variable values to
                          render in the template
    Raises:
        PathDoesNotExist: If the specified path does not exist
    """
    supported_systems = SupportedSystems()
    dir_path = join(supported_systems._playbooks_location,dir_path)

    if exists(dir_path) and isdir(dir_path):
        if exists(join(dir_path,'playbook.yml.j2')):
            env = Environment(auto_reload=False, loader = FileSystemLoader(dir_path))

            with open(join(dir_path,"playbook.yml"),"w") as playbook_filled_file:
                playbook_filled = env.get_template('playbook.yml.j2').render(**variables)
                playbook_filled_file.write(playbook_filled)
        else:
            raise PathDoesNotExist(f"The following path does not exist : {join(dir_path,'playbook.yml.j2')}")
    else:
        raise PathDoesNotExist(f"The following path does not exist : {dir_path}")
