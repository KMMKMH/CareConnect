// book.js - Booking Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('appointmentDate').min = today;
    
    // Simple doctor data - Will be replaced with PHP fetch
    const doctorData = {
        'cardiology': [
            { id: 'dr1', name: 'Dr. Sarah Johnson', specialty: 'Cardiologist' },
            { id: 'dr2', name: 'Dr. Michael Chen', specialty: 'Heart Surgeon' }
        ],
        'neurology': [
            { id: 'dr3', name: 'Dr. Robert Williams', specialty: 'Neurologist' },
            { id: 'dr4', name: 'Dr. Emily Davis', specialty: 'Neurosurgeon' }
        ],
        'ophthalmology': [
            { id: 'dr5', name: 'Dr. James Wilson', specialty: 'Ophthalmologist' }
        ],
        'gastroenterology': [
            { id: 'dr6', name: 'Dr. Lisa Brown', specialty: 'Gastroenterologist' }
        ],
        'dermatology': [
            { id: 'dr7', name: 'Dr. Amanda Taylor', specialty: 'Dermatologist' }
        ],
        'trichology': [
            { id: 'dr8', name: 'Dr. David Miller', specialty: 'Trichologist' }
        ],
        'general': [
            { id: 'dr9', name: 'Dr. Susan Lee', specialty: 'General Physician' }
        ]
    };

    // DOM Elements
    const categorySelect = document.getElementById('category');
    const doctorSelect = document.getElementById('doctor');
    const appointmentDate = document.getElementById('appointmentDate');
    const appointmentTime = document.getElementById('appointmentTime');
    const bookingForm = document.getElementById('bookingForm');
    const successMessage = document.getElementById('successMessage');
    const closeSuccessBtn = document.getElementById('closeSuccess');
    const selectedDoctorName = document.getElementById('selectedDoctorName');
    const selectedDate = document.getElementById('selectedDate');
    const selectedTime = document.getElementById('selectedTime');
    const appointmentId = document.getElementById('appointmentId');

    // Category change handler
    categorySelect.addEventListener('change', function() {
        const category = this.value;
        
        // Clear previous doctor options
        doctorSelect.innerHTML = '<option value="">Select a doctor</option>';
        selectedDoctorName.textContent = 'None selected';
        
        // Add error class if empty
        if (!category) {
            categorySelect.classList.add('input-error');
        } else {
            categorySelect.classList.remove('input-error');
            
            // Populate doctors for selected category
            if (doctorData[category]) {
                doctorData[category].forEach(doctor => {
                    const option = document.createElement('option');
                    option.value = doctor.id;
                    option.textContent = `${doctor.name} - ${doctor.specialty}`;
                    option.dataset.doctorName = doctor.name;
                    doctorSelect.appendChild(option);
                });
            }
        }
    });

    // Doctor change handler
    doctorSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        
        if (selectedOption.value) {
            const doctorName = selectedOption.dataset.doctorName || selectedOption.text;
            selectedDoctorName.textContent = doctorName;
            this.classList.remove('input-error');
        } else {
            selectedDoctorName.textContent = 'None selected';
        }
    });

    // Date change handler
    appointmentDate.addEventListener('change', function() {
        if (this.value) {
            const date = new Date(this.value);
            const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            selectedDate.textContent = formattedDate;
            this.classList.remove('input-error');
        } else {
            selectedDate.textContent = 'Not selected';
        }
    });

    // Time change handler
    appointmentTime.addEventListener('change', function() {
        if (this.value) {
            const timeText = this.options[this.selectedIndex].text;
            selectedTime.textContent = timeText;
            this.classList.remove('input-error');
        } else {
            selectedTime.textContent = 'Not selected';
        }
    });

    // Input validation helper
    function validateInput(input) {
        if (!input.value.trim()) {
            input.classList.add('input-error');
            return false;
        } else {
            input.classList.remove('input-error');
            return true;
        }
    }

    // Email validation
    function validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Phone validation (basic)
    function validatePhone(phone) {
        const phonePattern = /^[\d\s\-\+\(\)]{10,}$/;
        return phonePattern.test(phone.replace(/\D/g, ''));
    }

    // Form submission handler
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset all errors
        const allInputs = this.querySelectorAll('input, select, textarea');
        allInputs.forEach(input => input.classList.remove('input-error'));
        
        // Validate required fields
        const requiredFields = [
            { id: 'patientName', name: 'Patient Name' },
            { id: 'patientEmail', name: 'Email' },
            { id: 'patientPhone', name: 'Phone Number' },
            { id: 'reason', name: 'Reason for Visit' },
            { id: 'category', name: 'Medical Category' },
            { id: 'doctor', name: 'Doctor' },
            { id: 'appointmentDate', name: 'Appointment Date' },
            { id: 'appointmentTime', name: 'Appointment Time' }
        ];
        
        let isValid = true;
        let errorMessages = [];
        
        requiredFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!validateInput(element)) {
                isValid = false;
                errorMessages.push(`${field.name} is required`);
            }
        });
        
        // Validate email format
        const email = document.getElementById('patientEmail').value;
        if (email && !validateEmail(email)) {
            isValid = false;
            document.getElementById('patientEmail').classList.add('input-error');
            errorMessages.push('Please enter a valid email address');
        }
        
        // Validate phone format
        const phone = document.getElementById('patientPhone').value;
        if (phone && !validatePhone(phone)) {
            isValid = false;
            document.getElementById('patientPhone').classList.add('input-error');
            errorMessages.push('Please enter a valid phone number');
        }
        
        if (isValid) {
            // Prepare data for PHP (will be AJAX call later)
            const formData = {
                patientName: document.getElementById('patientName').value,
                patientEmail: document.getElementById('patientEmail').value,
                patientPhone: document.getElementById('patientPhone').value,
                reason: document.getElementById('reason').value,
                category: document.getElementById('category').value,
                doctor: document.getElementById('doctor').options[doctorSelect.selectedIndex].text,
                appointmentDate: document.getElementById('appointmentDate').value,
                appointmentTime: document.getElementById('appointmentTime').value,
                medicalHistory: document.getElementById('medicalHistory').value,
                timestamp: new Date().toISOString()
            };
            
            // Generate appointment ID
            const generatedId = 'CC-' + Date.now().toString().slice(-8);
            appointmentId.textContent = generatedId;
            
            // Show success message
            successMessage.style.display = 'block';
            
            // Log data (for now - will be PHP AJAX)
            console.log('Appointment Data:', formData);
            console.log('Appointment ID:', generatedId);
            
            // In real implementation, send to PHP via AJAX:
            /*
            fetch('book-appointment.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    appointmentId.textContent = data.appointmentId;
                    successMessage.style.display = 'block';
                }
            });
            */
            
        } else {
            // Show error messages
            alert('Please fix the following errors:\n\n' + errorMessages.join('\n'));
        }
    });

    // Close success message
    closeSuccessBtn.addEventListener('click', function() {
        successMessage.style.display = 'none';
        bookingForm.reset();
        
        // Reset displays
        selectedDoctorName.textContent = 'None selected';
        selectedDate.textContent = 'Not selected';
        selectedTime.textContent = 'Not selected';
        
        // Reset doctor dropdown
        doctorSelect.innerHTML = '<option value="">Select a doctor</option>';
        categorySelect.selectedIndex = 0;
        
        // Reset min date
        document.getElementById('appointmentDate').min = today;
    });

    // Real-time input validation
    document.getElementById('patientEmail').addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.classList.add('input-error');
        } else {
            this.classList.remove('input-error');
        }
    });

    document.getElementById('patientPhone').addEventListener('blur', function() {
        if (this.value && !validatePhone(this.value)) {
            this.classList.add('input-error');
        } else {
            this.classList.remove('input-error');
        }
    });

    // Initialize displays
    selectedDoctorName.textContent = 'None selected';
    selectedDate.textContent = 'Not selected';
    selectedTime.textContent = 'Not selected';
    
    // Pre-fill date with tomorrow as default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    appointmentDate.value = tomorrowFormatted;
    appointmentDate.dispatchEvent(new Event('change'));
});