from flask import request, jsonify, render_template
from config import db
from bson import ObjectId
from datetime import date
from routes.auth import login_required

def volunteer_routes(app):

    @app.route("/volunteers")
    @login_required
    def volunteers():
        totalvol = db.volunteers.count_documents({})
        activevol = db.volunteers.count_documents({"status": "Available"})
        offvol = db.volunteers.count_documents({"status": "Off Duty"})
        busy = db.volunteers.count_documents({"status": "Busy"})
        return render_template("volunteers/index.html",busy=busy, totalvol=totalvol, activevol=activevol, offvol=offvol)

    @app.route("/volunteerdata")
    @login_required
    def volunteerdata():
        data = db.volunteers.find()
        volunteer_list = []
        for i in data:
            volunteer_list.append({
                "id": str(i["_id"]),
                "first_name": i["first_name"],
                "last_name": i["last_name"],
                "phone": i["phone"],
                "skill": i["skill"],
                "organization": i["organization"],
                "location": i["location"],
                "start_date": i["start_date"],
                "status": i["status"],
            })
        return jsonify(volunteer_list)

    @app.route("/addvolunteer")
    @login_required
    def addvolunteer():
        return render_template("volunteers/add.html")

    @app.route("/submitvolunteer", methods=["POST"])
    @login_required
    def submitvolunteer():
        data = request.json
        db.volunteers.insert_one({
            "first_name": data["first_name"],
            "last_name": data["last_name"],
            "dob": data["dob"],
            "gender": data["gender"],
            "phone": data["phone"],
            "email": data["email"],
            "address": data["address"],
            "skill": data["skill"],
            "organization": data["organization"],
            "disaster": data["disaster"],
            "location": data["location"],
            "start_date": data["start_date"],
            "status": data["status"],
            "qualifications": data["qualifications"],
            "notes": data["notes"],
            "created_at": str(date.today())
        })
        return jsonify({"message": "Volunteer added!"})

    @app.route("/editvolunteer/<id>")
    @login_required
    def editvolunteer(id):
        volunteer = db.volunteers.find_one({"_id": ObjectId(id)})
        volunteer["_id"] = str(volunteer["_id"])
        return render_template("volunteers/edit.html", volunteer=volunteer)

    @app.route("/updatevolunteer/<id>", methods=["POST"])
    @login_required
    def updatevolunteer(id):
        data = request.json
        db.volunteers.update_one(
            {"_id": ObjectId(id)},
            {"$set": {
                "first_name": data["first_name"],
                "last_name": data["last_name"],
                "dob": data["dob"],
                "gender": data["gender"],
                "phone": data["phone"],
                "email": data["email"],
                "address": data["address"],
                "skill": data["skill"],
                "organization": data["organization"],
                "disaster": data["disaster"],
                "location": data["location"],
                "start_date": data["start_date"],
                "status": data["status"],
                "qualifications": data["qualifications"],
                "notes": data["notes"],
            }}
        )
        return jsonify({"message": "Volunteer updated!"})

    @app.route("/deletevolunteer/<id>")
    @login_required
    def deletevolunteer(id):
        db.volunteers.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Volunteer deleted!"})