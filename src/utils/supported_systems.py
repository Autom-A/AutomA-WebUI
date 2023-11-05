#!/bin/env python3

from os import listdir
from os.path import join, abspath, exists, isdir
from yaml import safe_load

class SingletonSupportedSystems():
    _instances = {}

    def __new__(class_, *args, **kwargs):
        if class_ not in class_._instances:
            class_._instances[class_] = super(SingletonSupportedSystems, class_).__new__(class_, *args, **kwargs)
        return class_._instances[class_]


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
                print("Raise an exception M")
        else:
            print("Raise an exception N")

    def set_playbooks_location(self, path : str) -> list[str]:
        if len(path) > 0:
            if exists(path):
                self._playbooks_location = path
            else:
                print("TODO : raise an exception A")
        else:
            print("TODO : raise an exception B")

    def list_os(self) -> list[str]:
        if len(self._playbooks_location) <= 0:
            print("TODO : raise an exception C")
        else:
            return listdir(self._playbooks_location)

    def list_os_type(self) -> list[str]:
        if len(self._playbooks_location) <= 0 or len(self._os_selected) <= 0:
            print("TODO : raise an exception D")
        else:
            if not exists(join(self._playbooks_location,self._os_selected)):
                self.reset_params()
                print("TODO : raise an exception E")
            else:
                return listdir(join(self._playbooks_location,self._os_selected))

    def list_os_version(self) -> list[str]:
        if len(self._playbooks_location) <= 0 or len(self._os_selected) <= 0 or len(self._os_type_selected) <= 0 :
            print("TODO : raise an exception F")
        else:
            if not exists(join(self._playbooks_location,self._os_selected,self._os_type_selected)):
                self.reset_params()
                print("TODO : raise an exception G")
            else:
                return listdir(join(self._playbooks_location,self._os_selected, self._os_type_selected))

    def select_os(self, os : str) -> None:
        if len(os) >= 1:
            self._os_selected = os.upper()
        else:
            print("TODO : raise an exception H")

    def select_os_type(self, os_type : str) -> None:
        if len(self._os_selected) >= 1: 
            if len(os_type) >= 1:
                self._os_type_selected = os_type.upper()
            else:
                print("TODO : raise an exception I")
        else:
            print("TODO : raise an exception J")

    def select_os_version(self, os_version : str) -> None:
        if len(self._os_selected) >=1 and len(self._os_type_selected) >= 1: 
            if len(os_version) >= 1:
                self._os_version_selected = os_version.upper()
            else:
                print("TODO : raise an exception K")
        else:
            print("TODO : raise an exception L")
