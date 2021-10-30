# Imports
import os
import json
from flask import Flask, render_template, make_response, jsonify, request, redirect

# Global variables
global data
FILE_LOCATION = "./static/file"
file_path = f"{FILE_LOCATION}/data.json"

# functions
# Write to file
def write2file(data):
    with open(file_path, 'w') as file:
        file.write(json.dumps(data))

# Read from file
def readFile():
    with open(file_path, "r") as file:
        r = json.load(file)
    return r

# checking file paths
if not os.path.exists(FILE_LOCATION):
    os.mkdir(FILE_LOCATION)
if not os.path.exists(file_path):
    data = {"count": 0, "pastes": {}}
    with open(file_path, 'w') as f:
        f.write(json.dumps(data))
else:
    data = readFile()


# App
app = Flask(__name__)
app.config["SECRET_KEY"] = "ThunderisaGOD"
data = readFile()

# Page routes


# Home page / product landing page
@app.route("/")
def home_page():
    return render_template("index.html")

# ENDPOINT to get id number
@app.route("/getID")
def getID():
    data = readFile()
    data["count"] += 1
    write2file(data)
    return {"value": data["count"]}

# ENDPOINT for returning data from file
@app.route("/data", methods=["GET"])
def getData():
    return readFile()

# ENDPOINT for Adding data to file
@app.route("/add_paste", methods=["POST"])
def add_paste():
    if request.method == "POST":
        paste = request.json
        print(paste)
        data["pastes"][paste["id"]] = paste["paste"]
        write2file(data)
        msg = {'message': 'Created', 'code': 'SUCCESS'}
        return make_response(jsonify(msg), 201)
    msg = {'message': 'Got a "get" request', 'code': 'FAILED'}
    return make_response(jsonify(msg), 201)


# remove data from file
@app.route("/remove_paste", methods=["POST"])
def remove_paste():
    if request.method == "POST":
        paste = request.json
        data.pop(paste["id"])
        write2file(data)
        return redirect("/")
    msg = {'message': 'Got a "get" request', 'code': 'FAILED'}
    return make_response(jsonify(msg), 201)


# Removes all the pastes from the list
@app.route("/clean", methods=["GET"])
def clean():
    data = {"count":0,"pastes":{}}
    write2file(data)
    return redirect("/")


#
@app.route("/start_sync", methods=["GET"])
def startSYNC():
    if not os.path.exists(file_path):
        open(file_path, 'w').close()


if __name__ == "__main__":
    app.run(debug=True)