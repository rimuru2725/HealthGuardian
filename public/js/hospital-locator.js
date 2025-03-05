let map, userLat, userLon;
let hospitals = [];
let routingControl = null;
let userMarker = null;

// Initialize the map
function initializeMap() {
    map = L.map('map').setView([0, 0], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Get user's location
    getUserLocation();
    
    // Add event listeners
    document.getElementById('getCurrentLocation').addEventListener('click', getUserLocation);
    document.getElementById('findNearest').addEventListener('click', findNearestHospital);
}

// Get user's location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                userLat = position.coords.latitude;
                userLon = position.coords.longitude;
                
                // Update user marker
                if (userMarker) {
                    map.removeLayer(userMarker);
                }
                
                userMarker = L.marker([userLat, userLon])
                    .addTo(map)
                    .bindPopup('Your Location')
                    .openPopup();
                
                map.setView([userLat, userLon], 13);
                
                // Fetch nearby hospitals
                fetchHospitals();
            },
            error => {
                alert('Unable to retrieve your location. Error: ' + error.message);
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}


// Fetch nearby hospitals using Overpass API
function fetchHospitals() {
    const radius = 5000; // 5km radius
    const query = `
        [out:json][timeout:25];
        (
            node["amenity"="hospital"](around:${radius},${userLat},${userLon});
            way["amenity"="hospital"](around:${radius},${userLat},${userLon});
            relation["amenity"="hospital"](around:${radius},${userLat},${userLon});
        );
        out body;
        >;
        out skel qt;
    `;

    fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            hospitals = [];
            data.elements.forEach(element => {
                if (element.type === "node" || (element.type === "way" && element.center)) {
                    const hospital = {
                        lat: element.type === "node" ? element.lat : element.center.lat,
                        lon: element.type === "node" ? element.lon : element.center.lon,
                        name: element.tags?.name || "Unnamed Hospital",
                        phone: element.tags?.phone || "N/A",
                        website: element.tags?.website || null
                    };
                    hospitals.push(hospital);
                    addHospitalMarker(hospital);
                }
            });
            
            updateStatistics();
            updateHospitalList();
        })
        .catch(error => {
            console.error('Error fetching hospitals:', error);
            alert('Error fetching nearby hospitals. Please try again later.');
        });
}
// Add hospital marker to map
function addHospitalMarker(hospital) {
    const hospitalIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const marker = L.marker([hospital.lat, hospital.lon], { icon: hospitalIcon })
        .addTo(map)
        .bindPopup(createPopupContent(hospital));

    marker.on('click', () => {
        showDirections(hospital);
    });
}



// Create popup content for hospital marker
function createPopupContent(hospital) {
    return `
        <div class="hospital-popup">
            <h6>${hospital.name}</h6>
            ${hospital.phone !== 'N/A' ? `<p><i class="bi bi-telephone"></i> ${hospital.phone}</p>` : ''}
            ${hospital.website ? `<p><a href="${hospital.website}" target="_blank">Visit Website</a></p>` : ''}
            <button onclick="showDirections({lat: ${hospital.lat}, lon: ${hospital.lon}, name: '${hospital.name.replace(/'/g, "\\'")}'}, true)" 
                    class="btn btn-sm btn-primary">
                Get Directions
            </button>
        </div>
    `;
}

// Show directions to selected hospital
// Show directions to selected hospital
// Update the directions panel
// Update the directions panel
function updateDirectionsPanel(hospitalName, distance, time, route) {
    // Safely extract steps from all legs
    const allSteps = route.legs.flatMap(leg => 
        leg.steps.map(step => {
            // Safely handle undefined instructions
            const instruction = step.maneuver.instruction || 'Continue';
            
            return {
                instruction: instruction,
                distance: step.distance > 0 ? (step.distance / 1000).toFixed(2) : 0, // Convert to kilometers
                type: step.maneuver.type || 'unknown'
            };
        })
    ).filter(step => step.instruction); // Remove any potentially empty steps
    
    const directionsHtml = `
        <div class="hospital-info-card p-3">
            <div class="hospital-name">${hospitalName}</div>
            <div class="directions-summary">
                <div><i class="bi bi-geo-alt"></i> Distance: ${distance} km</div>
                <div><i class="bi bi-clock"></i> Estimated Time: ${time} minutes</div>
            </div>
            <div class="directions-steps mt-3">
                ${allSteps.slice(0, 10).map((step, index) => `
                    <div class="direction-step mb-2">
                        <div class="d-flex align-items-start">
                            <span class="me-2 text-muted">${index + 1}.</span>
                            <div>
                                <small class="d-block text-white">${step.instruction}</small>
                                ${step.distance > 0 ? 
                                    `<small class="text-muted">Segment Distance: ${step.distance} km</small>` 
                                    : ''}
                            </div>
                        </div>
                    </div>
                `).join('') || '<div class="text-muted">No detailed route steps available</div>'}
            </div>
        </div>
    `;

    document.getElementById('hospitalList').innerHTML = directionsHtml;
}

// Show directions to selected hospital
function showDirections(hospital, fromPopup = false) {
    // Remove existing routing control if it exists
    if (routingControl) {
        map.removeControl(routingControl);
    }

    // Use a more reliable OSRM service or self-hosted routing server
    const osrmServiceUrl = 'https://router.project-osrm.org/route/v1/driving/';
    
    // Construct the OSRM routing URL with detailed steps
    const routeUrl = `${osrmServiceUrl}${userLon},${userLat};${hospital.lon},${hospital.lat}?overview=full&geometries=geojson&steps=true&annotations=true`;

    fetch(routeUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Routing request failed');
            }
            return response.json();
        })
        .then(routeData => {
            // Check if routes exist
            if (routeData.routes && routeData.routes.length > 0) {
                const route = routeData.routes[0];
                const distance = (route.distance / 1000).toFixed(1); // Convert to kilometers
                const duration = Math.round(route.duration / 60); // Convert to minutes

                // Draw the route on the map
                const routeCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
                const routeLine = L.polyline(routeCoordinates, {
                    color: 'blue',
                    weight: 5,
                    opacity: 0.7
                }).addTo(map);

                // Fit the map to the route
                map.fitBounds(routeLine.getBounds());

                // Debugging: Log route data to console
                console.log('Route Data:', route);

                // Update directions panel
                updateDirectionsPanel(hospital.name, distance, duration, route);

                if (fromPopup) {
                    const popup = L.popup()
                        .setLatLng([hospital.lat, hospital.lon])
                        .setContent(createPopupContent(hospital))
                        .openOn(map);
                }
            } else {
                throw new Error('No route found');
            }
        })
        .catch(error => {
            console.error('Routing error:', error);
            
            // Fallback to simple distance calculation
            const distance = calculateDistance(userLat, userLon, hospital.lat, hospital.lon).toFixed(1);
            const directionsHtml = `
                <div class="hospital-info-card p-3">
                    <div class="hospital-name text-warning">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        Routing Unavailable
                    </div>
                    <div class="directions-summary">
                        <div><i class="bi bi-geo-alt"></i> Direct Distance: ${distance} km</div>
                        <small class="text-muted">Detailed routing could not be retrieved.</small>
                    </div>
                </div>
            `;

            document.getElementById('hospitalList').innerHTML = directionsHtml;

            // Draw a simple line between user and hospital
            L.polyline([
                [userLat, userLon],
                [hospital.lat, hospital.lon]
            ], {
                color: 'red',
                weight: 2,
                opacity: 0.5,
                dashArray: '5, 10'
            }).addTo(map);
        });
}
// Find nearest hospital
// Find nearest hospital
function findNearestHospital() {
    if (hospitals.length === 0) {
        alert('No hospitals found nearby.');
        return;
    }

    let nearestHospital = hospitals[0];
    let shortestDistance = calculateDistance(userLat, userLon, hospitals[0].lat, hospitals[0].lon);

    hospitals.forEach(hospital => {
        const distance = calculateDistance(userLat, userLon, hospital.lat, hospital.lon);
        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestHospital = hospital;
        }
    });

    // Center map on the nearest hospital
    map.setView([nearestHospital.lat, nearestHospital.lon], 15);
    
    // Show directions to the nearest hospital
    showDirections(nearestHospital);
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
             Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
             Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Convert degrees to radians
function toRad(degrees) {
    return degrees * (Math.PI/180);
}

// Update statistics (nearby count and average distance)
function updateStatistics() {
    // Update nearby hospitals count
    document.getElementById('nearbyCount').textContent = hospitals.length;

    // Calculate and update average distance
    if (hospitals.length > 0) {
        const totalDistance = hospitals.reduce((sum, hospital) => {
            return sum + calculateDistance(userLat, userLon, hospital.lat, hospital.lon);
        }, 0);
        const avgDistance = (totalDistance / hospitals.length).toFixed(1);
        document.getElementById('avgDistance').textContent = `${avgDistance} km`;
    }
}

// Update hospital list in sidebar
function updateHospitalList() {
    const hospitalListElement = document.getElementById('hospitalList');
    hospitalListElement.innerHTML = hospitals.map(hospital => {
        const distance = calculateDistance(userLat, userLon, hospital.lat, hospital.lon).toFixed(1);
        return `
            <div class="hospital-info-card p-3 border-bottom border-secondary">
                <h6 class="text-white">${hospital.name}</h6>
                <p class="text-white-50 mb-2">
                    <i class="bi bi-geo-alt-fill me-2"></i>${distance} km away
                </p>
                <div class="d-flex gap-2">
                    <button onclick="showDirections({lat: ${hospital.lat}, lon: ${hospital.lon}, name: '${hospital.name.replace(/'/g, "\\'")}'}, true)" 
                            class="btn btn-sm btn-primary">
                        <i class="bi bi-map"></i> Directions
                    </button>
                    ${hospital.phone !== 'N/A' ? 
                        `<a href="tel:${hospital.phone}" class="btn btn-sm btn-outline-light">
                            <i class="bi bi-telephone"></i> Call
                        </a>` : ''
                    }
                </div>
            </div>
        `;
    }).join('');
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMap);