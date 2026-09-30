import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const sampleMenuItems = [
  {
    id: 101,
    name: "Margherita Pizza",
    description: "Classic pizza with tomato reduction, fresh buffalo mozzarella, and aromatic basil baked in stone hearth.",
    category: "Pizza",
    price: 299,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80",
    available: true,
    isVeg: true,
    rating: 4.9,
    prepTime: "15-20 min",
    badge: "Chef's Special",
  },
  {
    id: 102,
    name: "Tuscan Garlic Pasta",
    description: "Bronze-cut artisanal pasta tossed in slow-simmered marinara, roasted garlic, basil, and parmesan.",
    category: "Pasta",
    price: 279,
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80",
    available: true,
    isVeg: true,
    rating: 5.0,
    prepTime: "15-18 min",
    badge: "Bestseller",
  },
  {
    id: 103,
    name: "Crispy Golden French Fries",
    description: "Hand-cut Idaho potatoes fried crisp, seasoned with rosemary sea salt and served with house garlic aioli.",
    category: "Sides",
    price: 149,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80",
    available: true,
    isVeg: true,
    rating: 4.8,
    prepTime: "8-10 min",
    badge: "Popular",
  },
  {
    id: 104,
    name: "Grilled Chicken Shawarma",
    description: "Marinated spiced chicken, garlic toum cream, pickled turnips, and crisp greens rolled in warm Lebanese pita.",
    category: "Burgers",
    price: 269,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    available: true,
    isVeg: false,
    rating: 4.9,
    prepTime: "12-15 min",
    badge: "Customer Favorite",
  },
  {
    id: 105,
    name: "Truffle Wild Mushroom Pizza",
    description: "Roasted shiitake and portobello mushrooms, black truffle glaze, creamy fontina cheese, and thyme.",
    category: "Pizza",
    price: 389,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    available: true,
    isVeg: true,
    rating: 4.8,
    prepTime: "18-22 min",
  },
  {
    id: 106,
    name: "Spicy Pepperoni & Hot Honey",
    description: "Artisan cured pepperoni, rich crushed tomato marinara, mozzarella, and warm chili honey drizzle.",
    category: "Pizza",
    price: 369,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
    available: true,
    isVeg: false,
    rating: 4.9,
    prepTime: "15-20 min",
  },
  {
    id: 107,
    name: "Signature Smoked Smash Burger",
    description: "Dual prime smash patties, aged cheddar, caramelized shallots, crisp butter lettuce on toasted brioche.",
    category: "Burgers",
    price: 249,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
    available: true,
    isVeg: false,
    rating: 4.9,
    prepTime: "12-15 min",
    badge: "Must Try",
  },
  {
    id: 108,
    name: "Creamy Chicken Alfredo Penne",
    description: "Pan-seared herb chicken breast tossed in velvet parmesan cream sauce, cracked black pepper, and parsley.",
    category: "Pasta",
    price: 319,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80",
    available: true,
    isVeg: false,
    rating: 4.8,
    prepTime: "15-20 min",
  },
  {
    id: 109,
    name: "Artisanal Espresso Tiramisu",
    description: "Italian savoiardi steeped in freshly brewed dark espresso, layered with whipped mascarpone cream and cocoa.",
    category: "Desserts",
    price: 189,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80",
    available: true,
    isVeg: true,
    rating: 4.9,
    prepTime: "Ready to serve",
    badge: "House Specialty",
  },
  {
    id: 110,
    name: "Warm Molten Chocolate Cake",
    description: "Decadent dark chocolate molten sponge with a gooey liquid center, served with vanilla bean ice cream.",
    category: "Desserts",
    price: 199,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    available: true,
    isVeg: true,
    rating: 4.9,
    prepTime: "10 min",
  },
  {
    id: 111,
    name: "Iced Blood Orange Botanical Fizz",
    description: "Freshly squeezed Sicilian blood orange, cold-pressed mint syrup, topped with sparkling water and rosemary.",
    category: "Beverages",
    price: 129,
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    available: true,
    isVeg: true,
    rating: 4.7,
    prepTime: "5 min",
  },
  {
    id: 112,
    name: "Cold Brew Vietnamese Coffee",
    description: "18-hour cold brew Arabica paired with silky sweetened condensed milk over crystal ice.",
    category: "Beverages",
    price: 139,
    image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80",
    available: true,
    isVeg: true,
    rating: 4.8,
    prepTime: "5 min",
  },
];

const sampleReviews = [
  {
    id: "REV-1",
    name: "Savannah Nguyen",
    role: "Verified Foodie",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "This place is great! Atmosphere is chill and cool but the staff is also really friendly. They know what they're doing and what they're talking about, and you can tell making the customers happy is their main priority.",
  },
  {
    id: "REV-2",
    name: "Esther Howard",
    role: "Gourmet Critic",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "The wood-fired crust and smash burgers are simply sublime. Delivery arrived in under 25 minutes, steaming hot in insulated boxes. Best gourmet food delivery experience by far!",
  },
  {
    id: "REV-3",
    name: "Marvin McKinney",
    role: "Regular Customer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment:
      "Incredible flavors across every dish. From the creamy Alfredo pasta to the espresso tiramisu, everything tastes like it was made fresh 5 minutes ago by master chefs.",
  },
];

const sampleReservations = [
  {
    id: "RES-201",
    customerName: "Aarav Patel",
    mobile: "9876543210",
    email: "aarav.p@example.com",
    guests: 4,
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    timeSlot: "07:30 PM",
    seatingArea: "Outdoor Terrace",
    specialRequests: "Window corner table for anniversary dinner.",
    status: "Confirmed",
  },
  {
    id: "RES-202",
    customerName: "Priya Sharma",
    mobile: "9822334455",
    email: "priya.s@example.com",
    guests: 2,
    date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    timeSlot: "08:00 PM",
    seatingArea: "Chef's Counter",
    specialRequests: "Chef tasting menu experience.",
    status: "Confirmed",
  },
];

async function main() {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("❌ DATABASE_URL or DIRECT_URL is required to seed the database.");
    process.exit(1);
  }

  console.log("🌱 Starting database seed into Supabase...");
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    // 1. Seed Menu Items
    console.log("Seeding menu items...");
    for (const item of sampleMenuItems) {
      await prisma.menuItem.upsert({
        where: { id: item.id },
        update: {
          name: item.name,
          description: item.description,
          category: item.category,
          price: item.price,
          image: item.image,
          available: item.available ?? true,
          isVeg: item.isVeg ?? true,
          rating: item.rating ?? 5.0,
          prepTime: item.prepTime ?? "15 min",
          badge: item.badge ?? null,
        },
        create: {
          id: item.id,
          name: item.name,
          description: item.description,
          category: item.category,
          price: item.price,
          image: item.image,
          available: item.available ?? true,
          isVeg: item.isVeg ?? true,
          rating: item.rating ?? 5.0,
          prepTime: item.prepTime ?? "15 min",
          badge: item.badge ?? null,
        },
      });
    }
    console.log(`✅ Seeded ${sampleMenuItems.length} menu items.`);

    // 2. Seed Reviews
    console.log("Seeding reviews...");
    for (const rev of sampleReviews) {
      await prisma.customerReview.upsert({
        where: { id: rev.id },
        update: {
          name: rev.name,
          role: rev.role,
          rating: rev.rating,
          comment: rev.comment,
          avatar: rev.avatar,
        },
        create: {
          id: rev.id,
          name: rev.name,
          role: rev.role,
          rating: rev.rating,
          comment: rev.comment,
          avatar: rev.avatar,
        },
      });
    }
    console.log(`✅ Seeded ${sampleReviews.length} reviews.`);

    // 3. Seed Reservations
    console.log("Seeding sample reservations...");
    for (const res of sampleReservations) {
      await prisma.reservation.upsert({
        where: { id: res.id },
        update: {
          customerName: res.customerName,
          mobile: res.mobile,
          email: res.email,
          guests: res.guests,
          date: res.date,
          timeSlot: res.timeSlot,
          seatingArea: res.seatingArea,
          specialRequests: res.specialRequests,
          status: res.status,
        },
        create: {
          id: res.id,
          customerName: res.customerName,
          mobile: res.mobile,
          email: res.email,
          guests: res.guests,
          date: res.date,
          timeSlot: res.timeSlot,
          seatingArea: res.seatingArea,
          specialRequests: res.specialRequests,
          status: res.status,
        },
      });
    }
    console.log(`✅ Seeded ${sampleReservations.length} reservations.`);

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
