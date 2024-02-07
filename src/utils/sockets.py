from flask_socketio import SocketIO
from flask import request
socketio = SocketIO()

@socketio.on("connect")
def socket_connected():
    print(request.sid)
    print("client has connected")