from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

DUMMY_BOOKINGS = []

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    # Return bookings reversed to simulate newest first
    return jsonify({"status": "success", "data": list(reversed(DUMMY_BOOKINGS))})

@app.route('/api/bookings', methods=['POST'])
def add_booking():
    data = request.json
    new_id = max([int(o.get('id', 100)) for o in DUMMY_BOOKINGS] + [100]) + 1
    new_booking = {
        "id": new_id,
        "user_id": data.get('user_id'),
        "event_id": data.get('event_id'),
        "status": "processing",
        "total": data.get('total', 0.0)
    }
    DUMMY_BOOKINGS.append(new_booking)
    return jsonify({"status": "success", "data": new_booking}), 201

@app.route('/api/bookings/user/<int:user_id>', methods=['GET'])
def get_user_bookings(user_id):
    bookings = [o for o in DUMMY_BOOKINGS if o["user_id"] == user_id]
    return jsonify({"status": "success", "data": bookings})

@app.route('/api/bookings/<int:booking_id>', methods=['PUT'])
def update_booking(booking_id):
    data = request.json
    order_idx = next((i for i, o in enumerate(DUMMY_BOOKINGS) if o["id"] == booking_id), None)
    if order_idx is not None:
        DUMMY_BOOKINGS[order_idx].update({
            "status": data.get('status', DUMMY_BOOKINGS[order_idx]['status'])
        })
        return jsonify({"status": "success", "data": DUMMY_BOOKINGS[order_idx]})
    return jsonify({"status": "error", "message": "Booking not found"}), 404

@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
def delete_booking(booking_id):
    global DUMMY_BOOKINGS
    DUMMY_BOOKINGS = [o for o in DUMMY_BOOKINGS if o["id"] != booking_id]
    return jsonify({"status": "success", "message": "Booking deleted"})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
