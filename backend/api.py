from flask import Flask
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mcms.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(10), nullable=False)
    name = db.Column(db.String(80), unique=True, nullable=False)
    position = db.Column(db.String(80), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    date_of_employment = db.Column(db.Date, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

@app.route('/', methods=['GET'])
def home():
    return {'message': 'Hello, World!'}, 200

if __name__ == '__main__':
    app.run(debug=True)