const API_BASE = "http://localhost:3000";
let token = localStorage.getItem("token");
let sessionTimeout;
const SESSION_DURATION = 60 * 60 * 1000; // 1 hour timeout

// Password strength validation
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    let strength = 0;
    let message = "";
    
    if (password.length < minLength) {
        message = "Password must be at least 8 characters long";
    } else {
        strength += 1;
        if (hasUpperCase) strength += 1;
        if (hasLowerCase) strength += 1;
        if (hasNumbers) strength += 1;
        if (hasSpecialChars) strength += 1;
        
        if (strength < 3) {
            message = "Weak password - add uppercase, lowercase, numbers or special characters";
        } else if (strength < 5) {
            message = "Moderate password - could be stronger";
        } else {
            message = "Strong password";
        }
    }
    
    return {
        valid: password.length >= minLength,
        strength, // 1-5 scale
        message
    };
}

// Helper to show notifications
function showNotification(message, type = 'info') {
    const notifContainer = document.getElementById('notification-container');
    
    if (!notifContainer) {
        // Create container if not exists
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '10000';
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.getElementById('notification-container').appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// Session management
function startSessionTimer() {
    // Clear any existing timer
    clearTimeout(sessionTimeout);
    
    // Set new timer
    sessionTimeout = setTimeout(() => {
        showNotification('Your session has expired. Please login again.', 'error');
        logout();
    }, SESSION_DURATION);
}

function resetSessionTimer() {
    startSessionTimer();
}

// Active events to reset session timer
['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
    document.addEventListener(event, resetSessionTimer);
});

// 🆕 Register a New User
async function register() {
    try {
        const username = document.getElementById("reg-username").value;
        const password = document.getElementById("reg-password").value;
        const confirmPassword = document.getElementById("reg-confirm-password").value;
        
        // Validation
        if (!username || !password) {
            return showNotification("Username and password are required", "error");
        }
        
        if (password !== confirmPassword) {
            return showNotification("Passwords do not match", "error");
        }
        
        // Password strength validation
        const passwordCheck = validatePassword(password);
        if (!passwordCheck.valid) {
            return showNotification(passwordCheck.message, "error");
        }
        
        // Update UI to show loading state
        const registerBtn = document.getElementById("register-btn");
        registerBtn.disabled = true;
        registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';

        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (res.ok) {
            showNotification("Registration successful! Now login.", "success");
            // Switch to login tab
            document.getElementById('login-tab').click();
        } else {
            showNotification(data.message || "Registration failed", "error");
        }
    } catch (error) {
        console.error("Registration error:", error);
        showNotification("Registration failed: " + error.message, "error");
    } finally {
        // Reset UI
        const registerBtn = document.getElementById("register-btn");
        registerBtn.disabled = false;
        registerBtn.innerHTML = '<i class="fas fa-user-plus me-2"></i>Create Account';
    }
}

// 🔐 Login User
async function login() {
    try {
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;

        if (!username || !password) {
            return showNotification("Username and password are required", "error");
        }
        
        // Update UI to show loading state
        const loginBtn = document.getElementById("login-btn");
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();
        if (res.ok && data.token) {
            localStorage.setItem("token", data.token);
            token = data.token; // Update the global variable
            
            // Start session timer
            startSessionTimer();
            
            console.log("Token saved:", data.token);
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("records-section").style.display = "block";
            fetchRecords();
            
            showNotification("Login successful!", "success");
        } else {
            showNotification(data.message || "Login failed", "error");
        }
    } catch (error) {
        console.error("Login error:", error);
        showNotification("Login failed: " + error.message, "error");
    } finally {
        // Reset UI
        const loginBtn = document.getElementById("login-btn");
        loginBtn.disabled = false;
        loginBtn.innerHTML = '<i class="fas fa-sign-in-alt me-2"></i>Login';
    }
}

// 📋 Fetch Medical Records
async function fetchRecords() {
    try {
        // Show loading state
        const recordsList = document.getElementById("records-list");
        recordsList.innerHTML = '<div class="text-center my-4"><i class="fas fa-spinner fa-spin fa-2x"></i><p class="mt-2">Loading records...</p></div>';
        
        // Refresh token from localStorage
        token = localStorage.getItem("token");
        
        if (!token) {
            showNotification("Please login first", "error");
            // Reset UI to show login form
            document.getElementById("auth-section").style.display = "block";
            document.getElementById("records-section").style.display = "none";
            return;
        }
        
        console.log("Using token:", token);
        
        // Get filter values if set
        const searchTerm = document.getElementById("search-records")?.value || '';
        const filterType = document.getElementById("filter-type")?.value || '';
        
        let url = `${API_BASE}/medical-records/`;
        // Add filter parameters if specified
        if (searchTerm || filterType) {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (filterType) params.append('filter', filterType);
            url += `?${params.toString()}`;
        }
        
        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                showNotification("Session expired or invalid token. Please login again.", "error");
                // Reset the UI to show login form
                document.getElementById("auth-section").style.display = "block";
                document.getElementById("records-section").style.display = "none";
                localStorage.removeItem("token");
                return;
            }
            throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }
        
        const records = await res.json();
        
        if (!Array.isArray(records)) {
            console.error("Expected array but got:", records);
            return showNotification("Unexpected data format received from server", "error");
        }
        
        recordsList.innerHTML = "";
        
        if (records.length === 0) {
            recordsList.innerHTML = '<div class="text-center my-5"><i class="fas fa-folder-open text-secondary" style="font-size: 3rem;"></i><p class="mt-3">No medical records found.</p></div>';
            return;
        }
        
        // Build the records list
        records.forEach((record, index) => {
            const li = document.createElement("li");
            li.className = 'record-item';
            li.setAttribute('data-record-id', record.id);
            
            // Format dates in a more readable format
            const formattedDob = new Date(record.dob).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            });
            
            // Create icons for health information
            let healthIcons = '';
            if (record.allergies) healthIcons += '<i class="fas fa-allergies text-warning me-2" title="Has allergies"></i>';
            if (record.chronic_diseases) healthIcons += '<i class="fas fa-heartbeat text-danger me-2" title="Has chronic conditions"></i>';
            if (record.current_medications) healthIcons += '<i class="fas fa-pills text-info me-2" title="Taking medications"></i>';
            
            li.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 class="mb-1">${record.full_name} <span class="blood-group-badge">${record.blood_group}</span></h5>
                        <p class="mb-1"><i class="fas fa-calendar-day text-primary me-2"></i>Born: ${formattedDob}</p>
                        <div class="mb-1 mt-2">
                            ${healthIcons}
                        </div>
                    </div>
                    <div class="d-flex flex-column align-items-end">
                        ${record.medical_reports ? `<a href="${API_BASE}/${record.medical_reports}" target="_blank" class="view-report-btn mb-2"><i class="fas fa-file-pdf me-1"></i>View Report</a>` : ""}
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-primary view-details-btn" onclick="viewRecord(${record.id})">
                                <i class="fas fa-eye me-1"></i>Details
                            </button>
                            <button class="btn btn-sm btn-outline-warning edit-record-btn" onclick="editRecord(${record.id})">
                                <i class="fas fa-edit me-1"></i>Edit
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-record-btn" onclick="deleteRecord(${record.id})">
                                <i class="fas fa-trash-alt me-1"></i>Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
            recordsList.appendChild(li);
        });
        
        // Update dashboard counters
        updateDashboardStats(records);
        
        // Update timeline
        if (typeof updateTimeline === 'function') {
            updateTimeline(records);
        }
    } catch (error) {
        console.error("Error fetching records:", error);
        showNotification("Failed to fetch records: " + error.message, "error");
        
        const recordsList = document.getElementById("records-list");
        recordsList.innerHTML = '<div class="text-center my-4"><i class="fas fa-exclamation-triangle text-warning fa-2x"></i><p class="mt-2">Could not load records. Please try again.</p></div>';
    }
}

// Update dashboard stats
function updateDashboardStats(records) {
    if (!records || !Array.isArray(records)) return;
    
    const dashboard = document.getElementById('dashboard-stats');
    if (!dashboard) return;
    
    // Calculate stats
    const totalRecords = records.length;
    
    // Count records with upcoming appointments
    const upcomingAppointments = records.filter(r => r.upcoming_appointments && r.upcoming_appointments.trim() !== '').length;
    
    // Count records with allergies
    const allergiesCount = records.filter(r => r.allergies && r.allergies.trim() !== '').length;
    
    // Count records with medications
    const medicationsCount = records.filter(r => r.current_medications && r.current_medications.trim() !== '').length;
    
    // Update dashboard HTML
    dashboard.innerHTML = `
        <div class="row g-3">
            <div class="col-md-3">
                <div class="stat-card bg-primary bg-opacity-10 border-start border-5 border-primary">
                    <div class="stat-icon"><i class="fas fa-clipboard-list"></i></div>
                    <div class="stat-details">
                        <h2>${totalRecords}</h2>
                        <p>Total Records</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card bg-success bg-opacity-10 border-start border-5 border-success">
                    <div class="stat-icon"><i class="fas fa-calendar-check"></i></div>
                    <div class="stat-details">
                        <h2>${upcomingAppointments}</h2>
                        <p>Appointments</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card bg-warning bg-opacity-10 border-start border-5 border-warning">
                    <div class="stat-icon"><i class="fas fa-allergies"></i></div>
                    <div class="stat-details">
                        <h2>${allergiesCount}</h2>
                        <p>Allergies</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="stat-card bg-info bg-opacity-10 border-start border-5 border-info">
                    <div class="stat-icon"><i class="fas fa-pills"></i></div>
                    <div class="stat-details">
                        <h2>${medicationsCount}</h2>
                        <p>Medications</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// View record details
async function viewRecord(recordId) {
    try {
        // Refresh token from localStorage
        token = localStorage.getItem("token");
        
        if (!token) {
            showNotification("Please login first", "error");
            return;
        }
        
        // Fetch the specific record
        const res = await fetch(`${API_BASE}/medical-records/${recordId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!res.ok) {
            throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }
        
        const record = await res.json();
        
        // Create modal markup
        let modalHTML = `
            <div class="modal fade" id="recordDetailsModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-scrollable">
                    <div class="modal-content" style="background: var(--card-bg); color: #f8f9fa;">
                        <div class="modal-header border-0">
                            <h5 class="modal-title">
                                <i class="fas fa-file-medical-alt me-2 text-primary"></i>
                                ${record.full_name}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Patient Info Card -->
                            <div class="record-detail-card mb-4">
                                <h6 class="detail-section-title"><i class="fas fa-user-circle me-2"></i>Personal Information</h6>
                                <div class="row">
                                    <div class="col-md-6">
                                        <p><strong>Full Name:</strong> ${record.full_name}</p>
                                        <p><strong>Date of Birth:</strong> ${new Date(record.dob).toLocaleDateString()}</p>
                                    </div>
                                    <div class="col-md-6">
                                        <p><strong>Blood Group:</strong> <span class="blood-group-badge larger">${record.blood_group}</span></p>
                                        <p><strong>Emergency Contact:</strong> ${record.emergency_contact || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Medical Information -->
                            <div class="record-detail-card mb-4">
                                <h6 class="detail-section-title"><i class="fas fa-heartbeat me-2"></i>Medical Information</h6>
                                <div class="row">
                                    <div class="col-md-6">
                                        <p><strong>Allergies:</strong></p>
                                        <div class="detail-content">${formatForDisplay(record.allergies)}</div>
                                    </div>
                                    <div class="col-md-6">
                                        <p><strong>Chronic Diseases:</strong></p>
                                        <div class="detail-content">${formatForDisplay(record.chronic_diseases)}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Treatment Information -->
                            <div class="record-detail-card mb-4">
                                <h6 class="detail-section-title"><i class="fas fa-pills me-2"></i>Treatment Information</h6>
                                <div class="row">
                                    <div class="col-md-6">
                                        <p><strong>Current Medications:</strong></p>
                                        <div class="detail-content">${formatForDisplay(record.current_medications)}</div>
                                    </div>
                                    <div class="col-md-6">
                                        <p><strong>Prescriptions:</strong></p>
                                        <div class="detail-content">${formatForDisplay(record.prescriptions)}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- History & Documents -->
                            <div class="record-detail-card mb-4">
                                <h6 class="detail-section-title"><i class="fas fa-history me-2"></i>Medical History</h6>
                                
                                <p><strong>Previous Diagnoses:</strong></p>
                                <div class="detail-content mb-3">${formatForDisplay(record.previous_diagnoses)}</div>
                                
                                <p><strong>Hospitalization History:</strong></p>
                                <div class="detail-content mb-3">${formatForDisplay(record.hospitalization_history)}</div>
                                
                                <p><strong>Vaccination Records:</strong></p>
                                <div class="detail-content mb-3">${formatForDisplay(record.vaccination_records)}</div>
                                
                                ${record.medical_reports ? `
                                <div class="text-center mt-3">
                                    <a href="${API_BASE}/${record.medical_reports}" target="_blank" class="btn btn-primary">
                                        <i class="fas fa-file-medical me-2"></i>View Medical Report
                                    </a>
                                </div>` : ''}
                            </div>
                            
                            <!-- Health Notes -->
                            <div class="record-detail-card">
                                <h6 class="detail-section-title"><i class="fas fa-notes-medical me-2"></i>Health Notes</h6>
                                <div class="detail-content">${formatForDisplay(record.health_tracking_notes)}</div>
                            </div>
                            
                        </div>
                        <div class="modal-footer border-0">
                            <button type="button" class="btn btn-outline-primary" onclick="exportRecord(${record.id})">
                                <i class="fas fa-file-export me-2"></i>Export
                            </button>
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add the modal to the DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // Initialize and show the Bootstrap modal
        const modal = new bootstrap.Modal(document.getElementById('recordDetailsModal'));
        modal.show();
        
        // Remove the modal from DOM after it's hidden
        document.getElementById('recordDetailsModal').addEventListener('hidden.bs.modal', function () {
            document.body.removeChild(modalContainer);
        });
    } catch (error) {
        console.error("Error viewing record:", error);
        showNotification("Failed to load record details: " + error.message, "error");
    }
}

// Helper function to format text for display
function formatForDisplay(text) {
    if (!text || text.trim() === '') return '<em class="text-muted">None specified</em>';
    
    // Enhance links
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    
    // Convert newlines to <br>
    return text.replace(/\n/g, '<br>');
}

// Edit record
async function editRecord(recordId) {
    try {
        // Refresh token from localStorage
        token = localStorage.getItem("token");
        
        if (!token) {
            showNotification("Please login first", "error");
            return;
        }
        
        // Fetch the specific record for editing
        const res = await fetch(`${API_BASE}/medical-records/${recordId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!res.ok) {
            throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }
        
        const record = await res.json();
        
        // Populate the form with record data
        document.getElementById("edit-form-title").textContent = "Edit Medical Record";
        document.getElementById("recordId").value = record.id;
        document.getElementById("full_name").value = record.full_name;
        document.getElementById("dob").value = record.dob.split('T')[0]; // Format date for input
        document.getElementById("blood_group").value = record.blood_group;
        
        // Set values for other fields if they exist in the form
        if (document.getElementById("allergies")) {
            document.getElementById("allergies").value = record.allergies || '';
        }
        if (document.getElementById("chronic_diseases")) {
            document.getElementById("chronic_diseases").value = record.chronic_diseases || '';
        }
        if (document.getElementById("emergency_contact")) {
            document.getElementById("emergency_contact").value = record.emergency_contact || '';
        }
        if (document.getElementById("previous_diagnoses")) {
            document.getElementById("previous_diagnoses").value = record.previous_diagnoses || '';
        }
        if (document.getElementById("prescriptions")) {
            document.getElementById("prescriptions").value = record.prescriptions || '';
        }
        if (document.getElementById("vaccination_records")) {
            document.getElementById("vaccination_records").value = record.vaccination_records || '';
        }
        if (document.getElementById("current_medications")) {
            document.getElementById("current_medications").value = record.current_medications || '';
        }
        if (document.getElementById("upcoming_appointments")) {
            document.getElementById("upcoming_appointments").value = record.upcoming_appointments || '';
        }
        if (document.getElementById("hospitalization_history")) {
            document.getElementById("hospitalization_history").value = record.hospitalization_history || '';
        }
        if (document.getElementById("health_tracking_notes")) {
            document.getElementById("health_tracking_notes").value = record.health_tracking_notes || '';
        }
        
        // If there's a file display name
        if (record.medical_reports && document.getElementById("selected-file")) {
            const fileName = record.medical_reports.split('/').pop();
            document.getElementById("selected-file").textContent = fileName;
            document.getElementById("selected-file").style.display = 'block';
        }
        
        // Change form submit button text
        const submitBtn = document.querySelector("#record-form button[type='submit']");
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-save me-2"></i>Update Medical Record';
        }
        
        // Scroll to the form
        document.getElementById("record-form").scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error("Error editing record:", error);
        showNotification("Failed to load record for editing: " + error.message, "error");
    }
}

// Delete a record
async function deleteRecord(recordId) {
    if (!confirm("Are you sure you want to delete this medical record? This action cannot be undone.")) {
        return;
    }
    
    try {
        // Refresh token from localStorage
        token = localStorage.getItem("token");
        
        if (!token) {
            showNotification("Please login first", "error");
            return;
        }
        
        const res = await fetch(`${API_BASE}/medical-records/${recordId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                showNotification("Session expired or invalid token. Please login again.", "error");
                document.getElementById("auth-section").style.display = "block";
                document.getElementById("records-section").style.display = "none";
                localStorage.removeItem("token");
                return;
            }
            throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }
        
        showNotification("Record deleted successfully", "success");
        
        // Remove the record from UI
        const recordElement = document.querySelector(`li[data-record-id="${recordId}"]`);
        if (recordElement) {
            recordElement.classList.add('fade-out');
            setTimeout(() => {
                recordElement.remove();
                // Check if records list is empty
                const recordsList = document.getElementById("records-list");
                if (recordsList.children.length === 0) {
                    recordsList.innerHTML = '<div class="text-center my-5"><i class="fas fa-folder-open text-secondary" style="font-size: 3rem;"></i><p class="mt-3">No medical records found.</p></div>';
                }
                // Update dashboard counters
                fetchRecords(); // Refresh to update counters properly
            }, 300);
        } else {
            // If element not found, refresh the whole list
            fetchRecords();
        }
    } catch (error) {
        console.error("Error deleting record:", error);
        showNotification("Failed to delete record: " + error.message, "error");
    }
}

// 📑 Add/Update Medical Record
document.getElementById("record-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    try {
        // Refresh token from localStorage
        token = localStorage.getItem("token");
        
        if (!token) {
            showNotification("Please login first", "error");
            document.getElementById("auth-section").style.display = "block";
            document.getElementById("records-section").style.display = "none";
            return;
        }
        
        // Get record ID if editing
        const recordId = document.getElementById("recordId")?.value;
        const isEditing = recordId && recordId !== '';
        
        // Validate required fields
        const fullName = document.getElementById("full_name").value;
        const dob = document.getElementById("dob").value;
        const bloodGroup = document.getElementById("blood_group").value;
        
        if (!fullName || !dob || !bloodGroup) {
            showNotification("Full name, date of birth, and blood group are required", "error");
            return;
        }
        
        // Update button state to show loading
        const submitBtn = document.querySelector("#record-form button[type='submit']");
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i>${isEditing ? 'Updating' : 'Saving'}...`;
        
        const formData = new FormData();
        formData.append("full_name", fullName);
        formData.append("dob", dob);
        formData.append("blood_group", bloodGroup);
        
        // Check if there's a file to upload
       const medicalReportFile = document.getElementById("medical_report").files[0];
    if (medicalReportFile) {
        formData.append("medical_report", medicalReportFile);
    }
        
        // Add other optional fields from the form
        const allergiesField = document.getElementById("allergies");
        if (allergiesField && allergiesField.value) {
            formData.append("allergies", allergiesField.value);
        }
        
        const chronicDiseasesField = document.getElementById("chronic_diseases");
        if (chronicDiseasesField && chronicDiseasesField.value) {
            formData.append("chronic_diseases", chronicDiseasesField.value);
        }
        
        const emergencyContactField = document.getElementById("emergency_contact");
        if (emergencyContactField && emergencyContactField.value) {
            formData.append("emergency_contact", emergencyContactField.value);
        }
        
        const previousDiagnosesField = document.getElementById("previous_diagnoses");
        if (previousDiagnosesField && previousDiagnosesField.value) {
            formData.append("previous_diagnoses", previousDiagnosesField.value);
        }
        
        const prescriptionsField = document.getElementById("prescriptions");
        if (prescriptionsField && prescriptionsField.value) {
            formData.append("prescriptions", prescriptionsField.value);
        }
        
        const vaccinationRecordsField = document.getElementById("vaccination_records");
        if (vaccinationRecordsField && vaccinationRecordsField.value) {
            formData.append("vaccination_records", vaccinationRecordsField.value);
        }
        
        const currentMedicationsField = document.getElementById("current_medications");
        if (currentMedicationsField && currentMedicationsField.value) {
            formData.append("current_medications", currentMedicationsField.value);
        }
        
        const upcomingAppointmentsField = document.getElementById("upcoming_appointments");
        if (upcomingAppointmentsField && upcomingAppointmentsField.value) {
            formData.append("upcoming_appointments", upcomingAppointmentsField.value);
        }
        
        const hospitalizationHistoryField = document.getElementById("hospitalization_history");
        if (hospitalizationHistoryField && hospitalizationHistoryField.value) {
            formData.append("hospitalization_history", hospitalizationHistoryField.value);
        }
        
        const healthTrackingNotesField = document.getElementById("health_tracking_notes");
        if (healthTrackingNotesField && healthTrackingNotesField.value) {
            formData.append("health_tracking_notes", healthTrackingNotesField.value);
        }
        
        // Determine if this is a create or update operation
        const method = isEditing ? "PUT" : "POST";
        const endpoint = isEditing ? `${API_BASE}/medical-records/${recordId}` : `${API_BASE}/medical-records/`;
        
        const res = await fetch(endpoint, {
            method: method,
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        });
        
        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                showNotification("Session expired or invalid token. Please login again.", "error");
                document.getElementById("auth-section").style.display = "block";
                document.getElementById("records-section").style.display = "none";
                localStorage.removeItem("token");
                return;
            }
            
            const errorData = await res.json();
            throw new Error(errorData.message || `Server returned ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        showNotification(`Record ${isEditing ? 'updated' : 'added'} successfully!`, "success");
        
        // Reset form
        document.getElementById("record-form").reset();
        document.getElementById("recordId").value = "";
        if (document.getElementById("selected-file")) {
            document.getElementById("selected-file").style.display = "none";
        }
        
        // Reset form button
        document.querySelector("#record-form button[type='submit']").innerHTML = '<i class="fas fa-save me-2"></i>Save Medical Record';
        
        // Refresh records list
        fetchRecords();
    } catch (error) {
        console.error(`Error ${recordId ? 'updating' : 'adding'} record:`, error);
        showNotification(`Failed to ${recordId ? 'update' : 'add'} record: ` + error.message, "error");
    } finally {
        // Reset UI
        const submitBtn = document.querySelector("#record-form button[type='submit']");
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save me-2"></i>Save Medical Record';
    }
});

// Export record to PDF
async function exportRecord(recordId) {
    try {
        // Refresh token from localStorage
        token = localStorage.getItem("token");
        
        if (!token) {
            showNotification("Please login first", "error");
            return;
        }
        
        // Show loading notification
        showNotification("Preparing export...", "info");
        
        // Fetch the specific record
        const res = await fetch(`${API_BASE}/medical-records/${recordId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!res.ok) {
            throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }
        
        const record = await res.json();
        
        // Create export request
        const exportRes = await fetch(`${API_BASE}/medical-records/${recordId}/export`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${token}`,
                "Accept": "application/pdf"
            }
        });
        
        if (!exportRes.ok) {
            throw new Error(`Export failed: ${exportRes.status}: ${exportRes.statusText}`);
        }
        
        // Create and download the PDF blob
        const blob = await exportRes.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medical_record_${record.full_name.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification("Record exported successfully!", "success");
    } catch (error) {
        console.error("Error exporting record:", error);
        showNotification("Failed to export record: " + error.message, "error");
    }
}

// 🔄 Share medical record
async function shareRecord(recordId) {
    try {
        // Refresh token from localStorage
        token = localStorage.getItem("token");
        
        if (!token) {
            showNotification("Please login first", "error");
            return;
        }
        
        // Create share modal
        let shareModalHTML = `
            <div class="modal fade" id="shareRecordModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content" style="background: var(--card-bg); color: #f8f9fa;">
                        <div class="modal-header border-0">
                            <h5 class="modal-title">
                                <i class="fas fa-share-alt me-2 text-primary"></i>
                                Share Medical Record
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label for="share-email" class="form-label">Recipient Email</label>
                                <input type="email" class="form-control" id="share-email" placeholder="Enter recipient's email">
                            </div>
                            <div class="mb-3">
                                <label for="share-expire" class="form-label">Access Expires</label>
                                <select class="form-control" id="share-expire">
                                    <option value="1">24 hours</option>
                                    <option value="7">7 days</option>
                                    <option value="30">30 days</option>
                                    <option value="0">Never (not recommended)</option>
                                </select>
                            </div>
                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="share-readonly" checked>
                                <label class="form-check-label" for="share-readonly">
                                    Read-only access
                                </label>
                            </div>
                        </div>
                        <div class="modal-footer border-0">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="confirm-share-btn">
                                <i class="fas fa-paper-plane me-2"></i>Share
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add the modal to the DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = shareModalHTML;
        document.body.appendChild(modalContainer);
        
        // Initialize and show the Bootstrap modal
        const modal = new bootstrap.Modal(document.getElementById('shareRecordModal'));
        modal.show();
        
        // Set up share button handler
        document.getElementById('confirm-share-btn').addEventListener('click', async function() {
            const email = document.getElementById('share-email').value;
            const expireDays = document.getElementById('share-expire').value;
            const readonly = document.getElementById('share-readonly').checked;
            
            if (!email) {
                showNotification("Email address is required", "error");
                return;
            }
            
            // Show loading state
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sharing...';
            
            try {
                const res = await fetch(`${API_BASE}/medical-records/${recordId}/share`, {
                    method: "POST",
                    headers: { 
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, expireDays, readonly })
                });
                
                if (!res.ok) {
                    throw new Error(`Server returned ${res.status}: ${res.statusText}`);
                }
                
                const data = await res.json();
                showNotification("Record shared successfully!", "success");
                modal.hide();
            } catch (error) {
                console.error("Error sharing record:", error);
                showNotification("Failed to share record: " + error.message, "error");
                // Reset button
                this.disabled = false;
                this.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Share';
            }
        });
        
        // Remove the modal from DOM after it's hidden
        document.getElementById('shareRecordModal').addEventListener('hidden.bs.modal', function () {
            document.body.removeChild(modalContainer);
        });
    } catch (error) {
        console.error("Error sharing record:", error);
        showNotification("Failed to share record: " + error.message, "error");
    }
}

// Update timeline data
function updateTimeline(records) {
    if (!records || !Array.isArray(records) || records.length === 0) return;
    
    const timelineContainer = document.getElementById('medical-timeline');
    if (!timelineContainer) return;
    
    // Sort records by date
    records.sort((a, b) => new Date(a.dob) - new Date(b.dob));
    
    let timelineHTML = `<div class="timeline-wrapper">`;
    
    records.forEach((record, index) => {
        // Create a timeline entry for birth date
        const birthDate = new Date(record.dob);
        
        timelineHTML += `
            <div class="timeline-item">
                <div class="timeline-item-content">
                    <time>${birthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                    <p><strong>${record.full_name}</strong> was born</p>
                    <span class="circle"></span>
                </div>
            </div>
        `;
        
        // Add hospitalization events if they exist
        if (record.hospitalization_history && record.hospitalization_history.trim() !== '') {
            // Basic parsing - in a real app you'd want more structured data
            const hospitalizations = record.hospitalization_history.split('\n');
            
            hospitalizations.forEach(hospitalization => {
                if (hospitalization.trim() === '') return;
                
                // Try to extract a date - this is a simple example
                const dateMatch = hospitalization.match(/(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/);
                let eventDate = dateMatch ? new Date(dateMatch[0]) : null;
                
                if (!eventDate || isNaN(eventDate)) {
                    // If no valid date found, don't add to timeline
                    return;
                }
                
                timelineHTML += `
                    <div class="timeline-item">
                        <div class="timeline-item-content">
                            <time>${eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                            <p><strong>${record.full_name}</strong>: ${hospitalization}</p>
                            <span class="circle hospital-event"></span>
                        </div>
                    </div>
                `;
            });
        }
        
        // Add vaccination events if they exist
        if (record.vaccination_records && record.vaccination_records.trim() !== '') {
            const vaccinations = record.vaccination_records.split('\n');
            
            vaccinations.forEach(vaccination => {
                if (vaccination.trim() === '') return;
                
                // Try to extract a date
                const dateMatch = vaccination.match(/(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2})/);
                let eventDate = dateMatch ? new Date(dateMatch[0]) : null;
                
                if (!eventDate || isNaN(eventDate)) {
                    // If no valid date found, don't add to timeline
                    return;
                }
                
                timelineHTML += `
                    <div class="timeline-item">
                        <div class="timeline-item-content">
                            <time>${eventDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                            <p><strong>${record.full_name}</strong>: ${vaccination}</p>
                            <span class="circle vaccine-event"></span>
                        </div>
                    </div>
                `;
            });
        }
    });
    
    timelineHTML += `</div>`;
    timelineContainer.innerHTML = timelineHTML;
}

// Function to logout
function logout() {
    localStorage.removeItem("token");
    token = null;
    clearTimeout(sessionTimeout);
    document.getElementById("auth-section").style.display = "block";
    document.getElementById("records-section").style.display = "none";
    showNotification("Logged out successfully!", "success");
}

// Initialize the application
function init() {
    // Add hidden record ID field if not already present
    if (!document.getElementById("recordId")) {
        const hiddenField = document.createElement("input");
        hiddenField.type = "hidden";
        hiddenField.id = "recordId";
        hiddenField.name = "recordId";
        document.getElementById("record-form").appendChild(hiddenField);
    }
    
    // Check if token exists and show appropriate section
    if (token) {
        startSessionTimer();
        document.getElementById("auth-section").style.display = "none";
        document.getElementById("records-section").style.display = "block";
        fetchRecords();
    } else {
        document.getElementById("auth-section").style.display = "block";
        document.getElementById("records-section").style.display = "none";
    }
}

// Run initialization when page loads
window.addEventListener("load", init);
