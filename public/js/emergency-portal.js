// Emergency Services Contacts - These are permanent
const emergencyServices = [
    {
        name: "Police Emergency",
        phone: "100",
        relation: "Emergency Services",
        permanent: true
    },
    {
        name: "Fire Emergency",
        phone: "101",
        relation: "Emergency Services",
        permanent: true
    },
    {
        name: "Ambulance",
        phone: "108",
        relation: "Emergency Services",
        permanent: true
    },
    {
        name: "Emergency Response",
        phone: "112",
        relation: "Emergency Services",
        permanent: true
    },
    {
        name: "Women Helpline",
        phone: "1091",
        relation: "Emergency Services",
        permanent: true
    }
];

// Initialize emergency contacts from localStorage, including permanent services
let emergencyContacts = [...emergencyServices, ...(JSON.parse(localStorage.getItem('emergencyContacts')) || [])];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    renderContacts();
    initializeQuickSOSForm();
});

// Get current position helper function
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser.'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve(position);
            },
            (error) => {
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });
}

// Quick SOS Form Handler
function initializeQuickSOSForm() {
    const form = document.getElementById('quickSOSForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const phoneInput = document.getElementById('quickSOSPhone');
        const phone = phoneInput.value;
        
        if (phone) {
            try {
                const position = await getCurrentPosition();
                await sendSOSMessage(phone, position, "Emergency Contact");
                alert('Emergency message sent successfully');
                phoneInput.value = '';
            } catch (error) {
                console.error('Error sending SOS:', error);
                alert('Failed to send emergency message. Please try again or contact emergency services directly.');
            }
        }
    });
}

// Render Emergency Contacts
function renderContacts() {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '';
    
    emergencyContacts.forEach((contact, index) => {
        const contactCard = document.createElement('div');
        contactCard.className = 'col-md-6 col-lg-4';
        contactCard.innerHTML = `
            <div class="card bg-dark text-white contact-card border-${contact.permanent ? 'danger' : 'primary'}">
                <div class="card-body">
                    <h5 class="card-title">${contact.name}</h5>
                    <p class="card-text">
                        <i class="bi bi-telephone-fill me-2"></i>${contact.phone}<br>
                        <i class="bi bi-heart-fill me-2"></i>${contact.relation}
                    </p>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-primary btn-sm" onclick="sendSOS(${index})">
                            Send SOS
                        </button>
                        ${!contact.permanent ? `
                            <button class="btn btn-danger btn-sm" onclick="deleteContact(${index})">
                                Delete
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        contactsList.appendChild(contactCard);
    });
}

// Delete Contact
function deleteContact(index) {
    if (!emergencyContacts[index].permanent && confirm('Are you sure you want to delete this contact?')) {
        emergencyContacts.splice(index, 1);
        localStorage.setItem('emergencyContacts', JSON.stringify(
            emergencyContacts.filter(contact => !contact.permanent)
        ));
        renderContacts();
    }
}

// Modified sendSOS function
async function sendSOS(contactIndex) {
    try {
        const position = await getCurrentPosition();
        const contact = emergencyContacts[contactIndex];
        
        await sendSOSMessage(contact.phone, position, contact.name);
        
        // If it's not a permanent contact, remove it after sending SOS
        if (!contact.permanent) {
            emergencyContacts = emergencyContacts.filter((_, index) => index !== contactIndex);
            localStorage.setItem('emergencyContacts', JSON.stringify(
                emergencyContacts.filter(contact => !contact.permanent)
            ));
            renderContacts();
        }
        
        alert(`Emergency message sent successfully to ${contact.name}`);
    } catch (error) {
        console.error('Error sending SOS:', error);
        alert('Failed to send emergency message. Please try again or contact emergency services directly.');
    }
}

// Helper function to send SOS message
async function sendSOSMessage(phone, position, name) {
    const response = await fetch('http://localhost:3000/api/send-sos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            phone: phone,
            location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },
            name: name
        })
    });

    const result = await response.json();
    if (!result.success) {
        throw new Error('Failed to send message');
    }
    return result;
}

// Update the global SOS button handler
document.getElementById('sosButton').addEventListener('click', async () => {
    try {
        const position = await getCurrentPosition();
        
        // Send SOS to all permanent emergency services
        const sendPromises = emergencyServices.map(contact => {
            return sendSOSMessage(contact.phone, position, contact.name);
        });

        await Promise.all(sendPromises);
        alert('Emergency messages sent to all emergency services');
    } catch (error) {
        console.error('Error sending SOS messages:', error);
        alert('Failed to send emergency messages. Please try again or contact emergency services directly.');
    }
});