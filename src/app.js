// Data storage
let employees = [{
  id: 'emp001',
  status: 'Active',
  name: 'Carlos Rivera',
  position: 'Sales Manager',
  email: 'carlos@motostore.com',
  phone: '555-1234'
},
{
  id: 'emp002',
  status: 'Active',
  name: 'Tanya Blake',
  position: 'Parts Specialist',
  email: 'tanya@motostore.com',
  phone: '555-5678'
},
{
  id: 'emp003',
  status: 'Inactive',
  name: 'Jason Lee',
  position: 'Motorbike Technician',
  email: 'jason@motostore.com',
  phone: '555-9012'
},
{
  id: 'emp004',
  status: 'Active',
  name: 'Nina Patel',
  position: 'Customer Service Representative',
  email: 'nina@motostore.com',
  phone: '555-3456'
},
{
  id: 'emp005',
  status: 'Active',
  name: 'Miguel Santos',
  position: 'Repair Shop Lead',
  email: 'miguel@motostore.com',
  phone: '555-7890'
},
{
  id: 'emp006',
  status: 'Active',
  name: 'Ashley Chen',
  position: 'Inventory Coordinator',
  email: 'ashley@motostore.com',
  phone: '555-2345'
},
{
  id: 'emp007',
  status: 'Inactive',
  name: 'Robert Knight',
  position: 'Motorbike Sales Associate',
  email: 'robert@motostore.com',
  phone: '555-6789'
}];

let inventory = [
  // Motorbikes
  { id: "1", name: "Yamaha R3", category: "Motorbike", price: 5500, quantity: 3, manufacturer: "Yamaha", model: "YZF-R3" },
  { id: "2", name: "Kawasaki Ninja 400", category: "Motorbike", price: 5999, quantity: 2, manufacturer: "Kawasaki", model: "Ninja 400" },
  { id: "3", name: "Honda CBR500R", category: "Motorbike", price: 7200, quantity: 4, manufacturer: "Honda", model: "CBR500R" },
  { id: "4", name: "Suzuki GSX-R600", category: "Motorbike", price: 11500, quantity: 1, manufacturer: "Suzuki", model: "GSX-R600" },
  { id: "5", name: "KTM Duke 390", category: "Motorbike", price: 5799, quantity: 3, manufacturer: "KTM", model: "Duke 390" },

  // Parts
  { id: "6", name: "Brake Pads", category: "Parts", price: 45, quantity: 20, manufacturer: "Brembo", model: "Universal" },
  { id: "7", name: "Chain Kit", category: "Parts", price: 75, quantity: 15, manufacturer: "DID", model: "Universal" },
  { id: "8", name: "Air Filter", category: "Parts", price: 30, quantity: 25, manufacturer: "K&N", model: "Universal" },
  { id: "9", name: "Clutch Lever", category: "Parts", price: 40, quantity: 10, manufacturer: "ASV", model: "Universal" },
  { id: "10", name: "Engine Oil", category: "Parts", price: 10, quantity: 50, manufacturer: "Motul", model: "10W-40" }
];

// Navigation
function showSection(sectionId) {
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
    renderInventory();
  }
  if (sectionId === 'repairs') {
    renderRepairs();
  }
  if (sectionId === 'employees') {
    renderEmployees();
  }
  if (sectionId === 'order') {
    renderOrders();
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
function edit(event) {
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
        <td class="px-6 py-4">${item.email}</td>
        <td class="px-6 py-4">${item.phone}</td>
        <td class="px-6 py-4">
          <button onclick="deleteEmployee('${item.id}')" class="text-red-600 hover:text-red-800">Delete</button>
        </td>
      </tr>` 
      ).join('');
}

// Employee management
function handleAddEmployee(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const employee = {
    id: Date.now().toString(),
    name: formData.get('name'),
    position: formData.get('position'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    hireDate: new Date().toISOString().split('T')[0]
  };
  
  employees.push(employee);
  renderEmployees();
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
      <td class="px-6 py-4" contenteditable="false">${employee.email}</td>
      <td class="px-6 py-4" contenteditable="false">${employee.phone}</td>
      <td class="px-6 py-4 flex gap-2">
        <button onclick="edit(event)" class="text-blue-600 hover:text-blue-800">Edit</button>
        <button onclick="deleteEmployee('${employee.id}')" class="text-red-600 hover:text-red-800">Del</button>
      </td>
    </tr>
  `).join('');
}

function toggleStatus(event) {
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
  }
}
						
function deleteEmployee(id) {
  employees = employees.filter(employee => employee.id !== id);
  renderEmployees();
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
        <td class="px-6 py-4">${item.model}</td>
        <td class="px-6 py-4">${item.name}</td>
        <td class="px-6 py-4">${item.category}</td>
        <td class="px-6 py-4">$${item.price.toFixed(2)}</td>
        <td class="px-6 py-4">${item.quantity}</td>
        <td class="px-6 py-4">
          <button onclick="deleteInventoryItem('${item.id}')" class="text-red-600 hover:text-red-800">Delete</button>
        </td>
      </tr>
    `).join('');
}

// Inventory management
function handleAddInventoryItem(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const item = {
    id: Date.now().toString(),
    name: formData.get('name'),
    category: formData.get('category'),
    price: parseFloat(formData.get('price')),
    quantity: parseInt(formData.get('quantity')),
    manufacturer: formData.get('manufacturer'),
    partNumber: formData.get('partNumber'),
    model: formData.get('model')
  };
  
  inventory.push(item);
  renderInventory();
  hideModal('addInventoryModal');
  event.target.reset();
}

function renderInventory() {
  const tbody = document.getElementById('inventoryTableBody');
  tbody.innerHTML = inventory.map(item => `
    <tr>
      <td class="px-6 py-4">${item.manufacturer}</td>
      <td class="px-6 py-4">${item.model}</td>
      <td class="px-6 py-4">${item.name}</td>
      <td class="px-6 py-4">${item.category}</td>
      <td class="px-6 py-4">$${item.price.toFixed(2)}</td>
      <td class="px-6 py-4">${item.quantity}</td>
      <td class="px-6 py-4 flex gap-2">
        <button onclick="edit(event)" class="text-blue-600 hover:text-blue-800">Edit</button>
        <button onclick="deleteInventoryItem('${item.id}')" class="text-red-600 hover:text-red-800">Del</button>
      </td>
    </tr>
  `).join('');
}

function deleteInventoryItem(id) {
  inventory = inventory.filter(item => item.id !== id);
  renderInventory();
}

// Repair management
function handleAddRepair(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const repair = {
    id: Date.now().toString(),
    customerName: formData.get('customerName'),
    vehicleInfo: formData.get('vehicleInfo'),
    description: formData.get('description'),
    status: 'pending',
    assignedTo: formData.get('assignedTo'),
    scheduledDate: formData.get('scheduledDate'),
    estimatedCompletion: formData.get('estimatedCompletion'),
    price: parseFloat(formData.get('price')),
  };
  
  repairs.push(repair);
  renderRepairs();
  hideModal('addRepairModal');
  event.target.reset();
}

function renderRepairs() {
  const board = document.getElementById('repairsBoard');
  board.innerHTML = repairs.map(repair => `
    <div class="bg-white p-4 rounded-lg shadow-md">
      <div class="flex justify-between items-start mb-4">
        <h3 class="font-semibold">${repair.customerName}</h3>
        <span class="px-2 py-1 rounded text-sm ${getStatusColor(repair.status)}">${repair.status}</span>
      </div>
      <p class="text-sm text-gray-600 mb-2">${repair.vehicleInfo}</p>
      <p class="text-sm mb-4">${repair.description}</p>
      <div class="text-sm text-gray-500">
        <p>Assigned to: ${repair.assignedTo}</p>
        <p>Scheduled: ${repair.scheduledDate}</p>
        <p>Est. Completion: ${repair.estimatedCompletion}</p>
      </div>
      <div class="mt-4 flex justify-between space-x-2">
        <h1 class="text-xl font-black col text-green-500">$${repair.price}</h1>
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

function updateRepairStatus(id) {
  const repair = repairs.find(r => r.id === id);
  const statusOrder = ['pending', 'in-progress', 'completed'];
  const currentIndex = statusOrder.indexOf(repair.status);
  repair.status = statusOrder[(currentIndex + 1) % statusOrder.length];
  renderRepairs();
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

function handleAddOrder(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const order = {
    id: Date.now().toString(),
    customerName: formData.get('customerName'),
    items: Array.from(document.querySelectorAll("#cartItemsBody tr")).map(row => ({
      name: row.querySelector("td").textContent,
      quantity: row.querySelector(".orderQuantity").value,
      price: parseFloat(row.querySelector(".orderPrice").getAttribute("data-price"))
    })),
    totalPrice: parseFloat(document.getElementById("totalPrice").value.replace('$', '')),
    orderDate: new Date().toISOString().split('T')[0]
  };
  
  orders.push(order);
  alert(`Order for ${order.customerName} has been placed.`);
  event.target.reset();
  document.getElementById("cartItemsBody").innerHTML = ''; // Clear cart items
}

function deleteOrder(id) {
  orders = orders.filter(order => order.id !== id);
  renderOrders();
}

function cancelOrder(event){
  event.preventDefault();
  document.getElementById("cartItemsBody").innerHTML = ''; // Clear cart items
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
      <tr>
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

  const itemName = cells[0].textContent;
  const itemPrice = parseFloat(cells[2].textContent.replace('$', '')).toFixed(2);

  orderItem.className = "mb-2";
  orderItem.innerHTML = `
      <td class="px-6 py-4">${itemName}</td>
      <td class="px-6 py-4"><input type="number" class="orderQuantity w-16 text-center" value="1" min="1" onchange="calculateTotal()" /></td>
      <td class="px-6 py-4 orderPrice" data-price="${itemPrice}">$${itemPrice}</td>
      <td class="px-6 py-4"><button class="text-red-600 hover:text-red-800" onclick="removeOrderItem(event)">Remove</button></td>
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



// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  showSection('employees');
  document.getElementById("currentDate").textContent = new Date().toLocaleDateString();
});