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
