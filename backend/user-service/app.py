from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DUMMY_USERS = []

@app.route('/api/users', methods=['GET'])
def get_users():
    return jsonify({"status": "success", "data": DUMMY_USERS})

@app.route('/api/users', methods=['POST'])
def add_user():
    data = request.json
    new_id = max([int(u.get('id', 0)) for u in DUMMY_USERS] + [0]) + 1
    new_user = {
        "id": new_id,
        "name": data.get('name', ''),
        "email": data.get('email', ''),
        "role": data.get('role', 'customer')
    }
    DUMMY_USERS.append(new_user)
    return jsonify({"status": "success", "data": new_user}), 201

@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = next((u for u in DUMMY_USERS if u["id"] == user_id), None)
    if user:
        return jsonify({"status": "success", "data": user})
    return jsonify({"status": "error", "message": "User not found"}), 404

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    user_idx = next((i for i, u in enumerate(DUMMY_USERS) if u["id"] == user_id), None)
    if user_idx is not None:
        DUMMY_USERS[user_idx].update({
            "name": data.get('name', DUMMY_USERS[user_idx]['name']),
            "email": data.get('email', DUMMY_USERS[user_idx]['email']),
            "role": data.get('role', DUMMY_USERS[user_idx]['role'])
        })
        return jsonify({"status": "success", "data": DUMMY_USERS[user_idx]})
    return jsonify({"status": "error", "message": "User not found"}), 404

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    global DUMMY_USERS
    DUMMY_USERS = [u for u in DUMMY_USERS if u["id"] != user_id]
    return jsonify({"status": "success", "message": "User deleted"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
