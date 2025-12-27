document.addEventListener('DOMContentLoaded', function() {
            // Set minimum date to today
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('appointmentDate').min = today;
            
            // Doctor data
            const doctors = {
                'cardiology': [
                    { id: 'dr1', name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', experience: '15', fee: 150, rating: 4.8, avatar: 'SJ', bio: 'Specialized in cardiac care with 15+ years of experience. Expert in ECG, stress tests, and heart health management.' },
                    { id: 'dr2', name: 'Dr. Michael Chen', specialty: 'Heart Surgeon', experience: '12', fee: 200, rating: 4.9, avatar: 'MC', bio: 'Renowned heart surgeon with expertise in minimally invasive procedures and coronary interventions.' }
                ],
                'neurology': [
                    { id: 'dr3', name: 'Dr. Robert Williams', specialty: 'Neurologist', experience: '18', fee: 180, rating: 4.7, avatar: 'RW', bio: 'Expert in neurological disorders including migraines, epilepsy, and Parkinson\'s disease.' },
                    { id: 'dr4', name: 'Dr. Emily Davis', specialty: 'Neurosurgeon', experience: '14', fee: 250, rating: 4.9, avatar: 'ED', bio: 'Skilled neurosurgeon specializing in brain and spinal cord surgeries.' }
                ],
                'ophthalmology': [
                    { id: 'dr5', name: 'Dr. James Wilson', specialty: 'Ophthalmologist', experience: '20', fee: 120, rating: 4.6, avatar: 'JW', bio: 'Expert in eye care, cataract surgery, and laser vision correction.' }
                ],
                'gastroenterology': [
                    { id: 'dr6', name: 'Dr. Lisa Brown', specialty: 'Gastroenterologist', experience: '16', fee: 140, rating: 4.7, avatar: 'LB', bio: 'Specialized in digestive system disorders and endoscopic procedures.' }
                ],
                'dermatology': [
                    { id: 'dr7', name: 'Dr. Amanda Taylor', specialty: 'Dermatologist', experience: '10', fee: 130, rating: 4.5, avatar: 'AT', bio: 'Expert in skin conditions, cosmetic dermatology, and laser treatments.' }
                ],
                'trichology': [
                    { id: 'dr8', name: 'Dr. David Miller', specialty: 'Trichologist', experience: '8', fee: 100, rating: 4.4, avatar: 'DM', bio: 'Specialized in hair and scalp disorders with focus on hair loss treatments.' }
                ],
                'general': [
                    { id: 'dr9', name: 'Dr. Susan Lee', specialty: 'General Physician', experience: '25', fee: 90, rating: 4.8, avatar: 'SL', bio: 'Experienced general physician providing comprehensive primary care.' }
                ]
            };

            // Category change event
            document.getElementById('category').addEventListener('change', function() {
                const category = this.value;
                const doctorSelect = document.getElementById('doctor');
                
                // Clear previous options
                doctorSelect.innerHTML = '<option value="">Select a doctor</option>';
                
                if (category && doctors[category]) {
                    // Add doctors for selected category
                    doctors[category].forEach(doctor => {
                        const option = document.createElement('option');
                        option.value = doctor.id;
                        option.textContent = `${doctor.name} - ${doctor.specialty} ($${doctor.fee})`;
                        option.dataset.doctor = JSON.stringify(doctor);
                        doctorSelect.appendChild(option);
                    });
                }
                
                // Reset doctor info
                updateDoctorInfo(null);
                updateBookingSummary();
            });

            // Doctor change event
            document.getElementById('doctor').addEventListener('change', function() {
                const selectedOption = this.options[this.selectedIndex];
                
                if (selectedOption.value) {
                    const doctor = JSON.parse(selectedOption.dataset.doctor);
                    updateDoctorInfo(doctor);
                } else {
                    updateDoctorInfo(null);
                }
                updateBookingSummary();
            });

            // Update date/time in summary
            document.getElementById('appointmentDate').addEventListener('change', updateBookingSummary);
            document.getElementById('appointmentTime').addEventListener('change', updateBookingSummary);

            // Update doctor info display
            function updateDoctorInfo(doctor) {
                const doctorInfo = document.getElementById('doctorInfo');
                const doctorBio = document.getElementById('doctorBio');
                
                if (doctor) {
                    document.getElementById('doctorAvatar').textContent = doctor.avatar;
                    document.getElementById('doctorName').textContent = doctor.name;
                    document.getElementById('doctorSpecialty').textContent = doctor.specialty;
                    
                    // Create star rating
                    const ratingElement = document.getElementById('doctorRating');
                    ratingElement.innerHTML = '';
                    const fullStars = Math.floor(doctor.rating);
                    const hasHalfStar = doctor.rating % 1 >= 0.5;
                    
                    for (let i = 0; i < 5; i++) {
                        const star = document.createElement('i');
                        if (i < fullStars) {
                            star.className = 'fas fa-star';
                        } else if (i === fullStars && hasHalfStar) {
                            star.className = 'fas fa-star-half-alt';
                        } else {
                            star.className = 'far fa-star';
                        }
                        ratingElement.appendChild(star);
                    }
                    
                    const ratingText = document.createElement('span');
                    ratingText.textContent = ` ${doctor.rating}`;
                    ratingElement.appendChild(ratingText);
                    
                    document.getElementById('doctorExperience').textContent = `Experience: ${doctor.experience} years`;
                    doctorBio.textContent = doctor.bio;
                    
                    // Store doctor fee for calculation
                    doctorInfo.dataset.fee = doctor.fee;
                } else {
                    document.getElementById('doctorAvatar').textContent = 'DR';
                    document.getElementById('doctorName').textContent = 'Select a doctor';
                    document.getElementById('doctorSpecialty').textContent = 'Specialty will appear here';
                    document.getElementById('doctorRating').innerHTML = '<i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i><span>4.5</span>';
                    document.getElementById('doctorExperience').textContent = 'Experience: -- years';
                    doctorBio.textContent = 'Please select a doctor to view their profile and availability.';
                    
                    doctorInfo.dataset.fee = 0;
                }
            }

            // Update booking summary
            function updateBookingSummary() {
                const fee = parseFloat(document.getElementById('doctorInfo').dataset.fee) || 0;
                const serviceCharge = 5.00;
                const tax = fee * 0.08;
                const total = fee + serviceCharge + tax;
                
                document.getElementById('feeAmount').textContent = `$${fee.toFixed(2)}`;
                document.getElementById('taxAmount').textContent = `$${tax.toFixed(2)}`;
                document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
                
                const date = document.getElementById('appointmentDate').value;
                const time = document.getElementById('appointmentTime').value;
                
                if (date) {
                    const formattedDate = new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    document.getElementById('summaryDate').textContent = formattedDate;
                }
                
                if (time) {
                    const timeText = document.getElementById('appointmentTime').options[
                        document.getElementById('appointmentTime').selectedIndex
                    ].textContent;
                    document.getElementById('summaryTime').textContent = timeText;
                }
            }

            // Form submission
            document.getElementById('bookingForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Basic validation
                const requiredFields = ['patientName', 'patientEmail', 'patientPhone', 'reason', 'category', 'doctor', 'appointmentDate', 'appointmentTime'];
                let isValid = true;
                
                requiredFields.forEach(fieldId => {
                    const field = document.getElementById(fieldId);
                    if (!field.value.trim()) {
                        isValid = false;
                        field.style.borderColor = '#e74c3c';
                    } else {
                        field.style.borderColor = '#e1e5ee';
                    }
                });
                
                if (isValid) {
                    // Show success message
                    const successMessage = document.getElementById('successMessage');
                    successMessage.style.display = 'block';
                    
                    // Reset form after 5 seconds
                    setTimeout(() => {
                        this.reset();
                        successMessage.style.display = 'none';
                        updateDoctorInfo(null);
                        updateBookingSummary();
                        
                        // Reset category to default
                        document.getElementById('category').selectedIndex = 0;
                        const doctorSelect = document.getElementById('doctor');
                        doctorSelect.innerHTML = '<option value="">Select a doctor</option>';
                    }, 5000);
                    
                    // Here you would typically send data to a server
                    console.log('Booking submitted:', {
                        patientName: document.getElementById('patientName').value,
                        email: document.getElementById('patientEmail').value,
                        phone: document.getElementById('patientPhone').value,
                        reason: document.getElementById('reason').value,
                        category: document.getElementById('category').value,
                        doctor: document.getElementById('doctor').value,
                        date: document.getElementById('appointmentDate').value,
                        time: document.getElementById('appointmentTime').value,
                        medicalHistory: document.getElementById('medicalHistory').value
                    });
                } else {
                    alert('Please fill in all required fields marked in red.');
                }
            });

            // Initialize booking summary
            updateBookingSummary();
        });