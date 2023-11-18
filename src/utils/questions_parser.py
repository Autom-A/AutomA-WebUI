#!/bin/env python3

from os import listdir
from os.path import join, exists, isfile
from utils.custom_exceptions import PathDoesNotExist
from utils.supported_systems import SupportedSystems
from yaml import safe_load

def read_questions_file(path : str) -> dict:
    path = join(path,"questions.yml")
    if exists(path) and isfile(path):
        with open(path,"r") as question_file:
            data = safe_load(question_file)
        return data
    else:
        raise PathDoesNotExist(f"The following path does not exist {path}")

def list_categories(supported_systems: SupportedSystems) -> list[str]:
    try:
        entire_path = supported_systems.get_entire_path()
        return listdir(entire_path)
    except Exception as e:
        raise e

def list_anssi_recommendations(category : str, supported_systems: SupportedSystems) -> list[str]:
    category = category.upper()
    try:
        entire_path = supported_systems.get_entire_path()
        recommendations = {}
        p = join(entire_path,category,"ANSSI")
        if exists(p):
            for anssi_level in listdir(p):
                recommendations[anssi_level] = listdir(join(p,anssi_level))
            return recommendations
        else:
            raise PathDoesNotExist(f"The following path does not exist {p}")
    except Exception as e:
        raise e

# Not implemented
def list_cis_recommendations():
    pass