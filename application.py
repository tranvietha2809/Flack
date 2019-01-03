import os
import requests

from flask import Flask, render_template, request, url_for, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room

user = []
channels = ["Global"]
message = {
    "Global": []
}
app = Flask(__name__)
socketio = SocketIO(app)

#config app session
app.config["SESSION_PERMANENT"] = False

@app.route("/", methods = ["GET", "POST"])
def index():
    return render_template('dashboard.html', channels = channels)

@socketio.on("username input")
def username_validate(data, methods = ["GET", "POST"]):
    if data['username'] in user:
        data['response'] = "422"
        socketio.emit("user validate",data, callback = print("Username taken"), room = request.sid)
    else:
        user.append(data['username']);
        print(user)
        data['response'] = "200"

        #request.sid to emit response only to that client, not the whole server
        socketio.emit("user validate", data, callback = print("Username registered"), room= request.sid)

@socketio.on("create channel")
def create_channel(data):
    channels.append(data['channel_name'])
    socketio.emit("created channel", data, callback = print("Created channel {}".format(data['channel_name'])))


@socketio.on("join")
def join_channel(data):
    join_room(data['channel'])


if __name__ == '__main__':
    socketio.run(app, debug= True)
