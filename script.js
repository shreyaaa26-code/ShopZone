let cartCount = 0;


// ================= CART =================

function addToCart(button) {

    cartCount++;

    document.getElementById("cartCount").textContent = cartCount;

    button.textContent = "✓ Added to Cart";
    button.classList.add("added");

    setTimeout(() => {
        button.textContent = "Add to Cart";
        button.classList.remove("added");
    }, 1500);
}


// ================= WISHLIST =================

function toggleWishlist(button) {

    button.classList.toggle("active");

    if (button.classList.contains("active")) {
        button.textContent = "♥";
    } else {
        button.textContent = "♡";
    }
}


// ================= SCROLL =================

function scrollToProducts() {
    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}


function scrollToCategories() {
    document.getElementById("categories").scrollIntoView({
        behavior: "smooth"
    });
}


// ================= OFFER =================

function claimOffer() {

    alert(
        "🎉 Congratulations!\n\n" +
        "Your 20% first-order offer is ready!\n\n" +
        "Use code: SHOP20"
    );
}


// ================= SEARCH =================

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {

    const searchValue = this.value.toLowerCase();

    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {

        const productName =
            product.getAttribute("data-name").toLowerCase();

        if (productName.includes(searchValue)) {
            product.style.display = "block";
        } else {
            product.style.display = "none";
        }
    });
});


// ================= NEWSLETTER =================

document
    .getElementById("newsletterForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const email =
            document.getElementById("emailInput").value;

        if (email.trim() !== "") {

            alert(
                "Thank you for subscribing to ShopZone! 💜"
            );

            document.getElementById("emailInput").value = "";
        }
    });