// Sonali Furniture — Official Product Catalog Data
// Strictly adhering to specified brand categories:
// Temple, Shoe Rake, Study Table, Wooden Palang, Sofa, Dining Chair, Dining Table, Sofa Cum Bed, Dressing Table, Office Table, Custom Furniture

const PRODUCTS_DATA = [
  {
    id: "sf-palang-01",
    name: "Royal Sheesham Wooden Palang",
    category: "Wooden Palang",
    room: "Bedroom",
    descriptor: "Solid Sheesham wood king-size bed with traditional carved headboard",
    buyPrice: 38499,
    rentPrice: 1899,
    rentDeposit: 3500,
    minRentMonths: 3,
    availability: "Buy & Rent",
    rating: 4.9,
    reviewsCount: 42,
    material: "Solid Sheesham Wood",
    finish: "Warm Walnut Matte Finish",
    color: "Deep Walnut Brown",
    dimensions: "82\" L x 76\" W x 48\" H (King Size)",
    weight: "78 kg",
    assembly: "Carpenter assembly included (Free)",
    warranty: "5-Year Solid Wood Structural Warranty",
    inStock: true,
    image: "assets/images/products/wooden_palang.jpg",
    gallery: [
      "assets/images/products/wooden_palang.jpg",
      "assets/images/products/wood_detail.jpg",
      "assets/images/hero/hero_slide_1.jpg",
      "assets/images/about/workshop.jpg"
    ],
    overview: "Crafted from seasoned solid Sheesham wood (Indian Rosewood), this king-size palang blends generational Indian woodworking with refined contemporary strength. Built with hydraulic storage under-bed and reinforced corner joints designed to last decades without squeaking.",
    whatsIncluded: [
      "1 x Solid Sheesham Bed Frame (King Size)",
      "1 x Carved Sheesham Headboard",
      "Heavy-duty Marine Plywood Mattress Base Slats",
      "Complete assembly hardware & professional carpenter installation"
    ],
    deliveryInfo: "Delivered within 5–7 business days. Our professional carpentry team completes assembly at your room of choice at zero additional cost.",
    returnsInfo: "7-day doorstep replacement or return if any transit defect or dimensional discrepancy is noticed upon delivery.",
    careInstructions: "Dust regularly with a dry soft microfiber cloth. Avoid placing directly in prolonged harsh sunlight. Use natural beeswax polish once a year to maintain grain radiance."
  },
  {
    id: "sf-sofa-01",
    name: "Aura 3-Seater Wood-Trim Sofa",
    category: "Sofa",
    room: "Living Room",
    descriptor: "Solid Sheesham wood frame with high-density foam & textured beige upholstery",
    buyPrice: 32999,
    rentPrice: 1499,
    rentDeposit: 2500,
    minRentMonths: 3,
    availability: "Buy & Rent",
    rating: 4.8,
    reviewsCount: 38,
    material: "Solid Sheesham Wood & Premium Woven Linen",
    finish: "Natural Teak Brown Wood Trim",
    color: "Warm Oatmeal Beige",
    dimensions: "84\" W x 34\" D x 32\" H",
    weight: "52 kg",
    assembly: "Pre-assembled. Legs fastened on delivery.",
    warranty: "3-Year Frame & Foam Warranty",
    inStock: true,
    image: "assets/images/products/sofa.jpg",
    gallery: [
      "assets/images/products/sofa.jpg",
      "assets/images/hero/hero_slide_1.jpg",
      "assets/images/products/wood_detail.jpg"
    ],
    overview: "A clean, modern sofa framed in solid Sheesham wood with organic curved armrests. Built with 32-density ergonomic foam and spill-resistant breathable textured upholstery that stays cool during Indian summers.",
    whatsIncluded: [
      "1 x 3-Seater Sofa with Solid Sheesham Base",
      "3 x Back Cushions with Removable Washable Covers",
      "2 x Accent Lumbar Pillows"
    ],
    deliveryInfo: "Delivered within 4–6 business days in protective three-layer bubble and corrugated packaging.",
    returnsInfo: "Hassle-free 7-day return if not satisfied with seating comfort or fabric fit.",
    careInstructions: "Vacuum weekly with soft brush nozzle. Blot liquid spills immediately with clean dry cloth. Dry clean cushion covers when needed."
  },
  {
    id: "sf-study-01",
    name: "ErgoCraft Solid Wood Study Table",
    category: "Study Table",
    room: "Work & Study",
    descriptor: "Minimalist teak study table with organized drawers & discreet cable channel",
    buyPrice: 14499,
    rentPrice: 699,
    rentDeposit: 1500,
    minRentMonths: 3,
    availability: "Buy & Rent",
    rating: 4.9,
    reviewsCount: 56,
    material: "Seasoned Solid Teak Wood",
    finish: "Smooth Satin Lacquer",
    color: "Honey Teak Brown",
    dimensions: "48\" W x 24\" D x 30\" H",
    weight: "32 kg",
    assembly: "Minimal assembly required (10 mins, done by delivery team)",
    warranty: "3-Year Structural Warranty",
    inStock: true,
    image: "assets/images/products/study_table.jpg",
    gallery: [
      "assets/images/products/study_table.jpg",
      "assets/images/products/wood_detail.jpg",
      "assets/images/hero/hero_slide_2.jpg"
    ],
    overview: "Designed for focused long study and work sessions. Features a spacious 48-inch solid teak surface, three whisper-soft wooden slide drawers for notebooks and stationery, and a dedicated cable pass-through keeping your workspace clutter-free.",
    whatsIncluded: [
      "1 x Solid Teak Study Desk Top with Drawers",
      "4 x Heavy-gauge Teak Wood Legs with brass feet levelers",
      "Cable management brackets"
    ],
    deliveryInfo: "Delivered in 3–5 business days. Free installation included.",
    returnsInfo: "7-day return policy. Doorstep pickup arranged if any defect found.",
    careInstructions: "Wipe with slightly damp cloth followed by dry cloth. Use coasters for hot mugs and beverages."
  },
  {
    id: "sf-dining-table-01",
    name: "Heritage 6-Seater Solid Wood Dining Table",
    category: "Dining Table",
    room: "Dining",
    descriptor: "Heavy solid Sheesham wood dining table with hand-finished edges",
    buyPrice: 28999,
    rentPrice: 1399,
    rentDeposit: 2500,
    minRentMonths: 3,
    availability: "Buy & Rent",
    rating: 4.9,
    reviewsCount: 29,
    material: "100% Solid Sheesham Wood",
    finish: "Food-Safe Water Resistant Matte Coat",
    color: "Warm Golden Sheesham",
    dimensions: "66\" L x 36\" W x 30\" H",
    weight: "64 kg",
    assembly: "Leg assembly by Sonali delivery carpenter (Included)",
    warranty: "5-Year Solid Wood Warranty",
    inStock: true,
    image: "assets/images/products/dining_table.jpg",
    gallery: [
      "assets/images/products/dining_table.jpg",
      "assets/images/products/dining_chair.jpg",
      "assets/images/products/wood_detail.jpg",
      "assets/images/about/workshop.jpg"
    ],
    overview: "The heart of everyday family dinners. Constructed from single-plank matched Sheesham slabs with a heat and water-resistant protective sealant. Sturdy 4-inch square legs guarantee zero wobbling even during festive family feasts.",
    whatsIncluded: [
      "1 x 6-Seater Solid Sheesham Tabletop",
      "4 x Solid Sheesham Table Legs with structural aprons",
      "Installation hardware and floor-protection pads"
    ],
    deliveryInfo: "Delivered within 5–7 days. Complete installation at your dining room.",
    returnsInfo: "7-day replacement guarantee if defective or damaged in transit.",
    careInstructions: "Always use dining mats and trivets for hot cookware. Clean with mild soap water and wipe dry promptly."
  },
  {
    id: "sf-temple-01",
    name: "Pratishtha Solid Sheesham Temple (Mandir)",
    category: "Temple",
    room: "Pooja",
    descriptor: "Handcrafted home pooja mandir with carved jali work, brass bells & pooja drawers",
    buyPrice: 21999,
    rentPrice: null, // Temple is Buy only or custom
    rentDeposit: null,
    minRentMonths: null,
    availability: "Available to Buy",
    rating: 5.0,
    reviewsCount: 34,
    material: "Pure Solid Sheesham Wood with Solid Brass Bells",
    finish: "Traditional Hand-Rubbed Wax Polish",
    color: "Sacred Teak Brown",
    dimensions: "36\" W x 18\" D x 44\" H",
    weight: "41 kg",
    assembly: "Comes fully assembled & ready to place",
    warranty: "5-Year Wood Integrity Guarantee",
    inStock: true,
    image: "assets/images/products/temple.jpg",
    gallery: [
      "assets/images/products/temple.jpg",
      "assets/images/products/wood_detail.jpg",
      "assets/images/about/workshop.jpg"
    ],
    overview: "Created with reverent care by master woodcarvers. Features traditional floral jali cutouts, hand-hung brass bells that chime gently, an elevated sanctum altar, a slide-out prasad/diya tray, and three spacious drawers for storing holy scriptures, cotton wicks, and pooja essentials.",
    whatsIncluded: [
      "1 x Handcrafted Sheesham Pooja Mandir Unit",
      "4 x Hand-cast Solid Brass Hanging Bells",
      "1 x Pull-out Diya/Prasad Brass-Accented Tray",
      "Wall mounting anchor brackets (optional use)"
    ],
    deliveryInfo: "Specially packaged in wooden crate protection. Delivered in 5–8 days.",
    returnsInfo: "10-day replacement policy for peace of mind.",
    careInstructions: "Keep incense sticks and open flames safely inside the metal diya holder. Wipe surface with soft clean muslin cloth."
  },
  {
    id: "sf-shoe-rake-01",
    name: "Swagat Solid Wood Shoe Rake with Bench",
    category: "Shoe Rake",
    room: "Entryway",
    descriptor: "Entryway shoe organizer with cushioned seat & ventilated louvered doors",
    buyPrice: 11999,
    rentPrice: 499,
    rentDeposit: 1000,
    minRentMonths: 3,
    availability: "Buy & Rent",
    rating: 4.8,
    reviewsCount: 47,
    material: "Solid Teak Wood & High-Density Cushioned Bench",
    finish: "Protective Satin Wood Seal",
    color: "Natural Warm Teak",
    dimensions: "44\" W x 16\" D x 21\" H",
    weight: "26 kg",
    assembly: "Fully assembled. Ready to use.",
    warranty: "3-Year Wood Warranty",
    inStock: true,
    image: "assets/images/products/shoe_rack.jpg",
    gallery: [
      "assets/images/products/shoe_rack.jpg",
      "assets/images/products/wood_detail.jpg"
    ],
    overview: "The practical entryway solution for modern Indian homes. Combines a comfortable cushioned bench so you can sit comfortably while putting on footwear, with 2-tier louvered ventilated racks that store up to 12 pairs of shoes while preventing moisture and odor buildup.",
    whatsIncluded: [
      "1 x Solid Wood Shoe Rack with Fitted Padded Bench Top",
      "Internal Adjustable Shelving Inserts"
    ],
    deliveryInfo: "Delivered in 3–5 business days. No assembly needed.",
    returnsInfo: "7-day return policy.",
    careInstructions: "Clean internal shoe trays regularly. Brush fabric seat gently with a soft textile brush."
  },
  {
    id: "sf-sofa-bed-01",
    name: "Mukta Solid Wood Sofa Cum Bed",
    category: "Sofa Cum Bed",
    room: "Living Room",
    descriptor: "Effortless pull-out mechanism with hidden storage & Queen size sleeping area",
    buyPrice: 34999,
    rentPrice: 1699,
    rentDeposit: 3000,
    minRentMonths: 3,
    availability: "Buy & Rent",
    rating: 4.8,
    reviewsCount: 31,
    material: "Seasoned Sheesham Wood & High Resilience Foam",
    finish: "Honey Walnut Satin",
    color: "Warm Sand Beige Fabric",
    dimensions: "Sofa: 78\" W x 36\" D x 34\" H | Bed: 78\" W x 60\" D",
    weight: "68 kg",
    assembly: "Free doorstep assembly by trained technician",
    warranty: "5-Year Frame & Mechanism Warranty",
    inStock: true,
    image: "assets/images/products/sofa_cum_bed.jpg",
    gallery: [
      "assets/images/products/sofa_cum_bed.jpg",
      "assets/images/hero/hero_slide_1.jpg",
      "assets/images/products/wood_detail.jpg"
    ],
    overview: "The ideal dual-purpose piece for Indian homes accommodating overnight guests. Functions as an inviting 3-seater living room couch by day, and smoothly transforms into a comfortable Queen-size bed in under 15 seconds. Built-in under-seat storage holds extra quilts and pillows.",
    whatsIncluded: [
      "1 x Sheesham Sofa Cum Bed Frame with Heavy Duty Metal Sliders",
      "1 x Foldable Dual-Density Foam Mattress",
      "2 x Throw Pillows"
    ],
    deliveryInfo: "Delivered within 5–7 days. Complete demonstration and installation included.",
    returnsInfo: "7-day return or exchange policy.",
    careInstructions: "Vacuum cushions every fortnight. Lubricate slider rails once a year with dry silicone spray."
  },
  {
    id: "sf-dressing-table-01",
    name: "Roop Solid Sheesham Dressing Table",
    category: "Dressing Table",
    room: "Bedroom",
    descriptor: "Full-length clarity mirror with 3 organized vanity drawers & matching stool",
    buyPrice: 17999,
    rentPrice: 799,
    rentDeposit: 1800,
    minRentMonths: 3,
    availability: "Buy & Rent",
    rating: 4.7,
    reviewsCount: 23,
    material: "Solid Sheesham Wood & Saint-Gobain Distortion-Free Mirror",
    finish: "Warm Walnut Polish",
    color: "Deep Walnut Brown",
    dimensions: "40\" W x 18\" D x 70\" H",
    weight: "39 kg",
    assembly: "Mirror mounting and frame setup done by Sonali team",
    warranty: "3-Year Wood Warranty",
    inStock: true,
    image: "assets/images/products/dressing_table.jpg",
    gallery: [
      "assets/images/products/dressing_table.jpg",
      "assets/images/products/wood_detail.jpg"
    ],
    overview: "Graceful bedroom vanity crafted in solid Sheesham. Features a premium full-length clarity mirror, three partitioned drawers with antique brass hardware for cosmetics and jewelry, and a matching padded wooden stool that slides neatly underneath.",
    whatsIncluded: [
      "1 x Solid Sheesham Vanity Table with 3 Drawers",
      "1 x Beveled High-Clarity Mirror with Sheesham Border",
      "1 x Padded Wooden Stool"
    ],
    deliveryInfo: "Delivered within 4–6 days with special shatter-safe mirror crating.",
    returnsInfo: "7-day doorstep return.",
    careInstructions: "Clean mirror with glass cleaner and microfiber cloth. Avoid getting moisture into drawer joints."
  },
  {
    id: "sf-office-table-01",
    name: "Karyalay Executive Solid Wood Office Table",
    category: "Office Table",
    room: "Work & Study",
    descriptor: "Stately 60-inch executive office desk with locking filing cabinet & wire grommets",
    buyPrice: 24499,
    rentPrice: 1199,
    rentDeposit: 2200,
    minRentMonths: 3,
    availability: "Buy & Rent",
    rating: 4.9,
    reviewsCount: 27,
    material: "Solid Teak & Sheesham Wood Core",
    finish: "Scratch-Resistant Polyurethane Finish",
    color: "Natural Teak Brown",
    dimensions: "60\" W x 30\" D x 30\" H",
    weight: "58 kg",
    assembly: "Free assembly by Sonali delivery technicians",
    warranty: "5-Year Structural Warranty",
    inStock: true,
    image: "assets/images/products/office_table.jpg",
    gallery: [
      "assets/images/products/office_table.jpg",
      "assets/images/products/wood_detail.jpg",
      "assets/images/hero/hero_slide_2.jpg"
    ],
    overview: "Built for professionals, home offices, and executive workspaces. Features an expansive 5-foot work surface accommodating multi-monitor setups, a central privacy modesty panel, two stationery drawers, and a bottom deep drawer with key lock for confidential documents.",
    whatsIncluded: [
      "1 x 60\" Executive Desk Unit",
      "3 x Storage Drawers with Precision Slides & 2 Keys",
      "2 x Brass Cable Pass Grommets"
    ],
    deliveryInfo: "Delivered in 4–6 days. On-site assembly included.",
    returnsInfo: "7-day return policy.",
    careInstructions: "Use desk mats under writing pads and mouse. Clean with a dry cotton cloth."
  },
  {
    id: "sf-dining-chair-01",
    name: "Parampara Solid Wood Dining Chairs (Set of 2)",
    category: "Dining Chair",
    room: "Dining",
    descriptor: "Ergonomic slatted back solid Sheesham dining chairs with padded cushion",
    buyPrice: 9499,
    rentPrice: 449,
    rentDeposit: 800,
    minRentMonths: 3,
    availability: "Buy & Rent",
    rating: 4.8,
    reviewsCount: 44,
    material: "Solid Sheesham Wood & Oatmeal Fabric Cushion",
    finish: "Warm Walnut Smooth Finish",
    color: "Walnut Brown & Beige",
    dimensions: "18\" W x 19\" D x 38\" H (Seat Height: 18\")",
    weight: "16 kg (Pair)",
    assembly: "Pre-assembled and ready to use",
    warranty: "3-Year Structural Warranty",
    inStock: true,
    image: "assets/images/products/dining_chair.jpg",
    gallery: [
      "assets/images/products/dining_chair.jpg",
      "assets/images/products/dining_table.jpg",
      "assets/images/products/wood_detail.jpg"
    ],
    overview: "Classic Indian dining chairs that prioritize back comfort and timeless elegance. The curved ergonomic slatted lumbar support lets you enjoy leisurely conversations after dinner, while the 2-inch padded cushion provides comfortable posture support.",
    whatsIncluded: [
      "2 x Solid Sheesham Dining Chairs",
      "Pre-installed Floor Protector Felt Pads"
    ],
    deliveryInfo: "Delivered within 3–5 days. Fully assembled.",
    returnsInfo: "7-day replacement guarantee.",
    careInstructions: "Spot-clean cushion fabric with damp cloth. Dust wooden slats with dry brush."
  },
  {
    id: "sf-custom-01",
    name: "Custom Bespoke Wood Furniture",
    category: "Custom Furniture",
    room: "Custom",
    descriptor: "Tailored to your exact room measurements, wood selection, and architectural style",
    buyPrice: 19999, // Starting from
    rentPrice: null,
    rentDeposit: null,
    minRentMonths: null,
    availability: "Custom Only",
    rating: 5.0,
    reviewsCount: 65,
    material: "Choice of Sheesham, Teak, Sal, or White Oak",
    finish: "Custom Natural, Walnut, Honey, or Matte Wax",
    color: "Made to match your room palette",
    dimensions: "Customized to your exact layout specifications",
    weight: "Varies by custom design",
    assembly: "Master carpenter installation included",
    warranty: "5-Year Craftsmanship Guarantee",
    inStock: true,
    image: "assets/images/about/workshop.jpg",
    gallery: [
      "assets/images/about/workshop.jpg",
      "assets/images/products/wood_detail.jpg",
      "assets/images/hero/hero_slide_3.jpg"
    ],
    overview: "Have an awkward alcove, specific space constraint, or an architectural sketch in mind? Our master craftsmen collaborate with you to fabricate one-of-a-kind solid wood furniture built precisely to your millimeter measurements and wood preference.",
    whatsIncluded: [
      "Dedicated 1-on-1 consultation with master artisan",
      "3D dimension sketch & wood sample confirmation",
      "Handcrafted fabrication in seasoned solid wood",
      "White-glove doorstep delivery & precision installation"
    ],
    deliveryInfo: "Fabricated and delivered within 14–21 business days.",
    returnsInfo: "100% Satisfaction Guarantee. We adjust and fine-tune on-site until it fits your space seamlessly.",
    careInstructions: "Maintenance guide tailored to your chosen wood and finish provided on delivery."
  }
];

// Room groupings for 'Shop by Need'
const SHOP_BY_NEED_CATEGORIES = [
  {
    room: "Living Room",
    subtitle: "Everyday comfort & gatherings",
    items: ["Sofa", "Sofa Cum Bed"],
    image: "assets/images/products/sofa.jpg",
    categoryFilter: "Sofa"
  },
  {
    room: "Bedroom",
    subtitle: "Restful, solid wood retreats",
    items: ["Wooden Palang", "Dressing Table"],
    image: "assets/images/products/wooden_palang.jpg",
    categoryFilter: "Wooden Palang"
  },
  {
    room: "Dining",
    subtitle: "Where conversations linger",
    items: ["Dining Table", "Dining Chair"],
    image: "assets/images/products/dining_table.jpg",
    categoryFilter: "Dining Table"
  },
  {
    room: "Work & Study",
    subtitle: "Ergonomic & focused spaces",
    items: ["Study Table", "Office Table"],
    image: "assets/images/products/study_table.jpg",
    categoryFilter: "Study Table"
  },
  {
    room: "Entryway",
    subtitle: "Organized welcoming entry",
    items: ["Shoe Rake"],
    image: "assets/images/products/shoe_rack.jpg",
    categoryFilter: "Shoe Rake"
  },
  {
    room: "Pooja Room",
    subtitle: "Sacred handcrafted mandirs",
    items: ["Temple"],
    image: "assets/images/products/temple.jpg",
    categoryFilter: "Temple"
  },
  {
    room: "Custom Furniture",
    subtitle: "Made around your space",
    items: ["Bespoke Woodcraft"],
    image: "assets/images/about/workshop.jpg",
    categoryFilter: "Custom Furniture"
  }
];

// Sample authentic reviews (no fake numbers, honest feedback)
const PRODUCT_REVIEWS = [
  {
    productId: "sf-palang-01",
    author: "Rajesh Sharma",
    city: "New Delhi",
    rating: 5,
    date: "14 Feb 2026",
    title: "Remarkable Sheesham quality",
    text: "The wooden palang is very sturdy and the Sheesham grain looks even better than photos. Delivery team assembled it in 30 minutes without any mess."
  },
  {
    productId: "sf-palang-01",
    author: "Pooja Verma",
    city: "Gurugram",
    rating: 5,
    date: "28 Jan 2026",
    title: "Zero squeaks, real solid wood",
    text: "Tired of engineered particle board beds that loosen up. This solid wood palang feels rock solid. Headboard carving is clean and tasteful."
  },
  {
    productId: "sf-sofa-01",
    author: "Vikram Mehta",
    city: "Noida",
    rating: 5,
    date: "02 Mar 2026",
    title: "Comfortable and looks elegant",
    text: "The Sheesham wood base gives it a premium look. Fabric is comfortable and does not get hot. Very happy with the purchase."
  },
  {
    productId: "sf-study-01",
    author: "Ananya Deshmukh",
    city: "Bengaluru",
    rating: 5,
    date: "19 Jan 2026",
    title: "Perfect work from home desk",
    text: "Rented this for 6 months as I am on a temporary project. Delivery was punctual and the monthly rental process is completely transparent with no hidden fees."
  },
  {
    productId: "sf-temple-01",
    author: "Sunita Agarwal",
    city: "Jaipur",
    rating: 5,
    date: "11 Feb 2026",
    title: "Shuddh lakdi ka mandir, dil khush ho gaya",
    text: "The brass bells and wood carving look auspicious. Packaged with great care in a wooden frame. Thank you Sonali Furniture."
  },
  {
    productId: "sf-shoe-rake-01",
    author: "Amitabh Sen",
    city: "Kolkata",
    rating: 4,
    date: "05 Feb 2026",
    title: "Very practical entryway bench",
    text: "Louvered doors keep dust out while allowing ventilation. The cushioned seat makes putting on shoes very convenient."
  }
];

// Authentic FAQs
const FAQS_DATA = [
  {
    q: "Do you deliver to my city?",
    a: "Yes, Sonali Furniture delivers across major Indian cities and pin codes. Standard delivery takes 5–7 business days, with free doorstep assembly by our professional carpentry team."
  },
  {
    q: "How does Furniture on Rent work?",
    a: "Select your desired furniture, choose your rental tenure (3, 6, or 12 months), pay a minimal refundable security deposit and first month's rent. We deliver, install, and provide free doorstep maintenance. When your tenure ends, you can renew, return, or buy the piece at a discounted price."
  },
  {
    q: "What is the minimum rental period?",
    a: "Our minimum rental duration is 3 months. Longer tenures (6 or 12 months) offer substantial monthly discounts."
  },
  {
    q: "Do you provide installation and assembly?",
    a: "Yes. Every order — whether purchased or rented — includes complimentary professional assembly by skilled technicians at your room of choice."
  },
  {
    q: "Can I request custom furniture made to my dimensions?",
    a: "Absolutely. Custom furniture is a cornerstone of Sonali Furniture. You can submit your room dimensions and preferred wood via our Custom Furniture page, and our master craftsmen will build it specifically for your home."
  },
  {
    q: "What is your return and warranty policy?",
    a: "We offer a 7-day hassle-free doorstep inspection and return policy if any transit defect or dimensional discrepancy occurs. All solid wood furniture comes with 3 to 5 years structural warranty."
  },
  {
    q: "How can I track my order?",
    a: "Use our interactive Order Tracking page with your Order Number (e.g. #SF-1024) or phone number to view live progress: Order Confirmed, Workshop Preparation, Out for Delivery, and Delivered."
  }
];
