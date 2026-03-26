from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DUMMY_EVENTS = []

@app.route('/api/events', methods=['GET'])
def get_events():
    return jsonify({"status": "success", "data": DUMMY_EVENTS})

@app.route('/api/events', methods=['POST'])
def add_event():
    data = request.json
    new_id = max([int(p.get('id', 200)) for p in DUMMY_EVENTS] + [200]) + 1
    new_event = {
        "id": new_id,
        "name": data.get('name', ''),
        "price": float(data.get('price', 0.0)),
        "category": data.get('category', 'General'),
        "stock": int(data.get('stock', 0))
    }
    DUMMY_EVENTS.append(new_event)
    return jsonify({"status": "success", "data": new_event}), 201

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = next((p for p in DUMMY_EVENTS if p["id"] == event_id), None)
    if event:
        return jsonify({"status": "success", "data": event})
    return jsonify({"status": "error", "message": "Event not found"}), 404

@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.json
    event_idx = next((i for i, e in enumerate(DUMMY_EVENTS) if e["id"] == event_id), None)
    if event_idx is not None:
        DUMMY_EVENTS[event_idx].update({
            "name": data.get('name', DUMMY_EVENTS[event_idx]['name']),
            "price": float(data.get('price', DUMMY_EVENTS[event_idx]['price'])),
            "category": data.get('category', DUMMY_EVENTS[event_idx]['category']),
            "stock": int(data.get('stock', DUMMY_EVENTS[event_idx]['stock']))
        })
        return jsonify({"status": "success", "data": DUMMY_EVENTS[event_idx]})
    return jsonify({"status": "error", "message": "Event not found"}), 404

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    global DUMMY_EVENTS
    DUMMY_EVENTS = [e for e in DUMMY_EVENTS if e["id"] != event_id]
    return jsonify({"status": "success", "message": "Event deleted"})

if __name__ == '__main__':
    app.run(debug=True, port=5002)
