from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource, reqparse, marshal_with, fields, abort
import datetime
from flask import request
from flask_cors import CORS
from flask import jsonify

app = Flask(__name__)
CORS(app) # ALLOWS FRONT END TO SEND REQUESTS
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mcms.db'
db = SQLAlchemy(app)
api = Api(app)

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status = db.Column(db.String(10), nullable=False)
    name = db.Column(db.String(80), unique=True, nullable=False)
    position = db.Column(db.String(80), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    date_of_employment = db.Column(db.String(8), nullable=False)
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
    def patch(self, employee_id):
        args = employee_args.parse_args()
        employee = Employee.query.get(employee_id)
        if not employee:
            abort(404, message="Employee not found")
        
        for key, value in args.items():
            if value is not None:
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
    
api.add_resource(EmployeeResource, '/employees', '/employee/<int:employee_id>')



class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    manufacturer = db.Column(db.String(80), nullable=False)
    part_number = db.Column(db.String(80), nullable=False)
    date_of_purchase = db.Column(db.String(8), nullable=False)
    category = db.Column(db.String(80), nullable=False)
    price = db.Column(db.Float, nullable=False)
   
    def __repr__(self):
        return f'<Inventory {self.name}>'
    
inventory_args = reqparse.RequestParser()
inventory_args.add_argument('name', type=str, help='Name of the item', required=True)
inventory_args.add_argument('quantity', type=int, help='Quantity of the item', required=True)
inventory_args.add_argument('manufacturer', type=str, help='Manufacturer of the item', required=True)
inventory_args.add_argument('part_number', type=str, help='Part number of the item', required=True)
inventory_args.add_argument('date_of_purchase', type=str, help='Date of purchase of the item', required=True)
inventory_args.add_argument('category', type=str, help='Category of the item', required=True)
inventory_args.add_argument('price', type=float, help='Price of the item', required=True)


class InventoryResource(Resource):
    inventory_fields = {
            'id': fields.Integer,
            'name': fields.String,
            'quantity': fields.Integer,
            'manufacturer': fields.String,
            'part_number': fields.String,
            'date_of_purchase': fields.String,
            'category': fields.String,
            'price': fields.Float
        }
    
    @marshal_with(inventory_fields)
    def get(self, inventory_id):
        inventory = Inventory.query.get(inventory_id)
        if not inventory:
            abort(404, message="Inventory item not found")
        return inventory
    
    @marshal_with(inventory_fields)
    def get(self):
        inventory = Inventory.query.all()
        if not inventory:
            abort(404, message="No inventory items found")
        return inventory
    
    @marshal_with(inventory_fields)
    def post(self):
        args = inventory_args.parse_args()
        new_inventory = Inventory(**args)
        db.session.add(new_inventory)
        db.session.commit()
        return new_inventory, 201
    
    @marshal_with(inventory_fields)
    def patch(self, inventory_id):
        args = inventory_args.parse_args()
        inventory = Inventory.query.get(inventory_id)
        if not inventory:
            abort(404, message="Inventory item not found")
        
        for key, value in args.items():
            if value is not None:
                setattr(inventory, key, value)
        
        db.session.commit()
        return inventory
    
    @marshal_with(inventory_fields)
    def delete(self, inventory_id):
        inventory = Inventory.query.get(inventory_id)
        if not inventory:
            abort(404, message="Inventory item not found")
        
        db.session.delete(inventory)
        db.session.commit()
        return '', 204
    
api.add_resource(InventoryResource, '/inventory', '/inventory/<int:inventory_id>')

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    customer_name = db.Column(db.String(80), nullable=False)
    order_date = db.Column(db.String(8), nullable=False)
    total_price = db.Column(db.Float, nullable=False)

    
    def __repr__(self):
        return f'<Order {self.id}>'
order_args = reqparse.RequestParser()
order_args.add_argument('customer_name', type=str, help='Name of the customer', required=True)
order_args.add_argument('order_date', type=str, help='Date of the order', required=True)
order_args.add_argument('total_price', type=float, help='Total amount of the order', required=True)

class OrderResource(Resource):
    order_fields = {
            'id': fields.Integer,
            'customer_name': fields.String,
            'order_date': fields.String,
            'total_price': fields.Float
        }
    
    @marshal_with(order_fields)
    def get(self, order_id):
        order = Order.query.get(order_id)
        if not order:
            abort(404, message="Order not found")
        return order
    
    def get(self):
        orders = Order.query.all()
        if not orders:
            abort(404, message="No orders found")

        result = []
        for order in orders:
            order_items = OrderItem.query.filter_by(order_id=order.id).all()
            item_list = []
            for item in order_items:
                inventory = Inventory.query.get(item.inventory_id)
                if inventory:
                    item_list.append({
                        "name": inventory.name,
                        "quantity": item.quantity,
                        "price": inventory.price  # Assuming `price` is stored in Inventory
                    })
            result.append({
                "id": order.id,
                "customer_name": order.customer_name,
                "order_date": order.order_date,
                "total_price": order.total_price,
                "items": item_list
            })

        return jsonify(result)
    
    @marshal_with(order_fields)
    def post(self):
        data = request.get_json()
        
        # Step 1: Create the order
        new_order = Order(
            customer_name=data['customer_name'],
            order_date=data['order_date'],
            total_price=data['total_price']
        )
        db.session.add(new_order)
        db.session.commit()  # To generate the order.id for FK

        # Step 2: Add order items
        for item in data.get('items', []):
            inventory_item = Inventory.query.filter_by(name=item['name']).first()
            if not inventory_item:
                abort(400, message=f"Item '{item['name']}' not found in inventory")

            new_order_item = OrderItem(
                order_id=new_order.id,
                name=item['name'],
                inventory_id=inventory_item.id,
                quantity=int(item['quantity'])
            )
            db.session.add(new_order_item)

        db.session.commit()

        return new_order, 201
    
    
    
    @marshal_with(order_fields)
    def patch(self, order_id):
        args = order_args.parse_args()
        order = Order.query.get(order_id)
        if not order:
            abort(404, message="Order not found")
        
        for key, value in args.items():
            if value is not None:
                setattr(order, key, value)
        
        db.session.commit()
        return order
    
    @marshal_with(order_fields)
    def delete(self, order_id):
        order = Order.query.get(order_id)
        if not order:
            abort(404, message="Order not found")

        # Delete associated order items first
        OrderItem.query.filter_by(order_id=order.id).delete()

        db.session.delete(order)
        db.session.commit()
        return '', 204
    
api.add_resource(OrderResource, '/orders', '/order/<int:order_id>')

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    name = db.Column(db.String(80), nullable=False)
    inventory_id = db.Column(db.Integer, db.ForeignKey('inventory.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<OrderItem {self.id}>'

order_item_args = reqparse.RequestParser()
order_item_args.add_argument('order_id', type=int, help='ID of the order', required=True)
order_item_args.add_argument('name', type=str, help='Name of the item', required=True)
order_item_args.add_argument('inventory_id', type=int, help='ID of the inventory item', required=True)
order_item_args.add_argument('quantity', type=int, help='Quantity of the item in the order', required=True)

class OrderItemResource(Resource):
    order_item_fields = {
            'id': fields.Integer,
            'name': fields.String,
            'order_id': fields.Integer,
            'inventory_id': fields.Integer,
            'quantity': fields.Integer
        }
    
    @marshal_with(order_item_fields)
    def get(self, order_item_id):
        order_item = OrderItem.query.get(order_item_id)
        if not order_item:
            abort(404, message="Order item not found")
        return order_item
    
    @marshal_with(order_item_fields)
    def get(self):
        order_items = OrderItem.query.all()
        if not order_items:
            abort(404, message="No order items found")
        return order_items
    
    @marshal_with(order_item_fields)
    def post(self):
        args = order_item_args.parse_args()
        new_order_item = OrderItem(**args)
        db.session.add(new_order_item)
        db.session.commit()
        return new_order_item, 201
    
    @marshal_with(order_item_fields)
    def patch(self, order_item_id):
        args = order_item_args.parse_args()
        order_item = OrderItem.query.get(order_item_id)
        if not order_item:
            abort(404, message="Order item not found")
        
        for key, value in args.items():
            if value is not None:
                setattr(order_item, key, value)
        
        db.session.commit()
        return order_item
    
    @marshal_with(order_item_fields)
    def delete(self, order_item_id):
        order_item = OrderItem.query.get(order_item_id)
        if not order_item:
            abort(404, message="Order item not found")
        
        db.session.delete(order_item)
        db.session.commit()
        return '', 204
    
api.add_resource(OrderItemResource, '/order_items', '/order_item/<int:order_item_id>')


class Repair(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    repair_status = db.Column(db.String(20), nullable=False)
    customer_name = db.Column(db.String(80), nullable=False)
    vehicle_model = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    #order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    repair_cost = db.Column(db.Float, nullable=False)
    assigned_employee = db.Column(db.String(80), nullable=False)
    scheduled_date = db.Column(db.String(8), nullable=False)
    estimated_completion_date = db.Column(db.String(8), nullable=False)

    def __repr__(self):
        return f'<Repair {self.id}>'
    
repair_args = reqparse.RequestParser()
repair_args.add_argument('repair_status', type=str, help='Status of the repair', required=True)
repair_args.add_argument('customer_name', type=str, help='Name of the customer', required=True)
repair_args.add_argument('vehicle_model', type=str, help='Model of the vehicle', required=True)
repair_args.add_argument('description', type=str, help='Description of the repair', required=True)
repair_args.add_argument('repair_cost', type=float, help='Cost of the repair', required=True)
repair_args.add_argument('assigned_employee', type=str, help='Assigned employee for the repair', required=True)
repair_args.add_argument('scheduled_date', type=str, help='Scheduled date for the repair', required=True)
repair_args.add_argument('estimated_completion_date', type=str, help='Estimated completion date for the repair', required=True)

class RepairResource(Resource):
    repair_fields = {
            'id': fields.Integer,
            'repair_status': fields.String,
            'customer_name': fields.String,
            'vehicle_model': fields.String,
            'description': fields.String,
            'repair_cost': fields.Float,
            'assigned_employee': fields.String,
            'scheduled_date': fields.String,
            'estimated_completion_date': fields.String
        }
    
    @marshal_with(repair_fields)
    def get(self, repair_id):
        repair = Repair.query.get(repair_id)
        if not repair:
            abort(404, message="Repair not found")
        return repair
    
    @marshal_with(repair_fields)
    def get(self):
        repairs = Repair.query.all()
        if not repairs:
            abort(404, message="No repairs found")
        return repairs
    
    @marshal_with(repair_fields)
    def post(self):
        args = repair_args.parse_args()
        new_repair = Repair(**args)
        db.session.add(new_repair)
        db.session.commit()
        return new_repair, 201
    
    @marshal_with(repair_fields)
    def patch(self, repair_id):
        args = repair_args.parse_args()
        repair = Repair.query.get(repair_id)
        if not repair:
            abort(404, message="Repair not found")
        
        for key, value in args.items():
            if value is not None:
                setattr(repair, key, value)
        
        db.session.commit()
        return repair
    
    @marshal_with(repair_fields)
    def delete(self, repair_id):
        repair = Repair.query.get(repair_id)
        if not repair:
            abort(404, message="Repair not found")
        
        db.session.delete(repair)
        db.session.commit()
        return '', 204
    
api.add_resource(RepairResource, '/repairs', '/repair/<int:repair_id>')

@app.route('/', methods=['GET'])
def home():
    return {'message': 'Hello, World!'}, 200

if __name__ == '__main__':
    app.run(debug=True)