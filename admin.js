document.addEventListener("DOMContentLoaded", function() {
    let restaurantList = document.getElementById("restaurant-list");
    let form = document.getElementById("add-restaurant-form");

    fetch("http://localhost:3000/restaurants")
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            let restaurants = data.restaurants;
            displayRestaurants(restaurants);
            updateTotalRestaurants(restaurants.length);
        })
        .catch(function(error) {
            console.error("Error fetching restaurants:", error);
        });

    function displayRestaurants(restaurants) {
        restaurantList.innerHTML = "";

        for (let i = 0; i < restaurants.length; i++) {
            let restaurant = restaurants[i];
            let card = document.createElement("div");
            card.classList.add("resta-card");

            card.innerHTML = `
                <img src="${restaurant.image}" alt="${restaurant.name}">
                <h3>${restaurant.name}</h3>
                <h4>${restaurant.specialty}</h4>
                <div class="rating">
                    <h3>${restaurant.rating}</h3>
                    <img src="img/star.png" alt="Star">
                </div>
                <div class="buttons">
                    <img src="img/trash.png" alt="Delete" class="delete-button" data-id="${restaurant.id}">
                </div>
            `;

            restaurantList.appendChild(card);
        }

        addDeleteEventListeners();
    }

    function updateTotalRestaurants(count) {
        document.querySelector(".total h4").textContent = count;
    }

    function addDeleteEventListeners() {
        let deleteButtons = document.querySelectorAll(".delete-button");

        for (let i = 0; i < deleteButtons.length; i++) {
            (function(button) {
                button.addEventListener("click", function() {
                    let restaurantId = button.getAttribute("data-id");
                    deleteRestaurant(restaurantId);
                });
            })(deleteButtons[i]);
        }
    }

    function deleteRestaurant(id) {
        fetch("http://localhost:3000/restaurant/" + id, {
            method: "DELETE",
        })
        .then(function(response) {
            if (response.ok) {
                alert("Restaurant deleted successfully!");
                fetchRestaurants();
            } else {
                throw new Error("Failed to delete restaurant");
            }
        })
        .catch(function(error) {
            console.error("Error deleting restaurant:", error);
        });
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        let restaurantData = {
            name: form.name.value,
            address: form.address.value,
            specialty: form.specialty.value,
            rating: parseFloat(form.rating.value),
            description: form.description.value,
            image: form.image.value,
            website: form.website.value || "",
            phone: form.phone.value
        };

        fetch("http://localhost:3000/restaurant", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(restaurantData)
        })
        .then(function(response) {
            if (!response.ok) throw new Error("Failed to add restaurant");
            return response.json();
        })
        .then(function(data) {
            alert("Restaurant added successfully!");
            window.location.reload();
        })
        .catch(function(error) {
            console.error("Error adding restaurant:", error);
        });
    });
});
