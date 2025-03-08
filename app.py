from flask import Flask, request, jsonify, session, render_template, redirect, url_for
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = "supersecretkey"  # Cần để sử dụng session
CORS(app)


users = {
    "pvnhuong2405@gmail.com": {"password": "1234", "role": "user", "is_blocked": False},
    "bongthui812@gmail.com": {"password": "1234", "role": "admin", "is_blocked": False}
}

# -------------------- ROUTE HIỂN THỊ TRANG HTML --------------------

@app.route("/")
def home_dangnhap():
    return render_template("home_dangnhap.html")

@app.route("/login")
def login_page():
    return render_template("login.html")

@app.route("/register")
def register():
    return render_template("register.html")

@app.route("/post")
def post():
    return render_template("post.html")

@app.route("/post_next")
def post_next():
    return render_template("post_next.html")

@app.route("/manager_post")
def manager_post():
    return render_template("manager_post.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")

@app.route("/admin")
def admin():
    if "user" not in session or session.get("role") != "admin":
        return redirect(url_for("login_page"))  # Chuyển hướng nếu không phải admin
    return render_template("admin.html")

# -------------------- API XÁC THỰC --------------------

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if email in users:
        if users[email]["is_blocked"]:
            return jsonify({"success": False, "message": "Tài khoản của bạn đã bị khóa!"}), 403
        if users[email]["password"] == password:
            session["user"] = email
            session["role"] = users[email]["role"]
            redirect_url = "/admin" if users[email]["role"] == "admin" else "/"
            return jsonify({"success": True, "role": users[email]["role"], "redirect": redirect_url})

    return jsonify({"success": False, "message": "Sai email hoặc mật khẩu!"}), 401


@app.route("/api/auth/status", methods=["GET"])
def auth_status():
    if "user" in session:
        return jsonify({
            "logged_in": True,
            "username": session["user"],
            "role": session["role"]
        })
    return jsonify({"logged_in": False})

@app.route("/api/auth/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"success": True})
    #return redirect(url_for("home_dangnhap")) 

# -------------------- API QUẢN LÝ ADMIN --------------------

@app.route("/api/admin/users", methods=["GET"])
def get_users():
    if "user" not in session or session.get("role") != "admin":
        return jsonify({"success": False, "message": "Unauthorized"}), 403
    
    user_list = [{"email": email, "role": info["role"], "is_blocked": info["is_blocked"]} for email, info in users.items()]
    return jsonify({"success": True, "users": user_list})

@app.route("/api/admin/block_user/<email>", methods=["POST"])
def block_user(email):
    if "user" not in session or session.get("role") != "admin":
        return jsonify({"success": False, "message": "Unauthorized"}), 403
    
    if email in users:
        users[email]["is_blocked"] = not users[email]["is_blocked"]
        status = "blocked" if users[email]["is_blocked"] else "unblocked"
        return jsonify({"success": True, "message": f"Tài khoản {email} đã được {status}."})
    return jsonify({"success": False, "message": "Không tìm thấy người dùng."}), 404

@app.route("/api/admin/reset_password/<email>", methods=["POST"])
def reset_password(email):
    if "user" not in session or session.get("role") != "admin":
        return jsonify({"success": False, "message": "Unauthorized"}), 403
    
    if email in users:
        users[email]["password"] = "1234"
        return jsonify({"success": True, "message": f"Mật khẩu của {email} đã được đặt lại thành '1234'."})
    return jsonify({"success": False, "message": "Không tìm thấy người dùng."}), 404

@app.route("/api/admin/set_role/<email>", methods=["POST"])
def set_role(email):
    if "user" not in session or session.get("role") != "admin":
        return jsonify({"success": False, "message": "Unauthorized"}), 403
    
    data = request.json
    new_role = data.get("role")
    
    if email in users:
        users[email]["role"] = new_role
        return jsonify({"success": True, "message": f"Người dùng {email} đã được cập nhật role thành {new_role}."})
    
    return jsonify({"success": False, "message": "Không tìm thấy người dùng."}), 404







if __name__ == "__main__":
    app.run(debug=True)
