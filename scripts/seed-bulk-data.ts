import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting bulk data insertion...');

  const bcrypt = await import('bcryptjs');

  // Create 50 users (customers)
  const users = [];
  for (let i = 1; i <= 50; i++) {
    const hashedPassword = await bcrypt.hash('password123', 12);
    users.push({
      email: `customer${i}@example.com`,
      name: `Customer ${i}`,
      password: hashedPassword,
      role: 'CUSTOMER',
    });
  }

  // Insert users in batches
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('👥 Created 50 users');

  // Get existing categories
  const categories = await prisma.category.findMany();
  if (categories.length === 0) {
    throw new Error('No categories found. Please run the main seed script first.');
  }

  // Enhanced product templates with better categorization
  const productTemplates = {
    electronics: [
      { 
        name: 'Wireless Headphones', 
        desc: 'High-quality wireless headphones with noise cancellation and long battery life',
        images: [
          'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
      },
      { 
        name: 'Smart Watch', 
        desc: 'Advanced smartwatch with health monitoring and GPS tracking',
        images: [
          'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1841841/pexels-photo-1841841.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
      },
      { 
        name: 'Bluetooth Speaker', 
        desc: 'Portable Bluetooth speaker with rich sound and waterproof design',
        images: [
          'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
      },
      { 
        name: 'Wireless Charger', 
        desc: 'Fast wireless charging pad for smartphones and devices',
        images: [
          'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
      },
      { 
        name: 'Power Bank', 
        desc: 'High-capacity portable power bank with fast charging',
        images: [
          'https://images.pexels.com/photos/1037995/pexels-photo-1037995.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1038916/pexels-photo-1038916.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
      },
      { 
        name: 'Phone Case', 
        desc: 'Protective phone case with wireless charging support',
        images: [
          'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
      }
    ],
    home: [
      { 
        name: 'Coffee Maker', 
        desc: 'Professional-grade coffee maker for the perfect brew every time',
        images: [
          'https://images.pexels.com/photos/4226769/pexels-photo-4226769.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
      },
      { 
        name: 'Office Chair', 
        desc: 'Ergonomic office chair with lumbar support and adjustable height',
        images: [
          'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
      },
      { 
        name: 'Desk Lamp', 
        desc: 'LED desk lamp with adjustable brightness and modern design',
        images: [
          'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1571452/pexels-photo-1571452.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
      },
      { 
        name: 'Laptop Stand', 
        desc: 'Ergonomic laptop stand for better posture and cooling',
        images: [
          'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1571457/pexels-photo-1571457.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
      },
      { 
        name: 'Coffee Mug', 
        desc: 'Premium ceramic coffee mug with heat retention',
        images: [
          'https://images.pexels.com/photos/1080711/pexels-photo-1080711.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
      }
    ],
    fashion: [
      { 
        name: 'Sunglasses', 
        desc: 'UV protection sunglasses with polarized lenses and stylish design',
        images: [
          'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
      },
      { 
        name: 'Backpack', 
        desc: 'Durable backpack for travel and daily use with multiple compartments',
        images: [
          'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
      },
      { 
        name: 'Water Bottle', 
        desc: 'Insulated water bottle that keeps drinks cold or hot for hours',
        images: [
          'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1895943/pexels-photo-1895943.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
      }
    ],
    sports: [
      { 
        name: 'Fitness Tracker', 
        desc: 'Activity tracker with heart rate monitoring and sleep tracking',
        images: [
          'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
      }
    ],
    books: [
      { 
        name: 'Notebook', 
        desc: 'Premium notebook for writing, sketching, and note-taking',
        images: [
          'https://images.pexels.com/photos/1370298/pexels-photo-1370298.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
      },
      { 
        name: 'Pen Set', 
        desc: 'Professional pen set for business and personal use',
        images: [
          'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400',
          'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400'
        ]
      }
    ]
  };

  // Office/Tech accessories that could fit in electronics or home
  const techAccessories = [
    { 
      name: 'Keyboard', 
      desc: 'Mechanical keyboard for gaming and professional typing',
      images: [
        'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    { 
      name: 'Mouse Pad', 
      desc: 'Large gaming mouse pad with smooth surface and anti-slip base',
      images: [
        'https://images.pexels.com/photos/1037995/pexels-photo-1037995.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1038916/pexels-photo-1038916.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    { 
      name: 'Cable Organizer', 
      desc: 'Keep your cables neat and organized with this cable management solution',
      images: [
        'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    { 
      name: 'Phone Holder', 
      desc: 'Adjustable phone holder for desk or car use',
      images: [
        'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    { 
      name: 'Tablet Stand', 
      desc: 'Adjustable tablet stand for hands-free viewing and video calls',
      images: [
        'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1571457/pexels-photo-1571457.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    }
  ];

  const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Gray', 'Silver', 'Gold'];
  const brands = ['TechPro', 'SmartLife', 'ProGear', 'EliteMax', 'UltraFit', 'PremiumPlus'];

  // Create a mapping of category slugs to their templates
  const categoryTemplateMap: { [key: string]: any[] } = {};
  
  categories.forEach(category => {
    switch (category.slug) {
      case 'electronics':
        categoryTemplateMap[category.slug] = [...productTemplates.electronics, ...techAccessories];
        break;
      case 'home':
        categoryTemplateMap[category.slug] = [...productTemplates.home, ...techAccessories];
        break;
      case 'fashion':
        categoryTemplateMap[category.slug] = productTemplates.fashion;
        break;
      case 'sports':
        categoryTemplateMap[category.slug] = [...productTemplates.sports, ...productTemplates.fashion];
        break;
      case 'books':
        categoryTemplateMap[category.slug] = productTemplates.books;
        break;
      default:
        categoryTemplateMap[category.slug] = [...productTemplates.electronics, ...techAccessories];
    }
  });

  // Get existing products to avoid SKU conflicts
  const existingProducts = await prisma.product.findMany({
    select: { sku: true, slug: true }
  });
  const existingSKUs = new Set(existingProducts.map(p => p.sku));
  const existingSlugs = new Set(existingProducts.map(p => p.slug));

  // Generate unique SKU
  const generateUniqueSKU = (brand: string, index: number): string => {
    let sku = `${brand.substring(0, 3).toUpperCase()}-${String(index).padStart(4, '0')}`;
    let counter = 1;
    while (existingSKUs.has(sku)) {
      sku = `${brand.substring(0, 3).toUpperCase()}-${String(index + counter * 1000).padStart(4, '0')}`;
      counter++;
    }
    existingSKUs.add(sku);
    return sku;
  };

  // Generate unique slug
  const generateUniqueSlug = (brand: string, templateName: string, color: string, index: number): string => {
    let slug = `${brand.toLowerCase()}-${templateName.toLowerCase().replace(/\s+/g, '-')}-${color.toLowerCase()}-${index}`;
    let counter = 1;
    while (existingSlugs.has(slug)) {
      slug = `${brand.toLowerCase()}-${templateName.toLowerCase().replace(/\s+/g, '-')}-${color.toLowerCase()}-${index}-${counter}`;
      counter++;
    }
    existingSlugs.add(slug);
    return slug;
  };

  // Create 200 products with proper images and unique SKUs
  const products = [];
  for (let i = 1; i <= 200; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const availableTemplates = categoryTemplateMap[category.slug] || productTemplates.electronics;
    const template = availableTemplates[i % availableTemplates.length];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    
    const basePrice = Math.floor(Math.random() * 500) + 20; // $20 - $520
    const hasDiscount = Math.random() > 0.7; // 30% chance of discount
    const comparePrice = hasDiscount ? basePrice + Math.floor(Math.random() * 100) + 20 : null;
    
    const uniqueSKU = generateUniqueSKU(brand, i);
    const uniqueSlug = generateUniqueSlug(brand, template.name, color, i);
    
    const product = {
      name: `${brand} ${template.name} - ${color}`,
      slug: uniqueSlug,
      description: `${template.desc}. Premium quality from ${brand} in ${color} color. Perfect for daily use with excellent durability and performance.`,
      price: basePrice,
      comparePrice,
      sku: uniqueSKU,
      stock: Math.floor(Math.random() * 100) + 1, // 1-100 stock
      images: template.images, // Use the specific images for this product type
      categoryId: category.id,
      featured: Math.random() > 0.9, // 10% chance of being featured
      status: 'ACTIVE',
    };
    
    products.push(product);
  }

  // Insert products in batches with better error handling
  let createdCount = 0;
  for (const product of products) {
    try {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {
          name: product.name,
          description: product.description,
          price: product.price,
          comparePrice: product.comparePrice,
          stock: product.stock,
          images: product.images,
          featured: product.featured,
        },
        create: product,
      });
      createdCount++;
      
      // Log progress every 50 products
      if (createdCount % 50 === 0) {
        console.log(`🛍️ Created/updated ${createdCount}/${products.length} products...`);
      }
    } catch (error) {
      console.warn(`⚠️ Skipped product ${product.name} due to conflict`);
      continue;
    }
  }

  console.log(`🛍️ Created/updated ${createdCount} products with proper images`);

  // Create some orders for the users
  const allUsers = await prisma.user.findMany({ where: { role: 'CUSTOMER' } });
  const allProducts = await prisma.product.findMany();

  // Only create orders if we have users and products
  if (allUsers.length > 0 && allProducts.length > 0) {
    for (let i = 1; i <= 100; i++) {
      const user = allUsers[Math.floor(Math.random() * allUsers.length)];
      const orderProducts = [];
      const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
      
      for (let j = 0; j < numItems; j++) {
        const product = allProducts[Math.floor(Math.random() * allProducts.length)];
        const quantity = Math.floor(Math.random() * 3) + 1;
        orderProducts.push({
          productId: product.id,
          quantity,
          price: product.price,
        });
      }

      const subtotal = orderProducts.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
      const tax = subtotal * 0.08;
      const shipping = subtotal > 50 ? 0 : 9.99;
      const total = subtotal + tax + shipping;

      const statuses = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      try {
        await prisma.order.create({
          data: {
            orderNumber: `ORD-${Date.now()}-${String(i).padStart(4, '0')}`,
            userId: user.id,
            status,
            subtotal,
            tax,
            shipping,
            total,
            shippingAddress: {
              firstName: user.name?.split(' ')[0] || 'John',
              lastName: user.name?.split(' ')[1] || 'Doe',
              address1: `${Math.floor(Math.random() * 9999)} Main St`,
              city: 'Sample City',
              state: 'CA',
              postalCode: '90210',
              country: 'US',
            },
            billingAddress: {
              firstName: user.name?.split(' ')[0] || 'John',
              lastName: user.name?.split(' ')[1] || 'Doe',
              address1: `${Math.floor(Math.random() * 9999)} Main St`,
              city: 'Sample City',
              state: 'CA',
              postalCode: '90210',
              country: 'US',
            },
            paymentMethod: 'credit_card',
            orderItems: {
              create: orderProducts,
            },
          },
        });
      } catch (error) {
        console.warn(`⚠️ Skipped order ${i} due to conflict`);
        continue;
      }
    }

    console.log('📦 Created orders');
  }

  // Add some reviews
  if (allUsers.length > 0 && allProducts.length > 0) {
    for (let i = 1; i <= 150; i++) {
      const user = allUsers[Math.floor(Math.random() * allUsers.length)];
      const product = allProducts[Math.floor(Math.random() * allProducts.length)];
      const rating = Math.floor(Math.random() * 5) + 1;
      
      const comments = [
        'Great product! Highly recommended.',
        'Good quality for the price.',
        'Fast shipping and excellent packaging.',
        'Exactly as described. Very satisfied.',
        'Would buy again!',
        'Perfect for my needs.',
        'Excellent customer service.',
        'Good value for money.',
      ];

      try {
        await prisma.review.create({
          data: {
            userId: user.id,
            productId: product.id,
            rating,
            comment: comments[Math.floor(Math.random() * comments.length)],
            verified: Math.random() > 0.3, // 70% verified
          },
        });
      } catch (error) {
        // Skip if review already exists for this user-product combination
        continue;
      }
    }

    console.log('⭐ Created reviews');
  }

  console.log('✅ Bulk data insertion completed!');
}

main()
  .catch((e) => {
    console.error('❌ Bulk seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });