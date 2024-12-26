document.addEventListener("DOMContentLoaded", function() {
    let restaurantList = document.getElementById("restaurant-list");
    let searchInput = document.getElementById("search");
    let restaurantsData = [];

    fetch("http://localhost:3000/restaurants")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            restaurantsData = data.restaurants;
            displayRestaurants(restaurantsData);
        })
        .catch(function(error) {
            console.error("Error fetching restaurant data:", error);
        });

    function displayRestaurants(restaurants) {
        restaurantList.innerHTML = "";

        for (let i = 0; i < restaurants.length; i++) {
            let restaurant = restaurants[i];
            let card = document.createElement("div");
            card.classList.add("card-1");

            card.innerHTML = `
                <img src="${restaurant.image}" alt="${restaurant.name}">
                <h3>${restaurant.name}</h3>
                <h4>${restaurant.specialty}</h4>
                <hr>
                <div>
                    <h5>${restaurant.rating}</h5>
                    <img src="img/star.png" alt="Review Stars" id="star">
                </div>
                <hr>
                <p>${restaurant.address}</p>
            `;

            card.addEventListener("click", function() {
                window.location.href = "details.html?name=" + encodeURIComponent(restaurant.name);
            });

            restaurantList.appendChild(card);
        }
    }

    searchInput.addEventListener("input", function() {
        let searchTerm = searchInput.value.toLowerCase();
        let filteredRestaurants = [];

        for (let i = 0; i < restaurantsData.length; i++) {
            let restaurant = restaurantsData[i];
            if (restaurant.name.toLowerCase().includes(searchTerm) ||
                restaurant.specialty.toLowerCase().includes(searchTerm) ||
                restaurant.address.toLowerCase().includes(searchTerm)) {
                filteredRestaurants.push(restaurant);
            }
        }

        displayRestaurants(filteredRestaurants);
    });
});
