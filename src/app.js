// Data storage

let employees = [];

let repairs = [
  {
    id: "1",
    customerName: "John Doe",
    vehicleInfo: "Yamaha R3 - 2020",
    description: "Oil change and brake pad replacement",
    status: "pending",
    assignedTo: "Mike Johnson",
    scheduledDate: "2025-04-05",
    estimatedCompletion: "2025-04-06",
    price: 150.00
  },
  {
    id: "2",
    customerName: "Sarah Williams",
    vehicleInfo: "Kawasaki Ninja 400 - 2019",
    description: "Clutch adjustment and chain replacement",
    status: "in-progress",
    assignedTo: "Jake Peterson",
    scheduledDate: "2025-04-02",
    estimatedCompletion: "2025-04-04",
    price: 200.00
  },
  {
    id: "3",
    customerName: "David Brown",
    vehicleInfo: "Honda CBR500R - 2021",
    description: "Tire replacement and engine tuning",
    status: "completed",
    assignedTo: "Chris Evans",
    scheduledDate: "2025-03-30",
    estimatedCompletion: "2025-04-01",
    price: 300.00
  },
  {
    id: "4",
    customerName: "Emily Johnson",
    vehicleInfo: "Suzuki GSX-R600 - 2018",
    description: "Exhaust system repair and fuel injection tuning",
    status: "pending",
    assignedTo: "Emma Watson",
    scheduledDate: "2025-04-07",
    estimatedCompletion: "2025-04-08",
    price: 250.00
  },
  {
    id: "5",
    customerName: "Michael Davis",
    vehicleInfo: "KTM Duke 390 - 2022",
    description: "Electrical wiring issue and battery replacement",
    status: "in-progress",
    assignedTo: "Daniel Carter",
    scheduledDate: "2025-04-03",
    estimatedCompletion: "2025-04-05",
    price: 180.00
  }
];

let inventory = [

];

let orders = [];


const fetchInventoryData = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/inventory');
    const data = await response.json();
    inventory = data;
    console.log(inventory);
    renderInventory();
  } catch (error) {
    console.error('Error fetching inventory:', error);
  }
};
const fetchEmployeesData = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/employees');
    const data = await response.json();
    employees = data;
    console.log(employees);
    renderEmployees();
  } catch (error) {
    console.error('Error fetching Employees:', error);
  }
};
const fetchRepairsData = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/repairs');
    const data = await response.json();
    repairs = data;
    console.log(repairs);
    renderRepairs();
  } catch (error) {
    console.error('Error fetching Repairs:', error);
  }
};
const fetchOrdersData = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/orders');
    const data = await response.json();
    orders = data;
    console.log(inventory);
    renderOrdersHistory();
  } catch (error) {
    console.error('Error fetching Orders:', error);
  }
};
const fetchOrderItemsData = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/order_items');
    const data = await response.json();
    orderItems = data;
    console.log(inventory);
    renderInventory();
  } catch (error) {
    console.error('Error fetching order Items:', error);
  }
};

// Navigation
async function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.add('hidden');
  });
  
  //Show selected section
  document.getElementById(sectionId).classList.remove('hidden');
  
  //Update navigation highlighting
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('bg-blue-50', 'text-blue-600');
  });
  
  const activeNav = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
  activeNav.classList.add('bg-blue-50', 'text-blue-600');

  if (sectionId === 'inventory') {
    await fetchInventoryData(); 
   
  }
  if (sectionId === 'repairs') {
    await fetchRepairsData();
  
  }
  if (sectionId === 'employees') {
    await fetchEmployeesData();
  }
  if (sectionId === 'order') {
    await fetchInventoryData(); // Fetch inventory data for the order section
    renderOrders();
  }
  if (sectionId === 'orderHistory') {
    await fetchOrdersData();
  }
}

// Modal handling
function showModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
}

function hideModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

//Edit cell functionality
async function edit(event, table, id) {
  const row = event.target.closest('tr');
  const cells = row.querySelectorAll('td');
  if (event.target.textContent === 'Save') {
    cells.forEach(cell => {
      if (cell.cellIndex !== cells.length - 1) { // Exclude the last cell (actions)
        cell.contentEditable = false;
        cell.classList.remove('bg-gray-100');
      }
    });
    event.target.textContent = 'Edit';

    if (table === 'employees') {
      const updatedData = {
        status: cells[0].textContent,
        name: cells[1].textContent,
        position: cells[2].textContent,
        date_of_employment: cells[3].textContent,
        email: cells[4].textContent,
        phone: cells[5].textContent
      };
      await updateEmployee(id, updatedData);
    }

    if (table === 'inventory') {
      const updatedData = {
        name: cells[1].textContent,
        category: cells[2].textContent,
        price: parseFloat(cells[3].textContent.replace('$', '')),
        quantity: parseInt(cells[4].textContent),
        manufacturer: cells[5].textContent,
        part_number: cells[6].textContent
      };
      await updateInventory(id, updatedData);
    }
      
    console.log('Save changes:', Array.from(cells).map(cell => cell.textContent));
    return;
  }
  cells.forEach(cell => {
    if (cell.cellIndex !== cells.length - 1) { // Exclude the last cell (actions)
      cell.contentEditable = true;
      cell.classList.add('bg-gray-100');
    }
  });
  event.target.textContent = 'Save';
}
const updateEmployee = async (employeeId, updatedData) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/employee/${employeeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    });

    const updatedEmployee = await response.json();
    console.log('Employee updated:', updatedEmployee);
    fetchEmployeesData(); // refresh list
  } catch (error) {
    console.error('Error updating employee:', error);
  }
};
const updateInventoryItem = async (inventoryId, updatedData) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/inventory/${inventoryId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedData)
    });

    const updatedItem = await response.json();
    console.log('Inventory item updated:', updatedItem);
    fetchInventoryData();
  } catch (error) {
    console.error('Error updating inventory item:', error);
  }
};

//search functionality
function filterEmployee() {
  const searchQuery = document.getElementById("employeeSearch").value.toLowerCase();
  
  const tbody = document.getElementById("employeesTableBody");
  tbody.innerHTML = employees
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery) || 
      item.position.toLowerCase().includes(searchQuery) ||
      item.email.toLowerCase().includes(searchQuery) || 
      item.phone.toLowerCase().includes(searchQuery)
    )
    .map(item =>
      `<tr class="hover:bg-gray-100">
        <td class='px-6 py-4'>
          <button onclick="toggleStatus(event)" 
            class="px-3 py-0.5 text-white text-sm font-medium rounded-md ${item.status === 'Active' ? 'bg-green-500' : 'bg-slate-500'} text-center">
            ${item.status}
          </button>
        </td>
        <td class="px-6 py-4">${item.name}</td>
        <td class="px-6 py-4">${item.position}</td>
        <td class="px-6 py-4">${item.date_of_employement}</td>
        <td class="px-6 py-4">${item.email}</td>
        <td class="px-6 py-4">${item.phone}</td>
        <td class="px-6 py-4 flex gap-2">
        <button onclick="edit(event, 'employee', ${employee.id})" class="text-blue-600 hover:text-blue-800">Edit</button>
        <button onclick="deleteEmployee('${employee.id}')" class="text-red-600 hover:text-red-800">Del</button>
      </td>
      </tr>` 
      ).join('');
}

// Employee management
async function handleAddEmployee(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const employee = {
    id: '',
    status: 'Active',
    name: formData.get('name'),
    position: formData.get('position'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    date_of_employment: new Date().toISOString().split('T')[0]
  };
  
  try {
    const response = await fetch('http://127.0.0.1:5000/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(employee)
    });

    const newEmployee = await response.json();
    console.log('Employee added:', newEmployee);
    fetchEmployeesData(); // refresh list
  } catch (error) {
    console.error('Error adding employee:', error);
  }
  hideModal('addEmployeeModal');
  event.target.reset();
}

function renderEmployees() {
  const tbody = document.getElementById('employeesTableBody');
  tbody.innerHTML = employees.map(employee => `
    <tr class="hover:bg-gray-100">
      <td class='px-6 py-4'>
        <button onclick="toggleStatus(event)" 
          class="px-1.5 py-0.5 text-sm font-medium text-white rounded-md ${employee.status === 'Active' ? 'bg-green-500' : 'bg-slate-500'} text-center">
          ${employee.status}
        </button>
      </td>
      <td class="px-6 py-4 empName" contenteditable="false">${employee.name}</td>
      <td class="px-6 py-4" contenteditable="false">${employee.position}</td>
      <td class="px-6 py-4" contenteditable="false">${employee.date_of_employment}</td>
      <td class="px-6 py-4" contenteditable="false">${employee.email}</td>
      <td class="px-6 py-4" contenteditable="false">${employee.phone}</td>
      <td class="px-6 py-4 flex gap-2">
        <button onclick="edit(event, 'employees', ${employee.id})" class="text-blue-600 hover:text-blue-800">Edit</button>
        <button onclick="deleteEmployee('${employee.id}')" class="text-red-600 hover:text-red-800">Del</button>
      </td>
    </tr>
  `).join('');
}

async function toggleStatus(event) {
  event.preventDefault();
  const button = event.target.closest('button');
  const row = event.target.closest('tr');
  const empName = row.querySelector('.empName').textContent.trim();
  
  const employee = employees.find(emp => emp.name === empName);
  if (employee) {
    employee.status = employee.status === 'Active' ? 'Inactive' : 'Active';
    button.textContent = employee.status;
    
    // Update class based on status
    button.classList.remove('bg-green-500', 'bg-slate-500');
    button.classList.add(employee.status === 'Active' ? 'bg-green-500' : 'bg-slate-500');

    await updateEmployee(employee.id, employee);
  }
}
						
async function deleteEmployee(id) {
  try {
    const response = await fetch(`http://127.0.0.1:5000/employee/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      console.log(`Employee ${id} deleted.`);
      fetchEmployeesData(); // refresh list
    } else {
      throw new Error('Delete failed');
    }
  } catch (error) {
    console.error('Error deleting employee:', error);
  }
}

function filterInventory() {
  const searchQuery = document.getElementById("inventorySearch").value.toLowerCase();
  
  const tbody = document.getElementById("inventoryTableBody");
  tbody.innerHTML = inventory
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery) || 
      item.category.toLowerCase().includes(searchQuery) ||
      item.manufacturer.toLowerCase().includes(searchQuery) || 
      item.model.toLowerCase().includes(searchQuery) ||
      item.manufacturer.toLowerCase().includes(searchQuery) 
    )
    .map(item => `
      <tr>
        <td class="px-6 py-4">${item.manufacturer}</td>
        <td class="px-6 py-4">${item.part_number}</td>
        <td class="px-6 py-4">${item.name}</td>
        <td class="px-6 py-4">${item.category}</td>
        <td class="px-6 py-4">$${item.price.toFixed(2)}</td>
        <td class="px-6 py-4">${item.quantity}</td>
        <td class="px-6 py-4 flex gap-2">
        <button onclick="edit(event, 'inventory', ${item.id})" class="text-blue-600 hover:text-blue-800">Edit</button>
        <button onclick="deleteInventoryItem('${item.id}')" class="text-red-600 hover:text-red-800">Del</button>
      </td>
      </tr>
    `).join('');
}

// Inventory management
async function handleAddInventoryItem(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const item = {
    name: formData.get('name'),
    category: formData.get('category'),
    price: parseFloat(formData.get('price')),
    quantity: parseInt(formData.get('quantity')),
    manufacturer: formData.get('manufacturer'),
    part_number: formData.get('partNumber'),
    date_of_purchase: new Date().toISOString().split('T')[0]
  };
  
  try {
    const response = await fetch('http://127.0.0.1:5000/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });

    const newItem = await response.json();
    console.log('Inventory item added:', newItem);
    fetchInventoryData(); // Refresh inventory list
  } catch (error) {
    console.error('Error adding inventory item:', error);
  }
  hideModal('addInventoryModal');
  event.target.reset();
}

function renderInventory() {
  const tbody = document.getElementById('inventoryTableBody');
  tbody.innerHTML = inventory.map(item => `
    <tr>
      <td class="px-6 py-4">${item.manufacturer}</td>
      <td class="px-6 py-4">${item.part_number}</td>
      <td class="px-6 py-4">${item.name}</td>
      <td class="px-6 py-4">${item.category}</td>
      <td class="px-6 py-4">$${item.price.toFixed(2)}</td>
      <td class="px-6 py-4">${item.quantity}</td>
      <td class="px-6 py-4 flex gap-2">
        <button onclick="edit(event, 'inventory', ${item.id})" class="text-blue-600 hover:text-blue-800">Edit</button>
        <button onclick="deleteInventoryItem('${item.id}')" class="text-red-600 hover:text-red-800">Del</button>
      </td>
    </tr>
  `).join('');
}

const deleteInventoryItem = async (inventoryId) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/inventory/${inventoryId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      console.log(`Inventory item ${inventoryId} deleted.`);
      fetchInventoryData();
    } else {
      throw new Error('Delete failed');
    }
  } catch (error) {
    console.error('Error deleting inventory item:', error);
  }
};

// Repair management
async function handleAddRepair(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const repair = {
    customer_name: formData.get('customerName'),
    vehicle_model: formData.get('vehicleInfo'),
    description: formData.get('description'),
    repair_status: 'pending',
    assigned_employee: formData.get('assignedTo'),
    scheduled_date: formData.get('scheduledDate'),
    estimated_completion_date: formData.get('estimatedCompletion'),
    repair_cost: parseFloat(formData.get('price')),
  };
  
  try {
    const response = await fetch('http://127.0.0.1:5000/repairs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(repair)
    });

    const newRepair = await response.json();
    console.log('Repair added:', newRepair);
    fetchRepairsData();
  } catch (error) {
    console.error('Error adding repair:', error);
  }
  hideModal('addRepairModal');
}

function renderRepairs() {
  const board = document.getElementById('repairsBoard');
  board.innerHTML = repairs.map(repair => `
    <div class="bg-white p-4 rounded-lg shadow-md">
      <div class="flex justify-between items-start mb-4">
        <h3 class="font-semibold">${repair.customer_name}</h3>
        <span class="px-2 py-1 rounded text-sm ${getStatusColor(repair.repair_status)}">${repair.repair_status}</span>
      </div>
      <p class="text-sm text-gray-600 mb-2">${repair.vehicle_model}</p>
      <p class="text-sm mb-4">${repair.description}</p>
      <div class="text-sm text-gray-500">
        <p>Assigned to: ${repair.assigned_employee}</p>
        <p>Scheduled: ${repair.scheduled_date}</p>
        <p>Est. Completion: ${repair.estimated_completion_date}</p>
      </div>
      <div class="mt-4 flex justify-between space-x-2">
        <h1 class="text-xl font-black col text-green-500">$${repair.repair_cost}</h1>
        <div class="flex space-x-2 items-center gap-2">
          <button onclick="updateRepairStatus('${repair.id}')" class="text-blue-600 hover:text-blue-800">Update Status</button>
          <button onclick="deleteRepair('${repair.id}')" class="text-red-600 hover:text-red-800">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

function getStatusColor(status) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  };
  return colors[status] || colors.pending;
}

async function updateRepairStatus(id) {
  const repair = repairs.find(r => r.id == id);
  const statusOrder = ['pending', 'in-progress', 'completed'];
  const currentIndex = statusOrder.indexOf(repair.repair_status);
  repair.repair_status = statusOrder[(currentIndex + 1) % statusOrder.length];

  try {
    const response = await fetch(`http://127.0.0.1:5000/repair/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(repair)
    });

    const updatedRepair = await response.json();
    console.log('Repair updated:', updatedRepair);
    fetchRepairsData();
  } catch (error) {
    console.error('Error updating repair:', error);
  }
}

function deleteRepair(id) {
  repairs = repairs.filter(repair => repair.id !== id);
  renderRepairs();
}

// Report generation
function generateReport(type) {
  let reportData;
  switch (type) {
    case 'sales':
      reportData = generateSalesReport();
      break;
    case 'inventory':
      reportData = generateInventoryReport();
      break;
    case 'repairs':
      reportData = generateRepairsReport();
      break;
  }
  
  // For demonstration, we'll just console.log the report
  console.log(`${type.toUpperCase()} Report:`, reportData);
  alert(`${type.toUpperCase()} report has been generated. Check the console for details.`);
}

function generateSalesReport() {
  // Implement sales report logic
  return {
    totalSales: 0,
    itemsSold: 0,
    topSellingItems: []
  };
}

function generateInventoryReport() {
  return {
    totalItems: inventory.length,
    lowStock: inventory.filter(item => item.quantity < 5),
    totalValue: inventory.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  };
}

function generateRepairsReport() {
  return {
    totalRepairs: repairs.length,
    pending: repairs.filter(r => r.status === 'pending').length,
    inProgress: repairs.filter(r => r.status === 'in-progress').length,
    completed: repairs.filter(r => r.status === 'completed').length
  };
}

function renderOrders() {
  const tbody = document.getElementById('orderTableBody'); 
  tbody.innerHTML = inventory.map(item => `
    <tr onclick="addToOrder(event)" class='cursor-pointer hover:bg-gray-100')>
      <td class="px-6 py-4">${item.manufacturer}</td>
      <td class="px-6 py-4">${item.name}</td>
      <td class="px-6 py-4">${item.category}</td>
      <td class="px-6 py-4">$${item.price.toFixed(2)}</td>
      <td class="px-6 py-4">${item.quantity}</td>
    </tr>
  `).join('');
}
function renderOrdersHistory() {
  const tbody = document.getElementById('orderHistoryTableBody');
}

async function handleAddOrder(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const order = {
    id: Date.now().toString(),
    customer_name: formData.get('customerName'),
    items: Array.from(document.querySelectorAll("#cartItemsBody tr")).map(row => ({
      name: row.querySelector("td").textContent,
      quantity: row.querySelector(".orderQuantity").value,
      price: parseFloat(row.querySelector(".orderPrice").getAttribute("data-price"))
    })),
    total_price: parseFloat(document.getElementById("totalPrice").value.replace('$', '')),
    order_date: new Date().toISOString().split('T')[0]
  };
  
  try {
    const response = await fetch('http://127.0.0.1:5000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });

    const newOrder = await response.json();
    console.log('Order added:', newOrder);
    fetchOrdersData(); // Refresh list
  } catch (error) {
    console.error('Error adding order:', error);
  }
  event.target.reset();
  document.getElementById("cartItemsBody").innerHTML = ''; // Clear cart items
}

function deleteOrder(orderId) {
  if (!confirm("Are you sure you want to delete this order?")) return;

  fetch(`http://127.0.0.1:5000/order/${orderId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        renderOrders();
      } else {
        alert("Failed to delete order.");
      }
    })
    .catch(error => {
      console.error("Error deleting order:", error);
      alert("Something went wrong.");
    });
}

function cancelOrder(event){
  event.preventDefault();
  document.getElementById("cartItemsBody").innerHTML = ''; // Clear cart items
  calculateTotal(); // Reset total price
}

function filterOrderInventory() {
  const searchQuery = document.getElementById("orderSearch").value.toLowerCase();
  
  const tbody = document.getElementById("orderTableBody");
  tbody.innerHTML = inventory
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery) || 
      item.category.toLowerCase().includes(searchQuery) ||
      item.manufacturer.toLowerCase().includes(searchQuery) || 
      item.model.toLowerCase().includes(searchQuery)
    )
    .map(item => `
      <tr onclick="addToOrder(event)" class='cursor-pointer hover:bg-gray-100>
        <td class="px-6 py-4">${item.manufacturer}</td>
        <td class="px-6 py-4">${item.name}</td>
        <td class="px-6 py-4">${item.category}</td>
        <td class="px-6 py-4">$${item.price.toFixed(2)}</td>
        <td class="px-6 py-4">${item.quantity}</td>
      </tr>
    `).join('');
  tbody.forEach(row => {
    row.addEventListener('click', function() {
      const selectedItem = row.querySelector('td').textContent;
      const orderItemInput = document.getElementById("orderItemInput");
      orderItemInput.value = selectedItem;
    });
  });
}

function addToOrder(event) {
  const row = event.target.closest('tr');
  const cells = row.querySelectorAll('td');
  const orderItemsContainer = document.getElementById("cartItemsBody");
  const orderItem = document.createElement("tr");

  const itemName = cells[1].textContent;
  const itemPrice = parseFloat(cells[3].textContent.replace('$', '')).toFixed(2);

  orderItem.className = "mb-2";
  orderItem.innerHTML = `
      <td class="px-6 py-4">${itemName}</td>
      <td class="px-6 py-4"><input type="number" class="orderQuantity w-16 text-center" value="1" min="1" onchange="calculateTotal()" /></td>
      <td class="px-6 py-4 orderPrice" data-price="${itemPrice}">$${itemPrice}</td>
      <td class="px-6 py-4"><button class="text-red-600 hover:text-red-800 font-bold text-2xl text-center" onclick="removeOrderItem(event)">×</button></td>
  `;
  orderItemsContainer.appendChild(orderItem);
  calculateTotal();

}

function removeOrderItem(event) {
  const row = event.target.closest('tr');
  row.remove();
  calculateTotal();
}

function calculateTotal() {
  let total = 0;
  document.querySelectorAll("#cartItemsBody tr").forEach(row => {
      const quantity = row.querySelector(".orderQuantity").value;
      const pricePerItem = row.querySelector(".orderPrice").getAttribute("data-price");
      const itemTotal = quantity * pricePerItem;
      row.querySelector(".orderPrice").textContent = `$${itemTotal.toFixed(2)}`;
      total += itemTotal;
  });

  document.getElementById("totalPrice").value = `$${total.toFixed(2)}`;
}

function renderOrdersHistory() {
  const board = document.getElementById('historyBoard');
  board.innerHTML = orders.map(order => `
    <div class="flex flex-col justify-between w-full sm:w-[300px] bg-white p-5 rounded-xl shadow-md border border-gray-200 transition-all duration-200">
      <div class="mb-4">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h2 class="text-base font-semibold text-gray-800">${order.customer_name}</h2>
            <p class="text-xs text-gray-400">Order ID: ${order.id}</p>
          </div>
          <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">${order.order_date}</span>
        </div>

        <div>
          <h4 class="text-sm font-medium text-gray-700 mb-1">Items</h4>
          <ul class="text-sm text-gray-700 space-y-1 max-h-[160px] overflow-y-auto pr-1">
            ${order.items.map(item => `
              <li class="flex justify-between">
                <span>${item.name} × ${item.quantity}</span>
                <span class="text-gray-500">$${item.price.toFixed(2)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>

      <div class="pt-3 border-t mt-auto flex justify-between items-center">
        <span class="text-sm text-gray-600">Total</span>
        <span class="text-lg font-bold text-green-600">$${order.total_price.toFixed(2)}</span>
      </div>

      <div class="mt-3 text-right">
        <button onclick="deleteOrder(${order.id})" class="inline-block px-3 py-1.5 text-sm text-red-600 bg-red-100 hover:bg-red-200 rounded transition">
          Delete
        </button>
      </div>
    </div>
  `).join('');
}




// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  showSection('order');
  document.getElementById("currentDate").textContent = new Date().toLocaleDateString();
});