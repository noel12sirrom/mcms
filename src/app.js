// Data storage
let admin = false; // Set to true if the user is an admin, false otherwise
let employees = [];

let repairs = [
];

let inventory = [
];

let orders = [];

function checkLowStockAlert() {
  if (!admin) return; // Only check for low stock if the user is an admin
  fetch('http://127.0.0.1:5000/low_stock_report')
    .then(response => response.json())
    .then(data => {
      const alertBox = document.getElementById('lowStockAlert');
      if (data.items && data.items.length > 0) {
        alertBox.classList.remove('hidden');
      } else {
        alertBox.classList.add('hidden');
      }
    })
    .catch(error => {
      console.error("Error checking low stock:", error);
    });
}


const fetchInventoryData = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/inventory');
    const data = await response.json();
    inventory = data;
    console.log(inventory);
    renderInventory();
    checkLowStockAlert();
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
        name: cells[2].textContent,
        category: cells[3].textContent,
        price: parseFloat(cells[4].textContent.replace('$', '')),
        quantity: parseInt(cells[5].textContent),
        manufacturer: cells[0].textContent,
        part_number: cells[1].textContent
      };
      await updateInventoryItem(id, updatedData);
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
    await fetchInventoryData();
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
        <button onclick="edit(event, 'employee', ${item.id})" class="text-blue-600 hover:text-blue-800">Edit</button>
        <button onclick="deleteEmployee('${item.id}')" class="text-red-600 hover:text-red-800">Del</button>
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
  console.log("filterInvenmtory called");
  const searchQuery = document.getElementById("inventorySearch").value.toLowerCase();
  
  const tbody = document.getElementById("inventoryTableBody");
  tbody.innerHTML = inventory
    .filter(item => 
      item.name.toLowerCase().includes(searchQuery) || 
      item.category.toLowerCase().includes(searchQuery) ||
      item.manufacturer.toLowerCase().includes(searchQuery) || 
      item.part_number.toLowerCase().includes(searchQuery)
    )
    .map(item => {
      const isLowStock = item.quantity < 20;
      const rowClass = isLowStock ? 'bg-red-100' : ''; // Light red background for low stock

      return `
      <tr class="${rowClass}">
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
      `;
    }).join('');
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
  tbody.innerHTML = inventory.map(item => {
    const isLowStock = item.quantity < 20;
    const rowClass = isLowStock ? 'bg-red-100' : ''; // Light red background for low stock

    return `
      <tr class="${rowClass}">
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
    `;
  }).join('');
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
  event.target.reset();
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

const deleteRepair = async (repairId) => {
  try {
    const response = await fetch(`http://127.0.0.1:5000/repair/${repairId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      console.log(`Repair ${repairId} deleted.`);
      fetchRepairsData();
    } else {
      throw new Error('Delete failed');
    }
  } catch (error) {
    console.error('Error deleting repair:', error);
  }
};

function renderOrders() {
  const tbody = document.getElementById('orderTableBody'); 
  tbody.innerHTML = inventory
    .filter(item => item.quantity > 0)
    .map(item => `
      <tr onclick="addToOrder(event)" class='cursor-pointer hover:bg-gray-100'>
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
  const cartRows = document.querySelectorAll("#cartItemsBody tr");

  const orderItems = Array.from(cartRows).map(row => {
    return {
      name: row.querySelector("td").textContent,
      quantity: parseInt(row.querySelector(".orderQuantity").value),
      price: parseFloat(row.querySelector(".orderPrice").getAttribute("data-price"))
    };
  });

  const order = {
    id: Date.now().toString(),
    customer_name: formData.get('customerName'),
    items: orderItems,
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

    // Update inventory for each item
    for (const orderedItem of orderItems) {
      const inventoryItem = inventory.find(i => i.name === orderedItem.name);
      if (inventoryItem) {
        const updatedQuantity = inventoryItem.quantity - orderedItem.quantity;
        await updateInventoryItem(inventoryItem.id, { quantity: updatedQuantity });
      }
    }

  } catch (error) {
    console.error('Error adding order:', error);
  }
  
  event.target.reset();
  document.getElementById("cartItemsBody").innerHTML = ''; // Clear cart
  renderOrders();
}

async function deleteOrder(orderId) {
  if (!confirm("Are you sure you want to delete this order?")) return;

  fetch(`http://127.0.0.1:5000/order/${orderId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.ok) {
        fetchOrdersData(); // Refresh orders list
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

function renderOrders() {
  const tbody = document.getElementById('orderTableBody'); 
  tbody.innerHTML = inventory
    .filter(item => item.quantity > 0)
    .map(item => `
      <tr onclick="addToOrder(event)" class="cursor-pointer hover:bg-gray-100">
        <td class="px-6 py-4">${item.manufacturer}</td>
        <td class="px-6 py-4">${item.name}</td>
        <td class="px-6 py-4">${item.category}</td>
        <td class="px-6 py-4">$${item.price.toFixed(2)}</td>
        <td class="px-6 py-4">${item.quantity}</td>
      </tr>
    `).join('');
}


function filterOrderInventory() {
  const searchQuery = document.getElementById("orderSearch").value.toLowerCase();
  
  const tbody = document.getElementById("orderTableBody");
  tbody.innerHTML = inventory
    .filter(item => item.quantity > 0)
    .filter(item => 
      (item.name || '').toLowerCase().includes(searchQuery) || 
      (item.category || '').toLowerCase().includes(searchQuery) ||
      (item.manufacturer || '').toLowerCase().includes(searchQuery) || 
      (item.part_number || '').toLowerCase().includes(searchQuery)
    )
    .map(item => `
      <tr onclick="addToOrder(event)" class="cursor-pointer hover:bg-gray-100">
        <td class="px-6 py-4">${item.manufacturer}</td>
        <td class="px-6 py-4">${item.name}</td>
        <td class="px-6 py-4">${item.category}</td>
        <td class="px-6 py-4">$${item.price.toFixed(2)}</td>
        <td class="px-6 py-4">${item.quantity}</td>
      </tr>
    `).join('');

  [...tbody.querySelectorAll('tr')].forEach(row => {
    row.addEventListener('click', function() {
      const selectedItem = row.querySelector('td').textContent;
      const orderItemInput = document.getElementById("orderItemInput");
      orderItemInput.value = selectedItem;
    });
  });
}

function filterOrderHistory() {
  console.log("filter order hoistry called")
  const searchQuery = document.getElementById("historySearch").value.toLowerCase();
  
  const board = document.getElementById("historyBoard");
  board.innerHTML = orders
    .filter(order => 
      order.customer_name.toLowerCase().includes(searchQuery) ||
      order.id.toString().includes(searchQuery) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery))
    )
    .map(order => `
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


function addToOrder(event) {
  const row = event.target.closest('tr');
  const cells = row.querySelectorAll('td');
  const orderItemsContainer = document.getElementById("cartItemsBody");

  const itemName = cells[1].textContent;
  const itemPrice = parseFloat(cells[3].textContent.replace('$', '')).toFixed(2);

  // Find the inventory item
  const inventoryItem = inventory.find(item => item.name === itemName);
  if (!inventoryItem || inventoryItem.quantity <= 0) return;

  // Check if item is already in the cart
  const existingRow = Array.from(orderItemsContainer.querySelectorAll("tr")).find(tr =>
    tr.querySelector("td")?.textContent === itemName
  );

  if (existingRow) {
    const qtyInput = existingRow.querySelector("input.orderQuantity");
    let currentQty = parseInt(qtyInput.value);
    if (currentQty < inventoryItem.quantity) {
      qtyInput.value = currentQty + 1;
    } else {
      alert(`Only ${inventoryItem.quantity} in stock.`);
    }
  } else {
    const orderItem = document.createElement("tr");
    orderItem.className = "mb-2";
    orderItem.innerHTML = `
        <td class="px-6 py-4">${itemName}</td>
        <td class="px-6 py-4">
          <input 
            type="number" 
            class="orderQuantity w-16 text-center" 
            value="1" 
            min="1" 
            max="${inventoryItem.quantity}" 
            onchange="enforceMaxQuantity(this, ${inventoryItem.quantity}); calculateTotal()" 
          />
        </td>
        <td class="px-6 py-4 orderPrice" data-price="${itemPrice}">$${itemPrice}</td>
        <td class="px-6 py-4">
          <button class="text-red-600 hover:text-red-800 font-bold text-2xl text-center" onclick="removeOrderItem(event)">×</button>
        </td>
    `;
    orderItemsContainer.appendChild(orderItem);
  }

  calculateTotal();
}
// Helper to enforce the max quantity in input field
function enforceMaxQuantity(input, max) {
  if (parseInt(input.value) > max) {
    input.value = max;
    alert(`Only ${max} in stock.`);
  } else if (parseInt(input.value) < 1) {
    input.value = 1;
  }
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

// Report generation
function generateSalesReport() {
  alert('/sales_report?start_date=2025-01-01&end_date=2025-04-01');
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  fetch(`http://127.0.0.1:5000/sales_report?start_date=${startDate}&end_date=${endDate}`)
    .then(response => response.json())
    .then(data => {
      const output = document.getElementById('reportOutput');
      output.innerHTML = `
        <div class="bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto">
          <h3 class="text-2xl font-bold text-blue-600 mb-4">📈 Sales Report</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <p><span class="font-semibold">Total Orders:</span> ${data.total_orders}</p>
            <p><span class="font-semibold">Total Revenue:</span> $${data.total_revenue.toFixed(2)}</p>
          </div>
          <h4 class="text-xl font-semibold text-gray-700 mb-2">Best Selling Items</h4>
          <ul class="list-disc list-inside space-y-1 text-gray-600">
            ${data.best_selling_items.map(item => `<li><span class="font-medium">${item[0]}</span>: ${item[1].quantity} sold</li>`).join('')}
          </ul>
        </div>
      `;
    })
    .catch(error => {
      console.error('Error fetching sales report:', error);
    });
}

function generateInventoryReport() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  fetch(`http://127.0.0.1:5000/inventory_report?start_date=${startDate}&end_date=${endDate}`)
    .then(response => response.json())
    .then(data => {
      const output = document.getElementById('reportOutput');
      output.innerHTML = `
        <div class="bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto">
          <h3 class="text-2xl font-bold text-green-600 mb-4">📦 Inventory Report</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <p><span class="font-semibold">Total Items:</span> ${data.total_inventory_items}</p>
            <p><span class="font-semibold">Total Value:</span> $${data.total_inventory_value.toFixed(2)}</p>
          </div>
          <h4 class="text-xl font-semibold text-gray-700 mb-2">Inventory Items</h4>
          <ul class="list-disc list-inside space-y-1 text-gray-600">
            ${data.items.map(item => `<li>${item.name} — ${item.quantity} in stock @ $${item.price}</li>`).join('')}
          </ul>
        </div>
      `;
    })
    .catch(error => {
      console.error('Error fetching inventory report:', error);
    });
}

function generateRepairReport() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;

  fetch(`http://127.0.0.1:5000/repair_report?start_date=${startDate}&end_date=${endDate}`)
    .then(response => response.json())
    .then(data => {
      const output = document.getElementById('reportOutput');
      output.innerHTML = `
        <div class="bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto">
          <h3 class="text-2xl font-bold text-red-600 mb-4">🛠️ Repair Report</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <p><span class="font-semibold">Total Repairs:</span> ${data.total_repairs}</p>
            <p><span class="font-semibold">Total Repair Cost:</span> $${data.total_cost.toFixed(2)}</p>
          </div>
          <h4 class="text-xl font-semibold text-gray-700 mb-2">Repair Jobs</h4>
          <ul class="list-disc list-inside space-y-1 text-gray-600">
            ${data.repairs.map(r => `<li>${r.customer_name} (${r.vehicle_model}) - $${r.repair_cost} [${r.repair_status}]</li>`).join('')}
          </ul>
        </div>
      `;
    })
    .catch(error => {
      console.error('Error fetching repair report:', error);
    });
}

async function generateLowStockReport() {
  try {
    const response = await fetch('http://127.0.0.1:5000/low_stock_report');
    const data = await response.json();

    const container = document.getElementById('reportOutput');
    container.innerHTML = `
      <h2 class="text-xl font-bold mb-4">Low Stock Inventory Report</h2>
      <p class="mb-2 text-gray-700">Total Low Stock Items: <strong>${data.low_stock_count}</strong></p>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white shadow rounded-lg">
          <thead class="bg-red-100">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold text-red-700">Name</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-red-700">Category</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-red-700">Quantity</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-red-700">Price</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-red-700">Total Value</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map(item => `
              <tr class="border-b">
                <td class="px-6 py-4">${item.name}</td>
                <td class="px-6 py-4">${item.category}</td>
                <td class="px-6 py-4 text-red-600 font-semibold">${item.quantity}</td>
                <td class="px-6 py-4">$${item.price.toFixed(2)}</td>
                <td class="px-6 py-4">$${item.total_value.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    console.error('Error fetching low stock report:', error);
  }
}

function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById('loginUsername');
  const password = document.getElementById('loginPassword');

  // Define the button IDs
  const fullAccessBtns = ['ordBtn', 'reprBtn', 'empBtn', 'invBtn', 'repBtn'];
  const limitedAccessBtns = ['ordBtn', 'reprBtn'];

  // Access logic
  if (password.value === 'admin') {
    fullAccessBtns.forEach(id => {
      document.getElementById(id)?.classList.remove('hidden');
    });
    admin = true;

    document.getElementById('logoutBtn').classList.remove('hidden');

    showSection('orderHistory');
    
  } else if (password.value === '1234') {
    admin = false;
    limitedAccessBtns.forEach(id => {
      document.getElementById(id)?.classList.remove('hidden');
      document.getElementById('logoutBtn').classList.remove('hidden');
    });
    showSection('orderHistory');
  } else {
    alert('Incorrect password. Please try again.');
  }
}

function handleLogout() {
  // Hide all buttons
  const fullAccessBtns = ['ordBtn', 'reprBtn', 'empBtn', 'invBtn', 'repBtn'];
  fullAccessBtns.forEach(id => {
    document.getElementById(id)?.classList.add('hidden');
  });
  document.getElementById('logoutBtn').classList.add('hidden');
  
  admin = false
  document.getElementById('lowStockAlert').classList.add('hidden');
  document.getElementById('reportOutput').innerHTML = ''; // Clear report output
 
  showSection('login');
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');

  function updateButtonState() {
      const startFilled = startDateInput.value.trim() !== '';
      const endFilled = endDateInput.value.trim() !== '';
      const salesBtn = document.getElementById('salesBtn');
      const repairBtn = document.getElementById('repairBtn');
      const inventoryBtn = document.getElementById('inventoryBtn');

      const enable = startFilled && endFilled;
      salesBtn.disabled = !enable;
      repairBtn.disabled = !enable;
      inventoryBtn.disabled = !enable;

    }
  // Listen for changes
  startDateInput.addEventListener('input', updateButtonState);
  endDateInput.addEventListener('input', updateButtonState);


  showSection('login');
  document.getElementById("currentDate").textContent = new Date().toLocaleDateString();
});