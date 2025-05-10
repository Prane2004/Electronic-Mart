// Sample product data
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        price: 149900,
        image: "images/15pr.webp",
        category: "Mobiles"
    },
    {
        id: 2,
        name: "MacBook Pro M3",
        price: 199900,
        image: "images/m3.webp",
        category: "Laptops"
    },
    {
        id: 3,
        name: "Sony WH-1000XM5",
        price: 29990,
        image: "images/wh.webp",
        category: "Audio"
    },
    {
        id: 4,
        name: "Samsung Galaxy S24 Ultra",
        price: 129999,
        image: "images/s24.webp",
        category: "Mobiles"
    },
    {
        id: 5,
        name: "Dell XPS 15",
        price: 189990,
        image: "images/xps15.webp",
        category: "Laptops"
    },
    {
        id: 6,
        name: "Apple AirPods Pro 2",
        price: 24900,
        image: "images/pro2.webp",
        category: "Audio"
    },
    {
        id: 7,
        name: "Samsung 65\" QLED TV",
        price: 149990,
        image: "images/qled.webp",
        category: "Television"
    },
    {
        id: 8,
        name: "Logitech MX Master 3S",
        price: 9990,
        image: "images/mx.webp",
        category: "Accessories"
    }
];

// Cart functionality
let cart = [];

// DOM Elements
const productGrid = document.querySelector('.product-grid');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotal = document.getElementById('cart-total-amount');
const closeModal = document.querySelector('.close-modal');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Slideshow functionality
function initSlideshow() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-nav-dot');
    const prevBtn = document.querySelector('.slide-arrow.prev');
    const nextBtn = document.querySelector('.slide-arrow.next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopSlideshow() {
        clearInterval(slideInterval);
    }

    // Event listeners
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopSlideshow();
            startSlideshow();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopSlideshow();
            startSlideshow();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            stopSlideshow();
            startSlideshow();
        });
    });

    // Start the slideshow
    startSlideshow();

    // Pause slideshow on hover
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mouseenter', stopSlideshow);
        hero.addEventListener('mouseleave', startSlideshow);
    }
}

// Initialize the page
function init() {
    setupEventListeners();
    initSlideshow();
    
    // Check if we're on the products page
    if (window.location.pathname.includes('products.html')) {
        setupProductFilters();
        displayProducts();
    } else if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        // On home page, show only featured products
        displayFeaturedProducts();
    }
}

// Display featured products on home page
function displayFeaturedProducts() {
    if (!productGrid) return;
    
    const featuredProducts = products.slice(0, 4); // Show first 4 products
    productGrid.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

// Display all products on products page
function displayProducts(category = 'all') {
    if (!productGrid) return;
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    productGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card fade-in">
            <div class="product-badge">New</div>
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">₹${product.price.toLocaleString('en-IN')}</p>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="wishlist-btn">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Setup product filters
function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter products
            const category = button.dataset.category;
            displayProducts(category);
        });
    });

    // Check URL parameters for initial category
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
        const button = document.querySelector(`.filter-btn[data-category="${category}"]`);
        if (button) {
            button.click();
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Add to cart buttons
    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(e.target.dataset.id);
                addToCart(productId);
            }
        });
    }

    // Cart modal
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            cartModal.style.display = 'block';
            updateCartDisplay();
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
    }

    if (cartModal) {
        window.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
            }
        });
    }

    // Mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            alert(`Thank you for subscribing with ${email}!`);
            newsletterForm.reset();
        });
    }
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        updateCartCount();
        showNotification('Item added to cart!');
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartDisplay();
}

// Update cart count
function updateCartCount() {
    if (!cartCount) return;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update cart display
function updateCartDisplay() {
    if (!cartItems || !cartTotal) return;
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price.toLocaleString('en-IN')} x ${item.quantity}</p>
            </div>
            <span class="remove-item" data-id="${item.id}">&times;</span>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toLocaleString('en-IN');

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.dataset.id);
            removeFromCart(productId);
        });
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification fade-in';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add scroll event listener for navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            navbar.style.background = 'var(--background)';
        }
    }
}); 