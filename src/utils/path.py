#!/bin/env python3
from os import listdir
from os.path import isdir, join

def list_dir_in_dir(path : str) -> list[str]:
    """This method is a os.listdir wrapper to return only directories without the .git dir

    Args:
        path (str): Dir to list

    Returns:
        list[str]: List of the directories contained in path
    """
    artefacts = listdir(path)

    directories = []
    for artefact in artefacts:
        if isdir(join(path,artefact)) and ".git" not in artefact: directories.append(artefact)
        
    return directories