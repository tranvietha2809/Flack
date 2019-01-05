import os
import requests

from flask import Flask, render_template, request, url_for, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from channel_messages import *


user = []
channels = ["Global"]
message = {
    "Global": channel_messages()
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
    message[data['channel_name']] = channel_messages()
    print(channels)
    socketio.emit("created channel", data, callback = print("Created channel {}".format(data['channel_name'])))

@socketio.on("join")
def on_join(data):
    join_room(data['channel'])
    channel_messages = message[data['channel']].get_channel_history()
    socketio.emit("receive channel message", channel_messages,
        callback = print("User: {} has joined channel {}".format(data['username'], data['channel'])),
        room = request.sid)

@socketio.on("leave")
def on_leave(data):
    leave_room(data['channel'])

@socketio.on("send message")
def send_message(data):
    channel = data.pop('channel')
    message[channel].insert_message(message_info = data)
    print(message[channel].get_channel_history())
    socketio.emit("receive message", data,
        callback = print("Received message from {}, channel {}".format(data["username"], channel)), room = channel)

if __name__ == '__main__':
    socketio.run(app, debug= True)
