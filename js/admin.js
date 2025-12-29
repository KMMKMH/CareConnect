// admin.js - Single Page Admin Management System

// PHP Database Simulation (Replace with actual PHP/MySQL)
const demoData = {
    admin: {
        id: 'ADM-001',
        name: 'Administrator',
        email: 'admin@careconnectplus.com',
        created: '2023-10-15',
        lastLogin: 'Just now'
    },

    statistics: {
        totalDoctors: 12,
        totalCategories: 8,
        todayAppointments: 18
    },

    doctors: [
        {
            id: 'DR-001',
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@hospital.com',
            phone: '+1 (555) 123-4567',
            specialty: 'Cardiology',
            experience: 15,
            status: 'active'
        },
        {
            id: 'DR-002',
            name: 'Dr. Michael Chen',
            email: 'michael.chen@hospital.com',
            phone: '+1 (555) 987-6543',
            specialty: 'Neurology',
            experience: 12,
            status: 'active'
        },
        {
            id: 'DR-003',
            name: 'Dr. Emily Davis',
            email: 'emily.davis@hospital.com',
            phone: '+1 (555) 456-7890',
            specialty: 'Ophthalmology',
            experience: 8,
            status: 'active'
        }
    ],

    categories: [
        {
            id: 'CAT-001',
            name: 'Cardiology',
            description: 'Heart and cardiovascular system specialists',
            doctorCount: 3
        },
        {
            id: 'CAT-002',
            name: 'Neurology',
            description: 'Brain and nervous system specialists',
            doctorCount: 2
        },
        {
            id: 'CAT-003',
            name: 'Ophthalmology',
            description: 'Eye care and vision specialists',
            doctorCount: 2
        },
        {
            id: 'CAT-004',
            name: 'Dermatology',
            description: 'Skin, hair, and nail specialists',
            doctorCount: 1
        },
        {
            id: 'CAT-005',
            name: 'Gastroenterology',
            description: 'Digestive system specialists',
            doctorCount: 1
        }
    ]
};

let currentData = JSON.parse(JSON.stringify(demoData)); // Deep copy for manipulation

document.addEventListener('DOMContentLoaded', function () {
    // Initialize everything
    loadAdminData();
    loadStatistics();
    loadDoctors();
    loadCategories();
    populateCategorySelect();

    // Update server time
    updateServerTime();
    setInterval(updateServerTime, 1000);

    // PHP Integration: Uncomment for real implementation
    /*
    fetchAdminData();
    fetchStatistics();
    fetchDoctors();
    fetchCategories();
    */
});

// ==================== ADMIN DATA FUNCTIONS ====================
function loadAdminData() {
    // PHP Spot 1: Replace with actual PHP fetch
    const admin = currentData.admin;

    document.getElementById('adminName').textContent = admin.name;
    document.getElementById('adminEmail').textContent = admin.email;
    document.getElementById('adminId').textContent = admin.id;
    document.getElementById('accountCreated').textContent = formatDate(admin.created);
    document.getElementById('lastLogin').textContent = admin.lastLogin;
}

function loadStatistics() {
    // PHP Spot 2: Replace with actual PHP fetch
    const stats = currentData.statistics;

    document.getElementById('totalDoctors').textContent = stats.totalDoctors;
    document.getElementById('totalCategories').textContent = stats.totalCategories;
    document.getElementById('todayAppointments').textContent = stats.todayAppointments;
}

// ==================== DOCTORS MANAGEMENT ====================
function loadDoctors() {
    const tbody = document.getElementById('doctorsTableBody');
    const doctors = currentData.doctors;

    if (doctors.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">
                    <i class="fas fa-user-md"></i>
                    <p>No doctors found. Add your first doctor!</p>
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    doctors.forEach(doctor => {
        html += `
            <tr data-id="${doctor.id}">
                <td><strong>${doctor.id}</strong></td>
                <td>
                    <div class="doctor-name">
                        <strong>${doctor.name}</strong>
                    </div>
                </td>
                <td>
                    <span class="specialty-badge">${doctor.specialty}</span>
                </td>
                <td>${doctor.email}</td>
                <td>${doctor.phone || 'N/A'}</td>
                <td>${doctor.experience || '0'} years</td>
                <td>
                    <span class="status-badge status-${doctor.status}">
                        ${doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit-btn" onclick="editDoctor('${doctor.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="confirmDeleteDoctor('${doctor.id}', '${doctor.name}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function showAddDoctorForm() {
    document.getElementById('addDoctorForm').style.display = 'block';
    document.getElementById('doctorName').focus();
}

function hideAddDoctorForm() {
    document.getElementById('addDoctorForm').style.display = 'none';
    document.getElementById('doctorForm').reset();
}

function addDoctor(event) {
    event.preventDefault();

    const formData = {
        id: 'DR-' + String(currentData.doctors.length + 1).padStart(3, '0'),
        name: document.getElementById('doctorName').value,
        email: document.getElementById('doctorEmail').value,
        phone: document.getElementById('doctorPhone').value,
        specialty: document.getElementById('doctorSpecialty').value,
        experience: parseInt(document.getElementById('doctorExperience').value) || 0,
        password: document.getElementById('doctorPassword').value,
        status: 'active'
    };

    // PHP Spot 3: Replace with actual PHP POST
    // Example: fetch('api/add-doctor.php', { method: 'POST', body: JSON.stringify(formData) })

    currentData.doctors.push(formData);
    currentData.statistics.totalDoctors++;

    // Update UI
    loadDoctors();
    loadStatistics();
    hideAddDoctorForm();

    // Show success message
    showNotification(`Doctor ${formData.name} added successfully!`, 'success');

    // PHP Spot 4: Here you would typically refresh the data from server
    // fetchDoctors();
}

function editDoctor(doctorId) {
    const doctor = currentData.doctors.find(d => d.id === doctorId);
    if (!doctor) return;

    const modal = document.getElementById('editDoctorModal');
    const form = document.getElementById('editDoctorForm');

    // Set doctor ID in hidden field
    document.getElementById('editDoctorId').value = doctor.id;

    // Create edit form content
    const formContent = `
        <div class="form-grid">
            <div class="form-group">
                <label for="editDoctorName">Full Name *</label>
                <input type="text" id="editDoctorName" name="doctorName" value="${doctor.name}" required>
            </div>
            <div class="form-group">
                <label for="editDoctorEmail">Email Address *</label>
                <input type="email" id="editDoctorEmail" name="doctorEmail" value="${doctor.email}" required>
            </div>
            <div class="form-group">
                <label for="editDoctorPhone">Phone Number</label>
                <input type="tel" id="editDoctorPhone" name="doctorPhone" value="${doctor.phone || ''}">
            </div>
            <div class="form-group">
                <label for="editDoctorSpecialty">Specialty *</label>
                <select id="editDoctorSpecialty" name="doctorSpecialty" required>
                    ${generateCategoryOptions(doctor.specialty)}
                </select>
            </div>
            <div class="form-group">
                <label for="editDoctorExperience">Experience (years)</label>
                <input type="number" id="editDoctorExperience" name="doctorExperience" 
                       value="${doctor.experience || 0}" min="0" max="50">
            </div>
            <div class="form-group">
                <label for="editDoctorStatus">Status</label>
                <select id="editDoctorStatus" name="doctorStatus">
                    <option value="active" ${doctor.status === 'active' ? 'selected' : ''}>Active</option>
                    <option value="inactive" ${doctor.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                </select>
            </div>
        </div>
    `;

    modal.querySelector('.modal-body').innerHTML = formContent;
    modal.classList.add('active');
}

function updateDoctor(event) {
    event.preventDefault();

    const doctorId = document.getElementById('editDoctorId').value;
    const doctorIndex = currentData.doctors.findIndex(d => d.id === doctorId);

    if (doctorIndex === -1) return;

    // PHP Spot 5: Replace with actual PHP PUT
    const updatedDoctor = {
        ...currentData.doctors[doctorIndex],
        name: document.getElementById('editDoctorName').value,
        email: document.getElementById('editDoctorEmail').value,
        phone: document.getElementById('editDoctorPhone').value,
        specialty: document.getElementById('editDoctorSpecialty').value,
        experience: parseInt(document.getElementById('editDoctorExperience').value) || 0,
        status: document.getElementById('editDoctorStatus').value
    };

    currentData.doctors[doctorIndex] = updatedDoctor;

    // Update UI
    loadDoctors();
    closeEditModal();

    // Show success message
    showNotification(`Doctor ${updatedDoctor.name} updated successfully!`, 'success');
}

function confirmDeleteDoctor(doctorId, doctorName) {
    const modal = document.getElementById('confirmModal');
    const confirmBtn = document.getElementById('confirmActionBtn');

    document.getElementById('confirmMessage').textContent =
        `Are you sure you want to delete ${doctorName}? This action cannot be undone.`;

    confirmBtn.onclick = () => deleteDoctor(doctorId);
    modal.classList.add('active');
}

function deleteDoctor(doctorId) {
    // PHP Spot 6: Replace with actual PHP DELETE
    // Example: fetch(`api/delete-doctor.php?id=${doctorId}`, { method: 'DELETE' })

    const doctorIndex = currentData.doctors.findIndex(d => d.id === doctorId);
    if (doctorIndex === -1) return;

    const doctorName = currentData.doctors[doctorIndex].name;
    currentData.doctors.splice(doctorIndex, 1);
    currentData.statistics.totalDoctors--;

    // Update UI
    loadDoctors();
    loadStatistics();
    closeConfirmModal();

    // Show success message
    showNotification(`Doctor ${doctorName} deleted successfully!`, 'success');
}

// ==================== CATEGORIES MANAGEMENT ====================
function loadCategories() {
    const grid = document.getElementById('categoriesGrid');
    const categories = currentData.categories;

    if (categories.length === 0) {
        grid.innerHTML = `
            <div class="category-card empty-card">
                <i class="fas fa-folder-plus"></i>
                <p>No categories found. Add your first category!</p>
            </div>
        `;
        return;
    }

    let html = '';
    categories.forEach(category => {
        html += `
            <div class="category-card" data-id="${category.id}">
                <div class="category-header">
                    <h4 class="category-name">${category.name}</h4>
                    <span class="category-doctor-count">
                        ${category.doctorCount} doctor${category.doctorCount !== 1 ? 's' : ''}
                    </span>
                </div>
                <p class="category-description">${category.description || 'No description available.'}</p>
                <div class="category-actions">
                    <button class="action-btn delete-btn" onclick="confirmDeleteCategory('${category.id}', '${category.name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    grid.innerHTML = html;
}

function showAddCategoryForm() {
    document.getElementById('addCategoryForm').style.display = 'block';
    document.getElementById('categoryName').focus();
}

function hideAddCategoryForm() {
    document.getElementById('addCategoryForm').style.display = 'none';
    document.getElementById('categoryForm').reset();
}

function addCategory(event) {
    event.preventDefault();

    const formData = {
        id: 'CAT-' + String(currentData.categories.length + 1).padStart(3, '0'),
        name: document.getElementById('categoryName').value,
        description: document.getElementById('categoryDescription').value,
        doctorCount: 0
    };

    // PHP Spot 7: Replace with actual PHP POST
    currentData.categories.push(formData);
    currentData.statistics.totalCategories++;

    // Update UI
    loadCategories();
    loadStatistics();
    populateCategorySelect();
    hideAddCategoryForm();

    // Show success message
    showNotification(`Category "${formData.name}" added successfully!`, 'success');
}

function confirmDeleteCategory(categoryId, categoryName) {
    // Check if category has doctors
    const category = currentData.categories.find(c => c.id === categoryId);
    if (category && category.doctorCount > 0) {
        showNotification(`Cannot delete "${categoryName}" because it has ${category.doctorCount} doctor(s) assigned.`, 'error');
        return;
    }

    const modal = document.getElementById('confirmModal');
    const confirmBtn = document.getElementById('confirmActionBtn');

    document.getElementById('confirmMessage').textContent =
        `Are you sure you want to delete "${categoryName}"?`;

    confirmBtn.onclick = () => deleteCategory(categoryId);
    modal.classList.add('active');
}

function deleteCategory(categoryId) {
    // PHP Spot 8: Replace with actual PHP DELETE
    const categoryIndex = currentData.categories.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) return;

    const categoryName = currentData.categories[categoryIndex].name;
    currentData.categories.splice(categoryIndex, 1);
    currentData.statistics.totalCategories--;

    // Update UI
    loadCategories();
    loadStatistics();
    populateCategorySelect();
    closeConfirmModal();

    // Show success message
    showNotification(`Category "${categoryName}" deleted successfully!`, 'success');
}

// ==================== HELPER FUNCTIONS ====================
function populateCategorySelect() {
    const select = document.getElementById('doctorSpecialty');
    select.innerHTML = '<option value="">Select specialty</option>';

    currentData.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

function generateCategoryOptions(selectedValue) {
    let options = '<option value="">Select specialty</option>';
    currentData.categories.forEach(category => {
        options += `<option value="${category.name}" ${category.name === selectedValue ? 'selected' : ''}>
                       ${category.name}
                    </option>`;
    });
    return options;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function updateServerTime() {
    const now = new Date();
    document.getElementById('serverTime').textContent =
        now.toLocaleTimeString('en-US', { hour12: false });
}

function logout() {
    // PHP Spot 9: Clear session and redirect
    // Example: fetch('api/logout.php').then(() => window.location.href = 'login.html');
    closeConfirmModal();
    showNotification('Logging out...', 'info');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

function confirmLogout() {
    const modal = document.getElementById('confirmModal');
    const confirmBtn = document.getElementById('confirmActionBtn');

    document.getElementById('confirmMessage').textContent =
        `Are you sure you want to logout?`;

    confirmBtn.onclick = () => logout();
    modal.classList.add('active');
}

function closeEditModal() {
    document.getElementById('editDoctorModal').classList.remove('active');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' :
            type === 'error' ? 'exclamation-circle' :
                'info-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Add notification styles
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        background: white;
        box-shadow: 0 5px 20px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        border-left: 4px solid var(--primary-color);
    }
    
    .notification-success {
        border-left-color: var(--secondary-color);
    }
    
    .notification-error {
        border-left-color: var(--danger-color);
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification-success i {
        color: var(--secondary-color);
    }
    
    .notification-error i {
        color: var(--danger-color);
    }
    
    .notification span {
        font-weight: 500;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(notificationStyle);

// PHP Fetch Functions Template
async function fetchAdminData() {
    /*
    try {
        const response = await fetch('api/get-admin-data.php');
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('adminName').textContent = data.admin.name;
            document.getElementById('adminEmail').textContent = data.admin.email;
            document.getElementById('adminId').textContent = data.admin.id;
            document.getElementById('accountCreated').textContent = formatDate(data.admin.created_at);
            document.getElementById('lastLogin').textContent = data.admin.last_login;
        }
    } catch (error) {
        console.error('Error fetching admin data:', error);
        showNotification('Failed to load admin data', 'error');
    }
    */
}

async function fetchStatistics() {
    /*
    try {
        const response = await fetch('api/get-statistics.php');
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('totalDoctors').textContent = data.doctors_count;
            document.getElementById('totalCategories').textContent = data.categories_count;
            document.getElementById('todayAppointments').textContent = data.today_appointments;
        }
    } catch (error) {
        console.error('Error fetching statistics:', error);
        showNotification('Failed to load statistics', 'error');
    }
    */
}

async function fetchDoctors() {
    /*
    try {
        const response = await fetch('api/get-doctors.php');
        const data = await response.json();
        
        if (data.success) {
            currentData.doctors = data.doctors;
            loadDoctors();
        }
    } catch (error) {
        console.error('Error fetching doctors:', error);
        showNotification('Failed to load doctors', 'error');
    }
    */
}

async function fetchCategories() {
    /*
    try {
        const response = await fetch('api/get-categories.php');
        const data = await response.json();
        
        if (data.success) {
            currentData.categories = data.categories;
            loadCategories();
            populateCategorySelect();
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        showNotification('Failed to load categories', 'error');
    }
    */
}