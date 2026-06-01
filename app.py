from flask import Flask, request, jsonify, render_template, json, session
from datetime import date, datetime
from config import db
from routes.auth import register_auth_routes, login_required
from routes.disasters import disaster_routes
from routes.victims import victim_routes
from routes.shelters import shelter_routes
from routes.volunteers import volunteer_routes
from routes.donations import donation_routes
from routes.resources import resource_routes

import bcrypt

app = Flask(__name__)
app.secret_key = "disaster-relief-secret-123" 

register_auth_routes(app)
disaster_routes(app)
victim_routes(app)
shelter_routes(app)
volunteer_routes(app)
donation_routes(app)
resource_routes(app)


@app.route("/")
def home():
    return render_template("welcome.html")
@app.route("/dashboard")
@login_required
def dashboard():
    now = datetime.now()
    todaydate = now.strftime("%B %d, %Y")
    todayday = now.strftime("%A")

    # Stats
    actdisasters = db.disasters.count_documents({"status": "active"})
    resdisasters = db.disasters.count_documents({"status": "resolved"})
    regvictims = db.victims.count_documents({})
    actshelters = db.shelters.count_documents({"status": "Open"})
    totalvol = db.volunteers.count_documents({})
    availvol = db.volunteers.count_documents({"status": "Available"})
    totaldontaions = db.donations.count_documents({})

    # Total donation amount
    result = list(db.donations.aggregate([
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]))
    total_amount = result[0]["total"] if result else 0

    # Recent 5 disasters
    recent_disasters = list(db.disasters.find().sort("started_at", -1).limit(5))
    for d in recent_disasters:
        d["_id"] = str(d["_id"])

    # Shelter capacity stats
    shelter_result = list(db.shelters.aggregate([
        {"$group": {
            "_id": None,
            "total_capacity": {"$sum": "$capacity"},
            "total_occupied": {"$sum": "$occupants"}
        }}
    ]))
    if shelter_result:
        total_cap = shelter_result[0]["total_capacity"]
        total_occ = shelter_result[0]["total_occupied"]
        shelter_percent = round((total_occ / total_cap) * 100) if total_cap > 0 else 0
    else:
        shelter_percent = 0

    # Volunteer deployment
    deployed_vol = db.volunteers.count_documents({"status": "Deployed"})
    vol_percent = round((deployed_vol / totalvol) * 100) if totalvol > 0 else 0

    return render_template("dashboard/index.html",
        actdisasters=actdisasters,
        resdisasters=resdisasters,
        regvictims=regvictims,
        actshelters=actshelters,
        totalvol=totalvol,
        total_amount=total_amount,
        totaldontaions=totaldontaions,
        recent_disasters=recent_disasters,
        shelter_percent=shelter_percent,
        vol_percent=vol_percent,
        name=session.get("name"),
        role=session.get("role"),
        todaydate=todaydate,
        todayday=todayday,
        availvol = availvol
    )




app.run(debug=True)