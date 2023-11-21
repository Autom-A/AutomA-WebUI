#!/bin/env python3

class PathDoesNotExist(Exception):
    pass
class VariablePathNotDefined(Exception):
    pass
class IDDoesNotExist(Exception):
    pass
class VariableIDNotDefined(Exception):
    pass
class WrongAnswerType(Exception):
    pass
class AnswerIsRequired(Exception):
    pass
class MissingRecommendation(Exception):
    pass
class MissingHost(Exception):
    pass
class HostAlreadyAdded(Exception):
    pass