from flask import Flask, request, jsonify, render_template, json, session, redirect, url_for
from datetime import date
from config import db
import bcrypt


from functools import wraps
from flask import session, redirect, url_for

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated_function


def register_auth_routes(app):
    @app.route("/signup")
    def signup():
        return render_template("auth/signup.html")

    @app.route("/useradded", methods=["POST"])
    def useradded():
        data = request.json

        existing_user = db.users.find_one({"email": data["email"]})
        if existing_user:
            return jsonify({"message": "Email already registered!"}), 409

        hashed = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())

        db.users.insert_one({
            "name": data["name"],
            "email": data["email"],
            "password": hashed,
            "role": data["role"],
            "createdAt": str(date.today())

        })
        return jsonify({
            "message": "User added"
        })

    @app.route("/login")
    def login():
        return render_template("auth/login.html")

    @app.route("/userverify", methods=["POST"])
    def userverify():
        data = request.json
        user = db.users.find_one({"email": data["email"]})

        if not user:
            return jsonify({"message": "Email not registered."}), 401

        password_correct = bcrypt.checkpw(
            data["password"].encode(),
            user["password"]
        )

        if not password_correct:
            return jsonify({"message": "Incorrect Details"}), 401

        session["user"] = user["email"]
        session["role"] = user["role"]
        session["name"] = user["name"]

        return jsonify({"message": "Logged in!"}), 200
    
    @app.route("/logout")
    def logout():
        session.clear()
        return redirect(url_for("login"))
    