import os
import requests

from flask import Flask, render_template, request, url_for, jsonify, session
from flask_socketio import SocketIO, emit, join_room, leave_room


user = []
channels = ["Global"]
message = {}
app = Flask(__name__)
socketio = SocketIO(app)

@app.route("/", methods = ["GET", "POST"])
def index():
    return render_template('dashboard.html')

@socketio.on("username input")
def username_validate(data, methods = ["GET", "POST"]):
    if data['username'] in user:
        data['response'] = "422"
        socketio.emit("user validate",data, callback = print("Username taken"))
    else:
        user.append(data['username']);
        data['response'] = "200"

        #request.sid to emit only to that client, not the whole server
        socketio.emit("user validate", data, callback = print("Username registered"), room= request.sid)

@socketio.on("send message")
def send_message(data, methods = ["POST"]):
    if data['username'] in user:
        message[data['channel']].update({data['time_stamp']:{data['username'] : data['message']}})
        socketio.emit("received message", data,
                    callback = print("Received message from {}, channel: {} content: {}".format(
                    data['username'], data['channel'], data['message'])))
    else:
        render_template('somethingiswrong.html')

@socketio.on("create channel")
def create_channel(data, methods = ["POST"]):
    if data['channel_name'] in channels:
        data['response'] = "422"
        socketio.emit("channel created", data, callback= print("Duplicate channel name"))
    else:
        channels.append(data['channel_name'])
        data['response'] = "200"
        socketio.emit("channel created", data,
                    callback= print("Created channel {}".format(
                    data['channel_name'])))


@socketio.on("get channel messages")
def get_channel_messages(data, methods = ["POST"]):
    queried_channel = data['channel']
    current_user = data['username']
    #query message from a particular channel
    channel_messages = message.get(queried_channel)
    socketio.emit("receive channel messages", channel_messages)
    #get user messages from the channel
    #usermessage = []
    #for timestamp in channel_messages:
    #    usermessage.append(channel_messages[time_stamp][current_user])

if __name__ == '__main__':
    socketio.run(app, debug= True)
