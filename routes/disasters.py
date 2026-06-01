from flask import Flask, request, jsonify, render_template
from datetime import date
from config import db
from bson import ObjectId
from routes.auth import login_required


def disaster_routes(app):
    @app.route("/disaster")
    @login_required
    def disaster():
        active = db.disasters.count_documents({"status": "active"})
        critical = db.disasters.count_documents({"status": "critical"})
        resolved = db.disasters.count_documents({"status": "resolved"})
        controlled = db.disasters.count_documents({"status": "controlled"})
        return render_template("disasters/index.html", active=active, critical=critical, resolved=resolved, controlled=controlled)
    
    @app.route("/disasterdata")
    @login_required
    def disasterdata():
        data = db.disasters.find()
        datalist = []
        for i in data:
            disasterdata ={
                "id": str(i["_id"]),
                "title": i["title"],
                "type": i["type"],
                "location": i["location"],
                "severity": i["severity"],
                "status": i["status"],
                "started_at": i["started_at"],
            }
            datalist.append(disasterdata)
        return jsonify(datalist)


    @app.route("/adddisaster")
    @login_required
    def adddisaster():
        return render_template("disasters/form.html")

    @app.route("/submitdisaster", methods=["POST"])
    def submitdisaster():
        data = request.json
        db.disasters.insert_one({
            "title": data["title"],
            "type": data["type"],
            "location": data["location"],
            "severity": data["severity"],
            "status": data["status"],
            "started_at": data["started_at"]
        })
        return jsonify({
            "message": "DisasterAdded"
        })
    
    @app.route("/editdisaster/<id>")
    @login_required
    def editdisaster(id):
        disaster = db.disasters.find_one({"_id": ObjectId(id)})
        disid = str(disaster["_id"])
        return render_template("disasters/update.html", disaster=disaster, disid=disid)
    
    @app.route("/updatedisaster/<id>", methods=["POST"])
    @login_required
    def updatedisaster(id):
        data = request.json
        db.disasters.update_one(
        {"_id": ObjectId(id)},
        {"$set":{
            "title": data["title"],
            "type": data["type"],
            "location": data["location"],
            "severity": data["severity"],
            "status": data["status"],
            "started_at": data["started_at"]
        }}
            )
        return jsonify({
            "message": "updated..."
        })