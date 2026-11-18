// Electronics catalogue used by the website. Prices and specifications are
// representative Indian-market estimates, not manufacturer quotations.
window.catalogProducts = [];

(function buildCatalog() {
    const categoryModels = {
        "Smartphones": [
            ["Samsung Galaxy M35 5G", "Samsung"], ["Samsung Galaxy A55 5G", "Samsung"],
            ["iPhone 16", "Apple"], ["iPhone 15", "Apple"], ["OnePlus Nord 4", "OnePlus"],
            ["OnePlus 12R", "OnePlus"], ["Google Pixel 8a", "Google"], ["Google Pixel 9", "Google"],
            ["Xiaomi Redmi Note 14 Pro", "Xiaomi"], ["Xiaomi 14", "Xiaomi"],
            ["Motorola Edge 50 Fusion", "Motorola"], ["Realme 13 Pro+", "Realme"],
            ["Nothing Phone (2a)", "Nothing"], ["Vivo V40", "Vivo"]
        ],
        "Laptops & Computers": [
            ["Dell Inspiron 15", "Dell"], ["HP Pavilion 14", "HP"], ["Lenovo IdeaPad Slim 5", "Lenovo"],
            ["ASUS Vivobook 15", "ASUS"], ["Acer Aspire 5", "Acer"], ["Apple MacBook Air M3", "Apple"],
            ["Samsung Galaxy Book4", "Samsung"], ["MSI Modern 14", "MSI"],
            ["HP Victus 15", "HP"], ["Dell Vostro 14", "Dell"], ["Lenovo LOQ 15", "Lenovo"],
            ["ASUS TUF Gaming A15", "ASUS"], ["Acer Nitro 5", "Acer"], ["Apple iMac M3", "Apple"]
        ],
        "Headphones & Audio": [
            ["Sony WH-1000XM5", "Sony"], ["Sony WF-C700N", "Sony"], ["Apple AirPods Pro 2", "Apple"],
            ["Samsung Galaxy Buds3", "Samsung"], ["JBL Tune 770NC", "JBL"], ["JBL Live Pro 2", "JBL"],
            ["boAt Nirvana Ion", "boAt"], ["boAt Rockerz 550", "boAt"], ["Sennheiser HD 490 Pro", "Sennheiser"],
            ["Marshall Major IV", "Marshall"], ["Bose QuietComfort Ultra", "Bose"], ["OnePlus Buds 3", "OnePlus"],
            ["Skullcandy Crusher Evo", "Skullcandy"], ["Sony SRS-XG300", "Sony"]
        ],
        "Smartwatches": [
            ["Apple Watch Series 10", "Apple"], ["Samsung Galaxy Watch7", "Samsung"], ["Xiaomi Watch S4", "Xiaomi"],
            ["OnePlus Watch 2R", "OnePlus"], ["Nothing CMF Watch Pro 2", "Nothing"], ["Noise ColorFit Pro 5", "Noise"],
            ["Amazfit Active 2", "Amazfit"], ["Garmin Venu 3", "Garmin"], ["Fitbit Versa 4", "Fitbit"],
            ["boAt Lunar Discovery", "boAt"], ["Huawei Watch Fit 3", "Huawei"], ["Fossil Gen 6", "Fossil"],
            ["Honor Watch 4", "Honor"], ["CMF Watch 3 Pro", "CMF"]
        ],
        "Gaming Accessories": [
            ["Sony PlayStation 5", "Sony"], ["Xbox Series X", "Microsoft"], ["Nintendo Switch OLED", "Nintendo"],
            ["Logitech G502 X", "Logitech"], ["Razer BlackShark V2", "Razer"], ["HyperX Cloud III", "HyperX"],
            ["SteelSeries Arctis Nova 7", "SteelSeries"], ["DualSense Wireless Controller", "Sony"],
            ["Xbox Wireless Controller", "Microsoft"], ["Logitech G923 Racing Wheel", "Logitech"],
            ["Razer Kishi V2", "Razer"], ["ASUS ROG Ally X", "ASUS"], ["Elgato Stream Deck MK.2", "Elgato"],
            ["Corsair K70 RGB PRO", "Corsair"]
        ],
        "Mobile Accessories": [
            ["Samsung 25W USB-C Charger", "Samsung"], ["Apple MagSafe Charger", "Apple"], ["Anker PowerCore 20000", "Anker"],
            ["Mi 33W Power Bank", "Xiaomi"], ["OnePlus Warp Charge 100W", "OnePlus"], ["JBL Go 4 Protective Case", "JBL"],
            ["Spigen Ultra Hybrid Case", "Spigen"], ["Belkin 3-in-1 Wireless Charger", "Belkin"], ["Ambrane 67W Car Charger", "Ambrane"],
            ["UAG Pathfinder Case", "URBAN ARMOR GEAR"], ["Portronics Magsync 3", "Portronics"], ["Croma Braided USB-C Cable", "Croma"],
            ["Anker MagGo Grip", "Anker"], ["Samsung Type-C to Type-C Cable", "Samsung"]
        ],
        "Cameras & Photography": [
            ["Canon EOS R50", "Canon"], ["Canon EOS R6 Mark II", "Canon"], ["Nikon Z5 II", "Nikon"],
            ["Sony Alpha A7 IV", "Sony"], ["Sony ZV-E10", "Sony"], ["Fujifilm X-T5", "Fujifilm"],
            ["GoPro HERO13 Black", "GoPro"], ["DJI Osmo Action 5 Pro", "DJI"], ["DJI Osmo Pocket 3", "DJI"],
            ["Insta360 X4", "Insta360"], ["Nikon D7500", "Nikon"], ["Panasonic Lumix S5 II", "Panasonic"],
            ["Canon EF 50mm f/1.8", "Canon"], ["DJI RS 4 Mini", "DJI"]
        ],
        "TVs & Home Entertainment": [
            ["Samsung 55-inch Crystal 4K", "Samsung"], ["LG 55-inch OLED evo", "LG"], ["Sony Bravia 55-inch 4K", "Sony"],
            ["Xiaomi Smart TV X 43", "Xiaomi"], ["Hisense 65-inch U6N", "Hisense"], ["TCL 55-inch QLED", "TCL"],
            ["Sony HT-S40R Soundbar", "Sony"], ["Samsung HW-Q600C Soundbar", "Samsung"], ["JBL Cinema SB560", "JBL"],
            ["Apple TV 4K", "Apple"], ["Amazon Fire TV Stick 4K", "Amazon"], ["Mi TV Stick", "Xiaomi"],
            ["Bose Smart Ultra Soundbar", "Bose"], ["Sony HT-A7000", "Sony"]
        ],
        "Computer Accessories": [
            ["Logitech MX Master 3S", "Logitech"], ["Dell KM5221W Keyboard Mouse", "Dell"], ["Keychron K2 Pro", "Keychron"],
            ["Razer Huntsman V3", "Razer"], ["Logitech K980 Keyboard", "Logitech"], ["HP 330 Wireless Mouse", "HP"],
            ["Logitech C920 HD Webcam", "Logitech"], ["Dell UltraSharp Monitor Stand", "Dell"], ["Wacom Intuos Pro", "Wacom"],
            ["Jabra Speak 410", "Jabra"], ["BenQ ScreenBar Halo", "BenQ"], ["Targus Laptop Backpack", "Targus"],
            ["Corsair MM700 Mousepad", "Corsair"], ["Anker USB-C Hub 8-in-1", "Anker"]
        ],
        "Smart Home Devices": [
            ["Amazon Echo Dot 5th Gen", "Amazon"], ["Google Nest Mini", "Google"], ["Philips Hue Starter Kit", "Philips"],
            ["Xiaomi Smart Doorbell 3", "Xiaomi"], ["TP-Link Tapo C210", "TP-Link"], ["Wyze Cam v4", "Wyze"],
            ["Qubo Smart Camera", "Qubo"], ["Eufy Security Smart Lock", "Eufy"], ["Mi Smart Bulb Essential", "Xiaomi"],
            ["Samsung SmartThings Hub", "Samsung"], ["Echo Show 8", "Amazon"], ["Xiaomi Smart Air Purifier 4", "Xiaomi"],
            ["TP-Link Tapo Smart Plug", "TP-Link"], ["Google Nest Hub", "Google"]
        ],
        "Storage Devices": [
            ["Samsung T7 Shield 1TB", "Samsung"], ["SanDisk Extreme Portable SSD 1TB", "SanDisk"], ["WD Black SN850X 1TB", "Western Digital"],
            ["Crucial P3 Plus 1TB", "Crucial"], ["Seagate Expansion 2TB", "Seagate"], ["WD My Passport 2TB", "Western Digital"],
            ["Kingston NV2 1TB", "Kingston"], ["SanDisk Ultra 128GB", "SanDisk"], ["Samsung EVO Plus 256GB", "Samsung"],
            ["Crucial BX500 1TB", "Crucial"], ["LaCie Rugged 2TB", "LaCie"], ["Transcend JetFlash 128GB", "Transcend"],
            ["ADATA SE880 1TB", "ADATA"], ["Lexar 1TB NM790", "Lexar"]
        ],
        "Printers & Scanners": [
            ["HP LaserJet Tank 1005", "HP"], ["Canon PIXMA G3020", "Canon"], ["Epson EcoTank L3250", "Epson"],
            ["Brother DCP-T420W", "Brother"], ["HP LaserJet Pro MFP 4104fdw", "HP"], ["Epson WorkForce WF-2910", "Epson"],
            ["Canon imageCLASS MF244dw", "Canon"], ["Brother HL-L2351DW", "Brother"], ["HP DeskJet 2820", "HP"],
            ["Canon CanoScan LiDE 300", "Canon"], ["Epson Perfection V39II", "Epson"], ["Brother ADS-4300N", "Brother"],
            ["Xerox Phaser 3020", "Xerox"], ["Canon imageFORMULA R10", "Canon"]
        ],
        "Networking Devices": [
            ["TP-Link Archer AX20", "TP-Link"], ["Netgear Nighthawk RAX50", "Netgear"], ["ASUS RT-AX82U", "ASUS"],
            ["TP-Link Deco X50 Mesh", "TP-Link"], ["Netgear Orbi RBK752", "Netgear"], ["TP-Link 8-Port Gigabit Switch", "TP-Link"],
            ["D-Link DGS-1210-10P", "D-Link"], ["Xiaomi Wi-Fi Range Extender", "Xiaomi"], ["Tenda AC6 Router", "Tenda"],
            ["Ubiquiti UniFi Express", "Ubiquiti"], ["Cudy WR3000", "Cudy"], ["TP-Link Archer C6", "TP-Link"],
            ["Netgear AX1800 4G Router", "Netgear"], ["ASUS ZenWiFi BD4", "ASUS"]
        ],
        "Tablets & E-Readers": [
            ["Apple iPad Air M2", "Apple"], ["Apple iPad 10th Gen", "Apple"], ["Samsung Galaxy Tab S9", "Samsung"],
            ["Samsung Galaxy Tab S9 FE", "Samsung"], ["Lenovo Tab P12", "Lenovo"], ["Xiaomi Pad 7", "Xiaomi"],
            ["OnePlus Pad 2", "OnePlus"], ["Amazon Kindle Paperwhite", "Amazon"], ["Amazon Kindle Scribe", "Amazon"],
            ["Kobo Libra 2", "Kobo"], ["Microsoft Surface Pro 11", "Microsoft"], ["Xiaomi Redmi Pad Pro", "Xiaomi"],
            ["Lenovo Yoga Tab Plus", "Lenovo"], ["Samsung Galaxy Tab A9+", "Samsung"]
        ],
        "Electronic Components": [
            ["Arduino Uno R4 WiFi", "Arduino"], ["Raspberry Pi 5 8GB", "Raspberry Pi"], ["ESP32 DevKitC", "Espressif"],
            ["Arduino Mega 2560", "Arduino"], ["Micro:bit V2", "BBC"], ["DHT22 Sensor Module", "Generic"],
            ["HC-SR04 Ultrasonic Sensor", "Generic"], ["LM2596 Buck Converter", "Generic"], ["MPU6050 Gyroscope Module", "Generic"],
            ["KY-040 Rotary Encoder", "Generic"], ["18650 Li-ion Battery 3000mAh", "Generic"], ["OLED Display 0.96-inch I2C", "Generic"],
            ["Breadboard and Jumper Kit", "Generic"], ["Makerfabs Relay Module 4-Channel", "Generic"]
        ]
    };

    const categoryImages = {
        "Smartphones": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
        "Laptops & Computers": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
        "Headphones & Audio": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        "Smartwatches": "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        "Gaming Accessories": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3",
        "Mobile Accessories": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0",
        "Cameras & Photography": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
        "TVs & Home Entertainment": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
        "Computer Accessories": "https://images.unsplash.com/photo-1587829741301-dc798b83add3",
        "Smart Home Devices": "https://images.unsplash.com/photo-1558089687-f282ffcbc0d4",
        "Storage Devices": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b",
        "Printers & Scanners": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6",
        "Networking Devices": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8",
        "Tablets & E-Readers": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
        "Electronic Components": "https://images.unsplash.com/photo-1518770660439-4636190af475"
    };

    let id = 100;
    Object.entries(categoryModels).forEach(([category, models], categoryIndex) => {
        models.forEach(([name, brand], modelIndex) => {
            id += 1;
            const basePrices = [3499, 4999, 7999, 12999, 24999, 49999, 89999];
            const base = basePrices[(categoryIndex + modelIndex) % basePrices.length] +
                ((categoryIndex * 791 + modelIndex * 337) % 9000);
            const originalPrice = Math.ceil(base * (1.14 + (modelIndex % 3) * 0.04) / 99) * 99;
            const discountedPrice = Math.floor(base / 99) * 99;
            const discount = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
            const label = modelIndex === 0 ? "Bestseller" : modelIndex === 1 ? "Featured" : modelIndex === 2 ? "New Arrival" : null;

            const imageSeed = id;
            const imageSearchTerms = {
                "Smartphones": "smartphone",
                "Laptops & Computers": "laptop",
                "Headphones & Audio": "headphones",
                "Smartwatches": "smartwatch",
                "Gaming Accessories": "gaming",
                "Mobile Accessories": "mobile accessories",
                "Cameras & Photography": "camera",
                "TVs & Home Entertainment": "television",
                "Computer Accessories": "computer accessories",
                "Smart Home Devices": "smart home",
                "Storage Devices": "storage drive",
                "Printers & Scanners": "printer",
                "Networking Devices": "router",
                "Tablets & E-Readers": "tablet",
                "Electronic Components": "circuit board"
            };
            const productImageSearch = `${name},${brand},${imageSearchTerms[category]}`;

            window.catalogProducts.push({
                id,
                name,
                brand,
                category,
                icon: "📦",
                image: `https://loremflickr.com/900/900/${encodeURIComponent(productImageSearch)}?lock=${imageSeed}`,
                originalPrice,
                discountedPrice,
                discount,
                price: discountedPrice,
                rating: Number((4.1 + ((modelIndex + categoryIndex) % 8) * 0.1).toFixed(1)),
                reviewCount: 80 + ((modelIndex * 137 + categoryIndex * 313) % 4200),
                stock: modelIndex % 6 === 5 ? 0 : 12 + ((modelIndex * 3 + categoryIndex) % 18),
                description: `A representative ${brand} ${category.toLowerCase()} option for everyday use and comparison.`,
                specifications: {
                    Brand: brand,
                    Category: category,
                    Availability: modelIndex % 6 === 5 ? "Check availability" : "In stock",
                    Warranty: "Manufacturer warranty where applicable",
                    Purchase: "Check stock and service terms with the retailer"
                },
                label
            });
        });
    });
})();
