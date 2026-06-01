from pymongo import MongoClient
from flask import Flask, jsonify, render_template, request
from config import db
from bson import ObjectId
from routes.auth import login_required


def shelter_routes(app):
    @app.route("/shelters")
    @login_required
    def shelters():
        total_shelters = db.shelters.count_documents({})
        active_shelters = db.shelters.count_documents({"status": "Open"})

        result = list(db.shelters.aggregate([
        {"$group": {"_id": None, "total_occupants": {"$sum": "$occupants"}}}
    ]))
    
        total_occupants = result[0]["total_occupants"] if result else 0

        capacity = list(db.shelters.aggregate([
        {"$group": {"_id": None, "total_capacity": {"$sum": "$capacity"}}}
    ]))
    
        total_capacity = capacity[0]["total_capacity"] if capacity else 0
        return render_template("/shelters/index.html",total_capacity=total_capacity, total_occupants=total_occupants, total_shelters=total_shelters, active_shelters=active_shelters)

    @app.route("/shelterdata")
    @login_required
    def shelterdata():
        data = db.shelters.find()
        shelter_list=[]
        for i in data:
            shelter={
                "id": str(i["_id"]),
                "shelter_name": i["shelter_name"],
                "location": i["location"],
                "type": i["type"],
                "capacity": i["capacity"],
                "occupants": i["occupants"],
                "manager": i["manager"],
                "status": i["status"],
            }
            shelter_list.append(shelter)

        return jsonify(shelter_list)
    
    @app.route("/editshelter/<id>")
    @login_required
    def editshelter(id):
        shelterdata = db.shelters.find_one({"_id": ObjectId(id)})
        shelterid = str(shelterdata["_id"])


        return render_template("/shelters/edit.html",shelterdata=shelterdata, shelterid=shelterid)
    
    @app.route("/updateshelter/<id>", methods=["POST"])
    @login_required
    def updateshelter(id):
        data = request.json
        result = db.shelters.update_one(
            {"_id": ObjectId(id)},
            {"$set":{
            "shelter_name": data["shelter_name"],
            "location": data["location"],
            "type": data["type"],
            "capacity": data["capacity"],
            "occupants": data["occupants"],
            "manager": data["manager"],
            "status": data["status"],
            }})

        return jsonify({
            "message": "shelterdata_updated"
        })
    
    @app.route("/shelterform")
    @login_required
    def shelterform():
        return render_template("/shelters/add.html")

    @app.route("/addshelter", methods=["POST"])
    @login_required
    def addshelter():
        data = request.json
        shelterdata = db.shelters.insert_one({
            "shelter_name": data["shelter_name"],
            "location": data["location"],
            "type": data["type"],
            "capacity": data["capacity"],
            "occupants": data["occupants"],
            "manager": data["manager"],
            "status": data["status"],
        })

        return jsonify({
            "message": "shelter added"
        })