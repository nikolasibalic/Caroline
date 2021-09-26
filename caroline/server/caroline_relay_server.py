from flask import Flask, send_file, request
from flask_cors import CORS
from flask_socketio import (
    disconnect,
    SocketIO,
    emit,
    join_room,
    leave_room,
    ConnectionRefusedError,
)
import requests
import jwt
import json
import qrcode
import io
from PIL import Image
import datetime
import time

app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = "ADD_YOUR_OWN_SECRET_KEY"
socketio = SocketIO(app, cors_allowed_origins="*")
apiPrefix = "/api"
subscriberKey = "ADD_YOUR_OWN_SUBSCRIBER_KEY_FOR_AUTHENTICATION"


@app.route(apiPrefix + "/")
def hello():
    return "Hello World!"


@app.route(apiPrefix + "/qrcode/<path>", methods=["GET"])
def returnQRcode(path):
    qr = qrcode.QRCode()
    qr.add_data("https://roundtable.researchx3d.com/#" + path)

    qr.make(fit=True)
    img = qr.make_image()
    img_buf = io.BytesIO()
    img.save(img_buf)
    img_buf.seek(0)

    return send_file(img_buf, mimetype="image/png")


@app.route(apiPrefix + "/qrpres/", methods=["GET"])
def presentationQRcode():
    # To-do: check authentification of the presenter
    qr = qrcode.QRCode()
    qr.add_data(
        request.args.get("q")
        + "?a="
        + request.args.get("a")
        + "&r="
        + request.args.get("r")
        + "&l="
        + request.args.get("l")
    )

    qr.make(fit=True)
    img = qr.make_image()
    img_buf = io.BytesIO()
    img.save(img_buf)
    img_buf.seek(0)

    return send_file(img_buf, mimetype="image/png")


@socketio.on("connect")
def test_connection():
    # Uncomment next two lines to allow everyone to connect
    # That is useful for local development purposes
    # print("ok")
    # return

    # WAY FOR PRESENTER TO GENERATE TEMPORARY KEY
    if "pkey" in request.args and "site" in request.args:
        if request.args.get("pkey") == subscriberKey:
            payload = {
                "exp": datetime.datetime.utcnow()
                + datetime.timedelta(days=0, seconds=2 * 60 * 60),
                "site": request.args.get("site"),
            }
            emit(
                "initial_response",
                {
                    "data": "Connection established",
                    "token": jwt.encode(
                        payload, app.config.get("SECRET_KEY"), algorithm="HS256"
                    ),
                },
            )
            return
        else:
            disconnect()
            raise ConnectionRefusedError("Invalid token")

    if "auth" in request.args:
        r = requests.post(
            "https://www.google.com/recaptcha/api/siteverify",
            data={
                "secret": "ADD_YOUR_OWN_GOOGLE_RECAPTCHA_SECRET",
                "response": request.args.get("auth"),
            },
        )

        if not r.json()["success"]:
            disconnect()
            raise ConnectionRefusedError("Recaptcha expired")

    elif "auth2" in request.args:
        try:
            payload = jwt.decode(
                request.args.get("auth2"),
                app.config.get("SECRET_KEY"),
                algorithms=["HS256"],
            )
            if (
                datetime.datetime.utcfromtimestamp(payload["exp"])
                < datetime.datetime.utcnow()
            ):
                disconnect()
                raise ConnectionRefusedError("Token expired")
        except jwt.ExpiredSignatureError:
            disconnect()
            raise ConnectionRefusedError("Signature expired")
        except jwt.InvalidTokenError:
            disconnect()
            raise ConnectionRefusedError("Invalid token")

    payload = {
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=5, seconds=0)
    }
    emit(
        "initial_response",
        {
            "data": "Connection established",
            "token": jwt.encode(
                payload, app.config.get("SECRET_KEY"), algorithm="HS256"
            ),
        },
    )


@socketio.on("disconnect")
def test_connection():
    emit("user_disconnected", {"userid": request.sid}, broadcast=True, to=request.sid)


# @socketio.on('send')
# def bounceBack(message):
#    emit('my_response2', {'data': message["data"]})

# @socketio.on('send_all')
# def my_broadcast_event(message):
#    emit('my_response2',
#         {'data': message['data']},
#         broadcast=True)


@socketio.on("join_room")
def on_join(data):
    username = data["username"]
    room = data["room"]
    join_room(room)
    emit(
        "new_user",
        {"username": username, "sid": request.sid},
        to=room,
        include_self=False,
    )


@socketio.on("send_room")
def send_to_room(message):
    timestamp = time.time()
    message["t"] = timestamp
    emit(
        "update_state", message, broadcast=True, to=message["room"], include_self=False
    )
    return timestamp


@socketio.on("m")
def mouse_move(message):
    emit("m", message, broadcast=True, to=message["r"], include_self=False)


@socketio.on("room_user_left")
def send_to_room(message):
    leave_room(message["userid"])
    emit("update_state", message, broadcast=True, to=message["room"])


@socketio.on("send_user")
def send_to_user(message):
    if message["action"] == "introduceNewMember":
        # moderator will keep track of this member when he disconnects
        join_room(message["sid"])
    emit("update_state", message, broadcast=True, to=message["sid"], include_self=False)


@socketio.on("quizanswers")
def maxSlideUpdate(message):
    emit("quizanswers", message, to=message["to"])


@socketio.on("presentationstate")
def presentationState(message):
    emit(
        "presentationstate",
        message,
        to=message["to"],
        include_self=False,
        broadcast=False,
    )


if __name__ == "__main__":
    socketio.run(app)
    # app.run()
