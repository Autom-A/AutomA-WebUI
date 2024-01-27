#!/bin/env python3

from os.path import join, exists, isdir
from src.utils.custom_exceptions import PathDoesNotExist, VariablePathNotDefined
from src.utils.path import list_dir_in_dir


class SingletonSupportedSystems():
    """
    This class is a sigleton object for SupportedSystems class
    """

    _instance = {}

    def __new__(class_, *args, **kwargs):
        if class_ not in class_._instance:
            class_._instance[class_] = super(SingletonSupportedSystems, class_).__new__(class_, *args, **kwargs)
        return class_._instance[class_]
    
class SupportedSystems(SingletonSupportedSystems):
    """
    This class saves and checks path of the env selected by user.
    """
    _playbooks_location = ""
    _os_selected = ""
    _os_type_selected = ""
    _os_version_selected = ""

    def reset_params(self):
        """Reset varibles of path, used when they are errors
        """
        self._os_selected = ""
        self._os_type_selected = ""
        self._os_version_selected = ""

    def get_entire_path(self):
        """The method checks and return the complete environment path else raise Exception

        Raises:
            PathDoesNotExist: If the specified path does not exist
            VariablePathNotDefined: If variables are not filled

        Returns:
            str: The complete environment path selected by the user
        """
        if (len(self._playbooks_location) >= 1 and len(self._os_selected) >= 1 and
            len(self._os_type_selected) >= 1 and len(self._os_version_selected) >= 1):
        
            p = join(self._playbooks_location,self._os_selected,self._os_type_selected, self._os_version_selected)
            if exists(p) and isdir(p):
                return p
            else:
                raise PathDoesNotExist(f"The following path does not exist : {p}")
        else:
            raise VariablePathNotDefined(f"Variables _playbooks_location, _os_selected, _os_type_selected and _os_version_selected must be filled")

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
                self._playbooks_location = path
            else:
                raise PathDoesNotExist(f"The following path does not exist : {path}")
        else:
            raise VariablePathNotDefined("The path must be a string with len > 0")

    def get_os(self) -> list[str]:
        """Search for OS directories contained in the playbook directory

        Raises:
            VariablePathNotDefined: If variable  are not filled

        Returns:
            list[str]: The list of OS availables in {playbook}/
        """
        if len(self._playbooks_location) <= 0:
            raise VariablePathNotDefined(f"Variables _playbooks_location musts be filled")
        else:
            return list_dir_in_dir(self._playbooks_location)

    def get_os_type(self) -> list[str]:
        """Search for OS type directories contained in the OS directory selected

        Raises:
            PathDoesNotExist: If the specified path does not exist
            VariablePathNotDefined: If variables are not filled

        Returns:
            list[str]: The list of OS type availables in {playbook}/{OS}/
        """
        if len(self._playbooks_location) <= 0 or len(self._os_selected) <= 0:
            raise VariablePathNotDefined(f"Variables _playbooks_location and _os_selected must be filled")
        else:
            p = join(self._playbooks_location,self._os_selected)
            if not exists(p):
                self.reset_params()
                raise PathDoesNotExist(f"The following path does not exist : {p}")
            else:
                return list_dir_in_dir(join(self._playbooks_location,self._os_selected))

    def get_os_version(self) -> list[str]:
        """Search for OS version directories contained in the OS type selected

        Raises:
            PathDoesNotExist: If the specified path does not exist
            VariablePathNotDefined: If variables are not filled

        Returns:
            list[str]:  The list of OS version availables in {playbook}/{OS}/{OS_TYPE}/
        """
        if len(self._playbooks_location) <= 0 or len(self._os_selected) <= 0 or len(self._os_type_selected) <= 0 :
            raise VariablePathNotDefined(f"Variables _playbooks_location and _os_selected, _os_type_selected must be filled")
        else:
            p = join(self._playbooks_location,self._os_selected,self._os_type_selected)
            if not exists(p):
                self.reset_params()
                raise PathDoesNotExist(f"The following path does not exist : {p}")
            else:
                return list_dir_in_dir(join(self._playbooks_location,self._os_selected, self._os_type_selected))

    def set_os(self, os : str) -> None:
        """Set the OS selected by the user

        Args:
            os (str): OS name selected

        Raises:
            VariablePathNotDefined: If variables are not filled
        """
        if len(os) >= 1:
            self._os_selected = os.upper()
        else:
            raise VariablePathNotDefined(f"The variable os must be a string with len > 0")

    def set_os_type(self, os_type : str):
        """Set the OS type selected by the user

        Args:
            os_type (str): OS type name selected

        Raises:
            PathDoesNotExist: If the specified path does not exist
            VariablePathNotDefined: If variables are not filled
        """
        if len(self._os_selected) >= 1: 
            if len(os_type) >= 1:
                self._os_type_selected = os_type.upper()
            else:
                raise VariablePathNotDefined(f"The variable os_type must be a string with len > 0")
        else:
            raise VariablePathNotDefined(f"The variable _os_selected cannot be a string with len == 0")

    def set_os_version(self, os_version : str):
        """Set the OS version selected by the user

        Args:
            os_version (str): OS version name selected

        Raises:
            PathDoesNotExist: If the specified path does not exist
            VariablePathNotDefined: If variables are not filled
        """
        if len(self._os_selected) >=1 and len(self._os_type_selected) >= 1: 
            if len(os_version) >= 1:
                self._os_version_selected = os_version.upper()
            else:
                raise VariablePathNotDefined(f"The variable os_version must be a string with len > 0")
        else:
            raise VariablePathNotDefined(f"The variables _os_selected and _os_type_selected cannot be string with len == 0")
