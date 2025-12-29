// doctor.js - Doctor Dashboard

// Demo Data
const demoData = {
    doctor: {
        id: 'DR-001',
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@careconnectplus.com',
        phone: '+1 (555) 123-4567',
        specialty: 'Cardiology',
        experience: 15,
        status: 'active'
    },
    
    statistics: {
        scheduled: 8,
        waiting: 3,
        completed: 5,
        nextPatient: '15 min'
    },
    
    patients: [
        {
            id: 'PAT-001',
            name: 'John Doe',
            time: '09:30 AM',
            reason: 'Chest pain and shortness of breath',
            history: 'Hypertension, High cholesterol',
            status: 'waiting'
        },
        {
            id: 'PAT-002',
            name: 'Mary Smith',
            time: '10:15 AM',
            reason: 'Routine checkup',
            history: 'Diabetes type 2',
            status: 'scheduled'
        },
        {
            id: 'PAT-003',
            name: 'Robert Johnson',
            time: '11:00 AM',
            reason: 'Follow-up appointment',
            history: 'Previous heart surgery (2021)',
            status: 'in_progress'
        },
        {
            id: 'PAT-004',
            name: 'Lisa Wilson',
            time: '02:30 PM',
            reason: 'ECG test results review',
            history: 'Family history of heart disease',
            status: 'scheduled'
        },
        {
            id: 'PAT-005',
            name: 'Michael Brown',
            time: '03:15 PM',
            reason: 'Blood pressure monitoring',
            history: 'Obesity, Sleep apnea',
            status: 'completed'
        }
    ]
};

let currentData = JSON.parse(JSON.stringify(demoData));
let currentPatientId = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize everything
    loadDoctorData();
    loadStatistics();
    loadPatients();
    updateCurrentTime();
    
    // Update time every second
    setInterval(updateCurrentTime, 1000);
    
    // PHP Integration: Uncomment for real implementation
    /*
    fetchDoctorData();
    fetchStatistics();
    fetchPatients();
    */
});

// ==================== DOCTOR DATA ====================
function loadDoctorData() {
    const doctor = currentData.doctor;
    
    document.getElementById('doctorName').textContent = doctor.name;
    document.getElementById('doctorSpecialty').textContent = doctor.specialty;
    document.getElementById('doctorId').textContent = doctor.id;
    document.getElementById('doctorEmail').textContent = doctor.email;
    document.getElementById('doctorPhone').textContent = doctor.phone;
    document.getElementById('doctorExperience').textContent = doctor.experience + ' years';
}

function loadStatistics() {
    const stats = currentData.statistics;
    
    document.getElementById('scheduledAppointments').textContent = stats.scheduled;
    document.getElementById('waitingPatients').textContent = stats.waiting;
    document.getElementById('completedToday').textContent = stats.completed;
    document.getElementById('nextPatientTime').textContent = stats.nextPatient;
}

// ==================== PROFILE MANAGEMENT ====================
function showEditProfileForm() {
    const doctor = currentData.doctor;
    
    document.getElementById('editFullName').value = doctor.name;
    document.getElementById('editEmail').value = doctor.email;
    document.getElementById('editPhone').value = doctor.phone;
    document.getElementById('editSpecialty').value = doctor.specialty;
    document.getElementById('editExperience').value = doctor.experience;
    
    document.getElementById('editProfileForm').style.display = 'block';
    document.getElementById('editFullName').focus();
}

function hideEditProfileForm() {
    document.getElementById('editProfileForm').style.display = 'none';
    document.getElementById('profileForm').reset();
}

function updateProfile(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    
    // PHP Spot 1: Verify current password with database
    if (currentPassword !== 'doctor123') { // Demo password
        showNotification('Current password is incorrect', 'error');
        return;
    }
    
    const updatedDoctor = {
        ...currentData.doctor,
        name: document.getElementById('editFullName').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        experience: parseInt(document.getElementById('editExperience').value) || 0
    };
    
    // PHP Spot 2: Update doctor in database
    // fetch('api/update-doctor.php', { method: 'POST', body: JSON.stringify(updatedDoctor) })
    
    currentData.doctor = updatedDoctor;
    
    // Update UI
    loadDoctorData();
    hideEditProfileForm();
    
    // Show success
    showNotification('Profile updated successfully!', 'success');
}

function showChangePasswordForm() {
    document.getElementById('changePasswordForm').style.display = 'block';
    document.getElementById('oldPassword').focus();
}

function hideChangePasswordForm() {
    document.getElementById('changePasswordForm').style.display = 'none';
    document.getElementById('passwordForm').reset();
}

function changePassword(event) {
    event.preventDefault();
    
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (newPassword.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    
    // PHP Spot 3: Verify old password and update
    if (oldPassword !== 'doctor123') { // Demo password
        showNotification('Current password is incorrect', 'error');
        return;
    }
    
    // In real app: fetch('api/change-password.php', { method: 'POST', body: JSON.stringify({ newPassword }) })
    
    hideChangePasswordForm();
    showNotification('Password changed successfully!', 'success');
}

// ==================== PATIENT MANAGEMENT ====================
function loadPatients() {
    const tbody = document.getElementById('patientsTableBody');
    const patients = currentData.patients;
    
    if (patients.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <i class="fas fa-user-injured"></i>
                    <p>No patients scheduled for today.</p>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    patients.forEach(patient => {
        const statusBadge = getStatusBadge(patient.status);
        
        html += `
            <tr data-id="${patient.id}">
                <td><strong>${patient.id}</strong></td>
                <td>
                    <div class="patient-name">
                        <strong>${patient.name}</strong>
                    </div>
                </td>
                <td>${patient.time}</td>
                <td>${patient.reason}</td>
                <td>${patient.history}</td>
                <td>
                    ${statusBadge}
                </td>
                <td>
                    <div class="patient-actions">
                        <button class="view-btn" onclick="viewPatientDetails('${patient.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="status-btn" onclick="updatePatientStatus('${patient.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    updatePatientSelect();
}

function getStatusBadge(status) {
    const badges = {
        'waiting': '<span class="status-badge status-waiting">Waiting</span>',
        'scheduled': '<span class="status-badge status-waiting">Scheduled</span>',
        'in_progress': '<span class="status-badge status-in-progress">In Progress</span>',
        'completed': '<span class="status-badge status-completed">Completed</span>',
        'cancelled': '<span class="status-badge status-cancelled">Cancelled</span>'
    };
    
    return badges[status] || '<span class="status-badge status-waiting">Scheduled</span>';
}

function filterPatients() {
    const filter = document.getElementById('patientFilter').value;
    const rows = document.querySelectorAll('#patientsTableBody tr');
    
    rows.forEach(row => {
        if (filter === 'all') {
            row.style.display = '';
        } else {
            const status = row.querySelector('.status-badge').textContent.toLowerCase();
            row.style.display = status.includes(filter) ? '' : 'none';
        }
    });
}

function refreshPatients() {
    // PHP Spot 4: Fetch updated patients from database
    // fetchPatients();
    
    showNotification('Patients list refreshed', 'info');
}

function viewPatientDetails(patientId) {
    const patient = currentData.patients.find(p => p.id === patientId);
    if (!patient) return;
    
    currentPatientId = patientId;
    
    const detailsContent = `
        <div class="patient-info-card">
            <h4>Patient Information</h4>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Patient ID:</span>
                    <span class="info-value">${patient.id}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Full Name:</span>
                    <span class="info-value">${patient.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Appointment Time:</span>
                    <span class="info-value">${patient.time}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Current Status:</span>
                    <span class="info-value">${getStatusText(patient.status)}</span>
                </div>
            </div>
        </div>
        
        <div class="patient-info-card">
            <h4>Medical Information</h4>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Reason for Visit:</span>
                    <span class="info-value">${patient.reason}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Medical History:</span>
                    <span class="info-value">${patient.history}</span>
                </div>
            </div>
        </div>
        
        <div class="patient-info-card">
            <h4>Doctor's Notes</h4>
            <div class="form-group">
                <textarea id="doctorNotesInput" rows="6" placeholder="Add your notes here...">No notes yet.</textarea>
            </div>
            <div class="form-actions" style="margin-top: 20px;">
                <button class="action-btn" onclick="savePatientNotes()">
                    <i class="fas fa-save"></i> Save Notes
                </button>
                <button class="action-btn" onclick="showAddPrescriptionForPatient()">
                    <i class="fas fa-prescription"></i> Add Prescription
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('patientDetailsContent').innerHTML = detailsContent;
    document.getElementById('patientDetailsSection').style.display = 'block';
}

function getStatusText(status) {
    const statusMap = {
        'waiting': 'Waiting',
        'scheduled': 'Scheduled',
        'in_progress': 'In Progress',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    
    return statusMap[status] || 'Scheduled';
}

function hidePatientDetails() {
    document.getElementById('patientDetailsSection').style.display = 'none';
}

function savePatientNotes() {
    const notes = document.getElementById('doctorNotesInput').value;
    
    // PHP Spot 5: Save notes to database
    // fetch(`api/save-notes.php?patientId=${currentPatientId}`, { 
    //     method: 'POST', 
    //     body: JSON.stringify({ notes }) 
    // })
    
    showNotification('Notes saved successfully', 'success');
}

// ==================== APPOINTMENT STATUS ====================
function updatePatientStatus(patientId) {
    const patient = currentData.patients.find(p => p.id === patientId);
    if (!patient) return;
    
    currentPatientId = patientId;
    
    document.getElementById('statusModalTitle').textContent = `Update Status for ${patient.name}`;
    document.getElementById('statusSelect').value = patient.status;
    document.getElementById('statusModal').classList.add('active');
}

function updateAppointmentStatus() {
    const newStatus = document.getElementById('statusSelect').value;
    const notes = document.getElementById('doctorNotes').value;
    
    const patientIndex = currentData.patients.findIndex(p => p.id === currentPatientId);
    if (patientIndex === -1) return;
    
    // PHP Spot 6: Update status in database
    // fetch(`api/update-appointment.php?id=${currentPatientId}`, {
    //     method: 'POST',
    //     body: JSON.stringify({ status: newStatus, notes })
    // })
    
    currentData.patients[patientIndex].status = newStatus;
    
    // Update statistics if status changed to completed
    if (newStatus === 'completed') {
        currentData.statistics.completed++;
        currentData.statistics.waiting = Math.max(0, currentData.statistics.waiting - 1);
        loadStatistics();
    }
    
    // Update UI
    loadPatients();
    closeStatusModal();
    
    showNotification(`Appointment status updated to ${getStatusText(newStatus)}`, 'success');
}

function closeStatusModal() {
    document.getElementById('statusModal').classList.remove('active');
    document.getElementById('doctorNotes').value = '';
}

// ==================== PRESCRIPTION MANAGEMENT ====================
function showAddPrescription() {
    document.getElementById('prescriptionForm').style.display = 'block';
    document.getElementById('medicationName').focus();
}

function showAddPrescriptionForPatient() {
    document.getElementById('prescriptionPatientId').value = currentPatientId;
    showAddPrescription();
}

function hidePrescriptionForm() {
    document.getElementById('prescriptionForm').style.display = 'none';
    document.getElementById('prescriptionFormData').reset();
}

function addPrescription(event) {
    event.preventDefault();
    
    const patientId = document.getElementById('prescriptionPatientId').value || 
                      document.getElementById('patientSelect').value;
    const patient = currentData.patients.find(p => p.id === patientId);
    
    const prescription = {
        patientId: patientId,
        patientName: patient ? patient.name : 'Selected Patient',
        date: document.getElementById('prescriptionDate').value,
        medication: document.getElementById('medicationName').value,
        dosage: document.getElementById('dosage').value,
        notes: document.getElementById('additionalNotes').value,
        doctor: currentData.doctor.name,
        timestamp: new Date().toLocaleString()
    };
    
    // PHP Spot 7: Save prescription to database
    // fetch('api/add-prescription.php', {
    //     method: 'POST',
    //     body: JSON.stringify(prescription)
    // })
    
    // Show success modal
    document.getElementById('prescriptionSuccessMessage').textContent = 
        `Prescription added for ${prescription.patientName}`;
    
    document.getElementById('prescriptionDetails').innerHTML = `
        <p><strong>Medication:</strong> ${prescription.medication}</p>
        <p><strong>Dosage:</strong> ${prescription.dosage}</p>
        <p><strong>Date:</strong> ${prescription.date}</p>
        <p><strong>Prescribed by:</strong> ${prescription.doctor}</p>
    `;
    
    document.getElementById('prescriptionSuccessModal').classList.add('active');
    hidePrescriptionForm();
}

function closePrescriptionSuccess() {
    document.getElementById('prescriptionSuccessModal').classList.remove('active');
}

function printPrescription() {
    // In real implementation, generate printable prescription
    window.print();
}

function updatePatientSelect() {
    const select = document.getElementById('patientSelect');
    select.innerHTML = '<option value="">Select a patient</option>';
    
    currentData.patients.forEach(patient => {
        const option = document.createElement('option');
        option.value = patient.id;
        option.textContent = `${patient.name} (${patient.time})`;
        select.appendChild(option);
    });
}

// ==================== HELPER FUNCTIONS ====================
function updateCurrentTime() {
    const now = new Date();
    document.getElementById('currentTime').textContent = 
        now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
        });
}

function logout() {
    // PHP Spot 8: Clear session and redirect
    // fetch('api/logout.php').then(() => window.location.href = 'login.html');
    
    if (confirm('Are you sure you want to logout?')) {
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

function markAsAway() {
    const currentStatus = document.querySelector('.status-active').textContent;
    const newStatus = currentStatus === 'Available' ? 'Away' : 'Available';
    
    document.querySelector('.status-active').textContent = newStatus;
    document.querySelector('.status-active').style.background = 
        newStatus === 'Available' ? 'rgba(67, 206, 162, 0.1)' : 'rgba(241, 196, 15, 0.1)';
    document.querySelector('.status-active').style.color = 
        newStatus === 'Available' ? 'var(--secondary-color)' : '#f39c12';
    
    showNotification(`Status changed to ${newStatus}`, 'info');
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
        border-left-color: #e74c3c;
    }
    
    .notification-info {
        border-left-color: var(--primary-color);
    }
    
    .notification i {
        font-size: 1.2rem;
    }
    
    .notification-success i {
        color: var(--secondary-color);
    }
    
    .notification-error i {
        color: #e74c3c;
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