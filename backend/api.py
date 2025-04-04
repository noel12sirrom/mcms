from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource, reqparse, marshal_with, fields, abort


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mcms.db'
db = SQLAlchemy(app)
api = Api(app)

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status = db.Column(db.String(10), nullable=False)
    name = db.Column(db.String(80), unique=True, nullable=False)
    position = db.Column(db.String(80), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    date_of_employment = db.Column(db.Date, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'
    
employee_args = reqparse.RequestParser()
employee_args.add_argument('status', type=str, help='Status of the user', required=True)
employee_args.add_argument('name', type=str, help='Name of the user', required=True)
employee_args.add_argument('position', type=str, help='Position of the user', required=True)
employee_args.add_argument('phone', type=str, help='Phone number of the user', required=True)
employee_args.add_argument('date_of_employment', type=str, help='Date of employment of the user', required=True)
employee_args.add_argument('email', type=str, help='Email of the user', required=True)

class EmployeeResource(Resource):
    employee_fields = {
        'id': fields.Integer,
        'status': fields.String,
        'name': fields.String,
        'position': fields.String,
        'phone': fields.String,
        'date_of_employment': fields.String,
        'email': fields.String
    }

    @marshal_with(employee_fields)
    def get(self, employee_id):
        employee = Employee.query.get(employee_id)
        if not employee:
            abort(404, message="Employee not found")
        return employee
    
    
    @marshal_with(employee_fields)
    def get(self):
        employees = Employee.query.all()
        if not employees:
            abort(404, message="No employees found")
        return employees
    
    @marshal_with(employee_fields)
    def post(self):
        args = employee_args.parse_args()
        new_employee = Employee(**args)
        db.session.add(new_employee)
        db.session.commit()
        return new_employee, 201
    
    @marshal_with(employee_fields)
    def put(self, employee_id):
        args = employee_args.parse_args()
        employee = Employee.query.get(employee_id)
        if not employee:
            abort(404, message="Employee not found")
        
        for key, value in args.items():
            setattr(employee, key, value)
        
        db.session.commit()
        return employee
    
    @marshal_with(employee_fields)
    def delete(self, employee_id):
        employee = Employee.query.get(employee_id)
        if not employee:
            abort(404, message="Employee not found")
        
        db.session.delete(employee)
        db.session.commit()
        return '', 204

    @marshal_with(employee_fields)
    def post(self):
        args = employee_args.parse_args()
        new_employee = Employee(**args)
        db.session.add(new_employee)
        db.session.commit()
        return new_employee, 201
    
api.add_resource(EmployeeResource, '/employees', '/employee/<int:employee_id>')
    
@app.route('/', methods=['GET'])
def home():
    return {'message': 'Hello, World!'}, 200

if __name__ == '__main__':
    app.run(debug=True)