from flask import Flask, request, jsonify, render_template
from datetime import date
from config import db
from bson import ObjectId
from routes.auth import login_required


def victim_routes(app):

    @app.route("/victimssubmit", methods=["POST"])
    @login_required
    def victimssubmit():
        data = request.json
        db.victims.insert_one({
            "name":         data["name"],
            "age":          data["age"],
            "gender":       data["gender"],
            "contact":      data["contact"],
            "status":       data["status"],
            "medical_info": data["medical_info"],
            "created_at":   str(date.today()),
        })
        return jsonify({"message": "Victim added"})

    @app.route("/victimform")
    @login_required
    def victimform():
        return render_template("victims/form.html")

    @app.route("/victim")
    @login_required
    def victim():
        return render_template("victims/index.html")

    @app.route("/victimdata")
    @login_required
    def victimdata():
        data = db.victims.find()
        victimlist = []
        for i in data:
            victimlist.append({
                "id":           str(i["_id"]),   # JS ko edit/delete ke liye chahiye
                "name":         i["name"],
                "age":          i["age"],
                "gender":       i["gender"],
                "contact":      i["contact"],
                "status":       i["status"],
                "medical_info": i["medical_info"],
                "created_at":   i["created_at"],
            })
        return jsonify(victimlist)

    # ✅ Edit page render — Jinja2 pre-fill
    @app.route("/editvictim/<id>")
    @login_required
    def editvictim(id):
        victim = db.victims.find_one({"_id": ObjectId(id)})
        vicid = str(victim["_id"])
        return render_template("victims/edit.html", victim=victim, vicid=vicid)

    # ✅ Update submit
    @app.route("/updatevictim/<id>", methods=["POST"])
    @login_required
    def updatevictim(id):
        data = request.json
        db.victims.update_one(
            {"_id": ObjectId(id)},
            {"$set": {
                "name":         data["name"],
                "age":          data["age"],
                "gender":       data["gender"],
                "contact":      data["contact"],
                "status":       data["status"],
                "medical_info": data["medical_info"],
            }}
        )
        return jsonify({"message": "Victim updated"})

    # ✅ Delete
    @app.route("/deletevictim/<id>", methods=["POST"])
    @login_required
    def deletevictim(id):
        db.victims.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Victim deleted"})