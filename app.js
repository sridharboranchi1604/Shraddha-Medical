import {
    collection,
    addDoc,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
    db
} from "./firebase-config.js";


// ======================================================
// SHOP DETAILS
// ======================================================

const SHOP_NAME = "Shraddha Medical Shop";

const SHOP_PHONE = "919421847805";

const SHOP_DISPLAY_PHONE = "94218 47805";

const SHOP_ADDRESS =
    "Bitargaon Road, Dhanki, Maharashtra 445207";


// ======================================================
// HELPERS
// ======================================================

const $ = (selector) =>
    document.querySelector(selector);


const formatPrice = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;


const formatNumber = (amount) =>
    Number(amount || 0).toLocaleString("en-IN");


const escapeHTML = (value) => {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

};


// ======================================================
// PRODUCT CATALOG
// ======================================================

const medicines = [

    // ==================================================
    // FEVER & PAIN
    // ==================================================

    {
        id: "dolo-650",
        name: "Dolo 650",
        salt: "Paracetamol 650 mg",
        brand: "Micro Labs",
        pack: "15 tablets",
        price: 32,
        category: "Fever & Pain",
        rx: false
    },

    {
        id: "crocin-advance",
        name: "Crocin Advance",
        salt: "Paracetamol 500 mg",
        brand: "Haleon",
        pack: "20 tablets",
        price: 22,
        category: "Fever & Pain",
        rx: false
    },

    {
        id: "calpol-500",
        name: "Calpol 500",
        salt: "Paracetamol 500 mg",
        brand: "GSK",
        pack: "15 tablets",
        price: 18,
        category: "Fever & Pain",
        rx: false
    },

    {
        id: "combiflam",
        name: "Combiflam",
        salt: "Ibuprofen + Paracetamol",
        brand: "Sanofi",
        pack: "20 tablets",
        price: 45,
        category: "Fever & Pain",
        rx: false
    },

    {
        id: "meftal-p",
        name: "Meftal-P",
        salt: "Mefenamic Acid",
        brand: "Blue Cross",
        pack: "10 tablets",
        price: 35,
        category: "Fever & Pain",
        rx: true
    },

    {
        id: "crocin-pain",
        name: "Crocin Pain Relief",
        salt: "Paracetamol + Caffeine",
        brand: "Haleon",
        pack: "15 tablets",
        price: 35,
        category: "Fever & Pain",
        rx: false
    },

    {
        id: "saridon",
        name: "Saridon",
        salt: "Paracetamol + Propyphenazone + Caffeine",
        brand: "Piramal",
        pack: "10 tablets",
        price: 45,
        category: "Fever & Pain",
        rx: false
    },

    {
        id: "nicip",
        name: "Nicip",
        salt: "Nimesulide",
        brand: "Cipla",
        pack: "10 tablets",
        price: 30,
        category: "Fever & Pain",
        rx: true
    },


    // ==================================================
    // COLD & ALLERGY
    // ==================================================

    {
        id: "cetirizine",
        name: "Cetirizine 10",
        salt: "Cetirizine 10 mg",
        brand: "Various",
        pack: "10 tablets",
        price: 18,
        category: "Cold & Allergy",
        rx: false
    },

    {
        id: "levocetirizine",
        name: "Levocetirizine 5",
        salt: "Levocetirizine 5 mg",
        brand: "Various",
        pack: "10 tablets",
        price: 25,
        category: "Cold & Allergy",
        rx: false
    },

    {
        id: "montair-lc",
        name: "Montair LC",
        salt: "Montelukast + Levocetirizine",
        brand: "Cipla",
        pack: "10 tablets",
        price: 195,
        category: "Cold & Allergy",
        rx: true
    },

    {
        id: "allegra-120",
        name: "Allegra 120",
        salt: "Fexofenadine 120 mg",
        brand: "Sanofi",
        pack: "10 tablets",
        price: 180,
        category: "Cold & Allergy",
        rx: false
    },

    {
        id: "sinarest",
        name: "Sinarest",
        salt: "Paracetamol + Phenylephrine + Chlorpheniramine",
        brand: "Centaur",
        pack: "10 tablets",
        price: 40,
        category: "Cold & Allergy",
        rx: true
    },

    {
        id: "nasivion",
        name: "Nasivion Adult",
        salt: "Oxymetazoline",
        brand: "Merck",
        pack: "10 ml",
        price: 75,
        category: "Cold & Allergy",
        rx: false
    },

    {
        id: "vicks-action",
        name: "Vicks Action 500",
        salt: "Cold Relief Combination",
        brand: "P&G",
        pack: "10 tablets",
        price: 55,
        category: "Cold & Allergy",
        rx: false
    },

    {
        id: "steam-inhaler",
        name: "Steam Inhaler",
        salt: "Steam inhalation device",
        brand: "Generic",
        pack: "1 piece",
        price: 180,
        category: "Cold & Allergy",
        rx: false
    },


    // ==================================================
    // GASTRIC
    // ==================================================

    {
        id: "pantop-40",
        name: "Pantop 40",
        salt: "Pantoprazole 40 mg",
        brand: "Aristo",
        pack: "15 tablets",
        price: 108,
        category: "Gastric",
        rx: true
    },

    {
        id: "pantop-d",
        name: "Pantop D",
        salt: "Pantoprazole + Domperidone",
        brand: "Aristo",
        pack: "10 capsules",
        price: 120,
        category: "Gastric",
        rx: true
    },

    {
        id: "omez",
        name: "Omez 20",
        salt: "Omeprazole 20 mg",
        brand: "Dr. Reddy's",
        pack: "15 capsules",
        price: 70,
        category: "Gastric",
        rx: true
    },

    {
        id: "gelusil",
        name: "Gelusil",
        salt: "Antacid",
        brand: "Abbott",
        pack: "200 ml",
        price: 145,
        category: "Gastric",
        rx: false
    },

    {
        id: "digene",
        name: "Digene Gel",
        salt: "Antacid",
        brand: "Abbott",
        pack: "200 ml",
        price: 145,
        category: "Gastric",
        rx: false
    },

    {
        id: "eno",
        name: "ENO Fruit Salt",
        salt: "Antacid Powder",
        brand: "Haleon",
        pack: "100 g",
        price: 95,
        category: "Gastric",
        rx: false
    },

    {
        id: "simethicone",
        name: "Simethicone",
        salt: "Simethicone",
        brand: "Generic",
        pack: "10 tablets",
        price: 35,
        category: "Gastric",
        rx: false
    },


    // ==================================================
    // DIABETES
    // ==================================================

    {
        id: "glycomet-500",
        name: "Glycomet 500",
        salt: "Metformin 500 mg",
        brand: "USV",
        pack: "20 tablets",
        price: 38,
        category: "Diabetes",
        rx: true
    },

    {
        id: "glycomet-gp1",
        name: "Glycomet GP 1",
        salt: "Glimepiride + Metformin",
        brand: "USV",
        pack: "10 tablets",
        price: 90,
        category: "Diabetes",
        rx: true
    },

    {
        id: "glycomet-gp2",
        name: "Glycomet GP 2",
        salt: "Glimepiride + Metformin",
        brand: "USV",
        pack: "10 tablets",
        price: 110,
        category: "Diabetes",
        rx: true
    },

    {
        id: "istamet-50-500",
        name: "Istamet 50/500",
        salt: "Sitagliptin + Metformin",
        brand: "Sun Pharma",
        pack: "15 tablets",
        price: 190,
        category: "Diabetes",
        rx: true
    },

    {
        id: "diabetes-strips",
        name: "Glucose Test Strips",
        salt: "Blood glucose test strips",
        brand: "Generic",
        pack: "25 strips",
        price: 350,
        category: "Diabetes",
        rx: false
    },


    // ==================================================
    // BP & HEART
    // ==================================================

    {
        id: "telma-40",
        name: "Telma 40",
        salt: "Telmisartan 40 mg",
        brand: "Glenmark",
        pack: "15 tablets",
        price: 105,
        category: "BP & Heart",
        rx: true
    },

    {
        id: "telma-am",
        name: "Telma-AM",
        salt: "Telmisartan + Amlodipine",
        brand: "Glenmark",
        pack: "15 tablets",
        price: 145,
        category: "BP & Heart",
        rx: true
    },

    {
        id: "amlodipine-5",
        name: "Amlodipine 5",
        salt: "Amlodipine 5 mg",
        brand: "Various",
        pack: "10 tablets",
        price: 25,
        category: "BP & Heart",
        rx: true
    },

    {
        id: "ecosprin-75",
        name: "Ecosprin 75",
        salt: "Aspirin 75 mg",
        brand: "USV",
        pack: "14 tablets",
        price: 8,
        category: "BP & Heart",
        rx: true
    },

    {
        id: "atorva-10",
        name: "Atorva 10",
        salt: "Atorvastatin 10 mg",
        brand: "Zydus",
        pack: "10 tablets",
        price: 75,
        category: "BP & Heart",
        rx: true
    },

    {
        id: "clopitab-75",
        name: "Clopitab 75",
        salt: "Clopidogrel 75 mg",
        brand: "Lupin",
        pack: "10 tablets",
        price: 90,
        category: "BP & Heart",
        rx: true
    },


    // ==================================================
    // ANTIBIOTICS
    // ==================================================

    {
        id: "azithral-500",
        name: "Azithral 500",
        salt: "Azithromycin 500 mg",
        brand: "Alembic",
        pack: "5 tablets",
        price: 112,
        category: "Antibiotics",
        rx: true
    },

    {
        id: "zifi-200",
        name: "Zifi 200",
        salt: "Cefixime 200 mg",
        brand: "FDC",
        pack: "10 tablets",
        price: 180,
        category: "Antibiotics",
        rx: true
    },

    {
        id: "augmentin-625",
        name: "Augmentin 625",
        salt: "Amoxicillin + Clavulanic Acid",
        brand: "GSK",
        pack: "10 tablets",
        price: 220,
        category: "Antibiotics",
        rx: true
    },

    {
        id: "amoxyclav",
        name: "Amoxyclav 625",
        salt: "Amoxicillin + Clavulanic Acid",
        brand: "Abbott",
        pack: "10 tablets",
        price: 175,
        category: "Antibiotics",
        rx: true
    },

    {
        id: "cefixime-200",
        name: "Cefixime 200",
        salt: "Cefixime 200 mg",
        brand: "Various",
        pack: "10 tablets",
        price: 120,
        category: "Antibiotics",
        rx: true
    },

    {
        id: "ofloxacin-200",
        name: "Ofloxacin 200",
        salt: "Ofloxacin 200 mg",
        brand: "Various",
        pack: "10 tablets",
        price: 70,
        category: "Antibiotics",
        rx: true
    },


    // ==================================================
    // VITAMINS & NUTRITION
    // ==================================================

    {
        id: "shelcal-500",
        name: "Shelcal 500",
        salt: "Calcium + Vitamin D3",
        brand: "Torrent",
        pack: "15 tablets",
        price: 145,
        category: "Vitamins & Nutrition",
        rx: false
    },

    {
        id: "limcee",
        name: "Limcee",
        salt: "Vitamin C 500 mg",
        brand: "Abbott",
        pack: "15 tablets",
        price: 28,
        category: "Vitamins & Nutrition",
        rx: false
    },

    {
        id: "becosules",
        name: "Becosules",
        salt: "Vitamin B Complex",
        brand: "Pfizer",
        pack: "20 capsules",
        price: 45,
        category: "Vitamins & Nutrition",
        rx: false
    },

    {
        id: "neurobion-forte",
        name: "Neurobion Forte",
        salt: "Vitamin B Complex",
        brand: "P&G",
        pack: "30 tablets",
        price: 45,
        category: "Vitamins & Nutrition",
        rx: false
    },

    {
        id: "revital-h",
        name: "Revital H",
        salt: "Multivitamin & Minerals",
        brand: "Sun Pharma",
        pack: "30 capsules",
        price: 310,
        category: "Vitamins & Nutrition",
        rx: false
    },

    {
        id: "zincovit",
        name: "Zincovit",
        salt: "Multivitamin + Minerals",
        brand: "Apex",
        pack: "15 tablets",
        price: 115,
        category: "Vitamins & Nutrition",
        rx: false
    },

    {
        id: "evion-400",
        name: "Evion 400",
        salt: "Vitamin E 400 mg",
        brand: "Merck",
        pack: "10 capsules",
        price: 35,
        category: "Vitamins & Nutrition",
        rx: false
    },

    {
        id: "iron-folic",
        name: "Iron Folic Acid",
        salt: "Iron + Folic Acid",
        brand: "Generic",
        pack: "30 tablets",
        price: 60,
        category: "Vitamins & Nutrition",
        rx: false
    },


    // ==================================================
    // SYRUPS & LIQUIDS
    // ==================================================

    {
        id: "benadryl",
        name: "Benadryl Syrup",
        salt: "Diphenhydramine",
        brand: "Johnson & Johnson",
        pack: "100 ml",
        price: 120,
        category: "Syrups & Liquids",
        rx: false
    },

    {
        id: "ascoril-ls",
        name: "Ascoril LS",
        salt: "Ambroxol + Levosalbutamol + Guaiphenesin",
        brand: "Glenmark",
        pack: "100 ml",
        price: 145,
        category: "Syrups & Liquids",
        rx: true
    },

    {
        id: "alex",
        name: "Alex Syrup",
        salt: "Cough & Cold Combination",
        brand: "Glenmark",
        pack: "100 ml",
        price: 125,
        category: "Syrups & Liquids",
        rx: false
    },

    {
        id: "cough-syrup-generic",
        name: "Cough Relief Syrup",
        salt: "Cough Relief Formula",
        brand: "Generic",
        pack: "100 ml",
        price: 85,
        category: "Syrups & Liquids",
        rx: false
    },

    {
        id: "digene-syrup",
        name: "Digene Syrup",
        salt: "Antacid",
        brand: "Abbott",
        pack: "200 ml",
        price: 145,
        category: "Syrups & Liquids",
        rx: false
    },

    {
        id: "lactulose",
        name: "Lactulose Syrup",
        salt: "Lactulose",
        brand: "Various",
        pack: "100 ml",
        price: 110,
        category: "Syrups & Liquids",
        rx: false
    },

    {
        id: "paracetamol-syrup",
        name: "Paracetamol Syrup",
        salt: "Paracetamol",
        brand: "Generic",
        pack: "60 ml",
        price: 55,
        category: "Syrups & Liquids",
        rx: false
    },

    {
        id: "multivitamin-syrup",
        name: "Multivitamin Syrup",
        salt: "Multivitamins",
        brand: "Generic",
        pack: "200 ml",
        price: 120,
        category: "Syrups & Liquids",
        rx: false
    },

    {
        id: "ors-liquid",
        name: "ORS Ready Liquid",
        salt: "Oral Rehydration Solution",
        brand: "Generic",
        pack: "200 ml",
        price: 35,
        category: "ORS & Hydration",
        rx: false
    },


    // ==================================================
    // ORS & HYDRATION
    // ==================================================

    {
        id: "ors-orange",
        name: "ORS Orange",
        salt: "Oral Rehydration Salts",
        brand: "Electral",
        pack: "21 g",
        price: 22,
        category: "ORS & Hydration",
        rx: false
    },

    {
        id: "ors-lemon",
        name: "ORS Lemon",
        salt: "Oral Rehydration Salts",
        brand: "Electral",
        pack: "21 g",
        price: 22,
        category: "ORS & Hydration",
        rx: false
    },

    {
        id: "glucose-d",
        name: "Glucose-D",
        salt: "Glucose Powder",
        brand: "Dabur",
        pack: "500 g",
        price: 120,
        category: "ORS & Hydration",
        rx: false
    },

    {
        id: "glucose-powder",
        name: "Glucose Powder",
        salt: "Dextrose",
        brand: "Generic",
        pack: "500 g",
        price: 90,
        category: "ORS & Hydration",
        rx: false
    },


    // ==================================================
    // FIRST AID
    // ==================================================

    {
        id: "band-aid-small",
        name: "Adhesive Bandage Small",
        salt: "Adhesive wound dressing",
        brand: "Generic",
        pack: "10 pieces",
        price: 35,
        category: "First Aid",
        rx: false
    },

    {
        id: "band-aid-large",
        name: "Adhesive Bandage Large",
        salt: "Adhesive wound dressing",
        brand: "Generic",
        pack: "10 pieces",
        price: 45,
        category: "First Aid",
        rx: false
    },

    {
        id: "cotton-roll",
        name: "Cotton Roll",
        salt: "Absorbent cotton",
        brand: "Generic",
        pack: "100 g",
        price: 55,
        category: "First Aid",
        rx: false
    },

    {
        id: "cotton-roll-large",
        name: "Cotton Roll Large",
        salt: "Absorbent cotton",
        brand: "Generic",
        pack: "500 g",
        price: 180,
        category: "First Aid",
        rx: false
    },

    {
        id: "gauze-small",
        name: "Sterile Gauze",
        salt: "Sterile gauze dressing",
        brand: "Generic",
        pack: "10 pieces",
        price: 60,
        category: "First Aid",
        rx: false
    },

    {
        id: "crepe-bandage",
        name: "Crepe Bandage",
        salt: "Elastic support bandage",
        brand: "Generic",
        pack: "1 piece",
        price: 120,
        category: "First Aid",
        rx: false
    },

    {
        id: "micropore-tape",
        name: "Micropore Tape",
        salt: "Medical adhesive tape",
        brand: "3M",
        pack: "1 roll",
        price: 65,
        category: "First Aid",
        rx: false
    },

    {
        id: "antiseptic-liquid",
        name: "Antiseptic Liquid",
        salt: "Antiseptic solution",
        brand: "Dettol",
        pack: "250 ml",
        price: 95,
        category: "First Aid",
        rx: false
    },

    {
        id: "antiseptic-cream",
        name: "Antiseptic Cream",
        salt: "Antiseptic skin cream",
        brand: "Soframycin",
        pack: "30 g",
        price: 75,
        category: "First Aid",
        rx: false
    },

    {
        id: "betadine",
        name: "Betadine Solution",
        salt: "Povidone Iodine",
        brand: "Win-Medicare",
        pack: "100 ml",
        price: 120,
        category: "First Aid",
        rx: false
    },

    {
        id: "medical-gloves",
        name: "Disposable Gloves",
        salt: "Latex examination gloves",
        brand: "Generic",
        pack: "10 pieces",
        price: 80,
        category: "First Aid",
        rx: false
    },

    {
        id: "face-mask",
        name: "3-Ply Face Mask",
        salt: "Disposable mask",
        brand: "Generic",
        pack: "10 pieces",
        price: 50,
        category: "First Aid",
        rx: false
    },


    // ==================================================
    // HEALTH DEVICES
    // ==================================================

    {
        id: "digital-thermometer",
        name: "Digital Thermometer",
        salt: "Digital temperature measurement",
        brand: "Generic",
        pack: "1 piece",
        price: 150,
        category: "Health Devices",
        rx: false
    },

    {
        id: "bp-monitor",
        name: "Digital BP Monitor",
        salt: "Blood pressure monitor",
        brand: "Generic",
        pack: "1 piece",
        price: 1400,
        category: "Health Devices",
        rx: false
    },

    {
        id: "pulse-oximeter",
        name: "Pulse Oximeter",
        salt: "SpO2 & pulse measurement",
        brand: "Generic",
        pack: "1 piece",
        price: 650,
        category: "Health Devices",
        rx: false
    },

    {
        id: "hot-water-bag",
        name: "Hot Water Bag",
        salt: "Heat therapy bag",
        brand: "Generic",
        pack: "1 piece",
        price: 250,
        category: "Health Devices",
        rx: false
    },

    {
        id: "ice-bag",
        name: "Ice Bag",
        salt: "Cold therapy bag",
        brand: "Generic",
        pack: "1 piece",
        price: 180,
        category: "Health Devices",
        rx: false
    },

    {
        id: "surgical-scissors",
        name: "Medical Scissors",
        salt: "Medical scissors",
        brand: "Generic",
        pack: "1 piece",
        price: 120,
        category: "Health Devices",
        rx: false
    },


    // ==================================================
    // PERSONAL CARE
    // ==================================================

    {
        id: "colgate-strong",
        name: "Colgate Strong Teeth",
        salt: "Fluoride toothpaste",
        brand: "Colgate",
        pack: "200 g",
        price: 110,
        category: "Personal Care",
        rx: false
    },

    {
        id: "colgate-maxfresh",
        name: "Colgate MaxFresh",
        salt: "Fresh gel toothpaste",
        brand: "Colgate",
        pack: "150 g",
        price: 95,
        category: "Personal Care",
        rx: false
    },

    {
        id: "pepsodent",
        name: "Pepsodent",
        salt: "Toothpaste",
        brand: "HUL",
        pack: "150 g",
        price: 85,
        category: "Personal Care",
        rx: false
    },

    {
        id: "toothbrush",
        name: "Soft Toothbrush",
        salt: "Toothbrush",
        brand: "Generic",
        pack: "1 piece",
        price: 35,
        category: "Personal Care",
        rx: false
    },

    {
        id: "listerine",
        name: "Listerine Mouthwash",
        salt: "Mouthwash",
        brand: "Kenvue",
        pack: "250 ml",
        price: 145,
        category: "Personal Care",
        rx: false
    },

    {
        id: "dettol-soap",
        name: "Dettol Soap",
        salt: "Bath soap",
        brand: "Dettol",
        pack: "100 g",
        price: 45,
        category: "Personal Care",
        rx: false
    },

    {
        id: "dove-soap",
        name: "Dove Soap",
        salt: "Moisturising soap",
        brand: "Dove",
        pack: "100 g",
        price: 60,
        category: "Personal Care",
        rx: false
    },

    {
        id: "face-wash",
        name: "Face Wash",
        salt: "Facial cleanser",
        brand: "Generic",
        pack: "100 ml",
        price: 150,
        category: "Personal Care",
        rx: false
    },

    {
        id: "vaseline",
        name: "Vaseline Petroleum Jelly",
        salt: "Petroleum jelly",
        brand: "Vaseline",
        pack: "100 ml",
        price: 95,
        category: "Personal Care",
        rx: false
    },

    {
        id: "moisturizer",
        name: "Body Moisturizer",
        salt: "Moisturising lotion",
        brand: "Generic",
        pack: "200 ml",
        price: 180,
        category: "Personal Care",
        rx: false
    },

    {
        id: "handwash",
        name: "Liquid Hand Wash",
        salt: "Hand wash",
        brand: "Dettol",
        pack: "250 ml",
        price: 110,
        category: "Personal Care",
        rx: false
    },

    {
        id: "shampoo",
        name: "Daily Care Shampoo",
        salt: "Hair cleanser",
        brand: "Generic",
        pack: "180 ml",
        price: 160,
        category: "Personal Care",
        rx: false
    },


    // ==================================================
    // BABY CARE
    // ==================================================

    {
        id: "baby-diaper-s",
        name: "Baby Diapers Small",
        salt: "Baby diapers",
        brand: "Generic",
        pack: "10 pieces",
        price: 180,
        category: "Baby Care",
        rx: false
    },

    {
        id: "baby-diaper-m",
        name: "Baby Diapers Medium",
        salt: "Baby diapers",
        brand: "Generic",
        pack: "10 pieces",
        price: 200,
        category: "Baby Care",
        rx: false
    },

    {
        id: "baby-diaper-l",
        name: "Baby Diapers Large",
        salt: "Baby diapers",
        brand: "Generic",
        pack: "10 pieces",
        price: 220,
        category: "Baby Care",
        rx: false
    },

    {
        id: "baby-wipes",
        name: "Baby Wipes",
        salt: "Baby cleansing wipes",
        brand: "Generic",
        pack: "72 wipes",
        price: 110,
        category: "Baby Care",
        rx: false
    },

    {
        id: "baby-powder",
        name: "Baby Powder",
        salt: "Baby body powder",
        brand: "Generic",
        pack: "200 g",
        price: 150,
        category: "Baby Care",
        rx: false
    },

    {
        id: "baby-oil",
        name: "Baby Massage Oil",
        salt: "Baby body oil",
        brand: "Generic",
        pack: "200 ml",
        price: 170,
        category: "Baby Care",
        rx: false
    },

    {
        id: "baby-soap",
        name: "Baby Soap",
        salt: "Mild baby soap",
        brand: "Generic",
        pack: "75 g",
        price: 55,
        category: "Baby Care",
        rx: false
    },

    {
        id: "baby-shampoo",
        name: "Baby Shampoo",
        salt: "Mild baby shampoo",
        brand: "Generic",
        pack: "100 ml",
        price: 130,
        category: "Baby Care",
        rx: false
    },


    // ==================================================
    // HYGIENE
    // ==================================================

    {
        id: "sanitary-pads",
        name: "Sanitary Pads",
        salt: "Menstrual hygiene pads",
        brand: "Generic",
        pack: "8 pads",
        price: 70,
        category: "Hygiene",
        rx: false
    },

    {
        id: "sanitary-pads-xl",
        name: "Sanitary Pads XL",
        salt: "Menstrual hygiene pads",
        brand: "Generic",
        pack: "15 pads",
        price: 150,
        category: "Hygiene",
        rx: false
    },

    {
        id: "wet-wipes",
        name: "Wet Wipes",
        salt: "Cleansing wipes",
        brand: "Generic",
        pack: "40 wipes",
        price: 75,
        category: "Hygiene",
        rx: false
    },

    {
        id: "tissue-paper",
        name: "Tissue Paper",
        salt: "Facial tissue",
        brand: "Generic",
        pack: "100 tissues",
        price: 70,
        category: "Hygiene",
        rx: false
    },

    {
        id: "hand-sanitizer",
        name: "Hand Sanitizer",
        salt: "Alcohol hand sanitizer",
        brand: "Generic",
        pack: "100 ml",
        price: 65,
        category: "Hygiene",
        rx: false
    },

    {
        id: "disinfectant",
        name: "Disinfectant Liquid",
        salt: "Surface disinfectant",
        brand: "Generic",
        pack: "500 ml",
        price: 120,
        category: "Hygiene",
        rx: false
    },


    // ==================================================
    // GENERAL STORE
    // ==================================================

    {
        id: "biscuits-marie",
        name: "Marie Biscuits",
        salt: "Biscuits",
        brand: "Parle",
        pack: "250 g",
        price: 35,
        category: "General Store",
        rx: false
    },

    {
        id: "glucose-biscuits",
        name: "Glucose Biscuits",
        salt: "Biscuits",
        brand: "Parle",
        pack: "250 g",
        price: 35,
        category: "General Store",
        rx: false
    },

    {
        id: "good-day",
        name: "Good Day Biscuits",
        salt: "Butter biscuits",
        brand: "Britannia",
        pack: "200 g",
        price: 40,
        category: "General Store",
        rx: false
    },

    {
        id: "oreo",
        name: "Oreo Biscuits",
        salt: "Chocolate cream biscuits",
        brand: "Mondelez",
        pack: "120 g",
        price: 35,
        category: "General Store",
        rx: false
    },

    {
        id: "lays",
        name: "Lay's Potato Chips",
        salt: "Potato chips",
        brand: "PepsiCo",
        pack: "50 g",
        price: 30,
        category: "General Store",
        rx: false
    },

    {
        id: "kurkure",
        name: "Kurkure",
        salt: "Corn snack",
        brand: "PepsiCo",
        pack: "90 g",
        price: 30,
        category: "General Store",
        rx: false
    },

    {
        id: "maggi",
        name: "Maggi 2-Minute Noodles",
        salt: "Instant noodles",
        brand: "Nestle",
        pack: "280 g",
        price: 60,
        category: "General Store",
        rx: false
    },

    {
        id: "tata-salt",
        name: "Tata Salt",
        salt: "Iodised salt",
        brand: "Tata",
        pack: "1 kg",
        price: 30,
        category: "General Store",
        rx: false
    },

    {
        id: "sugar",
        name: "Sugar",
        salt: "Refined sugar",
        brand: "Generic",
        pack: "1 kg",
        price: 50,
        category: "General Store",
        rx: false
    },

    {
        id: "tea",
        name: "Tea",
        salt: "Tea leaves",
        brand: "Generic",
        pack: "250 g",
        price: 100,
        category: "General Store",
        rx: false
    },

    {
        id: "coffee",
        name: "Instant Coffee",
        salt: "Instant coffee",
        brand: "Generic",
        pack: "100 g",
        price: 150,
        category: "General Store",
        rx: false
    },

    {
        id: "turmeric",
        name: "Turmeric Powder",
        salt: "Turmeric",
        brand: "Generic",
        pack: "100 g",
        price: 35,
        category: "General Store",
        rx: false
    },

    {
        id: "chilli-powder",
        name: "Chilli Powder",
        salt: "Red chilli powder",
        brand: "Generic",
        pack: "100 g",
        price: 40,
        category: "General Store",
        rx: false
    },

    {
        id: "dishwash",
        name: "Dishwash Liquid",
        salt: "Dish cleaning liquid",
        brand: "Generic",
        pack: "500 ml",
        price: 110,
        category: "General Store",
        rx: false
    },

    {
        id: "detergent",
        name: "Detergent Powder",
        salt: "Laundry detergent",
        brand: "Generic",
        pack: "1 kg",
        price: 120,
        category: "General Store",
        rx: false
    },

    {
        id: "garbage-bags",
        name: "Garbage Bags",
        salt: "Waste disposal bags",
        brand: "Generic",
        pack: "30 bags",
        price: 100,
        category: "General Store",
        rx: false
    },

    {
        id: "matchbox",
        name: "Matchbox",
        salt: "Safety matches",
        brand: "Generic",
        pack: "1 box",
        price: 5,
        category: "General Store",
        rx: false
    },

    {
        id: "candles",
        name: "Candles",
        salt: "Household candles",
        brand: "Generic",
        pack: "6 pieces",
        price: 30,
        category: "General Store",
        rx: false
    },


    // ==================================================
    // WOMEN'S HEALTH
    // ==================================================

    {
        id: "folvite",
        name: "Folvite",
        salt: "Folic Acid",
        brand: "Eisai",
        pack: "10 tablets",
        price: 35,
        category: "Women's Health",
        rx: true
    },

    {
        id: "calcium-women",
        name: "Calcium + Vitamin D",
        salt: "Calcium + Vitamin D3",
        brand: "Generic",
        pack: "30 tablets",
        price: 180,
        category: "Women's Health",
        rx: false
    },

    {
        id: "pregnancy-test",
        name: "Pregnancy Test Kit",
        salt: "Urine pregnancy test",
        brand: "Generic",
        pack: "1 test",
        price: 80,
        category: "Women's Health",
        rx: false
    },


    // ==================================================
    // MEN'S HEALTH
    // ==================================================

    {
        id: "men-multivitamin",
        name: "Men's Multivitamin",
        salt: "Multivitamin supplement",
        brand: "Generic",
        pack: "30 tablets",
        price: 220,
        category: "Men's Health",
        rx: false
    },

    {
        id: "protein-powder",
        name: "Protein Powder",
        salt: "Protein supplement",
        brand: "Generic",
        pack: "500 g",
        price: 650,
        category: "Men's Health",
        rx: false
    },


    // ==================================================
    // MORE DAILY HEALTH PRODUCTS
    // ==================================================

    {
        id: "pain-relief-balm",
        name: "Pain Relief Balm",
        salt: "Topical pain relief",
        brand: "Generic",
        pack: "25 g",
        price: 60,
        category: "Personal Care",
        rx: false
    },

    {
        id: "muscle-spray",
        name: "Muscle Pain Spray",
        salt: "Topical analgesic",
        brand: "Generic",
        pack: "50 g",
        price: 150,
        category: "Personal Care",
        rx: false
    },

    {
        id: "antifungal-powder",
        name: "Antifungal Powder",
        salt: "Antifungal skin powder",
        brand: "Generic",
        pack: "100 g",
        price: 120,
        category: "Personal Care",
        rx: false
    },

    {
        id: "calamine-lotion",
        name: "Calamine Lotion",
        salt: "Calamine",
        brand: "Generic",
        pack: "100 ml",
        price: 90,
        category: "Personal Care",
        rx: false
    },

    {
        id: "petroleum-jelly-small",
        name: "Petroleum Jelly",
        salt: "Petroleum jelly",
        brand: "Generic",
        pack: "50 ml",
        price: 55,
        category: "Personal Care",
        rx: false
    },

    {
        id: "eye-drops-lubricant",
        name: "Lubricating Eye Drops",
        salt: "Artificial tears",
        brand: "Generic",
        pack: "10 ml",
        price: 120,
        category: "Personal Care",
        rx: false
    },

    {
        id: "ear-buds",
        name: "Cotton Ear Buds",
        salt: "Cotton buds",
        brand: "Generic",
        pack: "100 pieces",
        price: 50,
        category: "Personal Care",
        rx: false
    },

    {
        id: "razor",
        name: "Disposable Razor",
        salt: "Shaving razor",
        brand: "Generic",
        pack: "2 pieces",
        price: 40,
        category: "Personal Care",
        rx: false
    }

];


// ======================================================
// CATEGORIES
// ======================================================

const categories = [
    "All",
    "Fever & Pain",
    "Cold & Allergy",
    "Gastric",
    "Diabetes",
    "BP & Heart",
    "Antibiotics",
    "Vitamins & Nutrition",
    "ORS & Hydration",
    "Syrups & Liquids",
    "First Aid",
    "Health Devices",
    "Personal Care",
    "Baby Care",
    "Hygiene",
    "General Store",
    "Women's Health",
    "Men's Health"
];


// ======================================================
// CART
// ======================================================

let cart = [];

try {

    cart =
        JSON.parse(
            localStorage.getItem(
                "shraddhaMedicalCart"
            )
        ) || [];

} catch {

    cart = [];

}


// ======================================================
// SAVE CART
// ======================================================

function saveCart() {

    localStorage.setItem(
        "shraddhaMedicalCart",
        JSON.stringify(cart)
    );

}


// ======================================================
// CATEGORY CARDS
// ======================================================

function renderCategories() {

    const container = $("#categoryList");
    if (!container) return;

    const categoryIcons = {
        "Fever & Pain": "🌡️", "Cold & Allergy": "🤧", "Gastric": "🫃",
        "Diabetes": "🩸", "BP & Heart": "❤️", "Antibiotics": "💊",
        "Vitamins & Nutrition": "🍊", "ORS & Hydration": "💧", "Syrups & Liquids": "🥄",
        "First Aid": "🩹", "Health Devices": "🩺", "Personal Care": "🧴",
        "Baby Care": "👶", "Hygiene": "🧼", "General Store": "🛒",
        "Women's Health": "🌸", "Men's Health": "👨"
    };

    const visibleCategories = categories.filter(category => category !== "All");

    container.innerHTML = visibleCategories.map(category => {
        const categoryProducts = medicines.filter(product => product.category === category);

        return `
            <div class="category-hover-wrap">
                <button class="category-card" type="button" data-category="${escapeHTML(category)}" aria-expanded="false">
                    <span class="category-icon">${categoryIcons[category] || "🛍️"}</span>
                    <strong>${escapeHTML(category)}</strong>
                    <small>${categoryProducts.length} products</small>
                    <span class="category-hover-hint">View products <span>→</span></span>
                </button>

                <div class="category-product-panel" data-category-panel="${escapeHTML(category)}">
                    <div class="category-product-panel-head">
                        <div>
                            <span class="category-panel-eyebrow">${categoryProducts.length} available</span>
                            <strong>${escapeHTML(category)}</strong>
                        </div>
                        <span class="category-panel-close" aria-hidden="true">×</span>
                    </div>

                    <div class="category-product-list">
                        ${categoryProducts.map(product => {
                            const cartItem = cart.find(item => item.id === product.id);
                            const quantity = cartItem ? cartItem.quantity : 0;
                            return `
                                <div class="category-product-row" data-id="${escapeHTML(product.id)}">
                                    <div class="category-product-icon">${getProductIcon(product.category)}</div>
                                    <div class="category-product-info">
                                        <strong>${escapeHTML(product.name)}</strong>
                                        <span>${escapeHTML(product.brand)} • ${escapeHTML(product.pack)}</span>
                                        <small>${product.rx ? "Prescription required" : "Available"}</small>
                                    </div>
                                    <div class="category-product-price">
                                        <strong>${formatPrice(product.price)}</strong>
                                        <div class="category-product-action">
                                            ${quantity > 0 ? `
                                                <button class="quantity-btn" data-action="decrease" data-id="${escapeHTML(product.id)}" type="button">−</button>
                                                <span class="quantity-value">${quantity}</span>
                                                <button class="quantity-btn" data-action="increase" data-id="${escapeHTML(product.id)}" type="button">+</button>
                                            ` : `
                                                <button class="add-btn" data-action="add" data-id="${escapeHTML(product.id)}" type="button" aria-label="Add ${escapeHTML(product.name)} to cart">+</button>
                                            `}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join("")}
                    </div>
                </div>
            </div>
        `;
    }).join("");

    container.querySelectorAll(".category-hover-wrap").forEach(wrapper => {
        const button = wrapper.querySelector(".category-card");
        if (!button) return;

        wrapper.addEventListener("mouseenter", () => {
            if (window.matchMedia("(hover: hover)").matches) {
                closeCategoryPanels(wrapper);
                button.setAttribute("aria-expanded", "true");
                wrapper.classList.add("is-hovered");
            }
        });

        wrapper.addEventListener("mouseleave", () => {
            if (window.matchMedia("(hover: hover)").matches) {
                button.setAttribute("aria-expanded", "false");
                wrapper.classList.remove("is-hovered");
            }
        });

        button.addEventListener("click", event => {
            event.stopPropagation();
            if (window.matchMedia("(hover: hover)").matches) return;
            const isOpen = wrapper.classList.contains("is-active");
            closeCategoryPanels(wrapper);
            if (!isOpen) {
                wrapper.classList.add("is-active");
                button.setAttribute("aria-expanded", "true");
            }
        });
    });

    container.querySelectorAll(".category-product-panel").forEach(panel => {
        panel.addEventListener("click", event => {
            const actionButton = event.target.closest("[data-action]");
            if (!actionButton) return;
            event.stopPropagation();
            const id = actionButton.dataset.id;
            const action = actionButton.dataset.action;
            if (action === "add") addToCart(id);
            if (action === "increase") increaseCartItem(id);
            if (action === "decrease") decreaseCartItem(id);
        });
    });
}

function closeCategoryPanels(except = null) {
    document.querySelectorAll("#categoryList .category-hover-wrap").forEach(wrapper => {
        if (wrapper === except) return;
        wrapper.classList.remove("is-active", "is-hovered");
        wrapper.querySelector(".category-card")?.setAttribute("aria-expanded", "false");
    });
}


// ======================================================
// POPULATE CATEGORY SELECT
// ======================================================

function populateCategoryFilter() {

    const filter =
        $("#categoryFilter");

    if (!filter) return;


    filter.innerHTML =
        categories.map(category => {

            return `
                <option value="${escapeHTML(category)}">
                    ${escapeHTML(
                        category === "All"
                            ? "All categories"
                            : category
                    )}
                </option>
            `;

        }).join("");

}


// ======================================================
// PRODUCT FILTER
// ======================================================

function getFilteredProducts() {

    const search =
        ($("#search")?.value || "")
            .trim()
            .toLowerCase();


    const category =
        $("#categoryFilter")?.value ||
        "All";


    return medicines.filter(product => {

        const matchesCategory =
            category === "All" ||
            product.category === category;


        if (!search) {

            return matchesCategory;

        }


        const searchable = [

            product.name,

            product.salt,

            product.brand,

            product.category,

            product.pack

        ]
            .join(" ")
            .toLowerCase();


        return (
            matchesCategory &&
            searchable.includes(search)
        );

    });

}


// ======================================================
// RENDER PRODUCTS
// ======================================================

function renderProducts() {

    const container =
        $("#products");

    const empty =
        $("#empty");


    if (!container) return;


    const products =
        getFilteredProducts();


    if (!products.length) {

        container.innerHTML = "";

        if (empty) {
            empty.style.display = "block";
        }

        return;

    }


    if (empty) {
        empty.style.display = "none";
    }


    container.innerHTML =
        products.map(product => {

            const cartItem =
                cart.find(
                    item =>
                        item.id === product.id
                );


            const prescriptionBadge =
                product.rx
                    ? `
                        <span class="rx-badge">
                            Prescription
                        </span>
                    `
                    : "";


            const quantity =
                cartItem
                    ? cartItem.quantity
                    : 0;


            return `

                <article
                    class="product-card"
                    data-id="${escapeHTML(product.id)}"
                >

                    <div class="product-top">

                        <span class="product-category">
                            ${escapeHTML(product.category)}
                        </span>

                        ${prescriptionBadge}

                    </div>


                    <div class="product-icon-area">

                        <div class="product-icon-circle">
                            ${getProductIcon(product.category)}
                        </div>

                    </div>


                    <h3>
                        ${escapeHTML(product.name)}
                    </h3>


                    <p class="product-salt">
                        ${escapeHTML(product.salt)}
                    </p>


                    <p class="product-brand">
                        ${escapeHTML(product.brand)}
                        •
                        ${escapeHTML(product.pack)}
                    </p>


                    <div class="product-bottom">

                        <div>

                            <strong>
                                ${formatPrice(product.price)}
                            </strong>

                            <small>
                                ${product.rx
                                    ? "Prescription required"
                                    : "Available"}
                            </small>

                        </div>


                        <div class="product-action">

                            ${
                                quantity > 0
                                    ? `
                                        <button
                                            class="quantity-btn"
                                            data-action="decrease"
                                            data-id="${escapeHTML(product.id)}"
                                            type="button"
                                        >
                                            −
                                        </button>

                                        <span class="quantity-value">
                                            ${quantity}
                                        </span>

                                        <button
                                            class="quantity-btn"
                                            data-action="increase"
                                            data-id="${escapeHTML(product.id)}"
                                            type="button"
                                        >
                                            +
                                        </button>
                                    `
                                    : `
                                        <button
                                            class="add-btn"
                                            data-action="add"
                                            data-id="${escapeHTML(product.id)}"
                                            type="button"
                                            aria-label="Add ${escapeHTML(product.name)} to cart"
                                        >
                                            +
                                        </button>
                                    `

                            }

                        </div>

                    </div>

                </article>

            `;

        }).join("");

}


// ======================================================
// PRODUCT ICONS
// ======================================================

function getProductIcon(category) {

    const icons = {

        "Fever & Pain": "🌡️",

        "Cold & Allergy": "🤧",

        "Gastric": "💊",

        "Diabetes": "🩸",

        "BP & Heart": "❤️",

        "Antibiotics": "💊",

        "Vitamins & Nutrition": "🍊",

        "ORS & Hydration": "💧",

        "Syrups & Liquids": "🥄",

        "First Aid": "🩹",

        "Health Devices": "🩺",

        "Personal Care": "🧴",

        "Baby Care": "👶",

        "Hygiene": "🧼",

        "General Store": "🛒",

        "Women's Health": "🌸",

        "Men's Health": "👨"

    };


    return icons[category] || "🛍️";

}


// ======================================================
// ADD TO CART
// ======================================================

function addToCart(id) {

    const product =
        medicines.find(
            item => item.id === id
        );


    if (!product) return;


    const existing =
        cart.find(
            item => item.id === id
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }


    saveCart();

    renderCart();

    renderProducts();
    renderCategories();

}


// ======================================================
// REMOVE / DECREASE
// ======================================================

function decreaseCartItem(id) {

    const item =
        cart.find(
            product => product.id === id
        );


    if (!item) return;


    item.quantity -= 1;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                product =>
                    product.id !== id
            );

    }


    saveCart();

    renderCart();

    renderProducts();
    renderCategories();

}


// ======================================================
// INCREASE
// ======================================================

function increaseCartItem(id) {

    const item =
        cart.find(
            product => product.id === id
        );


    if (!item) return;


    item.quantity += 1;


    saveCart();

    renderCart();

    renderProducts();
    renderCategories();

}


// ======================================================
// DELETE ITEM
// ======================================================

function removeFromCart(id) {

    cart =
        cart.filter(
            item =>
                item.id !== id
        );


    saveCart();

    renderCart();

    renderProducts();
    renderCategories();

}


// ======================================================
// CART TOTAL
// ======================================================

function getCartTotal() {

    return cart.reduce(
        (total, item) => {

            return total +
                Number(item.price) *
                Number(item.quantity);

        },
        0
    );

}


// ======================================================
// CART COUNT
// ======================================================

function getCartCount() {

    return cart.reduce(
        (total, item) => {

            return total +
                Number(item.quantity);

        },
        0
    );

}


// ======================================================
// RENDER CART
// ======================================================

function renderCart() {

    const container =
        $("#cartItems");

    const total =
        $("#cartTotal");

    const cartCount =
        $("#cartCount");

    const mobileCount =
        $("#mobileCartCount");


    const count =
        getCartCount();


    if (cartCount) {

        cartCount.textContent =
            count;

    }


    if (mobileCount) {

        mobileCount.textContent =
            count;

    }


    if (total) {

        total.textContent =
            formatPrice(
                getCartTotal()
            );

    }


    if (!container) return;


    if (!cart.length) {

        container.innerHTML = `

            <div class="empty-cart">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add products to your cart
                    to continue.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        cart.map(item => {

            return `

                <div class="cart-item">

                    <div class="cart-item-icon">
                        ${getProductIcon(item.category)}
                    </div>


                    <div class="cart-item-info">

                        <strong>
                            ${escapeHTML(item.name)}
                        </strong>

                        <small>
                            ${escapeHTML(item.pack)}
                        </small>

                        <span>
                            ${formatPrice(item.price)}
                        </span>

                    </div>


                    <div class="cart-item-controls">

                        <button
                            type="button"
                            data-cart-action="decrease"
                            data-id="${escapeHTML(item.id)}"
                        >
                            −
                        </button>

                        <b>
                            ${item.quantity}
                        </b>

                        <button
                            type="button"
                            data-cart-action="increase"
                            data-id="${escapeHTML(item.id)}"
                        >
                            +
                        </button>

                    </div>


                    <button
                        type="button"
                        class="cart-remove"
                        data-cart-action="remove"
                        data-id="${escapeHTML(item.id)}"
                        aria-label="Remove ${escapeHTML(item.name)}"
                    >
                        ×
                    </button>

                </div>

            `;

        }).join("");

}


// ======================================================
// OPEN CART
// ======================================================

function openCart() {

    $("#cartPanel")?.classList.add("open");

    $("#cartOverlay")?.classList.add("show");

    document.body.classList.add("cart-open");

}


// ======================================================
// CLOSE CART
// ======================================================

function closeCart() {

    $("#cartPanel")?.classList.remove("open");

    $("#cartOverlay")?.classList.remove("show");

    document.body.classList.remove("cart-open");

}


// ======================================================
// OPEN CHECKOUT
// ======================================================

function openCheckout() {

    if (!cart.length) {

        alert(
            "Your cart is empty. Please add some products first."
        );

        return;

    }


    closeCart();


    $("#checkoutModal")
        ?.classList.add("show");

}


// ======================================================
// CLOSE CHECKOUT
// ======================================================

function closeCheckout() {

    $("#checkoutModal")
        ?.classList.remove("show");

}


// ======================================================
// ORDER ID
// ======================================================

function generateOrderId() {

    const date =
        new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "");


    const random =
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();


    return `SM-${date}-${random}`;

}


// ======================================================
// TRACKING ID
// ======================================================

function generateTrackingId() {

    const random =
        Math.random()
            .toString(36)
            .substring(2, 12)
            .toUpperCase();


    return `SMT-${random}`;

}


// ======================================================
// WHATSAPP MESSAGE
// ======================================================

function createWhatsAppMessage(
    orderId,
    customer
) {

    let message =

        `*NEW ORDER - ${SHOP_NAME}*\n\n` +

        `Order ID: ${orderId}\n` +

        `Customer: ${customer.name}\n` +

        `Phone: ${customer.phone}\n\n` +

        `*Items:*\n`;


    cart.forEach(item => {

        message +=

            `• ${item.name} x ${item.quantity} ` +
            `= ${formatPrice(
                item.price *
                item.quantity
            )}\n`;

    });


    message +=

        `\n*Total: ${formatPrice(
            getCartTotal()
        )}*\n\n` +

        `Payment: Cash on Delivery\n\n` +

        `*Delivery Address:*\n` +

        `${customer.address}`;


    if (
        cart.some(
            item => item.rx
        )
    ) {

        message +=

            `\n\n⚠️ Prescription medicine included. ` +
            `Prescription will be shared separately.`;

    }


    return message;

}


// ======================================================
// PLACE ORDER
// ======================================================

async function placeOrder(event) {

    event.preventDefault();


    if (!cart.length) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    const name =
        $("#customerName")
            ?.value
            .trim();


    const phone =
        $("#customerPhone")
            ?.value
            .trim();


    const address =
        $("#customerAddress")
            ?.value
            .trim();


    if (
        !name ||
        !phone ||
        !address
    ) {

        alert(
            "Please fill in all customer details."
        );

        return;

    }


    const cleanPhone =
        phone.replace(
            /\D/g,
            ""
        );


    if (
        cleanPhone.length !== 10
    ) {

        alert(
            "Please enter a valid 10-digit mobile number."
        );

        return;

    }


    const orderId =
        generateOrderId();


    const trackingId =
        generateTrackingId();


    const prescriptionRequired =
        cart.some(
            item => item.rx
        );


    const orderData = {

        orderId,

        trackingId,

        customer: {

            name,

            phone: cleanPhone,

            address

        },


        items: cart.map(
            item => ({

                medicineId: item.id,

                name: item.name,

                salt: item.salt,

                brand: item.brand,

                pack: item.pack,

                category: item.category,

                price: Number(item.price),

                quantity: Number(item.quantity),

                prescriptionRequired:
                    Boolean(item.rx)

            })
        ),


        total:
            Number(
                getCartTotal()
            ),


        prescriptionRequired,


        status: "New",


        paymentMethod:
            "Cash on Delivery",


        createdAt:
            serverTimestamp(),


        shop: {

            name:
                SHOP_NAME,

            phone:
                SHOP_DISPLAY_PHONE,

            address:
                SHOP_ADDRESS

        }

    };


    const submitButton =
        event.submitter ||
        $("#placeOrderBtn");


    try {

        if (submitButton) {

            submitButton.disabled =
                true;

            submitButton.textContent =
                "Placing Order...";

        }


        // FIRESTORE ORDER

        await addDoc(
            collection(
                db,
                "orders"
            ),
            orderData
        );


        // TRACKING DOCUMENT

        await setDoc(
            doc(
                db,
                "tracking",
                trackingId
            ),
            {

                trackingId,

                orderId,

                status: "New",

                createdAt:
                    serverTimestamp(),

                updatedAt:
                    serverTimestamp()

            }
        );


        // WHATSAPP

        const customer = {

            name,

            phone: cleanPhone,

            address

        };


        const whatsappMessage =
            createWhatsAppMessage(
                orderId,
                customer
            );


        const whatsappURL =
            `https://wa.me/${SHOP_PHONE}?text=${encodeURIComponent(
                whatsappMessage
            )}`;


        // CLEAR CART

        cart = [];

        saveCart();

        renderCart();

        renderProducts();


        closeCheckout();


        // SUCCESS MODAL

        const successModal =
            $("#successModal");


        const orderIdElement =
            $("#successOrderId");


        const whatsappButton =
            $("#whatsappOrderBtn");


        if (orderIdElement) {

            orderIdElement.textContent =
                orderId;

        }


        if (whatsappButton) {

            whatsappButton.href =
                whatsappURL;

        }


        if (successModal) {

            successModal
                .classList
                .add("show");

        }


        const checkoutForm =
            $("#checkoutForm");


        if (checkoutForm) {

            checkoutForm.reset();

        }

    } catch (error) {

        console.error(
            "Order submission error:",
            error
        );


        alert(
            "Unable to place the order right now. Please try again."
        );

    } finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.innerHTML =
                "Place order <span>→</span>";

        }

    }

}


// ======================================================
// TRACK ORDER
// ======================================================

async function trackOrder() {

    const input =
        $("#trackingId");


    const result =
        $("#trackingResult");


    if (!input || !result) return;


    const trackingId =
        input.value
            .trim()
            .toUpperCase();


    if (!trackingId) {

        alert(
            "Please enter your tracking ID."
        );

        return;

    }


    result.hidden = false;


    result.innerHTML = `

        <div class="tracking-loading">
            Checking your order...
        </div>

    `;


    try {

        const trackingRef =
            doc(
                db,
                "tracking",
                trackingId
            );


        const snapshot =
            await getDoc(
                trackingRef
            );


        if (!snapshot.exists()) {

            result.innerHTML = `

                <div class="tracking-error">

                    <strong>
                        Order not found
                    </strong>

                    <p>
                        Please check your tracking ID
                        and try again.
                    </p>

                </div>

            `;

            return;

        }


        const data =
            snapshot.data();


        const status =
            data.status ||
            "New";


        const statusText = {

            "New":
                "Order received",

            "Confirmed":
                "Order confirmed",

            "Preparing":
                "Preparing your order",

            "Out for Delivery":
                "Out for delivery",

            "Delivered":
                "Order delivered",

            "Cancelled":
                "Order cancelled"

        }[status] || status;


        result.innerHTML = `

            <div class="tracking-success">

                <div class="tracking-status-icon">
                    ${status === "Delivered"
                        ? "✓"
                        : "🚚"}
                </div>

                <div>

                    <span>
                        ${escapeHTML(trackingId)}
                    </span>

                    <h3>
                        ${escapeHTML(statusText)}
                    </h3>

                    <p>
                        Order ID:
                        ${escapeHTML(
                            data.orderId || "-"
                        )}
                    </p>

                </div>

            </div>

        `;

    } catch (error) {

        console.error(
            "Tracking error:",
            error
        );


        result.innerHTML = `

            <div class="tracking-error">

                <strong>
                    Unable to check order
                </strong>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }

}


// ======================================================
// HERO SEARCH
// ======================================================

function performHeroSearch() {

    const heroSearch =
        $("#heroSearch");


    if (!heroSearch) return;


    const value =
        heroSearch.value
            .trim();


    if (!value) {

        heroSearch.focus();

        return;

    }


    const mainSearch =
        $("#search");


    const categoryFilter =
        $("#categoryFilter");


    if (mainSearch) {

        mainSearch.value =
            value;

    }


    if (categoryFilter) {

        categoryFilter.value =
            "All";

    }


    // Search mode: temporarily show the existing product grid
    // so matching products are visible even though the normal
    // catalogue is category-hover based.
    const medicineSection =
        $("#medicines");

    if (medicineSection) {
        medicineSection.classList.add("search-active");
    }

    renderProducts();


    const medicineSectionAfterRender =
        $("#medicines");


    if (medicineSectionAfterRender) {

        medicineSectionAfterRender.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }

}


// ======================================================
// CART CLICK HANDLER
// ======================================================

function handleProductClick(event) {

    const button =
        event.target.closest(
            "button[data-action]"
        );


    if (!button) return;


    const id =
        button.dataset.id;


    const action =
        button.dataset.action;


    if (action === "add") {

        addToCart(id);

    }


    if (action === "increase") {

        increaseCartItem(id);

    }


    if (action === "decrease") {

        decreaseCartItem(id);

    }

}


// ======================================================
// CART ITEM CLICK HANDLER
// ======================================================

function handleCartClick(event) {

    const button =
        event.target.closest(
            "button[data-cart-action]"
        );


    if (!button) return;


    const id =
        button.dataset.id;


    const action =
        button.dataset.cartAction;


    if (action === "increase") {

        increaseCartItem(id);

    }


    if (action === "decrease") {

        decreaseCartItem(id);

    }


    if (action === "remove") {

        removeFromCart(id);

    }

}


// ======================================================
// KEYBOARD ESCAPE
// ======================================================

function handleEscape(event) {

    if (event.key !== "Escape") {
        return;
    }


    closeCart();

    closeCheckout();


    $("#successModal")
        ?.classList
        .remove("show");

}


// ======================================================
// DOM READY
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // Categories

        renderCategories();

        populateCategoryFilter();


        // Products

        renderProducts();


        // Cart

        renderCart();


        // Product actions

        $("#products")
            ?.addEventListener(
                "click",
                handleProductClick
            );


        // Cart actions

        $("#cartItems")
            ?.addEventListener(
                "click",
                handleCartClick
            );


        // Search

        $("#search")
            ?.addEventListener(
                "input",
                renderProducts
            );


        // Category

        $("#categoryFilter")
            ?.addEventListener(
                "change",
                renderProducts
            );


        // Hero search

        $("#heroSearchBtn")
            ?.addEventListener(
                "click",
                performHeroSearch
            );


        $("#heroSearch")
            ?.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        performHeroSearch();

                    }

                }
            );


        // Cart

        $("#cartButton")
            ?.addEventListener(
                "click",
                openCart
            );


        $("#closeCart")
            ?.addEventListener(
                "click",
                closeCart
            );


        $("#cartOverlay")
            ?.addEventListener(
                "click",
                closeCart
            );


        // Checkout

        $("#checkoutBtn")
            ?.addEventListener(
                "click",
                openCheckout
            );


        $("#closeCheckout")
            ?.addEventListener(
                "click",
                closeCheckout
            );


        $("#checkoutForm")
            ?.addEventListener(
                "submit",
                placeOrder
            );


        // Tracking

        $("#trackOrderBtn")
            ?.addEventListener(
                "click",
                trackOrder
            );


        $("#trackingId")
            ?.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        trackOrder();

                    }

                }
            );


        // Success modal

        $("#closeSuccess")
            ?.addEventListener(
                "click",
                () => {

                    $("#successModal")
                        ?.classList
                        .remove("show");

                }
            );


        // Escape

        document.addEventListener(
            "keydown",
            handleEscape
        );

        document.addEventListener("click", event => {
            if (!event.target.closest("#categoryList")) {
                closeCategoryPanels();
            }
        });


        // Click outside modal

        $("#checkoutModal")
            ?.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        $("#checkoutModal")
                    ) {

                        closeCheckout();

                    }

                }
            );


        $("#successModal")
            ?.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        $("#successModal")
                    ) {

                        $("#successModal")
                            .classList
                            .remove("show");

                    }

                }
            );

    }
);