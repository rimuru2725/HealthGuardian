// First Aid Database with expanded content and categories
const firstAidData = {
    burns: {
        title: "Burns Treatment",
        category: "injuries",
        icon: "bi-fire",
        urgency: "high",
        bookmarked: false,
        content: `
            <h4>Steps for Treating Burns:</h4>
            <ol>
                <li>Cool the burn under cool (not cold) running water for at least 10 minutes</li>
                <li>Remove any jewelry or tight items near the burned area</li>
                <li>Cover with a sterile gauze bandage</li>
                <li>Take an over-the-counter pain reliever if needed</li>
                <li>Don't break blisters</li>
                <li>Seek medical attention for severe burns</li>
            </ol>
            <div class="alert alert-danger mt-3">
                <strong>Warning:</strong> Don't use ice, butter, or ointments on burns
            </div>
        `
    },
    fractures: {
        title: "Fractures First Aid",
        category: "injuries",
        icon: "bi-bandaid-fill",
        urgency: "high",
        bookmarked: false,
        content: `
            <h4>Steps for Handling Fractures:</h4>
            <ol>
                <li>Stop any bleeding with gentle pressure</li>
                <li>Immobilize the injured area</li>
                <li>Apply ice packs to limit swelling</li>
                <li>Treat for shock if necessary</li>
            </ol>
            <div class="alert alert-warning mt-3">
                <strong>Important:</strong> Don't move the person unless absolutely necessary
            </div>
        `
    },
    heartAttack: {
        title: "Heart Attack Response",
        category: "medical",
        icon: "bi-heart-pulse-fill",
        urgency: "critical",
        bookmarked: false,
        content: `
            <h4>Signs and Immediate Actions:</h4>
            <ul>
                <li>Call emergency services immediately</li>
                <li>Help the person sit or lie down</li>
                <li>Loosen any tight clothing</li>
                <li>Ask if they take heart medication</li>
            </ul>
            <div class="alert alert-danger mt-3">
                <strong>Warning Signs:</strong>
                <ul>
                    <li>Chest pain or pressure</li>
                    <li>Pain in arms, neck, jaw, or back</li>
                    <li>Shortness of breath</li>
                    <li>Cold sweat, nausea</li>
                </ul>
            </div>
        `
    },
    choking: {
        title: "Choking Response",
        category: "medical",
        icon: "bi-lungs-fill",
        urgency: "critical",
        bookmarked: false,
        content: `
            <h4>Heimlich Maneuver Steps:</h4>
            <ol>
                <li>Stand behind the person</li>
                <li>Wrap your arms around their waist</li>
                <li>Make a fist with one hand</li>
                <li>Position it above the navel</li>
                <li>Grasp your fist with your other hand</li>
                <li>Pull inward and upward with quick thrusts</li>
            </ol>
            <div class="alert alert-warning mt-3">
                <strong>Note:</strong> For children under 1 year, use back blows and chest thrusts instead
            </div>
        `
    },
    heatstroke: {
        title: "Heatstroke Treatment",
        category: "environmental",
        icon: "bi-thermometer-high",
        urgency: "high",
        bookmarked: false,
        content: `
            <h4>Emergency Steps:</h4>
            <ol>
                <li>Move to a cool place</li>
                <li>Remove excess clothing</li>
                <li>Cool the body with water or ice packs</li>
                <li>Focus on head, neck, armpits, and groin</li>
                <li>Seek immediate medical attention</li>
            </ol>
            <div class="alert alert-danger mt-3">
                <strong>Warning Signs:</strong>
                <ul>
                    <li>High body temperature (103°F or higher)</li>
                    <li>Hot, red, dry skin</li>
                    <li>Rapid pulse</li>
                    <li>Headache, dizziness, confusion</li>
                </ul>
            </div>
        `
    },
    snakeBite: {
        title: "Snake Bite First Aid",
        category: "environmental",
        icon: "bi-bug-fill",
        urgency: "high",
        bookmarked: false,
        content: `
            <h4>Immediate Actions:</h4>
            <ol>
                <li>Keep the person calm and still</li>
                <li>Remove any constricting items</li>
                <li>Position the bite below heart level</li>
                <li>Clean the wound with soap and water</li>
                <li>Cover with clean, dry dressing</li>
                <li>Seek immediate medical attention</li>
            </ol>
            <div class="alert alert-danger mt-3">
                <strong>DO NOT:</strong>
                <ul>
                    <li>Apply a tourniquet</li>
                    <li>Try to suck out the venom</li>
                    <li>Apply ice or immerse in water</li>
                    <li>Give the person anything to eat or drink</li>
                </ul>
            </div>
        `
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadBookmarks();
    populateFirstAidCards();
    initializeEventListeners();
    initializeSearch();
    initializeFilters();
}

// Load bookmarks from localStorage
function loadBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem('firstAidBookmarks')) || [];
    bookmarks.forEach(key => {
        if (firstAidData[key]) {
            firstAidData[key].bookmarked = true;
        }
    });
}

// Save bookmarks to localStorage
function saveBookmarks() {
    const bookmarks = Object.keys(firstAidData).filter(key => firstAidData[key].bookmarked);
    localStorage.setItem('firstAidBookmarks', JSON.stringify(bookmarks));
}

// Initialize all event listeners
function initializeEventListeners() {
    // Emergency button
    document.getElementById('emergencyBtn').addEventListener('click', () => {
        new bootstrap.Modal(document.getElementById('emergencyModal')).show();
    });

    // Save offline button
    document.getElementById('saveOfflineBtn').addEventListener('click', handleOfflineSave);

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterCards(searchTerm);
    });
}

// Initialize category filters
function initializeFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterByCategory(e.target.dataset.category);
        });
    });
}

// Populate First Aid Cards
function populateFirstAidCards() {
    const firstAidList = document.getElementById('firstAidList');
    firstAidList.innerHTML = '';
    
    Object.entries(firstAidData).forEach(([key, data]) => {
        const card = createFirstAidCard(key, data);
        firstAidList.appendChild(card);
    });
}

// Create individual First Aid Card
function createFirstAidCard(key, data) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    
    const urgencyClass = data.urgency === 'critical' ? 'border-danger' : 'border-primary';
    
    col.innerHTML = `
        <div class="first-aid-card ${urgencyClass} h-100" data-scenario="${key}" data-category="${data.category}">
            <button class="bookmark-btn" data-scenario="${key}">
                <i class="bi ${data.bookmarked ? 'bi-bookmark-fill' : 'bi-bookmark'}"></i>
            </button>
            <div class="card-body p-4">
                <div class="d-flex align-items-center mb-3">
                    <i class="bi ${data.icon} text-primary me-2" style="font-size: 1.5rem;"></i>
                    <h5 class="card-title mb-0">${data.title}</h5>
                </div>
                <p class="card-text text-white-50">Click for detailed instructions</p>
                ${data.urgency === 'critical' ? 
                    '<span class="badge bg-danger">Critical</span>' : 
                    '<span class="badge bg-primary">Important</span>'
                }
            </div>
        </div>
    `;

    // Add click handlers
    const card = col.querySelector('.first-aid-card');
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.bookmark-btn')) {
            showFirstAidInstructions(key);
        }
    });

    const bookmarkBtn = col.querySelector('.bookmark-btn');
    bookmarkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleBookmark(key);
    });

    return col;
}

// Show First Aid Instructions
function showFirstAidInstructions(scenario) {
    const data = firstAidData[scenario];
    document.getElementById('firstAidModalTitle').textContent = data.title;
    document.getElementById('firstAidModalContent').innerHTML = data.content;
    new bootstrap.Modal(document.getElementById('firstAidModal')).show();
}

// Toggle bookmark status
function toggleBookmark(scenario) {
    firstAidData[scenario].bookmarked = !firstAidData[scenario].bookmarked;
    saveBookmarks();
    populateFirstAidCards();
}

// Filter cards by search term
function filterCards(searchTerm) {
    Object.entries(firstAidData).forEach(([key, data]) => {
        const card = document.querySelector(`[data-scenario="${key}"]`);
        const visible = data.title.toLowerCase().includes(searchTerm) || 
                       data.content.toLowerCase().includes(searchTerm);
        card.closest('.col-md-6').style.display = visible ? 'block' : 'none';
    });
}

// Filter by category
function filterByCategory(category) {
    Object.entries(firstAidData).forEach(([key, data]) => {
        const card = document.querySelector(`[data-scenario="${key}"]`);
        const visible = category === 'all' || data.category === category;
        card.closest('.col-md-6').style.display = visible ? 'block' : 'none';
    });
}

// Handle filter button clicks
function handleFilterClick(e) {
    const category = e.target.dataset.category;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    filterByCategory(category);
}

// Handle offline saving
function handleOfflineSave() {
    // Implementation for offline saving functionality
    const saveBtn = document.getElementById('saveOfflineBtn');
    saveBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Saved';
    saveBtn.classList.remove('btn-primary');
    saveBtn.classList.add('btn-success');
    
    setTimeout(() => {
        saveBtn.innerHTML = '<i class="bi bi-download me-2"></i>Save Offline';
        saveBtn.classList.remove('btn-success');
        saveBtn.classList.add('btn-primary');
    }, 2000);
}

// Service worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}