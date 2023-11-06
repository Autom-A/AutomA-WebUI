#!/bin/env python3

from os import listdir
from os.path import join, abspath, exists, isdir
from utils.custom_exceptions import PathDoesNotExist, VariablePathNotDefined
from yaml import safe_load

class SingletonSupportedSystems():
    _instances = {}

    def __new__(class_, *args, **kwargs):
        if class_ not in class_._instances:
            class_._instances[class_] = super(SingletonSupportedSystems, class_).__new__(class_, *args, **kwargs)
        return class_._instances[class_]

class PathException(Exception):
    pass
class SupportedSystems(SingletonSupportedSystems):
    _playbooks_location = ""
    _os_selected = ""
    _os_type_selected = ""
    _os_version_selected = ""

    def reset_params(self):
        self._os_selected = ""
        self._os_type_selected = ""
        self._os_version_selected = ""

    def get_entire_path(self):
        if (len(self._playbooks_location) >= 1 and len(self._os_selected) >= 1 and
            len(self._os_type_selected) >= 1 and len(self._os_version_selected) >= 1):
        
            p = join(self._playbooks_location,self._os_selected,self._os_type_selected, self._os_version_selected)
            if exists(p) and isdir(p):
                return p
            else:
                raise PathDoesNotExist(f"The following path does not exist : {p}")
        else:
            raise VariablePathNotDefined(f"Variables _playbooks_location, _os_selected, _os_type_selected and _os_version_selected must be filled")

    def set_playbooks_location(self, path : str) -> list[str]:
        if len(path) > 0:
            if exists(path):
                self._playbooks_location = path
            else:
                raise PathDoesNotExist(f"The following path does not exist : {path}")
        else:
            raise VariablePathNotDefined("The path must be a string with len > 0")

    def list_os(self) -> list[str]:
        if len(self._playbooks_location) <= 0:
            raise VariablePathNotDefined(f"Variables _playbooks_location musts be filled")
        else:
            return listdir(self._playbooks_location)

    def list_os_type(self) -> list[str]:
        if len(self._playbooks_location) <= 0 or len(self._os_selected) <= 0:
            raise VariablePathNotDefined(f"Variables _playbooks_location and _os_selected must be filled")
        else:
            p = join(self._playbooks_location,self._os_selected)
            if not exists(p):
                self.reset_params()
                raise PathDoesNotExist(f"The following path does not exist : {p}")
            else:
                return listdir(join(self._playbooks_location,self._os_selected))

    def list_os_version(self) -> list[str]:
        if len(self._playbooks_location) <= 0 or len(self._os_selected) <= 0 or len(self._os_type_selected) <= 0 :
            raise VariablePathNotDefined(f"Variables _playbooks_location and _os_selected, _os_type_selected must be filled")
        else:
            p = join(self._playbooks_location,self._os_selected,self._os_type_selected)
            if not exists(p):
                self.reset_params()
                raise PathDoesNotExist(f"The following path does not exist : {p}")
            else:
                return listdir(join(self._playbooks_location,self._os_selected, self._os_type_selected))

    def select_os(self, os : str) -> None:
        if len(os) >= 1:
            self._os_selected = os.upper()
        else:
            raise VariablePathNotDefined(f"The variable os must be a string with len > 0")

    def select_os_type(self, os_type : str) -> None:
        if len(self._os_selected) >= 1: 
            if len(os_type) >= 1:
                self._os_type_selected = os_type.upper()
            else:
                raise VariablePathNotDefined(f"The variable os_type must be a string with len > 0")
        else:
            raise VariablePathNotDefined(f"The variable _os_selected cannot be a string with len == 0")

    def select_os_version(self, os_version : str) -> None:
        if len(self._os_selected) >=1 and len(self._os_type_selected) >= 1: 
            if len(os_version) >= 1:
                self._os_version_selected = os_version.upper()
            else:
                raise VariablePathNotDefined(f"The variable os_version must be a string with len > 0")
        else:
            raise VariablePathNotDefined(f"The variables _os_selected and _os_type_selected cannot be string with len == 0")
