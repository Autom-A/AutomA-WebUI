#!/bin/env python3

from os import listdir
from os.path import abspath, join, exists, isfile
from utils.supported_systems import SupportedSystems
from yaml import safe_load

def read_questions_file(path : str) -> dict:
    if exists(path) and isfile(path):
        with open(path,"r") as question_file:
            data = safe_load(question_file)
        return data
    else:
        print("Raise an exception AA")

def list_categories() -> list[str]:
    supported_systems = SupportedSystems()
    entire_path = supported_systems.get_entire_path()
    if entire_path:
        return listdir(entire_path)
    else:
        print("Raise an exception AB")

def list_anssi_recommandations(category : str) -> list[str]:
    category = category.upper()
    
    supported_systems = SupportedSystems()
    entire_path = supported_systems.get_entire_path()
    recommandations = {}
    if entire_path and exists(join(entire_path,category,"ANSSI")):
        for dir in listdir(join(entire_path,category,"ANSSI")):
            recommandations[dir] = listdir(join(entire_path,category,"ANSSI",dir))
        return recommandations
    else:
        print("Raise an exception AC")