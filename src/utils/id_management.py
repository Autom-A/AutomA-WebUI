from uuid import uuid4
from yaml import safe_load, dump as yml_dump

from os import listdir
from os.path import join, exists, isdir

from utils.custom_exceptions import IDDoesNotExist, PathDoesNotExist, VariableIDNotDefined, VariablePathNotDefined
from utils.path import list_dir_in_dir

class SingletonRecommendationID():
    _instances = {}

    def __new__(class_, *args, **kwargs):
        if class_ not in class_._instances:
            class_._instances[class_] = super(SingletonRecommendationID, class_).__new__(class_, *args, **kwargs)
        return class_._instances[class_]

class RecommendationID(SingletonRecommendationID):
    _id_file_location = ""
    _playbooks_location = ""
    _recommendation_ids = {}

    def set_playbooks_location(self, path : str):
        if len(path) > 0:
            if exists(path):
                self._playbooks_location = join(path)
            else:
                raise PathDoesNotExist(f"The following path does not exist : {path}")
        else:
            raise VariablePathNotDefined("The path must be a string with len > 0")
    
    def set_id_file_location(self, path : str):
        if len(path) > 0:
            if exists(path):
                self._id_file_location = path
            else:
                raise PathDoesNotExist(f"The following path does not exist : {path}")
        else:
            raise VariablePathNotDefined("The path must be a string with len > 0")
        
    def attribute_new_playbooks(self, all_recommendation_paths : list[str]):
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

    def through_playbooks(self) -> list[str]:
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

                            if rfrom.upper() == "ANSSI":
                                level_path = join(rfrom_path,rfrom)
                                for level in list_dir_in_dir(level_path):

                                    recommendation_path = join(level_path,level)
                                    for recommendation in list_dir_in_dir(recommendation_path):
                                        rpath = join(os,os_type,os_version,category,rfrom,level,recommendation)
                                        all_recommendation_paths.append(rpath)
                            elif rfrom.upper() == "CIS":
                                pass

        return all_recommendation_paths

    def get_id_from_path(self, path : str):
        if len(path) > 0:
            if exists(path):
                path = join(path.replace(self._playbooks_location,""))
                for pair in self._recommendation_ids:
                    if pair.get("path").strip("/") == path.strip("/"):
                        return pair.get("id")
                raise IDDoesNotExist(f"The following path does not have id: {path}")
            else:
                raise PathDoesNotExist(f"The following path does not exist : {path}")
        else:
            raise VariablePathNotDefined("The path must be a string with len > 0")
        
    def get_path_from_id(self,id: str):
        if len(id) == 36:
                for pair in self._recommendation_ids:
                    if pair.get("id") == id:
                        return pair.get("path")
                raise IDDoesNotExist(f"The following id does not exist: {id}")
        else:
            raise VariableIDNotDefined("The id must be a string with len of 36")
        

