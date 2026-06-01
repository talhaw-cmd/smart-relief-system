from flask import request, jsonify, render_template, session
from bson import ObjectId
from config import db
from routes.auth import login_required
from datetime import date


def resource_routes(app):

    @app.route("/resources")
    @login_required
    def resources():
        total = db.resources.count_documents({})
        instock = db.resources.count_documents({"status": "In Stock"})
        lowstock = db.resources.count_documents({"status": "Low Stock"})
        depleted = db.resources.count_documents({"status": "Depleted"})
        return render_template("resources/index.html",
            total=total,
            instock=instock,
            lowstock=lowstock,
            depleted=depleted,
            name=session.get("name"),
            role=session.get("role")
        )

    @app.route("/resourcesdata")
    @login_required
    def resourcesdata():
        data = db.resources.find()
        datalist = []
        for i in data:
            datalist.append({
                "id": str(i["_id"]),
                "name": i["name"],
                "category": i["category"],
                "unit": i["unit"],
                "stock": i["stock"],
                "allocated": i.get("allocated", 0),
                "facility": i["facility"],
                "status": i["status"],
            })
        return jsonify(datalist)

    @app.route("/addresource")
    @login_required
    def addresource():
        return render_template("resources/add.html",
            name=session.get("name"),
            role=session.get("role")
        )

    @app.route("/submitresource", methods=["POST"])
    @login_required
    def submitresource():
        data = request.json
        db.resources.insert_one({
            "name": data["name"],
            "category": data["category"],
            "unit": data["unit"],
            "stock": int(data["stock"]),
            "allocated": int(data.get("allocated", 0)),
            "facility": data["facility"],
            "status": data["status"],
            "created_at": str(date.today())
        })
        return jsonify({"message": "Resource Added!"})

    @app.route("/editresource/<id>")
    @login_required
    def editresource(id):
        resource = db.resources.find_one({"_id": ObjectId(id)})
        resource["_id"] = str(resource["_id"])
        return render_template("resources/edit.html",
            resource=resource,
            name=session.get("name"),
            role=session.get("role")
        )

    @app.route("/updateresource/<id>", methods=["POST"])
    @login_required
    def updateresource(id):
        data = request.json
        db.resources.update_one(
            {"_id": ObjectId(id)},
            {"$set": {
                "name": data["name"],
                "category": data["category"],
                "unit": data["unit"],
                "stock": int(data["stock"]),
                "allocated": int(data.get("allocated", 0)),
                "facility": data["facility"],
                "status": data["status"],
            }}
        )
        return jsonify({"message": "Resource Updated!"})

    @app.route("/deleteresource/<id>")
    @login_required
    def deleteresource(id):
        db.resources.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Deleted!"})