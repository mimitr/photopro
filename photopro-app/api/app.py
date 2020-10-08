#!/usr/bin/env python
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import base64

for i in sys.path:
    print(i)

from utils.database.connect import conn, cur
from utils.database.general_user import create_user, login_user, \
    change_password, forgot_password_get_change_password_link, \
    post_image, discovery

print(conn, cur)

app = Flask(__name__)
app.user_id = None
CORS(app)


@app.route('/login', methods=['GET','POST'])
def api_login():
    email = request.args.get('email')
    password = request.args.get('password')
    print(email, password)

    (result, user_id) = login_user(email, password, conn, cur)
    print(result, user_id)

    app.user_id = user_id

    return jsonify({
        'result': result
    })


@app.route('/create_user')
def api_create_user():
    first = request.args.get('first')
    last = request.args.get('last')
    email = request.args.get('email')
    password = request.args.get('password')

    result = create_user(first, last, email, password, conn, cur)
    if result:
        (result, user_id) = login_user(email, password, conn, cur)
        print(result, user_id)
        return jsonify({
            'result': result
        })

    return jsonify({
        'result': result
    })


@app.route('/change_password')
def api_change_password():
    email = request.args.get('email')
    password = request.args.get('password')
    new_password = request.args.get('new_password')
    result = change_password(email, password, new_password, conn, cur)

    return {
        'result': result
    }


@app.route('/forgot_password_get_change_password_link')
def api_forgot_password():
    email = request.args.get('email')
    result = forgot_password_get_change_password_link(email, conn, cur)

    return jsonify({
        'result': result
    })


@app.route('/post')
def api_post_image():
    if request.method == "POST":

        user_id = request.args.get('user_id')
        caption = request.args.get('caption')
        image = request.files['image']
        result = post_image(user_id, caption, image, conn, cur)

        return jsonify({
            'result': result
        })


@app.route('/discovery')
def api_discovery():
    user_id = request.args.get('user_id')
    batch_size = request.args.get('batch_size')
    result = discovery(user_id, batch_size, conn, cur)

    processed_result = []

    for tup in result:
        id, caption, uploader, img = tup
        img = base64.encodebytes(img).decode("utf-8")
        # print(img)
        processed_result.append(
            {
                'id': id,
                'caption': caption,
                'uploader': uploader,
                'img': img
            }
        )

    # print(imgarr[0])

    retval = jsonify({
        'result': processed_result
    })
    return retval
