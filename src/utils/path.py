#!/bin/env python3
from os import listdir
from os.path import isdir, join

def list_dir_in_dir(path : str):
    artefacts = listdir(path)

    directories = []
    for artefact in artefacts:
        if isdir(join(path,artefact)) and ".git" not in artefact: directories.append(artefact)
        
    return directories