const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const Pet     = require('./models/Pet');
const User    = require('./models/User');
const Product = require('./models/Product');
const bcrypt  = require('bcryptjs');
dotenv.config();

const pets = [
    { name: "Max", breed: "Golden Retriever", age: "2 Years", desc: "Energetic and loves kids", imageUrl: "golden retriever.jpg", type: "dog" },
    { name: "Luna", breed: "Persian Cat", age: "1 Year", desc: "Calm lap cat", imageUrl: "persian cat.jpg", type: "cat" },
    { name: "Thumper", breed: "Holland Lop", age: "6 Months", desc: "Loves fresh greens", imageUrl: "holland lop.jpg", type: "rabbit" },
    { name: "Buddy", breed: "Beagle", age: "3 Years", desc: "Loyal friendly hound", imageUrl: "beagle.jpg", type: "dog" },
    { name: "Oliver", breed: "Tabby Cat", age: "2 Years", desc: "Curious and playful", imageUrl: "tabby cat.jpg", type: "cat" },
    { name: "Sky", breed: "Parakeet", age: "1 Year", desc: "Enjoys singing", imageUrl: "parakeet.jpg", type: "bird" },
    { name: "Daisy", breed: "Poodle", age: "4 Years", desc: "Smart and well-trained", imageUrl: "poodle.jpg", type: "dog" },
    { name: "Mittens", breed: "Siamese", age: "3 Years", desc: "Very affectionate", imageUrl: "siamese.jpg", type: "cat" }
];

const products = [
    { name: 'Premium Dog Kibble',   description: 'High-protein dry food for adult dogs, vet-approved formula.',           price: 24.99,  stock: 50,  category: 'dog', image: 'dogkibble.jpg' },
    { name: 'Luxury Cat Tree',      description: 'Multi-level climbing frame with sisal scratching posts and cosy beds.', price: 120.00, stock: 15,  category: 'cat', image: 'cattree.jpg' },
    { name: 'Squeaky Bone Toy',     description: 'Durable rubber chew toy that keeps dogs entertained for hours.',        price: 8.50,   stock: 100, category: 'dog', image: 'squeakytoy.jpg' },
    { name: 'Cat Nip & Toy Bundle', description: 'Organic catnip pouch plus feather wand — keeps cats playful all day.', price: 12.99,  stock: 60,  category: 'cat', image: 'catnipandtoybundle.jpg' }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        await Pet.deleteMany();
        await Pet.insertMany(pets);
        await User.deleteMany();
        const hash = await bcrypt.hash('admin123', 8);
        await User.create({
            name: 'Site Admin',
            email: 'admin@paws.com',
            phone: '01000000000',
            address: 'Paws HQ, Cairo',
            password: hash,
            type: 'admin'
        });
        console.log('Admin seeded: admin@paws.com / admin123');
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log('✅ Database seeded!');
        process.exit();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
seed();