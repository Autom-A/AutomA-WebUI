from os.path import join
from utils.custom_exceptions import MissingRecommendation

from utils.supported_systems import SupportedSystems
class SingletonRecommendationsSelected():
    """
    This class is a sigleton object for RecommendationSelected class
    """
    _instance = {}

    def __new__(class_, *args, **kwargs):
        if class_ not in class_._instance:
            class_._instance[class_] = super(SingletonRecommendationsSelected, class_).__new__(class_)
        return class_._instance[class_]

class RecommendationsSelected(SingletonRecommendationsSelected):
    """This class keep in memory which recommendations has been selected
    """

    _recommendations_selected =  []

    def __init__(self, recommendations=[]) -> None:
        super().__init__()
        if len(recommendations) > 0:
            self._recommendations_selected = recommendations

    def write_yml(self):
        if len(self._recommendations_selected) == 0:
            raise MissingRecommendation("There must be at least one recommendation to apply")
        supported_systems = SupportedSystems()
        with open("./playbook.master.yml","w") as playbook_master_file:
            playbook_master_file.write("---\n")
            for recommendation in self._recommendations_selected:
                recommendation_path = join(supported_systems._playbooks_location,recommendation,"playbook.yml")
                playbook_master_file.write(f"- import_playbook: \"{recommendation_path}\"\n")