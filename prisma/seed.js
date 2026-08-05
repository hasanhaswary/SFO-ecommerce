import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing database...');
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding users...');
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const alexHonnold = await prisma.user.create({
    data: {
      email: 'alex.honnold@summitforge.com',
      password: hashedPassword,
      fullName: 'Alex Honnold',
      bio: 'High-altitude specialist and free soloist. Focus on ultralight alpine setups and extreme climate testing.',
      loyaltyTier: 'Lead Explorer',
      loyaltyPoints: 8450,
      milesLogged: 1248.5,
      totalSummits: 14,
      activeDeployments: 2,
      phone: '+27 (0)82 555 0123',
      shippingAddress: '882 Kloof Street, Gardens, Cape Town, 8001, South Africa',
      billingAddress: '882 Kloof Street, Gardens, Cape Town, 8001, South Africa',
      twoFactorEnabled: true,
    }
  });

  const demoUser = await prisma.user.create({
    data: {
      email: 'explorer@summitforge.com',
      password: hashedPassword,
      fullName: 'Johnathan Doe',
      bio: 'Tactical trekker & alpine enthusiast exploring world summits.',
      loyaltyTier: 'Lead Explorer',
      loyaltyPoints: 3200,
      milesLogged: 450.0,
      totalSummits: 6,
      activeDeployments: 1,
      phone: '+27 (0)82 555 9876',
      shippingAddress: '104 Drakensberg Drive, Stellenbosch, 7600, South Africa',
      billingAddress: '104 Drakensberg Drive, Stellenbosch, 7600, South Africa',
    }
  });

  console.log('Seeding products...');
  const products = [
    // --- FOOTWEAR (6) ---
    {
      name: 'Apex Trail Runner Gen-4',
      slug: 'apex-trail-runner-gen-4',
      category: 'Footwear',
      price: 3450.00,
      originalPrice: 3800.00,
      description: 'A precision-engineered masterpiece for competitive trail athletes. Features a multi-directional lug system for superior grip on wet granite and an ultra-breathable mesh upper that sheds moisture instantly. The Gen-4 model introduces our Carbon-Shank technology for explosive energy return on climbs.',
      image: '/src/assets/images/apex_trail_runner_gen_4.png',
      additionalImages: '/src/assets/images/regenerated_image_1784724875809.png,https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
      weight: '285g (Single)',
      weatherproof: 'Water-Resistant Coating',
      rating: 4.8,
      reviewCount: 142,
      stock: 12,
      tags: 'ULTRALIGHT,BESTSELLER,TECHNICAL',
      specs: JSON.stringify({
        "Midsole": "Dual-Density EVA",
        "Drop": "6mm",
        "Lug Depth": "5.5mm",
        "Support": "Neutral / Stability"
      }),
      materials: 'Kevlar-reinforced mesh upper, Vibram Megagrip rubber sole, Carbon fiber shank internal plate.',
      fieldNotes: 'Tested over 500km in the Cederberg & North Cascades. Zero hotspots during sustained technical ascents on loose scree and wet granite slabs.'
    },
    {
      name: 'Summit Trek V2 Boots',
      slug: 'summit-trek-v2-boots',
      category: 'Footwear',
      price: 4200.00,
      originalPrice: 4600.00,
      description: 'Heavy-duty leather mountaineering boots with full rubber rand and semi-automatic crampon compatibility.',
      image: '/src/assets/images/summit_trek_v2_boots.jpg',
      weight: '720g (Single)',
      weatherproof: '100% DryShield Waterproof',
      rating: 4.7,
      reviewCount: 110,
      stock: 14,
      tags: 'FOOTWEAR,CRAMPON-COMPATIBLE',
      specs: JSON.stringify({
        "Upper": "2.8mm Perwanger Leather",
        "Sole": "Vibram Mont Compound",
        "Crampon Notch": "Heel TPU Welt"
      }),
      materials: 'Full-grain Italian leather, Vibram Mont rubber outsole.',
      fieldNotes: 'Exceptional ankle support when carrying heavy 30kg load over uneven terrain.'
    },
    {
      name: 'Granite Shield Approach Shoes',
      slug: 'granite-shield-approach-shoes',
      category: 'Footwear',
      price: 2850.00,
      originalPrice: 3200.00,
      description: 'Sticky-rubber approach shoe built for technical rock scrambling, via ferrata, and steep crag approaches.',
      image: '/src/assets/images/granite_shield_approach_shoes.jpg',
      weight: '390g (Single)',
      weatherproof: 'Water-Repellent Suede',
      rating: 4.6,
      reviewCount: 78,
      stock: 20,
      tags: 'APPROACH,STICKY RUBBER,SCRAMBLING',
      specs: JSON.stringify({
        "Outsole": "Stealth C4 Rubber",
        "Lacing": "To-the-Toe Precision",
        "Rand": "Full 360 Gum Rubber"
      }),
      materials: 'Waterproof suede upper, high-friction rubber climbing zone.',
      fieldNotes: 'Unbeatable friction on 5th class slab approaches in Table Mountain & Yosemite.'
    },
    {
      name: 'Glacier-Pro Mountaineering Boot',
      slug: 'glacier-pro-mountaineering-boot',
      category: 'Footwear',
      price: 7500.00,
      originalPrice: 8200.00,
      description: 'Insulated double boot engineered for 6,000m summits, cold ice climbing, and prolonged glacier exposure.',
      image: '/src/assets/images/glacier_pro_mountaineering_boot.jpg',
      weight: '980g (Single)',
      weatherproof: 'GORE-TEX Insulated Comfort',
      rating: 4.9,
      reviewCount: 45,
      stock: 8,
      tags: '6000M,EXPEDITION,CRAMPON-AUTOMATIC',
      specs: JSON.stringify({
        "Insulation": "Primaloft Gold 200g",
        "Crampon Fit": "Step-In Automatic",
        "Insole": "Carbon Fiber Honeycomb"
      }),
      materials: 'High-tenacity Cordura gaiter, Kevlar reinforcements, Vibram Teton sole.',
      fieldNotes: 'Kept toes warm at -25°C on Kilimanjaro and Himalayan alpine ridges.'
    },
    {
      name: 'Vapor-Grip Trail Sandal',
      slug: 'vapor-grip-trail-sandal',
      category: 'Footwear',
      price: 1250.00,
      originalPrice: 1450.00,
      description: 'Heavy-duty adjustable webbing trail sandal with aggressive lugged Vibram sole for river crossings and warm-weather trekking.',
      image: '/src/assets/images/vapor_grip_trail_sandal.jpg',
      weight: '240g (Single)',
      weatherproof: 'Hydrophobic Fast-Drying',
      rating: 4.5,
      reviewCount: 62,
      stock: 25,
      tags: 'WATER,RIVER,SANDAL',
      specs: JSON.stringify({
        "Straps": "Recycled REPREVE Polyester",
        "Footbed": "Antimicrobial Molded EVA",
        "Sole": "Vibram Megagrip Lugs"
      }),
      materials: 'Hydrophobic nylon webbing, dual-density EVA midsole, Vibram Megagrip.',
      fieldNotes: 'Dries in minutes after deep river crossings. Unshakeable grip on slippery wet rocks.'
    },
    {
      name: 'Alpine Thermal Camp Booties',
      slug: 'alpine-thermal-camp-booties',
      category: 'Footwear',
      price: 850.00,
      originalPrice: 980.00,
      description: 'Ultralight synthetic down booties with non-slip reinforced rubberized soles for tent and basecamp warmth.',
      image: '/src/assets/images/alpine_thermal_camp_booties.jpg',
      weight: '160g (Pair)',
      weatherproof: 'DWR Ripstop Shell',
      rating: 4.8,
      reviewCount: 91,
      stock: 30,
      tags: 'CAMP,BASECAMP,THERMAL',
      specs: JSON.stringify({
        "Fill": "Primaloft ThermoPlume Synthetic",
        "Sole": "Rugged PU Grip Grid",
        "Packability": "Stuff Sack Included"
      }),
      materials: '20D Pertex Quantum ripstop, synthetic down fill, reinforced PU bottom.',
      fieldNotes: 'Pure luxury after 10 hours in heavy boots. Weighs virtually nothing in the pack.'
    },

    // --- EQUIPMENT (6) ---
    {
      name: 'Titan 65L Expedition Pack',
      slug: 'titan-65l-expedition-pack',
      category: 'Equipment',
      price: 4950.00,
      originalPrice: 5500.00,
      description: 'Engineered for sustained multi-week alpine traverses. The Titan 65L uses a load-distributing titanium skeleton frame wrapped in weatherproof 500D Ripstop fabric.',
      image: '/src/assets/images/titan_65l_expedition_pack.jpg',
      weight: '1.45kg',
      weatherproof: 'IPX-6 Waterproof Shield',
      rating: 4.9,
      reviewCount: 89,
      stock: 8,
      tags: 'HEAVY LOAD,WATERPROOF',
      specs: JSON.stringify({
        "Capacity": "65L Main + 10L Expansion",
        "Frame": "Anodized Titanium Alloy",
        "Fabric": "500D Kevlar Ripstop",
        "Load Limit": "35kg / 77lbs"
      }),
      materials: 'Kevlar-mesh 500D nylon, welded waterproof seams, aircraft-grade aluminum fasteners.',
      fieldNotes: 'Used on Drakensberg Grand Traverse approach. Superior hip-belt articulation minimizes shoulder strain on steep pitches.'
    },
    {
      name: 'Carbon Fiber Trekking Poles',
      slug: 'carbon-fiber-trekking-poles',
      category: 'Equipment',
      price: 2400.00,
      originalPrice: 2800.00,
      description: '3-section quick-cam locking carbon fiber poles designed for high-altitude stabilization and severe joint impact reduction.',
      image: '/src/assets/images/carbon_fiber_trekking_poles.jpg',
      weight: '340g (Pair)',
      weatherproof: 'Corrosion-Proof Titanium Tips',
      rating: 4.6,
      reviewCount: 42,
      stock: 25,
      tags: 'CARBON FIBER,ULTRALIGHT',
      specs: JSON.stringify({
        "Length": "65cm - 135cm Adjustable",
        "Shaft": "3k Matte Carbon Fiber",
        "Grip": "Extended Ergonomic EVA",
        "Locking": "ForgeLock Aluminum Cams"
      }),
      materials: 'High-modulus carbon fiber, tungsten carbide tips, ergonomic high-density foam handles.',
      fieldNotes: 'Essential stability tool on high-angle moraine fields and icy ridgelines.'
    },
    {
      name: 'Ice-Lock Crampons',
      slug: 'ice-lock-crampons',
      category: 'Equipment',
      price: 3200.00,
      originalPrice: 3600.00,
      description: 'Aggressive 12-point chromoly steel mountaineering crampons for vertical ice walls and icy glacier travel.',
      image: '/src/assets/images/ice_lock_crampons.jpg',
      weight: '890g',
      weatherproof: 'Rust-Proof Polymer Coated',
      rating: 4.8,
      reviewCount: 64,
      stock: 15,
      tags: 'CLIMBING,CHROMOLY,ICE',
      specs: JSON.stringify({
        "Points": "12-Point Chromoly Steel",
        "Binding": "Universal Lever / Strap",
        "Anti-Balling": "Dual-Density TPU Plates Included"
      }),
      materials: 'Forged Chromoly steel alloy, flexible stainless wire bail.',
      fieldNotes: 'Bites flawlessly into hard blue water ice and windpacked neve slopes.'
    },
    {
      name: 'Vector Headlamp 1200L',
      slug: 'vector-headlamp-1200l',
      category: 'Equipment',
      price: 1450.00,
      originalPrice: 1650.00,
      description: '1200 lumen dual-beam rechargeable headlamp with red night-vision LED and IP68 waterproof rating for alpine pre-dawn starts.',
      image: '/src/assets/images/vector_headlamp_1200l.jpg',
      weight: '110g',
      weatherproof: 'IP68 Submersible 2m',
      rating: 4.8,
      reviewCount: 203,
      stock: 40,
      tags: 'LIGHTING,RECHARGEABLE,IP68',
      specs: JSON.stringify({
        "Max Lumens": "1200 Lumens",
        "Battery": "3000mAh USB-C Li-ion",
        "Beam Distance": "160m",
        "Runtime": "Up to 120 hrs (Low Mode)"
      }),
      materials: 'Anodized aluminum body, reflective moisture-wicking headband.',
      fieldNotes: 'Flawless performance during 3 AM alpine pushes in sub-zero temps.'
    },
    {
      name: 'ForgeLock Technical Ice Axe',
      slug: 'forgelock-technical-ice-axe',
      category: 'Equipment',
      price: 2600.00,
      originalPrice: 2950.00,
      description: 'Lightweight curved aluminum shaft ice axe with hot-forged chromoly pick for steep snow, ice couloirs, and self-arrest.',
      image: '/src/assets/images/forgelock_technical_ice_axe.jpg',
      weight: '430g',
      weatherproof: 'Anodized Anti-Corrosion',
      rating: 4.9,
      reviewCount: 38,
      stock: 12,
      tags: 'ICE CLIMBING,ALPINE,AXE',
      specs: JSON.stringify({
        "Shaft": "Type 2 T-Rated Aluminum",
        "Pick": "Hot-Forged Chromoly Steel",
        "Length": "50cm / 57cm / 65cm Options"
      }),
      materials: 'Aircraft-grade 7075 aluminum shaft, chromoly steel pick and adze.',
      fieldNotes: 'Solid placements in hard alpine neve. Ergonomic grip isolates cold hands.'
    },
    {
      name: 'Alpine First Aid & Survival Kit',
      slug: 'alpine-first-aid-survival-kit',
      category: 'Equipment',
      price: 1100.00,
      originalPrice: 1300.00,
      description: 'Comprehensive backcountry medical kit housed in an IPX-7 waterproof roll-top pouch with trauma shears, splints, and emergency bivvy blanket.',
      image: '/src/assets/images/alpine_first_aid_survival_kit.jpg',
      weight: '520g',
      weatherproof: 'IPX-7 Waterproof Pouch',
      rating: 4.9,
      reviewCount: 115,
      stock: 35,
      tags: 'MEDICAL,SAFETY,SURVIVAL',
      specs: JSON.stringify({
        "Capacity": "1-4 Person / 7-Day Trip",
        "Contents": "Trauma, Burn, Fracture, Wound Care",
        "Extras": "Mylar Bivvy, Signal Mirror, Whistle"
      }),
      materials: 'Welded TPU drybag, professional hospital-grade sterile supplies.',
      fieldNotes: 'An indispensable lifeline for remote wilderness expeditions.'
    },

    // --- APPAREL (6) ---
    {
      name: 'Merino Base Layer',
      slug: 'merino-base-layer',
      category: 'Apparel',
      price: 1450.00,
      originalPrice: 1750.00,
      description: 'Ultra-pure 200g 100% New Zealand Merino wool base layer shirt. Regulates core thermal output while offering natural odor-resistant properties.',
      image: '/src/assets/images/merino_base_layer.jpg',
      weight: '210g',
      weatherproof: 'Breathable Moisture Wicking',
      rating: 4.7,
      reviewCount: 256,
      stock: 35,
      tags: 'ODOR-RESISTANT,THERMAL',
      specs: JSON.stringify({
        "Material": "100% New Zealand Merino",
        "Weight Class": "200 gsm",
        "Seams": "Flatlock Anti-Chafe",
        "Fit": "Next-to-Skin Alpine"
      }),
      materials: '100% Traceable Merino Wool (18.5 micron superfine fiber).',
      fieldNotes: 'Tested in Sub-zero conditions across winter summits. Kept base climate dry even under heavy sweat output.'
    },
    {
      name: 'Summit Shell Alpha GORE-TEX',
      slug: 'summit-shell-alpha',
      category: 'Apparel',
      price: 8900.00,
      originalPrice: 9800.00,
      description: '3-Layer Hardshell engineered with GORE-TEX Pro membrane. Bombproof water resistance combined with unprecedented vapor breathability.',
      image: '/src/assets/images/summit_shell_alpha_goretex.jpg',
      weight: '410g',
      weatherproof: '28,000mm Hydrostatic Head',
      rating: 4.9,
      reviewCount: 118,
      stock: 10,
      tags: 'GORE-TEX PRO,WATERPROOF,HARDSHELL',
      specs: JSON.stringify({
        "Membrane": "GORE-TEX Pro 3-Layer",
        "Waterproof Rating": "28,000mm",
        "Zippers": "YKK AquaGuard Waterproof",
        "Hood": "Helmet-Compatible StormHood"
      }),
      materials: 'GORE-TEX Pro 80D nylon face, micro-grid backer, fully taped 8mm seams.',
      fieldNotes: 'Remained impenetrable through 48 hours of constant blizzard conditions during high summit push.'
    },
    {
      name: 'Ion-X Shell Jacket',
      slug: 'ion-x-shell-jacket',
      category: 'Apparel',
      price: 6900.00,
      originalPrice: 7500.00,
      description: 'Lightweight alpine wind-and-rain protection shell for rapid ascents when weight and packability are paramount.',
      image: '/src/assets/images/ion_x_shell_jacket.jpg',
      weight: '260g',
      weatherproof: '20,000mm StormProof',
      rating: 4.7,
      reviewCount: 77,
      stock: 18,
      tags: 'ULTRALIGHT,PACKABLE',
      specs: JSON.stringify({
        "Fit": "Athletic Alpine",
        "Pack Size": "Tennis Ball Volume",
        "Reflective": "3M Scotchlite Accents"
      }),
      materials: '30D Pertex Shield 2.5L stretch ripstop.',
      fieldNotes: 'Stows directly into its own chest pocket and clips cleanly to harness.'
    },
    {
      name: 'Alpine Merino Socks (Pair)',
      slug: 'alpine-merino-socks',
      category: 'Apparel',
      price: 450.00,
      originalPrice: 520.00,
      description: 'Heavyweight full-cushion Merino wool expedition socks with reinforced Kevlar heel and toe zones.',
      image: '/src/assets/images/alpine_merino_socks.jpg',
      weight: '90g',
      weatherproof: 'Moisture Wicking Thermal',
      rating: 4.9,
      reviewCount: 312,
      stock: 50,
      tags: 'SOCKS,MERINO,EXPEDITION',
      specs: JSON.stringify({
        "Content": "74% Merino Wool, 20% Nylon, 4% Kevlar, 2% Lycra",
        "Height": "Mid-Calf Crew",
        "Cushioning": "Full High-Density Pile"
      }),
      materials: 'Fine-gauge Merino wool blend.',
      fieldNotes: 'Zero blisters reported during 7-day high trek in Drakensberg.'
    },
    {
      name: 'Sub-Zero 800-Fill Down Parka',
      slug: 'sub-zero-800-fill-down-parka',
      category: 'Apparel',
      price: 6200.00,
      originalPrice: 6900.00,
      description: 'Box-baffled 800-fill goose down expedition parka designed for arctic conditions and high-altitude summit belays.',
      image: '/src/assets/images/sub_zero_800_fill_down_parka.jpg',
      weight: '680g',
      weatherproof: 'Water-Resistant DownTek',
      rating: 4.9,
      reviewCount: 84,
      stock: 12,
      tags: 'DOWN,EXPEDITION,SUBZERO',
      specs: JSON.stringify({
        "Down Power": "800+ Fill Goose Down (RDS Certified)",
        "Baffle Structure": "3D Box-Wall Construction",
        "Pockets": "Dual Insulated Handwarmer + Internal Mesh"
      }),
      materials: 'Pertex Quantum Pro 20D shell with DWR finish.',
      fieldNotes: 'Instant blast of heat when pulling into freezing wind-scoured belay stations.'
    },
    {
      name: 'Forge Stretch Alpine Pants',
      slug: 'forge-stretch-alpine-pants',
      category: 'Apparel',
      price: 2100.00,
      originalPrice: 2400.00,
      description: '4-way stretch double-weave softshell mountain trousers with Kevlar crampon kickpatches and articulated knees.',
      image: '/src/assets/images/forge_stretch_alpine_pants.jpg',
      weight: '440g',
      weatherproof: 'DWR Windproof 80mph',
      rating: 4.7,
      reviewCount: 96,
      stock: 22,
      tags: 'SOFTSHELL,PANTS,TECHNICAL',
      specs: JSON.stringify({
        "Fabric": "Schoeller Dryskin Softshell",
        "Waist": "Integrated Low-Profile Webbing Belt",
        "Reinforcement": "Kevlar Inner Ankle Guards"
      }),
      materials: '90% Nylon, 10% Elastane double weave, Kevlar kickpatches.',
      fieldNotes: 'Maximum mobility during steep step-ups and high-step rock moves.'
    },

    // --- CAMPING (6) ---
    {
      name: 'Titanium Cook Set 1100ml',
      slug: 'titanium-cook-set',
      category: 'Camping',
      price: 1950.00,
      originalPrice: 2200.00,
      description: 'Ultralight grade-1 titanium pot with lockable handle and frying pan lid. Nests 230g gas canister and micro stove inside.',
      image: '/src/assets/images/titanium_cook_set_1100ml.jpg',
      weight: '145g',
      weatherproof: 'Corrosion-Free Titanium',
      rating: 4.9,
      reviewCount: 94,
      stock: 22,
      tags: 'TITANIUM,ULTRALIGHT,CAMPING',
      specs: JSON.stringify({
        "Capacity": "1100ml Pot + 350ml Lid/Pan",
        "Material": "Grade 1 Uncoated Pure Titanium",
        "Graduations": "Stamped oz / ml Marks"
      }),
      materials: 'Grade 1 pure titanium, heat-resistant silicone wire sleeves.',
      fieldNotes: 'Boils 500ml water in 2m 15s using high-altitude canister stove.'
    },
    {
      name: 'Summit StormDome 2-Person Tent',
      slug: 'summit-stormdome-2p-tent',
      category: 'Camping',
      price: 5600.00,
      originalPrice: 6200.00,
      description: '4-season freestanding geodesic double-wall mountain shelter built to withstand gale-force winds and heavy snowfall loads.',
      image: '/src/assets/images/summit_stormdome_2_person_tent.jpg',
      weight: '2.15kg',
      weatherproof: '10,000mm Silicone Nylon Fly',
      rating: 4.8,
      reviewCount: 67,
      stock: 9,
      tags: '4-SEASON,TENT,EXPEDITION',
      specs: JSON.stringify({
        "Capacity": "2 Persons",
        "Poles": "DAC Featherlite NSL Aluminum",
        "Floor Area": "3.2 sq meters + Dual Vestibules"
      }),
      materials: '30D Ripstop Nylon with dual silicone coating, DAC aluminum frame.',
      fieldNotes: 'Stood rock solid in 70 knot wind gusts during ridge camp overnight.'
    },
    {
      name: 'Alpine-Zero Down Sleeping Bag -10°C',
      slug: 'alpine-zero-down-sleeping-bag',
      category: 'Camping',
      price: 4200.00,
      originalPrice: 4800.00,
      description: '800-fill Nikwax hydrophobic down mummy sleeping bag rating -10°C comfort with trapezoidal footbox and face draft collar.',
      image: '/src/assets/images/alpine_zero_down_sleeping_bag.jpg',
      weight: '950g',
      weatherproof: 'Hydrophobic Down & DWR Shell',
      rating: 4.9,
      reviewCount: 102,
      stock: 14,
      tags: 'SLEEPING BAG,DOWN,-10C',
      specs: JSON.stringify({
        "Temp Rating": "Comfort -10°C / Limit -16°C",
        "Fill": "800FP Hydrophobic Down",
        "Zipper": "Full-Length YKK Anti-Snag"
      }),
      materials: '10D Pertex Quantum nylon fabric, RDS certified goose down.',
      fieldNotes: 'Incredible loft recovery even after 5 days compressed in a dry sack.'
    },
    {
      name: 'Ultralight Micro Canister Stove',
      slug: 'ultralight-micro-canister-stove',
      category: 'Camping',
      price: 890.00,
      originalPrice: 1050.00,
      description: 'Micro titanium gas stove producing 10,000 BTU burner output with built-in micro-regulator for consistent cold-weather boiling.',
      image: '/src/assets/images/ultralight_micro_canister_stove.jpg',
      weight: '73g',
      weatherproof: 'Wind-Resistant Concave Burner',
      rating: 4.7,
      reviewCount: 158,
      stock: 35,
      tags: 'STOVE,COOKING,MICRO',
      specs: JSON.stringify({
        "Output": "10,200 BTU / 3,000 W",
        "Boil Time": "3 min 10 sec per 1L",
        "Fuel": "Isobutane-Propane Canister"
      }),
      materials: 'Titanium burner head, brass valve stem, stainless support arms.',
      fieldNotes: 'Folds down to the size of a golf ball. Regulator holds strong flame in cold.'
    },
    {
      name: 'Thermal-Grid Inflatable Sleeping Pad',
      slug: 'thermal-grid-inflatable-sleeping-pad',
      category: 'Camping',
      price: 1850.00,
      originalPrice: 2100.00,
      description: 'R-value 4.5 4-season insulated sleeping pad utilizing reflective ThermaCapture barrier matrix for zero ground cold transfer.',
      image: '/src/assets/images/thermal_grid_inflatable_sleeping_pad.jpg',
      weight: '430g',
      weatherproof: 'Airtight TPU Laminate',
      rating: 4.8,
      reviewCount: 88,
      stock: 20,
      tags: 'SLEEPING PAD,INSULATED,R-4.5',
      specs: JSON.stringify({
        "R-Value": "4.5 Thermal Resistance",
        "Thickness": "7.5 cm / 3.0 in",
        "Valve": "WingLock Fast Inflation"
      }),
      materials: '30D Ripstop Polyester with metallic thermal foil layers.',
      fieldNotes: 'Luxurious 3-inch cushion prevents hip points from contacting cold rocks or ice.'
    },
    {
      name: 'SolarPulse 20W Foldable Charger',
      slug: 'solarpulse-20w-foldable-charger',
      category: 'Camping',
      price: 1650.00,
      originalPrice: 1900.00,
      description: '20 Watt SunPower solar array built into weather-resistant canvas case with dual smart USB output ports for powerbanks.',
      image: '/src/assets/images/solarpulse_20w_foldable_charger.jpg',
      weight: '490g',
      weatherproof: 'IP65 Weatherproof Canvas',
      rating: 4.6,
      reviewCount: 54,
      stock: 18,
      tags: 'SOLAR,POWER,ELECTRONICS',
      specs: JSON.stringify({
        "Output": "20W Dual USB 5V / 2.4A",
        "Cell Type": "SunPower Monocrystalline (24% Efficiency)",
        "Attachment": "Corner Carabiner Loops"
      }),
      materials: 'ETFE laminated solar panels, heavy-duty 600D polyester backing.',
      fieldNotes: 'Kept GPS and headlamps charged continuously during 2-week wilderness trip.'
    },

    // --- HIKING (6) ---
    {
      name: 'Alpine Trekker 30L Pack',
      slug: 'alpine-trekker-30l-pack',
      category: 'Hiking',
      price: 2250.00,
      originalPrice: 2500.00,
      description: 'Versatile 30L daypack featuring air-mesh suspension backpanel, trekking pole attachments, and integrated rain cover.',
      image: '/src/assets/images/alpine_trekker_30l_pack.jpg',
      weight: '880g',
      weatherproof: 'Raincover Included (IPX-5)',
      rating: 4.8,
      reviewCount: 135,
      stock: 24,
      tags: 'DAYPACK,HIKING,VENTILATED',
      specs: JSON.stringify({
        "Volume": "30 Liters",
        "Suspension": "AirFlow Trampoline Mesh",
        "Hydration": "Compatible up to 3L"
      }),
      materials: "210D Honeycomb Ripstop Nylon, YKK zippers.",
      fieldNotes: 'Perfect capacity for day hikes in Table Mountain and Drakensberg valleys.'
    },
    {
      name: 'Ridge Runner GPS Handheld Navigator',
      slug: 'ridge-runner-gps-navigator',
      category: 'Hiking',
      price: 4800.00,
      originalPrice: 5300.00,
      description: 'Multi-GNSS satellite handheld navigator with preloaded 24K Topo maps, 3-inch sunlight-readable display, and SOS satellite messaging.',
      image: '/src/assets/images/ridge_runner_gps_handheld_navigator.jpg',
      weight: '230g',
      weatherproof: 'IPX7 Waterproof & Shockproof',
      rating: 4.9,
      reviewCount: 48,
      stock: 10,
      tags: 'GPS,NAVIGATION,SATELLITE',
      specs: JSON.stringify({
        "Screen": "3.0 Color Transflective TFT",
        "Battery": "35 Hours GPS Mode / 200 Hours Expedition",
        "Satellites": "GPS, GLONASS, GALILEO"
      }),
      materials: 'Impact-resistant polycarbonate chassis, rubber armor grip.',
      fieldNotes: 'Acquired instant satellite lock in deep slots and forested gorges.'
    },
    {
      name: 'TrailBlazer Ultralight Hammock System',
      slug: 'trailblazer-ultralight-hammock',
      category: 'Hiking',
      price: 1150.00,
      originalPrice: 1350.00,
      description: 'Complete wilderness hammock shelter with integrated micro-mesh bug net, tree-friendly webbing straps, and sil-nylon tarp.',
      image: '/src/assets/images/trailblazer_ultralight_hammock_system.jpg',
      weight: '620g (Full Kit)',
      weatherproof: 'Sil-Nylon Tarp 3000mm',
      rating: 4.7,
      reviewCount: 72,
      stock: 19,
      tags: 'HAMMOCK,ULTRALIGHT,SHELTER',
      specs: JSON.stringify({
        "Capacity": "200kg / 440lbs Limit",
        "Dimensions": "290cm x 140cm",
        "Straps": "12-Loop Tree Saver Webbing"
      }),
      materials: '70D High-tenacity breathable nylon, wiregate aluminum carabiners.',
      fieldNotes: 'Set up in under 3 minutes. Zero bug bites sleeping near mountain streams.'
    },
    {
      name: 'Summit Compass & Altimeter Watch',
      slug: 'summit-compass-altimeter-watch',
      category: 'Hiking',
      price: 3100.00,
      originalPrice: 3500.00,
      description: 'Outdoor tactical watch with real-time barometric altimeter, digital 3-axis compass, storm alarm, and sapphire crystal glass.',
      image: '/src/assets/images/summit_compass_altimeter_watch.jpg',
      weight: '68g',
      weatherproof: '100m Water Resistant',
      rating: 4.8,
      reviewCount: 94,
      stock: 16,
      tags: 'WATCH,ALTIMETER,COMPASS',
      specs: JSON.stringify({
        "Sensors": "Altimeter, Barometer, Compass, Thermometer",
        "Glass": "Scratch-Proof Sapphire",
        "Bezel": "Grade 5 Titanium"
      }),
      materials: 'Titanium bezel, silicone band, sapphire crystal lens.',
      fieldNotes: 'Storm alert warned us 30 minutes before a sudden severe cold front hit.'
    },
    {
      name: 'High-Altitude Hydration Bladder 3L',
      slug: 'high-altitude-hydration-bladder-3l',
      category: 'Hiking',
      price: 650.00,
      originalPrice: 750.00,
      description: 'Taste-free 3 Liter hydration reservoir with insulated hose sleeve, high-flow bite valve, and quick-disconnect hose mechanism.',
      image: '/src/assets/images/high_altitude_hydration_bladder_3l.jpg',
      weight: '170g',
      weatherproof: 'Freeze-Proof Insulated Hose',
      rating: 4.6,
      reviewCount: 120,
      stock: 45,
      tags: 'HYDRATION,RESERVOIR,3L',
      specs: JSON.stringify({
        "Volume": "3.0 Liters / 100 fl oz",
        "BPA Free": "100% TPU Construction",
        "Opening": "Slide-Seal Wide Mouth"
      }),
      materials: 'Taste-free TPU film, neoprene hose cover.',
      fieldNotes: 'Insulated hose prevented freezing during sub-zero sunrise summit pushes.'
    },
    {
      name: 'Summit Forge Topo Trail Map Set',
      slug: 'summit-forge-topo-trail-map-set',
      category: 'Hiking',
      price: 420.00,
      originalPrice: 500.00,
      description: 'Waterproof, tear-proof 1:24,000 scale topographic maps detailing major mountain passes, water sources, and emergency points.',
      image: '/src/assets/images/summit_forge_topo_trail_map_set.jpg',
      weight: '80g',
      weatherproof: '100% Synthetic Waterproof Paper',
      rating: 4.9,
      reviewCount: 56,
      stock: 60,
      tags: 'MAPS,TOPO,NAVIGATION',
      specs: JSON.stringify({
        "Scale": "1:24,000 Contour Intervals",
        "Material": "Hop-Syn Synthetic Paper",
        "Coverage": "Drakensberg & Table Mountain Ranges"
      }),
      materials: 'Indestructible synthetic waterproof paper.',
      fieldNotes: 'Remained fully legible even after soaking in river water.'
    },

    // --- RUNNING (6) ---
    {
      name: 'VaporLite Distance Running Vest',
      slug: 'vaporlite-distance-running-vest',
      category: 'Running',
      price: 1950.00,
      originalPrice: 2200.00,
      description: 'Ultra-lightweight ergonomic trail running vest with dual 500ml HydraPak soft flasks, pole carry loops, and phone zip pocket.',
      image: '/src/assets/images/vaporlite_distance_running_vest.jpg',
      weight: '180g (Without Flasks)',
      weatherproof: 'Moisture-Wicking Air Mesh',
      rating: 4.8,
      reviewCount: 112,
      stock: 22,
      tags: 'RUNNING,VEST,HYDRATION',
      specs: JSON.stringify({
        "Capacity": "8L Total Gear Capacity",
        "Flasks Included": "2x 500ml Soft Flasks",
        "Adjustment": "Twin Sternum Bungee Straps"
      }),
      materials: '3D Stretch air mesh, ripstop nylon stretch pockets.',
      fieldNotes: 'Zero chest bounce during high-speed downhill trail descent.'
    },
    {
      name: 'Aeroflex Carbon Trail Running Shoes',
      slug: 'aeroflex-carbon-trail-running-shoes',
      category: 'Running',
      price: 3850.00,
      originalPrice: 4200.00,
      description: 'Competition trail running shoe with full-length carbon fiber propulsive plate and Vibram Megagrip traction lug design.',
      image: '/src/assets/images/aeroflex_carbon_trail_running_shoes.jpg',
      weight: '235g (Single)',
      weatherproof: 'Fast-Draining Mesh Upper',
      rating: 4.9,
      reviewCount: 88,
      stock: 14,
      tags: 'CARBON,TRAIL RUNNING,COMPETITION',
      specs: JSON.stringify({
        "Plate": "3D Spoon-Shaped Carbon Fiber",
        "Midsole": "Pebax SuperFoam",
        "Outsole": "Vibram Megagrip Litebase"
      }),
      materials: 'Engineered jacquard mesh upper, carbon composite plate, Pebax midsole.',
      fieldNotes: 'Incredible speed boost on flat trail sections and technical ascents.'
    },
    {
      name: 'HyperGlide Hydration Belt',
      slug: 'hyperglide-hydration-belt',
      category: 'Running',
      price: 780.00,
      originalPrice: 900.00,
      description: 'Bounce-free running waist belt angled to hold a 400ml flask with extra room for phone, energy gels, and keys.',
      image: '/src/assets/images/hyperglide_hydration_belt.jpg',
      weight: '95g',
      weatherproof: 'Sweat-Proof Internal Pocket',
      rating: 4.6,
      reviewCount: 95,
      stock: 30,
      tags: 'BELT,RUNNING,HYDRATION',
      specs: JSON.stringify({
        "Flask Included": "400ml Ergonomic Curve Bottle",
        "Fit": "Adjustable Velcro Tension Band",
        "Phone Size": "Fits Up To 6.8 inch Screen"
      }),
      materials: 'Neoprene band, breathable stretch mesh.',
      fieldNotes: 'Fits snug around hips without riding up during marathons.'
    },
    {
      name: 'Reflect-X Night Runner Headband',
      slug: 'reflect-x-night-runner-headband',
      category: 'Running',
      price: 350.00,
      originalPrice: 420.00,
      description: 'High-visibility moisture-wicking athletic headband equipped with 360-degree reflective thread weave and micro LED safety light.',
      image: '/src/assets/images/reflect_x_night_runner_headband.jpg',
      weight: '35g',
      weatherproof: 'Sweat-Resistant LED Unit',
      rating: 4.7,
      reviewCount: 140,
      stock: 50,
      tags: 'HEADBAND,SAFETY,REFLECTIVE',
      specs: JSON.stringify({
        "Reflective": "3M Scotchlite 360 Grid",
        "LED Battery": "Rechargeable Micro USB (10 hr runtime)",
        "Fabric": "ThermaFit Stretch Jersey"
      }),
      materials: 'Polyester elastane blend, 3M reflective threads.',
      fieldNotes: 'Essential piece for early morning or dusk road and trail training.'
    },
    {
      name: 'Pro-Pace Compression Calf Sleeves',
      slug: 'pro-pace-compression-calf-sleeves',
      category: 'Running',
      price: 480.00,
      originalPrice: 550.00,
      description: 'Medical-grade 20-30 mmHg gradient compression calf sleeves to reduce muscle oscillation and accelerate post-run recovery.',
      image: '/src/assets/images/pro_pace_compression_calf_sleeves.jpg',
      weight: '45g (Pair)',
      weatherproof: 'Quick-Dry Breathable Knit',
      rating: 4.8,
      reviewCount: 165,
      stock: 40,
      tags: 'COMPRESSION,CALF,RECOVERY',
      specs: JSON.stringify({
        "Compression Rating": "20-30 mmHg Gradient",
        "Weave": "Seamless Circular Micro-Knit",
        "UV Protection": "UPF 50+"
      }),
      materials: '80% Polyamide, 20% Elastane compression weave.',
      fieldNotes: 'Significantly reduces delayed onset muscle soreness on long trail runs.'
    },
    {
      name: 'VaporDash Trail Shorts 5-Inch',
      slug: 'vapordash-trail-shorts-5in',
      category: 'Running',
      price: 920.00,
      originalPrice: 1050.00,
      description: 'Lightweight 4-way stretch trail shorts with integrated anti-chafe boxer liner and 360-degree waistband gel pockets.',
      image: '/src/assets/images/vapordash_trail_shorts_5_inch.jpg',
      weight: '125g',
      weatherproof: 'Fast-Draining Hydrophobic Finish',
      rating: 4.8,
      reviewCount: 82,
      stock: 28,
      tags: 'SHORTS,RUNNING,TRAIL',
      specs: JSON.stringify({
        "Inseam": "5 Inches (13 cm)",
        "Liner": "Seamless Mesh Support Boxer",
        "Pockets": "Pass-Through Pole Loop + Zip Key Pocket"
      }),
      materials: '86% Recycled Polyester, 14% Spandex stretch weave.',
      fieldNotes: 'Zero chafing during 50km ultra race in warm weather.'
    }
  ];

  const createdProducts = [];
  for (const p of products) {
    const prod = await prisma.product.create({ data: p });
    createdProducts.push(prod);
  }

  console.log('Seeding orders for Alex Honnold...');
  const order1 = await prisma.order.create({
    data: {
      orderNumber: '#SF-90124',
      userId: alexHonnold.id,
      status: 'DELIVERED',
      statusLabel: 'VERIFIED MISSION',
      subtotal: 22750.00,
      shippingCost: 0.00,
      taxAmount: 0.00,
      totalAmount: 22750.00,
      shippingMethod: 'Summit Priority',
      shippingAddress: alexHonnold.shippingAddress,
      createdAt: new Date('2024-10-12'),
      items: {
        create: [
          {
            productId: createdProducts.find(p => p.slug === 'summit-shell-alpha').id,
            quantity: 2,
            price: 8900.00,
            variant: 'Deep Forest / Large'
          },
          {
            productId: createdProducts.find(p => p.slug === 'titan-65l-expedition-pack').id,
            quantity: 1,
            price: 4950.00,
            variant: 'Slate Gray / 65L'
          }
        ]
      }
    }
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: '#SF-88441',
      userId: alexHonnold.id,
      status: 'RETURNED',
      statusLabel: 'VERIFIED MISSION',
      subtotal: 5650.00,
      shippingCost: 0.00,
      taxAmount: 0.00,
      totalAmount: 5650.00,
      shippingMethod: 'Standard Ground',
      shippingAddress: alexHonnold.shippingAddress,
      createdAt: new Date('2024-09-05'),
      items: {
        create: [
          {
            productId: createdProducts.find(p => p.slug === 'summit-trek-v2-boots').id,
            quantity: 1,
            price: 4200.00,
            variant: 'Size 11 / Earth Brown'
          },
          {
            productId: createdProducts.find(p => p.slug === 'vector-headlamp-1200l').id,
            quantity: 1,
            price: 1450.00,
            variant: 'Tactical Black'
          }
        ]
      }
    }
  });

  const order3 = await prisma.order.create({
    data: {
      orderNumber: '#SF-99281-EC',
      userId: alexHonnold.id,
      status: 'IN_TRANSIT',
      statusLabel: 'ACTIVE DEPLOYMENT',
      subtotal: 4950.00,
      shippingCost: 0.00,
      taxAmount: 0.00,
      totalAmount: 4950.00,
      shippingMethod: 'Summit Priority',
      shippingAddress: alexHonnold.shippingAddress,
      createdAt: new Date(),
      items: {
        create: [
          {
            productId: createdProducts.find(p => p.slug === 'titan-65l-expedition-pack').id,
            quantity: 1,
            price: 4950.00,
            variant: 'Summit Pro 65L Pack / Slate'
          }
        ]
      }
    }
  });

  const order4 = await prisma.order.create({
    data: {
      orderNumber: '#SF-99150-EC',
      userId: alexHonnold.id,
      status: 'OUT_FOR_DELIVERY',
      statusLabel: 'ACTIVE DEPLOYMENT',
      subtotal: 2400.00,
      shippingCost: 0.00,
      taxAmount: 0.00,
      totalAmount: 2400.00,
      shippingMethod: 'Expedited Air',
      shippingAddress: alexHonnold.shippingAddress,
      createdAt: new Date(),
      items: {
        create: [
          {
            productId: createdProducts.find(p => p.slug === 'carbon-fiber-trekking-poles').id,
            quantity: 1,
            price: 2400.00,
            variant: 'Apex Carbon Poles / Matte'
          }
        ]
      }
    }
  });

  console.log('Seeding reviews...');
  await prisma.review.create({
    data: {
      productId: createdProducts[0].id,
      userId: alexHonnold.id,
      rating: 5,
      title: 'Flawless Grip on Wet Slabs',
      comment: 'The Vibram Megagrip lug arrangement provides insane friction even on wet granite polished by glacial melt. Sheds mud effortlessly.'
    }
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
