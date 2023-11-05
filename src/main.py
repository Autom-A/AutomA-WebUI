# from flask import Flask

# app = Flask(__name__)

# @app.route("/")
# def status():
#     return "<h1>Server is Running</h1>"


# app.run(host="127.0.01", port="9123", debug=True)

from utils.supported_systems import SupportedSystems
from utils.questions_parser import read_questions_file, list_categories, list_anssi_recommandations
from os.path import abspath, join

ss = SupportedSystems()
ss.set_playbooks_location(join(abspath("."),"playbooks"))

ossup = ss.list_os()
print(f"OS supported : {ossup}")
ss.select_os(input("Select OS > "))

ostypesup = ss.list_os_type()
print(f"OS type supported : {ostypesup}")
ss.select_os_type(input("Select OS type > "))

versionsup = ss.list_os_version()
print(f"OS version supported : {versionsup}")
ss.select_os_version(input("Select OS version > "))

print(list_categories())

cat = input("Choose Category > ")
print(list_anssi_recommandations(cat))


p = join(ss.get_entire_path(),cat.upper(),"ANSSI","1_intermediate","Rxx_Audit_Admin_Actions","questions.yml")
print(read_questions_file(p))