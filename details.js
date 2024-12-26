document.addEventListener("DOMContentLoaded", function () {
    let params = new URLSearchParams(window.location.search);
    let restaurantName = params.get("name");

    if (restaurantName) {
        fetch("http://localhost:3000/restaurants/" + restaurantName)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error("Restaurant not found");
                }
                return response.json();
            })
            .then(function (restaurant) {
                document.getElementById("restaurant-name").textContent = restaurant.name;
                document.getElementById("restaurant-address").textContent = restaurant.address;
                document.getElementById("restaurant-image").src = restaurant.image;
                document.getElementById("restaurant-image").alt = restaurant.name;
                document.getElementById("restaurant-rating").textContent = restaurant.rating;
                document.getElementById("restaurant-specialty").textContent = restaurant.specialty;
                document.getElementById("restaurant-description").textContent = restaurant.description;


                let reviewsCount = restaurant.reviewsCount || 0;
                let reviewText = reviewsCount === 1 ? "Review" : "Reviews";
                document.getElementById("restaurant-reviews").textContent = reviewsCount + " " + reviewText;

                document.getElementById("restaurant-website").onclick = function () {
                    window.open(restaurant.website, "_blank");
                };
                document.getElementById("restaurant-call").onclick = function () {
                    window.location.href = "tel:" + restaurant.phone;
                };
            })
            .catch(function (error) {
                console.error("Error fetching restaurant details:", error);
                document.querySelector(".container").innerHTML = "<p>Restaurant not found.</p>";
            });
    } else {
        document.querySelector(".container").innerHTML = "<p>No restaurant specified.</p>";
    }
});
