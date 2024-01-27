#!/bin/env python3

from genericpath import isdir
from os import listdir
from os.path import join, exists, isfile
from src.utils.custom_exceptions import AnswerIsRequired, PathDoesNotExist, WrongAnswerType
from src.utils.supported_systems import SupportedSystems
from yaml import safe_load

def read_questions_file(path : str) -> dict:
    """Take a recommendation path and read the questions.yml file linked to

    Args:
        path (str): Path of the recommendation

    Raises:
        PathDoesNotExist: If the path {path}/questions.yml does not exist

    Returns:
        dict: A dict that represents the questions.yml file
    """
    path = join(path,"questions.yml")
    if exists(path) and isfile(path):
        with open(path,"r") as question_file:
            data = safe_load(question_file)
        return data
    else:
        raise PathDoesNotExist(f"The following path does not exist {path}")

def list_categories(supported_systems: SupportedSystems) -> list[str]:
    """List categories contained in the environment selected by the user

    Args:
        supported_systems (SupportedSystems): singleton that contains the user env selection

    Raises:
        PathDoesNotExist: If the specified path does not exist
        VariablePathNotDefined: If variables are not filled

    Returns:
        list[str]: The list of categories in the path
    """
    try:
        entire_path = supported_systems.get_entire_path()
        return listdir(entire_path)
    except Exception as e:
        raise e


def list_reference(category : str, supported_systems: SupportedSystems) -> list[str]:
    """List all reference base (ANSSI, CIS, etc) from a category

    Args:
        category (str): The category to list
        supported_systems (SupportedSystems): singleton that contains the user env selection 

    Returns:
        list[str]: the list of references contained in the category
    """
    category = category.upper()

    try:
        entire_path = supported_systems.get_entire_path()
        return listdir(join(entire_path,category))
    except Exception as e:
        raise e

def list_recommendations(category : str, reference : str, supported_systems: SupportedSystems) -> list[str]:
    """List recommendation available in the reference directory in a category

    Args:
        category (str): One of the category available in env selected
        reference (str): The reference to list
        supported_systems (SupportedSystems): singleton that contains the user env selection

    Raises:
        PathDoesNotExist: If the specified path does not exist
        VariablePathNotDefined: If variables are not filled

    Returns:
        list[str]: The list of recommendations in the reference dir from the category
    """
    category = category.upper()
    reference = reference.upper()

    try:
        entire_path = supported_systems.get_entire_path()
        recommendations = {}
        p = join(entire_path,category,reference)
        if exists(p):
            for reference_level in listdir(p):
                recommendations[reference_level] = listdir(join(p,reference_level))
            return recommendations
        else:
            raise PathDoesNotExist(f"The following path does not exist {p}")
    except Exception as e:
        raise e

# Not implemented
def list_cis_recommendations():
    pass

def is_type_ok(type_asked : str, answer) -> bool:
    """This method check is the type provided by the user is correct

    Args:
        type_asked (str): type asked in the questions.yml file
        answer (_type_): answer provided by the user

    Returns:
        bool: True if the type corresponds, else False
    """
    if type_asked == "list<str>":
        if isinstance(answer, list):
            for el in answer:
                if not isinstance(el, str):
                    return False
        else:
            return False
    elif type_asked == "str":
        if not isinstance(answer,str):
            return False
    elif type_asked.find("choice<str>"):
        choices_allowed = type_asked[11:].replace("[","").replace("]","").split(",")
        if not isinstance(answer,str) or answer not in choices_allowed:
            return False
    return True

def check_answers(r_path : str, answer_list : list[dict]) -> dict[str]:
    """Take the answer provided by the user and check if it is conform in comparaison
    of the questions.yml. It check, the type, the real format, if value exists in case of
    required "true". If everything is correct, return the dict object to inject in the
    playbook template (playbook.yml.j2).

    Args:
        r_path (str): path of the recommendation
        answer_list (list[dict]): list of the answers provided by the user

    Raises:
        AnswerIsRequired: If the answers is present but no value
        WrongAnswerType: If the type provived textually of in object instance is wrong
        PathDoesNotExist: If the specified path does not exist
        IndexError: If there are missing answers

    Returns:
        dict[str]: The answers the inject in playbook template
    """
    supported_systems = SupportedSystems()
    r_path = join(supported_systems._playbooks_location,r_path)
    answers_to_inject = {}
    try:
        if exists(r_path) and isdir(r_path):
            question_data : dict = read_questions_file(r_path)
            question_list : list = question_data.get("questions")
            for answer in answer_list:
                index = answer.get("index")
                question = question_list[index]

                if question.get("type") == answer.get("formatType"):
                    if question.get("required") and not answer.get("value"):
                        raise AnswerIsRequired(f"The question '{question.get('title')}' is required (must be filled)")
                    if is_type_ok(question.get("type"), answer.get("value")):
                        answers_to_inject[question.get("name")] = answer.get("value")
                    else:
                        raise WrongAnswerType(f"Answer value doesn't correspond to the {question.get('type')} type")
                else:
                    raise WrongAnswerType(f"Type expected : {question.get('type')} but got {answer.get('type')}")
            return answers_to_inject
        else:
            raise PathDoesNotExist(f"The following path does not exist {r_path}")
    except PathDoesNotExist as path_does_not_exist:
        raise path_does_not_exist
    except IndexError:
        raise IndexError(f"There are missing answers (even if it is not required must be appear in the list)")
    except Exception as e:
        raise e
