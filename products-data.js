const PRODUCTS = [
  {
    id: "exclusive-laminates",
    name: "Exclusive Laminates",
    mainImage: "images/exclusive laminated.jpg",
    similarImages: [
      "images/e1.jpg",
      "images/e2.jpg",
      "images/e3.jpg"
    ],
    shortDescription: "Exclusive laminates are superior designs which attract the client by grooving method to give classy outcome.",
    specifications: {
      "Thickness": "32 mm",
      "Height": '78", 81", 84"',
      "Width": '30", 32", 33", 36", 38"'
    },
    features: [
      "Designs can be customised with different shades of colour or texture to create elegant effects.",
      "They're cost-effective & offer a good value alternative to traditional doors.",
      "Laminate doors with antibacterial property increases the durability & strength."
    ],
    warranty: "5 Years Warranty against manufacturing defects and peeling.",
    maintenance: "Wipe with a soft, damp cloth. Avoid abrasive cleaners to maintain the laminate finish.",
    price: 7500
  },

  {
    id: "solid-wood-primer",
    name: "Solid Wood Primer Door",
    mainImage: "images/solid wood primer.jpg",
    similarImages: [
      "images/s1.jpg",
      "images/s2.jpg",
      "images/s3.jpg"
    ],
    shortDescription: "Solid Wood Primer Doors are sturdy, durable, and serve as a perfect base for home and office applications.",
    specifications: {
      "Thickness": "32 mm",
      "Height": '78", 81", 84"',
      "Width": '30", 32", 33", 36", 38"'
    },
    features: [
      "Customizable finish to match your interior style.",
      "Highly durable and classic look.",
      "Can be painted or polished."
    ],
    warranty: "10 Years Warranty on structural integrity.",
    maintenance: "Periodic polishing recommended every 3-5 years to maintain the wood's natural luster.",
    price: 9000
  },
  {
    id: "wpc-digital",
    name: "WPC Digital Doors",
    mainImage: "images/wpc digital.jpg",
    similarImages: [
      "images/w1.jpg",
      "images/w2.jpg",
      "images/w3.jpg"
    ],
    shortDescription: "We endeavour to design these products with specific parameters of the customers demand and current market.",
    specifications: {
      "Thickness": "25 mm | 28 mm",
      "Height": '78", 81", 84"',
      "Width": '30", 32", 33", 36", 38"'
    },
    features: [
      "Customizable finish to match your interior style.",
      "Waterproof and termite resistant.",
      "Eco-friendly and low maintenance.",
      "Durable and long-lasting."
    ],
    warranty: "Lifetime Warranty against termites and water damage.",
    maintenance: "Zero maintenance required. Washable with water and mild soap.",
    price: 8500
  },
  {
    id: "antique-laminated",
    name: "Antique Laminated Doors",
    mainImage: "images/antique laminated.jpg",
    similarImages: [
      "images/a1.jpg",
      "images/a2.jpg",
      "images/a3.jpg"
    ],
    shortDescription: "Antique word itself has its meaning these are limited hence antique with high grade laminate in either textured or glossy sheet according to the clients recommendation.",
    specifications: {
      "Thickness": "30 mm | 38 mm",
      "Height": '78", 81", 84", 96"',
      "Width": '30", 32", 33", 36", 38",'
    },
    features: [
      "Designs can be customised with different shades of colour or texture to create elegant effects.",
      "They're cost-effective & offer a good value alternative to traditional doors.",
      "Laminate doors with antibacterial property increases the durability & strength."
    ],
    warranty: "5 Years Warranty against manufacturing defects.",
    maintenance: "Wipe with a soft, damp cloth. Avoid abrasive cleaners.",
    price: 8000
  },
  {
    id: "premium-digital",
    name: "Premium Digital Korean Doors",
    mainImage: "images/premium digital.jpg",
    similarImages: [
      "images/p1.jpg",
      "images/p2.jpg",
      "images/p3.jpg"
    ],
    shortDescription: "Being Royal is always attractive. Hence forth we present premium membrane doors with premium designs and elegant looks with Korean touch of designs.",
    specifications: {
      "Thickness": "30 mm ",
      "Height": '78", 81", 84"',
      "Width": '27", 30", 33", 36", 38"'
    },
    features: [
      "They are custom made for quick installations.",
      "Easy to maintain and clean.",
      "Durable and long-lasting.",
      "Eco-friendly and termite resistant."
    ],
    warranty: "7 Years Warranty on the door structure.",
    maintenance: "Easy to clean with a damp cloth. Resistant to most household stains.",
    price: 9500
  },
  {
    id: "teak-veneer",
    name: "Teak Veneer Doors",
    mainImage: "images/teak wood.jpg",
    similarImages: [
      "images/t1.jpg",
      "images/t2.jpg",
      "images/t3.jpg"
    ],
    shortDescription: "Teak Veneer Doors are crafted from high-quality teak wood, offering a luxurious and durable finish,Doors are made with same colour teak which can be grooved into different designs.",
    specifications: {
      "Thickness": "30 mm | 38 mm",
      "Height": '78", 81", 84" ,96"',
      "Width": '30", 33", 36", 38",'
    },
    features: [
      "Flexibility in designs.",
      "Easy to maintain and clean.",
      "Increased strength and durability.",
      "Better way of wood utilization."
    ],
    warranty: "10 Years Warranty on structural integrity.",
    maintenance: "Requires periodic polishing (every 2-3 years) to maintain its sheen.",
    price: 12000
  },
  {
    id: "premium-teak-wood",
    name: "Premium Teak Wood Door",
    mainImage: "images/premium teak wood door.jpg",
    similarImages: [
      "images/tw1.jpg",
      "images/tw2.jpg",
      "images/tw3.jpg"
    ],

    shortDescription: "We season our product for best durability, strength & quality as well as the outcome appears attractive with fine polish.",
    specifications: {
      "Thickness": "32 mm | 38 mm",
      "Height": '78", 81", 84" ,96"',
      "Width": '30", 33", 36", 38", '
    },
    features: [
      "Strong, Durable.",
      "Easy to maintain and clean.",
      "Resistance to fungi, Termites.",
      "100% Season Wood."
    ],
    warranty: "15 Years Warranty on wood and structure.",
    maintenance: "Regular polishing is recommended to protect the wood and enhance its life.",
    price: 18000
  },
  {
    id: "laminate-doors",
    name: "Laminate Doors",
    mainImage: "images/laminated doors.png",
    similarImages: [
      "images/l1.png",
      "images/l2.png",
      "images/l3.png"
    ],

    shortDescription: "We also customise the design as per the interior by choosing variety of laminates for attractive outcome.",
    specifications: {
      "Thickness": "32 mm | 38 mm | 45 mm",
      "Height": '78", 81", 84"',
      "Width": '30", 33", 36", 38",'
    },
    features: [
      "Designs can be customised with different shades of colour or texture to create elegant effects.",
      "They’re cost-effective & offer a good value alternative to traditional doors.",
      "Laminate doors with antibacterial property increases the durability, strength of the doors.",
    ],
    warranty: "5 Years Warranty against manufacturing defects.",
    maintenance: "Very low maintenance. Clean with a damp cloth.",
    price: 6500
  },
  {
    id: "wpc-door-frame",
    name: "WPC Door and Frame",
    mainImage: "images/WPC.png",
    similarImages: [
      "images/wpc1.png",
    ],

    shortDescription: "This product is a combination of wooden properties and virgin or recycled plastic WPC overcomes all the negative marking caused by natural wood.",
    specifications: {
      "Thickness": "25 mm | 28 mm | 30 mm",
      "Height": '78", 81", 84"',
      "Width": '30", 33", 36", 38",'
    },
    features: [
      "Anti-termite.",
      "Anti-corrosion.",
      "Low maintenance.",
      "Waterproof."
    ],
    warranty: "Lifetime Warranty against termites and water damage.",
    maintenance: "Washable and requires no periodic maintenance.",
    price: 5500
  },
  {
    id: "pooja-door",
    name: "Pooja Door",
    mainImage: "images/pooja-1.jpg",
    similarImages: [
      "images/pooja-2.jpg",
      "images/pooja-3.jpg",
      "images/pooja-4.jpg"
    ],

    shortDescription: "AJOR presents Beautifully crafted Pooja doors made of solid teakwood (Tanzania & Ghana Teak), veneer, Primer Coated & UV COATED WPC Doors.",
    specifications: {
      "Thickness": "25 mm | 28 mm | 30 mm",
      "Height": '78", 81", 84"',
      "Width": '30", 33", 36", 38",'
    },
    features: [
      "Anti-termite.",
      "Anti-corrosion.",
      "Low maintenance.",
      "Waterproof."
    ],
    warranty: "Varies by material (Teak, Veneer, WPC). See specific product for details.",
    maintenance: "Maintenance depends on the material. Generally, gentle cleaning is sufficient.",
    price: 25000
  },
  // Add other products as needed...
]

// Door Catalog Gallery Data - Collection of door designs with codes and categories
// Each door has a category to group similar doors together
const DOOR_CATALOG = [
  // Category 1: Exclusive Laminates (codes starting with 1)
  { code: "AJ-101", image: "images/exclusive laminated.jpg", category: "exclusive-laminates" },
  { code: "AJ-102", image: "images/1001.jpg", category: "exclusive-laminates" },
  { code: "AJ-103", image: "images/1002.jpg", category: "exclusive-laminates" },
  { code: "AJ-104", image: "images/e1.jpg", category: "exclusive-laminates" },
  { code: "AJ-105", image: "images/e2.jpg", category: "exclusive-laminates" },
  { code: "AJ-106", image: "images/e3.jpg", category: "exclusive-laminates" },


  // Category 2: Solid Wood Primer (codes starting with 2)
  { code: "AJ-201", image: "images/solid wood primer.jpg", category: "solid-wood-primer" },
  { code: "AJ-202", image: "images/s1.jpg", category: "solid-wood-primer" },
  { code: "AJ-203", image: "images/s2.jpg", category: "solid-wood-primer" },
  { code: "AJ-204", image: "images/s3.jpg", category: "solid-wood-primer" },
  { code: "AJ-205", image: "images/2005.jpg", category: "solid-wood-primer" },
  { code: "AJ-206", image: "images/2006.jpg", category: "solid-wood-primer" },
  { code: "AJ-207", image: "images/2007.jpg", category: "solid-wood-primer" },
  { code: "AJ-208", image: "images/2008.jpg", category: "solid-wood-primer" },
  { code: "AJ-209", image: "images/2009.jpg", category: "solid-wood-primer" },
  { code: "AJ-210", image: "images/2010.jpg", category: "solid-wood-primer" },
  { code: "AJ-211", image: "images/2011.jpg", category: "solid-wood-primer" },

  // Category 3: WPC Digital (codes starting with 3)
  { code: "AJ-301", image: "images/wpc digital.jpg", category: "wpc-digital" },
  { code: "AJ-302", image: "images/w1.jpg", category: "wpc-digital" },
  { code: "AJ-303", image: "images/w2.jpg", category: "wpc-digital" },
  { code: "AJ-304", image: "images/w3.jpg", category: "wpc-digital" },
  { code: "AJ-305", image: "images/3005.jpg", category: "wpc-digital" },
  { code: "AJ-306", image: "images/3006.jpg", category: "wpc-digital" },
  { code: "AJ-307", image: "images/3007.jpg", category: "wpc-digital" },
  { code: "AJ-308", image: "images/3008.jpg", category: "wpc-digital" },
  { code: "AJ-309", image: "images/3009.jpg", category: "wpc-digital" },
  { code: "AJ-310", image: "images/3010.jpg", category: "wpc-digital" },
  { code: "AJ-311", image: "images/3011.jpg", category: "wpc-digital" },




  // Category 4: Antique Laminated Doors (codes starting with 4)
  { code: "AJ-401", image: "images/antique laminated.jpg", category: "antique-laminated" },
  { code: "AJ-402", image: "images/a1.jpg", category: "antique-laminated" },
  { code: "AJ-403", image: "images/a2.jpg", category: "antique-laminated" },
  { code: "AJ-404", image: "images/a3.jpg", category: "antique-laminated" },
  { code: "AJ-405", image: "images/4005.jpg", category: "antique-laminated" },
  { code: "AJ-406", image: "images/4006.jpg", category: "antique-laminated" },


  // Category 5: Premium Digital Korean Doors (codes starting with 5)
  { code: "AJ-501", image: "images/premium digital.jpg", category: "premium-digital" },
  { code: "AJ-502", image: "images/p1.jpg", category: "premium-digital" },
  { code: "AJ-503", image: "images/p2.jpg", category: "premium-digital" },
  { code: "AJ-504", image: "images/p3.jpg", category: "premium-digital" },
  { code: "AJ-505", image: "images/5005.jpg", category: "premium-digital" },
  { code: "AJ-506", image: "images/5006.jpg", category: "premium-digital" },
  { code: "AJ-507", image: "images/5007.jpg", category: "premium-digital" },
  { code: "AJ-508", image: "images/5008.jpg", category: "premium-digital" },
  { code: "AJ-509", image: "images/5009.jpg", category: "premium-digital" },
  { code: "AJ-510", image: "images/5010.jpg", category: "premium-digital" },



  // Category 6: Premium Teak Wood Doors (codes starting with 6)
  { code: "AJ-601", image: "images/premium teak wood door.jpg", category: "premium-teak-wood" },
  { code: "AJ-602", image: "images/tw1.jpg", category: "premium-teak-wood" },
  { code: "AJ-603", image: "images/tw2.jpg", category: "premium-teak-wood" },
  { code: "AJ-604", image: "images/tw3.jpg", category: "premium-teak-wood" },
  { code: "AJ-605", image: "images/6005.jpg", category: "premium-teak-wood" },
  { code: "AJ-606", image: "images/6006.jpg", category: "premium-teak-wood" },
  { code: "AJ-607", image: "images/6007.jpg", category: "premium-teak-wood" },
  { code: "AJ-608", image: "images/6008.jpg", category: "premium-teak-wood" },
  { code: "AJ-609", image: "images/6009.jpg", category: "premium-teak-wood" },
  { code: "AJ-610", image: "images/6010.jpg", category: "premium-teak-wood" },
  { code: "AJ-611", image: "images/6011.jpg", category: "premium-teak-wood" },
  { code: "AJ-612", image: "images/6012.jpg", category: "premium-teak-wood" },
  { code: "AJ-613", image: "images/6013.jpg", category: "premium-teak-wood" },
  { code: "AJ-614", image: "images/6014.jpg", category: "premium-teak-wood" },
  { code: "AJ-615", image: "images/6015.jpg", category: "premium-teak-wood" },
  { code: "AJ-616", image: "images/6016.jpg", category: "premium-teak-wood" },
  { code: "AJ-617", image: "images/6017.jpg", category: "premium-teak-wood" },
  { code: "AJ-618", image: "images/6018.jpg", category: "premium-teak-wood" },
  { code: "AJ-619", image: "images/6019.jpg", category: "premium-teak-wood" },
  { code: "AJ-620", image: "images/6020.jpg", category: "premium-teak-wood" },
  { code: "AJ-621", image: "images/6021.jpg", category: "premium-teak-wood" },
  { code: "AJ-622", image: "images/6022.jpg", category: "premium-teak-wood" },
  { code: "AJ-623", image: "images/6023.jpg", category: "premium-teak-wood" },
  { code: "AJ-624", image: "images/6024.jpg", category: "premium-teak-wood" },
  { code: "AJ-625", image: "images/6025.jpg", category: "premium-teak-wood" },
  { code: "AJ-626", image: "images/6026.jpg", category: "premium-teak-wood" },
  { code: "AJ-627", image: "images/6027.jpg", category: "premium-teak-wood" },
  { code: "AJ-628", image: "images/6028.jpg", category: "premium-teak-wood" },
  { code: "AJ-629", image: "images/6029.jpg", category: "premium-teak-wood" },
  { code: "AJ-630", image: "images/6030.jpg", category: "premium-teak-wood" },
  { code: "AJ-631", image: "images/6031.jpg", category: "premium-teak-wood" },
  { code: "AJ-632", image: "images/6032.jpg", category: "premium-teak-wood" },
  { code: "AJ-633", image: "images/6033.jpg", category: "premium-teak-wood" },
  { code: "AJ-634", image: "images/6034.jpg", category: "premium-teak-wood" },
  { code: "AJ-635", image: "images/6035.jpg", category: "premium-teak-wood" },


  // Category 7: Teak Veneer Doors (codes starting with 7)
  { code: "AJ-701", image: "images/teak wood.jpg", category: "teak-veneer" },
  { code: "AJ-702", image: "images/t1.jpg", category: "teak-veneer" },
  { code: "AJ-703", image: "images/t2.jpg", category: "teak-veneer" },
  { code: "AJ-704", image: "images/t3.jpg", category: "teak-veneer" },
  { code: "AJ-705", image: "images/7005.jpg", category: "teak-veneer" },
  { code: "AJ-706", image: "images/7006.jpg", category: "teak-veneer" },
  { code: "AJ-707", image: "images/7007.jpg", category: "teak-veneer" },
  { code: "AJ-708", image: "images/7008.jpg", category: "teak-veneer" },
  { code: "AJ-709", image: "images/7009.jpg", category: "teak-veneer" },
  { code: "AJ-710", image: "images/7010.jpg", category: "teak-veneer" },
  { code: "AJ-711", image: "images/7011.jpg", category: "teak-veneer" },
  { code: "AJ-712", image: "images/7012.jpg", category: "teak-veneer" },
  { code: "AJ-713", image: "images/7013.jpg", category: "teak-veneer" },
  { code: "AJ-714", image: "images/7014.jpg", category: "teak-veneer" },
  { code: "AJ-715", image: "images/7015.jpg", category: "teak-veneer" },
  { code: "AJ-716", image: "images/7016.jpg", category: "teak-veneer" },
  { code: "AJ-717", image: "images/7017.jpg", category: "teak-veneer" },
  { code: "AJ-718", image: "images/7018.jpg", category: "teak-veneer" },
  { code: "AJ-719", image: "images/7019.jpg", category: "teak-veneer" },
  { code: "AJ-720", image: "images/7020.jpg", category: "teak-veneer" },
  { code: "AJ-721", image: "images/7021.jpg", category: "teak-veneer" },
  { code: "AJ-722", image: "images/7022.jpg", category: "teak-veneer" },



  // Category 8: Laminate Doors (codes starting with 8)
  { code: "AJ-801", image: "images/laminate doors.png", category: "laminate-doors" },
  { code: "AJ-802", image: "images/l1.png", category: "laminate-doors" },
  { code: "AJ-803", image: "images/l2.png", category: "laminate-doors" },
  { code: "AJ-804", image: "images/l3.png", category: "laminate-doors" },
  { code: "AJ-805", image: "images/8005.png", category: "laminate-doors" },
  { code: "AJ-806", image: "images/8006.png", category: "laminate-doors" },
  { code: "AJ-807", image: "images/8007.png", category: "laminate-doors" },
  { code: "AJ-808", image: "images/8008.png", category: "laminate-doors" },
  { code: "AJ-809", image: "images/8009.png", category: "laminate-doors" },
  { code: "AJ-810", image: "images/8010.png", category: "laminate-doors" },
  { code: "AJ-811", image: "images/8011.png", category: "laminate-doors" },
  { code: "AJ-812", image: "images/8012.png", category: "laminate-doors" },
  { code: "AJ-813", image: "images/8013.png", category: "laminate-doors" },
  { code: "AJ-814", image: "images/8014.png", category: "laminate-doors" },
  { code: "AJ-815", image: "images/8015.png", category: "laminate-doors" },
  { code: "AJ-816", image: "images/8016.png", category: "laminate-doors" },
  { code: "AJ-817", image: "images/8017.png", category: "laminate-doors" },
  { code: "AJ-818", image: "images/8018.png", category: "laminate-doors" },
  { code: "AJ-819", image: "images/8019.png", category: "laminate-doors" },
  { code: "AJ-820", image: "images/8020.png", category: "laminate-doors" },
  { code: "AJ-821", image: "images/8021.png", category: "laminate-doors" },
  { code: "AJ-822", image: "images/8022.png", category: "laminate-doors" },
  { code: "AJ-823", image: "images/8023.png", category: "laminate-doors" },
  { code: "AJ-824", image: "images/8024.png", category: "laminate-doors" },
  { code: "AJ-825", image: "images/8025.png", category: "laminate-doors" },
  { code: "AJ-826", image: "images/8026.png", category: "laminate-doors" },
  { code: "AJ-827", image: "images/8027.png", category: "laminate-doors" },
  { code: "AJ-828", image: "images/8028.png", category: "laminate-doors" },
  { code: "AJ-829", image: "images/8029.png", category: "laminate-doors" },

  // Category 9: WPC Door Frame (codes starting with 9)
  { code: "AJ-901", image: "images/WPC.png", category: "wpc-door-frame" },
  { code: "AJ-902", image: "images/wpc1.png", category: "wpc-door-frame" },
   // Category 10: Pooja  Door  (codes starting with 10)
  { code: "AJ-1001", image: "images/pooja-1.jpg", category: "pooja-door" },
  { code: "AJ-1002", image: "images/pooja-2.jpg", category: "pooja-door" },
  { code: "AJ-1003", image: "images/pooja-3.jpg", category: "pooja-door" },
  { code: "AJ-1004", image: "images/pooja-4.jpg", category: "pooja-door" },
  { code: "AJ-1005", image: "images/pooja-5.jpg", category: "pooja-door" },
  { code: "AJ-1006", image: "images/pooja-6.jpg", category: "pooja-door" },
  { code: "AJ-1007", image: "images/pooja-7.jpg", category: "pooja-door" },
  { code: "AJ-1008", image: "images/pooja-8.jpg", category: "pooja-door" },
  { code: "AJ-1009", image: "images/pooja-9.jpg", category: "pooja-door" },
  { code: "AJ-1010", image: "images/pooja-10.jpg", category: "pooja-door" },
  { code: "AJ-1011", image: "images/pooja-11.jpg", category: "pooja-door" },
  { code: "AJ-1012", image: "images/pooja-12.jpg", category: "pooja-door" },
  { code: "AJ-1013", image: "images/pooja-13.jpg", category: "pooja-door" },
  { code: "AJ-1014", image: "images/pooja-14.jpg", category: "pooja-door" },
  { code: "AJ-1015", image: "images/pooja-15.jpg", category: "pooja-door" },
  { code: "AJ-1016", image: "images/pooja-16.jpg", category: "pooja-door" },
  { code: "AJ-1017", image: "images/pooja-17.jpg", category: "pooja-door" },
  
]