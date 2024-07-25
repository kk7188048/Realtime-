const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        if (position && position.coords) {
            socket.emit('sendLocation', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            }, (error) => {
                if (error) {
                    console.error(error);
                }
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        }
    });
} else {
    console.error('Geolocation is not supported.');
}

var map = L.map("map").setView([0, 0], 10);

var someLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "Github.com/kk7188048/RealTrack"
});

map.addLayer(someLayer);

const markers = {};

socket.on("receiveConnection", (data) => {
    if (data && (data.latitude && data.longitude)) {
      const { latitude, longitude } = data;
      const markerId = data.id || Math.random().toString(36).substring(2, 15); // Generate a random ID if not provided
      map.setView([latitude, longitude], 16);
      console.log("data", data);
      if (markers[markerId]) {
        markers[markerId].setLatLng([latitude, longitude]);
      } else {
        markers[markerId] = L.marker([latitude, longitude]).addTo(map);
      }
    } else {
      console.error('Invalid data (missing latitude or longitude) received from server.');
    }
  });
  

socket.on("disconnect", (id) => {
    if (id && markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
