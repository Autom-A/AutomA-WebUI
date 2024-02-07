from uuid import uuid4
from yaml import safe_load, dump as yml_dump

from os import listdir
from os.path import join, exists, isdir
from src.utils.configuration import Configuration

from src.utils.custom_exceptions import IDDoesNotExist, PathDoesNotExist, VariableIDNotDefined, VariablePathNotDefined
from src.utils.path import list_dir_in_dir

class SingletonRecommendationID():
    """Sigleton of the RecommendationID class
    """
    _instance = {}

    def __new__(class_, *args, **kwargs):
        if class_ not in class_._instance:
            class_._instance[class_] = super(SingletonRecommendationID, class_).__new__(class_, *args, **kwargs)
        return class_._instance[class_]

class RecommendationID(SingletonRecommendationID):
    """This class manage the ID of each recommendation. To avoid to put ID in recommendation
    directories and files, the class RecommendationID manage dynamically ID by adding missing pair
    ID/path in the ID file. Futhermore, all ID are UUID from the uuid.uuid4()
    """
    _id_file_location = ""
    _playbooks_location = ""
    _recommendation_ids = {}

    def set_playbooks_location(self, path : str):
        """Check and set the location of the playbook directory

        Args:
            path (str): The path of the playbook location

        Raises:
            PathDoesNotExist: If the specified path does not exist
            VariablePathNotDefined: If variables are not filled
        """
        if len(path) > 0:
            if exists(path):
                self._playbooks_location = join(path)
            else:
                raise PathDoesNotExist(f"The following path does not exist : {path}")
        else:
            raise VariablePathNotDefined("The path must be a string with len > 0")
    
    def set_id_file_location(self, path : str):
        """Set the location of the ID/PATH pair file

        Args:
            path (str): Path of the file

        Raises:
            VariablePathNotDefined: If variables are not filled
        """
        if len(path) > 0:
            if exists(path):
                self._id_file_location = path
            else:
                print(f"The following path does not exist : {path}")
                print(f"Setting _id_file_location to 'id_management.yml'")

                config = Configuration()

                self._id_file_location = join(config.get("path_generated"),"id_management.yml")
                with open(self._id_file_location,"w") as f:
                    pass
        else:
            raise VariablePathNotDefined("The path must be a string with len > 0")
        
    def attribute_new_playbooks(self, all_recommendation_paths : list[str]):
        """Add missing pair ID/PATH in the file. The pair ID/PATH are not deleted when
        a playbook is removed.

        Args:
            all_recommendation_paths (list[str]): list of all recommendation paths
        """
        with open(self._id_file_location,"r") as id_file:
            id_path_pair = safe_load(id_file)
        
        with open(self._id_file_location,"w") as id_file:
            
            if id_path_pair is None or id_path_pair.get("recommendation_ids") is None:
                yml_dump({"recommendation_ids":[]},id_file)
                self._recommendation_ids = []
                return

            for recommendation_path in all_recommendation_paths:
                contains = False                
                for pair in id_path_pair.get("recommendation_ids"):
                    if pair.get("path") == recommendation_path:
                        contains = True
                        break

                if not contains:
                    id_path_pair.get("recommendation_ids").append({"id":str(uuid4()),"path":join(recommendation_path)})

            yml_dump(id_path_pair,id_file)
            self._recommendation_ids = id_path_pair.get("recommendation_ids")

    def get_available_playbooks(self) -> list[str]:
        """browse all folders in the playbook folder to retrieve all recommendation paths

        Returns:
            list[str]: all recommendation paths
        """
        all_recommendation_paths = []

        for os in list_dir_in_dir(self._playbooks_location):
            os_type_path = join(self._playbooks_location,os)
            for os_type in list_dir_in_dir(os_type_path):
                
                os_version_path = join(os_type_path,os_type)
                for os_version in list_dir_in_dir(os_version_path):
            
                    category_path = join(os_version_path,os_version)
                    for category in list_dir_in_dir(category_path):

                        rfrom_path = join(category_path,category)
                        for rfrom in list_dir_in_dir(rfrom_path):

                            level_path = join(rfrom_path,rfrom)
                            for level in list_dir_in_dir(level_path):

                                recommendation_path = join(level_path,level)
                                for recommendation in list_dir_in_dir(recommendation_path):
                                    rpath = join(os,os_type,os_version,category,rfrom,level,recommendation)
                                    all_recommendation_paths.append(rpath)

        return all_recommendation_paths

    def get_id_from_path(self, path : str) -> str:
        """Translate a path to an ID. The ID is used mainly in the front-end

        Args:
            path (str): path to translate

        Raises:
            IDDoesNotExist: If the path doesn't have an ID
            PathDoesNotExist: If the specified path does not exist
            VariablePathNotDefined: If variables are not filled

        Returns:
            str: The path's ID
        """
        if len(path) > 0:
            if exists(path):
                path = join(path.replace(self._playbooks_location,""))
                for pair in self._recommendation_ids:
                    if pair.get("path").strip("/").strip('\\') == path.strip("/").strip('\\'):
                        return pair.get("id")
                raise IDDoesNotExist(f"The following path does not have id: {path}")
            else:
                raise PathDoesNotExist(f"The following path does not exist : {path}")
        else:
            raise VariablePathNotDefined("The path must be a string with len > 0")
        
    def get_path_from_id(self,id: str) -> str:
        """Translate an ID to a path. The path is used mainly in the back-end

        Args:
            id (str): The id to translate

        Raises:
            IDDoesNotExist: If the ID does not exist
            VariablePathNotDefined: If variables are not filled

        Returns:
            str: The ID's path
        """
        if len(id) == 36:
                for pair in self._recommendation_ids:
                    if pair.get("id") == id:
                        return pair.get("path")
                raise IDDoesNotExist(f"The following id does not exist: {id}")
        else:
            raise VariableIDNotDefined("The id must be a string with len of 36")
        

