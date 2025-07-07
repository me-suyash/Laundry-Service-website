// Service data array containing all available laundry services
const services = [
  {
    id: 1,
    name: "Dry Cleaning",
    price: 200,
    icon: "🧥",
  },
  {
    id: 2,
    name: "Wash & Fold",
    price: 100,
    icon: "👕",
  },
  {
    id: 3,
    name: "Ironing",
    price: 30,
    icon: "🔥",
  },
  {
    id: 4,
    name: "Stain Removal",
    price: 500,
    icon: "🧽",
  },
  {
    id: 5,
    name: "Leather & Suede Cleaning",
    price: 999,
    icon: "🧳",
  },
  {
    id: 6,
    name: "Wedding Dress Cleaning",
    price: 2800,
    icon: "👗",
  },
];

// Global cart array to store selected services
let cart = [];

/**
 * Renders all available services in the service container
 * Updates button states based on cart contents
 */
function renderServices() {
  const serviceContainer = document.getElementById("service-container");
  
  // Generate HTML for each service with dynamic button states
  serviceContainer.innerHTML = services
    .map((service) => {
      // Check if service is already in cart
      const isInCart = cart.some((item) => item.id === service.id);
      
      return `
        <div class="service-item">
          <div class="service-left">
            <span class="service-icon">${service.icon}</span>
            <div class="service-info">
              <h4>${service.name}</h4>
            </div>
          </div>
          <div class="service-actions">
            <span class="service-price">₹${service.price}.00</span>
            <button class="btn ${isInCart ? "btn-remove" : "btn-add"}" 
                    onclick="${isInCart ? "removeFromCart" : "addToCart"}(${service.id})">
              <span>${isInCart ? "Remove Item" : "Add Item"}</span>
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

/**
 * Renders the cart contents and updates total price
 * Shows empty state when cart is empty
 */
function renderCart() {
  const cartContainer = document.getElementById("cart-container");
  const totalPriceElement = document.getElementById("total-price");

  // Display empty cart state
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <i class="material-icons">shopping_cart</i>
        <h4>No Items Added</h4>
        <p>Add items to the cart from the services section</p>
      </div>
    `;
    totalPriceElement.textContent = "₹0.00";
  } else {
    // Display cart items with serial numbers
    cartContainer.innerHTML = cart
      .map(
        (item, index) => `
          <div class="cart-item">
            <p>${index + 1}</p>
            <p>${item.name}</p>
            <p>₹${item.price}.00</p>
          </div>
        `
      )
      .join("");

    // Calculate and display total amount
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalPriceElement.textContent = `₹${total}.00`;
  }
}

/**
 * Adds a service to the cart
 * @param {number} serviceId - The ID of the service to add
 */
function addToCart(serviceId) {
  const service = services.find((s) => s.id === serviceId);
  
  // Add service if found and not already in cart
  if (service && !cart.some((item) => item.id === serviceId)) {
    cart.push(service);
    renderServices(); // Update service buttons
    renderCart();     // Update cart display
  }
}

/**
 * Removes a service from the cart
 * @param {number} serviceId - The ID of the service to remove
 */
function removeFromCart(serviceId) {
  cart = cart.filter((item) => item.id !== serviceId);
  renderServices(); // Update service buttons
  renderCart();     // Update cart display
}

/**
 * Shows a temporary message to the user
 * @param {string} text - The message text to display
 */
function showMessage(text) {
  const messageElement = document.getElementById("message");
  const messageText = document.getElementById("message-text");
  
  // Set message text and show
  messageText.textContent = text;
  messageElement.classList.add("show");

  // Hide message after 2 seconds
  setTimeout(() => {
    messageElement.classList.remove("show");
  }, 2000);
}

// Form submission handler for booking services
document
  .getElementById("booking-form")
  .addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    // Validate cart is not empty
    if (cart.length === 0) {
      document.getElementById("confirm-icon").textContent = "error_outline";
      showMessage(
        "Please add at least one service to your cart before booking."
      );
      return;
    }

    // Get form data
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;

    // Process booking if all fields are filled
    if (name && email && phone) {
      const total = cart.reduce((sum, item) => sum + item.price, 0);

      // Show confirmation dialog with booking details
      const confirmBooking = confirm(
        `Confirm your booking:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nServices: ${cart
          .map((item) => item.name)
          .join(", ")}\nTotal: ₹${total}.00\n\nClick OK to confirm booking, or Cancel to continue editing.`
      );

      // Process confirmed booking
      if (confirmBooking) {
        document.getElementById("confirm-icon").textContent = "check_circle";
        showMessage(
          `Booking confirmed for ${name}! Total amount: ₹${total}.00. You will receive confirmation details shortly.`
        );
        
        // Reset form and cart after successful booking
        document.getElementById("booking-form").reset();
        cart = [];
        renderServices();
        renderCart();
      }
    }
  });

// Initialize the application by rendering cart and services
renderCart();
renderServices();