from flask import Flask, render_template


app = Flask(__name__, static_url_path='', static_folder='static')
app.config.from_object('config')
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))
