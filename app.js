/* =========================================================
       PRODUCT DATA
    ========================================================= */

    const products = [

        {
            id: 1,
            name: "Samsung Galaxy S25",
            brand: "Samsung",
            category: "Mobile",
            icon: "📱",
            price: 63999,
            rating: 4.7,
            description:
                "Premium Samsung smartphone with powerful performance.",
            specifications: {
                RAM: "12GB",
                Storage: "256GB",
                Display: "6.2 inch",
                Camera: "50MP",
                Battery: "4000mAh"
            }
        },

        {
            id: 2,
            name: "iPhone 17",
            brand: "Apple",
            category: "Mobile",
            icon: "📱",
            price: 79999,
            rating: 4.8,
            description:
                "Latest Apple smartphone with advanced performance.",
            specifications: {
                RAM: "8GB",
                Storage: "256GB",
                Display: "6.3 inch",
                Camera: "48MP",
                Battery: "3561mAh"
            }
        },

        {
            id: 3,
            name: "HP Pavilion 15",
            brand: "HP",
            category: "Laptop",
            icon: "💻",
            price: 65999,
            rating: 4.4,
            description:
                "Powerful laptop for students and professionals.",
            specifications: {
                RAM: "16GB",
                Storage: "512GB SSD",
                Processor: "Intel Core i5",
                Display: "15.6 inch"
            }
        },

        {
            id: 4,
            name: "Dell Inspiron 15",
            brand: "Dell",
            category: "Laptop",
            icon: "💻",
            price: 62999,
            rating: 4.5,
            description:
                "Reliable everyday laptop.",
            specifications: {
                RAM: "16GB",
                Storage: "512GB SSD",
                Processor: "Intel Core i5",
                Display: "15.6 inch"
            }
        },

        {
            id: 5,
            name: "Sony Bravia 55 Inch 4K",
            brand: "Sony",
            category: "TV",
            icon: "📺",
            price: 52999,
            rating: 4.6,
            description:
                "55 inch 4K Smart TV.",
            specifications: {
                Screen: "55 inch",
                Resolution: "4K",
                SmartTV: "Yes",
                HDR: "Yes"
            }
        },

        {
            id: 6,
            name: "Samsung 55 Inch 4K Smart TV",
            brand: "Samsung",
            category: "TV",
            icon: "📺",
            price: 49999,
            rating: 4.5,
            description:
                "Samsung 4K Smart TV.",
            specifications: {
                Screen: "55 inch",
                Resolution: "4K",
                SmartTV: "Yes",
                HDR: "Yes"
            }
        },

        {
            id: 7,
            name: "Sony WH-1000XM5",
            brand: "Sony",
            category: "Headphones",
            icon: "🎧",
            price: 29999,
            rating: 4.8,
            description:
                "Premium noise cancelling headphones.",
            specifications: {
                Type: "Over Ear",
                ANC: "Yes",
                Battery: "30 Hours"
            }
        },

        {
            id: 8,
            name: "Canon EOS 1500D",
            brand: "Canon",
            category: "Camera",
            icon: "📷",
            price: 45999,
            rating: 4.4,
            description:
                "Entry-level DSLR camera.",
            specifications: {
                Sensor: "24.1MP",
                Video: "Full HD",
                Lens: "18-55mm"
            }
        },

        {
            id: 9,
            name: "Sony PlayStation 5",
            brand: "Sony",
            category: "Gaming",
            icon: "🎮",
            price: 54999,
            rating: 4.9,
            description:
                "Next generation gaming console.",
            specifications: {
                Storage: "825GB SSD",
                Resolution: "4K",
                HDR: "Yes"
            }
        }

    ];


    /* =========================================================
       SHOP DATA
    ========================================================= */

    const shops = [

        {
            id: 1,
            name: "City Electronics",
            address: "Main Road",
            phone: "9876543210",
            lat: 19.8762,
            lng: 75.3433,
            rating: 4.5,
            reviews: 120,
            verified: true
        },

        {
            id: 2,
            name: "Tech World",
            address: "Station Road",
            phone: "9876543211",
            lat: 19.8810,
            lng: 75.3390,
            rating: 4.7,
            reviews: 200,
            verified: true
        },

        {
            id: 3,
            name: "Digital Point",
            address: "Market Area",
            phone: "9876543212",
            lat: 19.8700,
            lng: 75.3500,
            rating: 4.2,
            reviews: 80,
            verified: false
        },

        {
            id: 4,
            name: "Smart Electronics",
            address: "Central Market",
            phone: "9876543213",
            lat: 19.8830,
            lng: 75.3460,
            rating: 4.6,
            reviews: 150,
            verified: true
        },

        {
            id: 5,
            name: "Future Tech Store",
            address: "City Center",
            phone: "9876543214",
            lat: 19.8680,
            lng: 75.3380,
            rating: 4.3,
            reviews: 95,
            verified: false
        }

    ];


    /* =========================================================
       SHOP PRICES
    ========================================================= */

    const shopProducts = [

        /* Samsung S25 */

        {
            productId: 1,
            shopId: 1,
            price: 64999,
            stock: 5,
            warranty: "1 Year"
        },

        {
            productId: 1,
            shopId: 2,
            price: 63999,
            stock: 3,
            warranty: "1 Year"
        },

        {
            productId: 1,
            shopId: 3,
            price: 65999,
            stock: 8,
            warranty: "1 Year"
        },

        {
            productId: 1,
            shopId: 4,
            price: 64500,
            stock: 2,
            warranty: "1 Year"
        },

        {
            productId: 1,
            shopId: 5,
            price: 65500,
            stock: 0,
            warranty: "1 Year"
        },


        /* iPhone */

        {
            productId: 2,
            shopId: 1,
            price: 80999,
            stock: 3,
            warranty: "1 Year"
        },

        {
            productId: 2,
            shopId: 2,
            price: 79999,
            stock: 2,
            warranty: "1 Year"
        },

        {
            productId: 2,
            shopId: 3,
            price: 81500,
            stock: 1,
            warranty: "1 Year"
        },

        {
            productId: 2,
            shopId: 4,
            price: 80500,
            stock: 5,
            warranty: "1 Year"
        },


        /* HP */

        {
            productId: 3,
            shopId: 1,
            price: 67999,
            stock: 4,
            warranty: "1 Year"
        },

        {
            productId: 3,
            shopId: 2,
            price: 65999,
            stock: 2,
            warranty: "1 Year"
        },

        {
            productId: 3,
            shopId: 3,
            price: 68999,
            stock: 5,
            warranty: "1 Year"
        },


        /* Dell */

        {
            productId: 4,
            shopId: 1,
            price: 63999,
            stock: 3,
            warranty: "1 Year"
        },

        {
            productId: 4,
            shopId: 2,
            price: 62999,
            stock: 2,
            warranty: "1 Year"
        },

        {
            productId: 4,
            shopId: 4,
            price: 63500,
            stock: 4,
            warranty: "1 Year"
        },


        /* Sony TV */

        {
            productId: 5,
            shopId: 1,
            price: 54999,
            stock: 3,
            warranty: "2 Years"
        },

        {
            productId: 5,
            shopId: 2,
            price: 52999,
            stock: 2,
            warranty: "2 Years"
        },

        {
            productId: 5,
            shopId: 3,
            price: 53999,
            stock: 1,
            warranty: "2 Years"
        },


        /* Samsung TV */

        {
            productId: 6,
            shopId: 1,
            price: 50999,
            stock: 2,
            warranty: "2 Years"
        },

        {
            productId: 6,
            shopId: 2,
            price: 49999,
            stock: 4,
            warranty: "2 Years"
        },

        {
            productId: 6,
            shopId: 4,
            price: 50500,
            stock: 2,
            warranty: "2 Years"
        },


        /* Headphones */

        {
            productId: 7,
            shopId: 1,
            price: 30999,
            stock: 3,
            warranty: "1 Year"
        },

        {
            productId: 7,
            shopId: 2,
            price: 29999,
            stock: 4,
            warranty: "1 Year"
        },

        {
            productId: 7,
            shopId: 3,
            price: 31999,
            stock: 2,
            warranty: "1 Year"
        },


        /* Camera */

        {
            productId: 8,
            shopId: 1,
            price: 46999,
            stock: 2,
            warranty: "2 Years"
        },

        {
            productId: 8,
            shopId: 2,
            price: 45999,
            stock: 3,
            warranty: "2 Years"
        },

        {
            productId: 8,
            shopId: 4,
            price: 46499,
            stock: 2,
            warranty: "2 Years"
        },


        /* PS5 */

        {
            productId: 9,
            shopId: 1,
            price: 55999,
            stock: 1,
            warranty: "1 Year"
        },

        {
            productId: 9,
            shopId: 2,
            price: 54999,
            stock: 2,
            warranty: "1 Year"
        },

        {
            productId: 9,
            shopId: 3,
            price: 56999,
            stock: 1,
            warranty: "1 Year"
        }

    ];


    /* =========================================================
       REVIEWS
    ========================================================= */

    const reviews = [

        {
            shopId: 2,
            user: "Rahul",
            rating: 5,
            text:
                "Excellent service and genuine products."
        },

        {
            shopId: 1,
            user: "Amit",
            rating: 4,
            text:
                "Good shop. Staff is helpful."
        },

        {
            shopId: 4,
            user: "Priya",
            rating: 5,
            text:
                "Very good experience and reasonable prices."
        },

        {
            shopId: 3,
            user: "Sanjay",
            rating: 4,
            text:
                "Good product collection."
        }

    ];


    /* =========================================================
       USER LOCATION
    ========================================================= */

    let userLocation = {
        lat: 19.8762,
        lng: 75.3433
    };


    /* =========================================================
       MAP
    ========================================================= */

    let map = null;

    let mapMarkers = [];


    /* =========================================================
       INITIAL LOAD
    ========================================================= */

    window.onload = function() {

        renderProducts(products);

    };


    /* =========================================================
       RENDER PRODUCTS
    ========================================================= */

    const productImages = {
        Mobile: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=85",
        Laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=85",
        TV: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=900&q=85",
        Headphones: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
        Camera: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",
        Gaming: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=85"
    };

    function getInStockOffers(productId) {
        return shopProducts.filter(offer => offer.productId === productId && offer.stock > 0);
    }

    function renderProducts(productList) {
        const container = document.getElementById("productsContainer");
        container.innerHTML = "";

        if (productList.length === 0) {
            container.innerHTML = `<div class="empty-state"><div class="empty-icon">⌕</div><h2>No products found</h2><p>Try a different name or category.</p></div>`;
            return;
        }

        document.getElementById("resultInfo").innerText = `${productList.length} products found`;

        productList.forEach(product => {
            const offers = getInStockOffers(product.id);
            const lowest = offers.length ? Math.min(...offers.map(offer => offer.price)) : null;
            const card = document.createElement("article");
            card.className = "product-card";
            card.innerHTML = `
                <div class="product-image-wrap">
                    <span class="availability-badge ${offers.length ? "in-stock" : "out-stock"}">${offers.length ? "In stock" : "Out of stock"}</span>
                    <button class="wishlist-button" aria-label="Add ${product.name} to wishlist" onclick="toggleWishlist(this, ${product.id})">♡</button>
                    <img src="${productImages[product.category]}" alt="${product.name}" class="product-image-real" loading="lazy">
                </div>
                <div class="product-info">
                    <p class="brand">${product.brand}</p>
                    <h3>${product.name}</h3>
                    <div class="product-rating"><span>★</span> ${product.rating} <small>Verified rating</small></div>
                    <p class="starting-label">${lowest ? "Lowest nearby price" : "Price unavailable"}</p>
                    <div class="price">${lowest ? "₹" + lowest.toLocaleString() : "—"}</div>
                    <label class="compare-checkbox"><input type="checkbox" onchange="toggleProductCompare(this, ${product.id})"> Add to compare</label>
                    <div class="product-buttons">
                        <button class="primary-btn" onclick="compareProduct(${product.id})">Compare prices</button>
                        <button class="secondary-btn" onclick="openPriceAlert(${product.id})" aria-label="Create price alert">🔔</button>
                        <button class="secondary-btn" onclick="showSpecifications(${product.id})" aria-label="View specifications">ⓘ</button>
                    </div>
                </div>`;
            container.appendChild(card);
        });
        renderFeaturedDeals(productList);
    }

    function toggleWishlist(button, productId) {
        button.classList.toggle("active");
        button.textContent = button.classList.contains("active") ? "♥" : "♡";
        button.setAttribute("aria-label", button.classList.contains("active") ? "Remove from wishlist" : "Add to wishlist");
        showToast(button.classList.contains("active") ? "Added to wishlist" : "Removed from wishlist", "success");
    }

    function toggleProductCompare(checkbox, productId) {
        window.compareSelection = window.compareSelection || new Set();
        checkbox.checked ? window.compareSelection.add(productId) : window.compareSelection.delete(productId);
        showToast(`${window.compareSelection.size} product${window.compareSelection.size === 1 ? "" : "s"} selected to compare`, "info");
    }


    /* =========================================================
       SEARCH
    ========================================================= */

    function searchProducts() {
        const container = document.getElementById("productsContainer");
        container.innerHTML = `<div class="loading-state"><span class="spinner"></span><p>Searching nearby prices...</p></div>`;

        const search =
            document
                .getElementById("searchInput")
                .value
                .toLowerCase()
                .trim();


        if (!search) {

            renderProducts(products);

            return;
        }


        const result =
            products.filter(product => {

                return (

                    product.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    product.brand
                        .toLowerCase()
                        .includes(search)

                    ||

                    product.category
                        .toLowerCase()
                        .includes(search)

                );

            });


        renderProducts(result);

    }


    function handleSearchKey(event) {

        if (event.key === "Enter") {

            searchProducts();

        }

    }


    /* =========================================================
       CATEGORY FILTER
    ========================================================= */

    function filterCategory(category) {

        const result =
            products.filter(
                product =>
                    product.category === category
            );


        renderProducts(result);


        window.scrollTo({
            top: document
                .querySelector(".container")
                .offsetTop - 80,
            behavior: "smooth"
        });

    }


    /* =========================================================
       SORT
    ========================================================= */

    function sortProducts() {

        const value =
            document
                .getElementById("sortSelect")
                .value;


        let sorted = [...products];


        if (value === "priceLow") {

            sorted.sort(
                (a, b) =>
                    a.price - b.price
            );

        }


        if (value === "priceHigh") {

            sorted.sort(
                (a, b) =>
                    b.price - a.price
            );

        }


        if (value === "rating") {

            sorted.sort(
                (a, b) =>
                    b.rating - a.rating
            );

        }


        renderProducts(sorted);

    }


    /* =========================================================
       COMPARE PRODUCT
    ========================================================= */

    function compareProduct(productId) {

        const product =
            products.find(
                p => p.id === productId
            );


        const offers =
            shopProducts

                .filter(
                    item =>
                        item.productId === productId
                )

                .map(item => {

                    const shop =
                        shops.find(
                            s =>
                                s.id === item.shopId
                        );


                    const distance =
                        calculateDistance(
                            userLocation.lat,
                            userLocation.lng,
                            shop.lat,
                            shop.lng
                        );


                    return {
                        ...item,
                        shop,
                        distance
                    };

                });


        /*
           Sort by price initially
        */

        offers.sort(
            (a, b) =>
                a.price - b.price
        );


        renderComparison(
            product,
            offers
        );

    }


    /* =========================================================
       RENDER COMPARISON
    ========================================================= */

    function renderComparison(
        product,
        offers
    ) {
        window.currentComparisonOffers = offers;
        setTimeout(() => applyOfferFilters(), 0);

        const section =
            document.getElementById(
                "comparisonSection"
            );


        section.style.display =
            "block";


        document.getElementById(
            "comparisonTitle"
        ).innerText =
            `Compare ${product.name}`;


        /*
           Find best deal
        */

        const best =
            findBestDeal(offers);


        const bestDeal =
            document.getElementById(
                "bestDeal"
            );


        if (best) {

            bestDeal.innerHTML = `

                <div class="best-deal-title">
                    🏆 BEST DEAL FOR YOU
                </div>

                <div class="best-deal-content">

                    <div>

                        <h2>
                            ${best.shop.name}
                        </h2>

                        <p>
                            ⭐ ${best.shop.rating}
                            (${best.shop.reviews} reviews)
                        </p>

                        <p>
                            📍 ${best.distance.toFixed(2)}
                            km away
                        </p>

                        <p>
                            ${best.stock > 0
                                ? "✅ In Stock"
                                : "❌ Out of Stock"}
                        </p>

                    </div>

                    <div>

                        <div class="best-price">
                            ₹${best.price.toLocaleString()}
                        </div>

                        <div class="deal-score">
                            Deal Score:
                            ${best.score}/100
                        </div>

                    </div>

                </div>

                <br>

                <button
                    class="primary-btn"
                    onclick="openDirections(
                        ${best.shop.lat},
                        ${best.shop.lng}
                    )"
                    style="max-width:220px;"
                >
                    🧭 Get Directions
                </button>

            `;

        }


        /*
           Render shops
        */

        const shopsContainer =
            document.getElementById(
                "shopsContainer"
            );


        shopsContainer.innerHTML = "";


        offers.forEach(offer => {

            const shop =
                offer.shop;


            const stockClass =
                offer.stock > 0
                    ? "in-stock"
                    : "out-stock";


            const stockText =
                offer.stock > 0
                    ? `✅ ${offer.stock} Available`
                    : "❌ Out of Stock";


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "shop-card";


            card.innerHTML = `

                <div class="shop-top">

                    <div class="shop-name">
                        ${shop.name}
                    </div>

                    ${
                        shop.verified
                        ?
                        `<span class="verified">
                            ✓ Verified
                        </span>`
                        :
                        ""
                    }

                </div>


                <div class="rating">
                    ⭐ ${shop.rating}
                    / 5
                    (${shop.reviews} reviews)
                </div>


                <div class="distance">
                    📍 ${offer.distance.toFixed(2)}
                    km away
                </div>


                <p>
                    ${shop.address}
                </p>


                <div class="shop-price">
                    ₹${offer.price.toLocaleString()}
                </div>


                <span class="stock ${stockClass}">
                    ${stockText}
                </span>


                <p>
                    🛡️ Warranty:
                    ${offer.warranty}
                </p>


                <div class="shop-buttons">

                    <button
                        class="map-btn"
                        onclick="
                            openDirections(
                                ${shop.lat},
                                ${shop.lng}
                            )
                        "
                    >
                        🧭 Directions
                    </button>

                    <button
                        class="call-btn"
                        onclick="
                            callShop(
                                '${shop.phone}'
                            )
                        "
                    >
                        📞 Call
                    </button>

                </div>

            `;


            shopsContainer.appendChild(card);

        });


        renderMap(offers);

        renderReviews(offers);


        section.scrollIntoView({
            behavior: "smooth"
        });

    }


    /* =========================================================
       BEST DEAL ALGORITHM
    ========================================================= */

    function findBestDeal(offers) {

        const available =
            offers.filter(
                offer =>
                    offer.stock > 0
            );


        if (available.length === 0) {

            return null;

        }


        const prices =
            available.map(
                offer =>
                    offer.price
            );


        const minPrice =
            Math.min(...prices);


        const maxPrice =
            Math.max(...prices);


        available.forEach(offer => {

            /*
               PRICE SCORE
            */

            let priceScore = 50;


            if (maxPrice !== minPrice) {

                priceScore =
                    50 *
                    (
                        (maxPrice - offer.price)
                        /
                        (maxPrice - minPrice)
                    );

            }


            /*
               RATING SCORE
            */

            const ratingScore =
                (
                    offer.shop.rating / 5
                ) * 25;


            /*
               DISTANCE SCORE
            */

            const distanceScore =
                Math.max(
                    0,
                    15 -
                    offer.distance
                );


            /*
               AVAILABILITY
            */

            const availabilityScore =
                offer.stock > 0
                    ? 10
                    : 0;


            offer.score =
                Math.round(
                    priceScore +
                    ratingScore +
                    distanceScore +
                    availabilityScore
                );

        });


        available.sort(
            (a, b) =>
                b.score - a.score
        );


        return available[0];

    }


    /* =========================================================
       DISTANCE CALCULATION
       Haversine Formula
    ========================================================= */

    function calculateDistance(
        lat1,
        lon1,
        lat2,
        lon2
    ) {

        const R = 6371;

        const dLat =
            toRadians(lat2 - lat1);

        const dLon =
            toRadians(lon2 - lon1);


        const a =
            Math.sin(dLat / 2) *
            Math.sin(dLat / 2)

            +

            Math.cos(
                toRadians(lat1)
            )
            *
            Math.cos(
                toRadians(lat2)
            )
            *
            Math.sin(dLon / 2)
            *
            Math.sin(dLon / 2);


        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );


        return R * c;

    }


    function toRadians(value) {

        return value *
            Math.PI /
            180;

    }


    /* =========================================================
       USER LOCATION
    ========================================================= */

    function getUserLocation() {

        const status =
            document.getElementById(
                "locationStatus"
            );


        if (!navigator.geolocation) {

            status.innerText =
                "Geolocation is not supported.";

            return;

        }


        status.innerText =
            "📍 Getting your location...";


        navigator.geolocation.getCurrentPosition(

            position => {

                userLocation = {

                    lat:
                        position.coords.latitude,

                    lng:
                        position.coords.longitude

                };


                status.innerText =
                    "✅ Your location detected.";


                /*
                   Refresh current comparison
                */

                const comparison =
                    document.getElementById(
                        "comparisonSection"
                    );


                if (
                    comparison.style.display ===
                    "block"
                ) {

                    const visibleProduct =
                        document.getElementById(
                            "comparisonTitle"
                        ).innerText;


                    const product =
                        products.find(
                            p =>
                                visibleProduct
                                    .includes(
                                        p.name
                                    )
                        );


                    if (product) {

                        compareProduct(
                            product.id
                        );

                    }

                }

            },

            error => {

                status.innerText =
                    "Unable to get location. Please allow location permission.";

                console.error(error);

            }

        );

    }


    /* =========================================================
       MAP
    ========================================================= */

    function renderMap(offers) {

        if (!map) {

            map =
                L.map("map")
                .setView(
                    [
                        userLocation.lat,
                        userLocation.lng
                    ],
                    14
                );


            L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution:
                        "&copy; OpenStreetMap contributors"
                }
            ).addTo(map);

        }


        /*
           Remove old markers
        */

        mapMarkers.forEach(
            marker =>
                map.removeLayer(marker)
        );


        mapMarkers = [];


        /*
           User marker
        */

        const userMarker =
            L.marker([
                userLocation.lat,
                userLocation.lng
            ])
            .addTo(map)
            .bindPopup(
                "<b>📍 Your Location</b>"
            );


        mapMarkers.push(
            userMarker
        );


        /*
           Shop markers
        */

        offers.forEach(offer => {

            const marker =
                L.marker([
                    offer.shop.lat,
                    offer.shop.lng
                ])
                .addTo(map);


            marker.bindPopup(`

                <b>
                    ${offer.shop.name}
                </b>

                <br>

                ⭐ ${offer.shop.rating}

                <br>

                ₹${offer.price.toLocaleString()}

                <br>

                📍
                ${offer.distance.toFixed(2)}
                km away

            `);


            mapMarkers.push(marker);

        });


        map.setView(
            [
                userLocation.lat,
                userLocation.lng
            ],
            14
        );

    }


    /* =========================================================
       DIRECTIONS
    ========================================================= */

    function openDirections(
        lat,
        lng
    ) {

        const url =
            `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;


        window.open(
            url,
            "_blank"
        );

    }


    /* =========================================================
       CALL SHOP
    ========================================================= */

    function callShop(phone) {

        window.location.href =
            `tel:${phone}`;

    }


    /* =========================================================
       REVIEWS
    ========================================================= */

    function renderReviews(offers) {

        const container =
            document.getElementById(
                "reviewsContainer"
            );


        container.innerHTML = "";


        const shopIds =
            offers.map(
                offer =>
                    offer.shop.id
            );


        const filteredReviews =
            reviews.filter(
                review =>
                    shopIds.includes(
                        review.shopId
                    )
            );


        if (
            filteredReviews.length === 0
        ) {

            container.innerHTML =
                "<p>No reviews available.</p>";

            return;

        }


        filteredReviews.forEach(
            review => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "review";


                div.innerHTML = `

                    <div class="review-user">
                        ${review.user}
                    </div>

                    <div class="review-stars">
                        ${"⭐".repeat(
                            review.rating
                        )}
                    </div>

                    <div class="review-text">
                        ${review.text}
                    </div>

                `;


                container.appendChild(div);

            }
        );

    }


    /* =========================================================
       PRODUCT SPECIFICATIONS
    ========================================================= */

    function showSpecifications(
        productId
    ) {

        const product =
            products.find(
                p =>
                    p.id === productId
            );


        let specifications = "";


        Object.entries(
            product.specifications
        ).forEach(
            ([key, value]) => {

                specifications +=
                    `${key}: ${value}\n`;

            }
        );


        alert(
            `${product.name}\n\n` +
            `${product.description}\n\n` +
            `${specifications}`
        );

    }


    /* =========================================================
       NEARBY SHOPS
    ========================================================= */

    function showNearbyShops() {

        const container =
            document.getElementById(
                "comparisonSection"
            );


        /*
           Find nearest shops
        */

        const nearest =
            shops
                .map(shop => {

                    return {

                        ...shop,

                        distance:
                            calculateDistance(
                                userLocation.lat,
                                userLocation.lng,
                                shop.lat,
                                shop.lng
                            )

                    };

                })
                .sort(
                    (a, b) =>
                        a.distance -
                        b.distance
                );


        const shopsContainer =
            document.getElementById(
                "shopsContainer"
            );


        shopsContainer.innerHTML = "";


        nearest.forEach(shop => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "shop-card";


            card.innerHTML = `

                <div class="shop-top">

                    <div class="shop-name">
                        ${shop.name}
                    </div>

                    ${
                        shop.verified
                        ?
                        `<span class="verified">
                            ✓ Verified
                        </span>`
                        :
                        ""
                    }

                </div>

                <div class="rating">
                    ⭐ ${shop.rating}
                    (${shop.reviews} reviews)
                </div>

                <div class="distance">
                    📍
                    ${shop.distance.toFixed(2)}
                    km away
                </div>

                <p>
                    ${shop.address}
                </p>

                <br>

                <div class="shop-buttons">

                    <button
                        class="map-btn"
                        onclick="
                            openDirections(
                                ${shop.lat},
                                ${shop.lng}
                            )
                        "
                    >
                        🧭 Directions
                    </button>

                    <button
                        class="call-btn"
                        onclick="
                            callShop(
                                '${shop.phone}'
                            )
                        "
                    >
                        📞 Call
                    </button>

                </div>

            `;


            shopsContainer.appendChild(
                card
            );

        });


        document.getElementById(
            "comparisonTitle"
        ).innerText =
            "Nearby Electronic Shops";


        document.getElementById(
            "bestDeal"
        ).innerHTML = `

            <div class="best-deal-title">
                📍 Nearby Shops
            </div>

            <p>
                Shops are sorted by distance
                from your current location.
            </p>

        `;


        container.style.display =
            "block";


        renderMap(
            nearest.map(
                shop => ({
                    shop: shop,
                    distance: shop.distance,
                    price: 0,
                    stock: 1
                })
            )
        );


        container.scrollIntoView({
            behavior: "smooth"
        });

    }


    /* =========================================================
       NAVIGATION
    ========================================================= */

    function goHome() {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    function scrollToComparison() {

        const section =
            document.getElementById(
                "comparisonSection"
            );


        if (
            section.style.display !==
            "block"
        ) {

            alert(
                "Please search and select a product first."
            );

            return;

        }


        section.scrollIntoView({
            behavior: "smooth"
        });

    }


    function showAbout() {

        alert(
            "NearBy Electronic Product Finder\n\n" +

            "This project helps users find " +
            "nearby electronic shops, compare " +
            "product prices, check ratings and " +
            "reviews, calculate distance and " +
            "find the best shop to buy from."
        );

    }


function openAuthModal(){
    document.getElementById('authModal').classList.add('open');
}
function closeAuthModal(){
    document.getElementById('authModal').classList.remove('open');
}
function selectAuthType(type){
    document.getElementById('customerTab').classList.toggle('active', type === 'customer');
    document.getElementById('shopTab').classList.toggle('active', type === 'shop');
    document.getElementById('shopFields').classList.toggle('visible', type === 'shop');
}
function demoGoogleLogin(){
    alert('Google/Firebase authentication will connect in production.');
}
function captureShopLocation(){
    if (!navigator.geolocation) {
        alert('Location is not supported.');
        return;
    }
    navigator.geolocation.getCurrentPosition(
        position => alert('Shop location captured: ' + position.coords.latitude.toFixed(5) + ', ' + position.coords.longitude.toFixed(5)),
        () => alert('Enable location access to verify the shop.')
    );
}
function submitAuth(event){
    event.preventDefault();
    const email = document.getElementById('authEmail').value;
    const shop = document.getElementById('shopFields').classList.contains('visible');
    if(shop){
        const shopName=document.getElementById('shopName').value.trim();
        const businessNumber=document.getElementById('businessNumber').value.trim();
        const applications=JSON.parse(localStorage.getItem('nearbyShopApplications')||'[]');
        applications.push({shopName:shopName||'Unnamed shop',email,businessNumber,status:'pending',submittedAt:new Date().toISOString()});
        localStorage.setItem('nearbyShopApplications',JSON.stringify(applications));
        alert('Verification submitted for ' + email + '. Admin approval is required.');
    }else alert('Verification link sent to ' + email + '.');
    closeAuthModal();
}
// Appended premium experience helpers
function toggleMenu() {
    const nav = document.getElementById('navLinks');
    const button = document.getElementById('menuToggle');
    const open = nav.classList.toggle('open');
    button.classList.toggle('active', open);
    button.setAttribute('aria-expanded', String(open));
}

function showToast(message, type = 'info') {
    let toast = document.getElementById('appToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'appToast';
        toast.className = 'app-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `app-toast show ${type}`;
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function renderFeaturedDeals(productList = products) {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    const featured = [...productList]
        .map(product => ({ product, offers: getInStockOffers(product.id) }))
        .filter(item => item.offers.length)
        .sort((a, b) => Math.min(...a.offers.map(o => o.price)) - Math.min(...b.offers.map(o => o.price)))
        .slice(0, 4);

    grid.innerHTML = featured.map(({ product, offers }) => {
        const price = Math.min(...offers.map(offer => offer.price));
        return `<button class="featured-card" onclick="compareProduct(${product.id})">
            <img src="${productImages[product.category]}" alt="${product.name}" loading="lazy">
            <span><small>${product.brand}</small><strong>${product.name}</strong><b>₹${price.toLocaleString()}</b></span>
        </button>`;
    }).join('');
}

function applyOfferFilters() {
    const offers = window.currentComparisonOffers || [];
    const maxPrice = Number(document.getElementById('maxPriceFilter')?.value || 0);
    const maxDistance = Number(document.getElementById('maxDistanceFilter')?.value || 0);
    const verifiedOnly = document.getElementById('verifiedOnlyFilter')?.checked;

    let filtered = offers.filter(item => !maxPrice || item.price <= maxPrice)
        .filter(item => !maxDistance || item.distance <= maxDistance)
        .filter(item => !verifiedOnly || item.shop.verified);

    filtered.sort((a, b) => a.price - b.price);
    renderComparisonTable(filtered);
}

function renderComparisonTable(offers) {
    const wrap = document.getElementById('comparisonTableWrap');
    if (!wrap) return;
    if (!offers.length) {
        wrap.innerHTML = `<div class="empty-state compact"><h3>No matching offers</h3><p>Increase the price or distance limit.</p></div>`;
        return;
    }
    const lowest = Math.min(...offers.filter(item => item.stock > 0).map(item => item.price));
    wrap.innerHTML = `<table class="comparison-table"><thead><tr><th>Shop</th><th>Price</th><th>Distance</th><th>Rating</th><th>Warranty</th><th>Stock</th></tr></thead><tbody>${offers.map(item => `<tr class="${item.stock > 0 && item.price === lowest ? 'lowest-row' : ''}">
        <td><strong>${item.shop.name}</strong>${item.shop.verified ? '<span class="verified-pill">Verified</span>' : ''}</td>
        <td><strong>₹${item.price.toLocaleString()}</strong>${item.stock > 0 && item.price === lowest ? '<small class="lowest-label">Lowest in stock</small>' : ''}</td>
        <td>${item.distance.toFixed(2)} km</td><td>★ ${item.shop.rating}</td><td>${item.warranty}</td><td>${item.stock > 0 ? `${item.stock} available` : 'Out of stock'}</td>
    </tr>`).join('')}</tbody></table>`;
}
