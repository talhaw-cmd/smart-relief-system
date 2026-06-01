from flask import request, jsonify, render_template
from config import db
from bson import ObjectId
from datetime import date
from routes.auth import login_required

def donation_routes(app):

    @app.route("/donations")
    @login_required
    def donations():
        total = db.donations.count_documents({})
        received = db.donations.count_documents({"status": "Received"})
        utilized = db.donations.count_documents({"status": "Utilized"})
        pending = db.donations.count_documents({"status": "In Progress"})

        # Total cash amount
        result = list(db.donations.aggregate([
            {"$group": {"_id": None, "total_amount": {"$sum": "$amount"}}}
        ]))
        total_amount = result[0]["total_amount"] if result else 0

        return render_template("donations/index.html",
            total=total,
            received=received,
            utilized=utilized,
            pending=pending,
            total_amount=total_amount
        )

    @app.route("/donationdata")
    @login_required
    def donationdata():
        data = db.donations.find()
        donation_list = []
        for i in data:
            donation_list.append({
                "id": str(i["_id"]),
                "donor_name": i["donor_name"],
                "donor_type": i["donor_type"],
                "donation_type": i["donation_type"],
                "amount": i.get("amount", 0),
                "description": i.get("description", ""),
                "designated_for": i["designated_for"],
                "received_by": i["received_by"],
                "date_received": i["date_received"],
                "status": i["status"],
            })
        return jsonify(donation_list)

    @app.route("/adddonation")
    @login_required
    def adddonation():
        return render_template("donations/add.html",
        )

    @app.route("/submitdonation", methods=["POST"])
    @login_required
    def submitdonation():
        data = request.json
        db.donations.insert_one({
            "donor_name": data["donor_name"],
            "donor_type": data["donor_type"],
            "contact_person": data.get("contact_person", ""),
            "contact_number": data.get("contact_number", ""),
            "email": data.get("email", ""),
            "donation_type": data["donation_type"],
            "amount": data.get("amount", 0),
            "description": data.get("description", ""),
            "designated_for": data["designated_for"],
            "received_by": data["received_by"],
            "date_received": data["date_received"],
            "status": data["status"],
            "notes": data.get("notes", ""),
            "created_at": str(date.today())
        })
        return jsonify({"message": "Donation recorded!"})

    @app.route("/deletedonation/<id>")
    @login_required
    def deletedonation(id):
        db.donations.delete_one({"_id": ObjectId(id)})
        return jsonify({"message": "Donation deleted!"})