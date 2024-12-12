import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashed_password', // In production, use proper password hashing
      role: 'admin',
    },
  });

  // Create some test posts
  await prisma.post.createMany({
    data: [
      {
        title: 'First Post',
        slug: 'first-post',
        content: 'This is the first post content',
        excerpt: 'First post excerpt',
        coverImage: 'https://example.com/image1.jpg',
        category: 'Development',
        status: 'published',
        authorId: user.id,
        views: 100,
      },
      {
        title: 'Second Post',
        slug: 'second-post',
        content: 'This is the second post content',
        excerpt: 'Second post excerpt',
        coverImage: 'https://example.com/image2.jpg',
        category: 'Design',
        status: 'published',
        authorId: user.id,
        views: 150,
      },
    ],
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 