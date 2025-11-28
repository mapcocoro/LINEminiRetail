import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.reservationItem.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.purchaseHistory.deleteMany()
  await prisma.pointHistory.deleteMany()
  await prisma.userCoupon.deleteMany()
  await prisma.user.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.businessDay.deleteMany()
  await prisma.regularHoliday.deleteMany()

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: '食パン', slug: 'shokupan', displayOrder: 1 },
    }),
    prisma.category.create({
      data: { name: '菓子パン', slug: 'kashipan', displayOrder: 2 },
    }),
    prisma.category.create({
      data: { name: '惣菜パン', slug: 'souzaipan', displayOrder: 3 },
    }),
    prisma.category.create({
      data: { name: 'ハード系', slug: 'hard', displayOrder: 4 },
    }),
    prisma.category.create({
      data: { name: 'サンドイッチ', slug: 'sandwich', displayOrder: 5 },
    }),
  ])

  console.log('Categories created:', categories.length)

  // Create products
  const products = [
    // 食パン
    {
      name: '極上生食パン',
      description: '北海道産小麦と生クリームを贅沢に使用した、耳まで柔らかい食パン。トーストせずそのままでお召し上がりください。',
      price: 800,
      imageUrl: '/images/products/shokupan.svg',
      categoryId: categories[0].id,
      stock: 10,
      isNew: false,
      isPopular: true,
      allergens: '小麦, 乳, 卵',
    },
    {
      name: '全粒粉食パン',
      description: '食物繊維たっぷりの全粒粉を使用。香ばしい風味と栄養価が魅力です。',
      price: 450,
      imageUrl: '/images/products/zenshokupan.svg',
      categoryId: categories[0].id,
      stock: 8,
      isNew: false,
      isPopular: false,
      allergens: '小麦',
    },
    {
      name: 'レーズン食パン',
      description: 'カリフォルニア産レーズンをたっぷり練り込んだ贅沢な食パン。',
      price: 550,
      imageUrl: '/images/products/raisinbread.svg',
      categoryId: categories[0].id,
      stock: 6,
      isNew: true,
      isPopular: false,
      allergens: '小麦, 乳',
    },

    // 菓子パン
    {
      name: 'クリームパン',
      description: '自家製カスタードクリームをたっぷり詰め込んだ定番人気商品。',
      price: 200,
      imageUrl: '/images/products/creampan.svg',
      categoryId: categories[1].id,
      stock: 15,
      isNew: false,
      isPopular: true,
      allergens: '小麦, 乳, 卵',
    },
    {
      name: 'メロンパン',
      description: 'サクサクのクッキー生地とふわふわのパン生地のハーモニー。',
      price: 180,
      imageUrl: '/images/products/melonpan.svg',
      categoryId: categories[1].id,
      stock: 12,
      isNew: false,
      isPopular: true,
      allergens: '小麦, 乳, 卵',
    },
    {
      name: 'あんパン',
      description: '北海道産小豆を使用した自家製あんこ。甘さ控えめで上品な味わい。',
      price: 180,
      imageUrl: '/images/products/anpan.svg',
      categoryId: categories[1].id,
      stock: 10,
      isNew: false,
      isPopular: false,
      allergens: '小麦',
    },
    {
      name: 'チョコクロワッサン',
      description: 'ベルギー産チョコレートを贅沢に使用したサクサクのクロワッサン。',
      price: 280,
      imageUrl: '/images/products/chococro.svg',
      categoryId: categories[1].id,
      stock: 8,
      isNew: true,
      isPopular: true,
      allergens: '小麦, 乳, 卵, 大豆',
    },
    {
      name: 'シナモンロール',
      description: 'スパイシーなシナモンとたっぷりのアイシング。コーヒーとの相性抜群。',
      price: 320,
      imageUrl: '/images/products/cinnamonroll.svg',
      categoryId: categories[1].id,
      stock: 5,
      isNew: true,
      isPopular: false,
      allergens: '小麦, 乳, 卵',
    },

    // 惣菜パン
    {
      name: 'カレーパン',
      description: '特製スパイシーカレーを包み、サクッと揚げた当店自慢の一品。',
      price: 250,
      imageUrl: '/images/products/currypan.svg',
      categoryId: categories[2].id,
      stock: 12,
      isNew: false,
      isPopular: true,
      allergens: '小麦, 乳, 卵',
    },
    {
      name: '焼きそばパン',
      description: 'もちもちのパンと特製ソース焼きそばの黄金コンビ。',
      price: 230,
      imageUrl: '/images/products/yakisobapan.svg',
      categoryId: categories[2].id,
      stock: 8,
      isNew: false,
      isPopular: false,
      allergens: '小麦, 卵',
    },
    {
      name: 'ピザパン',
      description: 'トマトソース、チーズ、ベーコンをたっぷりトッピング。',
      price: 280,
      imageUrl: '/images/products/pizzapan.svg',
      categoryId: categories[2].id,
      stock: 6,
      isNew: false,
      isPopular: false,
      allergens: '小麦, 乳',
    },
    {
      name: '明太フランス',
      description: '博多明太子とバターの絶妙なコンビネーション。',
      price: 350,
      imageUrl: '/images/products/mentaifrance.svg',
      categoryId: categories[2].id,
      stock: 4,
      isNew: true,
      isPopular: true,
      allergens: '小麦, 乳, 卵',
    },

    // ハード系
    {
      name: 'バゲット',
      description: 'パリッとした皮ともっちりとした中身。フランスパンの王道。',
      price: 300,
      imageUrl: '/images/products/baguette.svg',
      categoryId: categories[3].id,
      stock: 8,
      isNew: false,
      isPopular: false,
      allergens: '小麦',
    },
    {
      name: 'カンパーニュ',
      description: '天然酵母を使用した素朴な田舎パン。スライスしてそのままでも、サンドイッチにも。',
      price: 450,
      imageUrl: '/images/products/campagne.svg',
      categoryId: categories[3].id,
      stock: 5,
      isNew: false,
      isPopular: false,
      allergens: '小麦',
    },
    {
      name: 'くるみパン',
      description: 'ローストしたくるみをたっぷり練り込んだ香ばしいハードパン。',
      price: 380,
      imageUrl: '/images/products/walnutbread.svg',
      categoryId: categories[3].id,
      stock: 6,
      isNew: false,
      isPopular: true,
      allergens: '小麦, くるみ',
    },

    // サンドイッチ
    {
      name: 'BLTサンド',
      description: 'カリカリベーコン、シャキシャキレタス、完熟トマトの定番サンド。',
      price: 450,
      imageUrl: '/images/products/bltsand.svg',
      categoryId: categories[4].id,
      stock: 6,
      isNew: false,
      isPopular: true,
      allergens: '小麦, 卵',
    },
    {
      name: 'たまごサンド',
      description: '自家製マヨネーズとふわふわ卵の優しい味わい。',
      price: 380,
      imageUrl: '/images/products/eggsand.svg',
      categoryId: categories[4].id,
      stock: 8,
      isNew: false,
      isPopular: true,
      allergens: '小麦, 卵',
    },
    {
      name: 'ハムチーズサンド',
      description: 'ロースハムととろけるチーズのシンプルなサンドイッチ。',
      price: 400,
      imageUrl: '/images/products/hamcheese.svg',
      categoryId: categories[4].id,
      stock: 5,
      isNew: false,
      isPopular: false,
      allergens: '小麦, 乳',
    },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }

  console.log('Products created:', products.length)

  // Create coupons
  const now = new Date()
  const oneMonthLater = new Date(now)
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)

  const coupons = [
    {
      code: 'RAINY10',
      name: '雨の日クーポン 10%OFF',
      description: '雨の日にご来店いただいたお客様限定のクーポンです。',
      discountType: 'percentage',
      discountValue: 10,
      validFrom: now,
      validUntil: oneMonthLater,
      conditions: 'rain',
    },
    {
      code: 'WELCOME100',
      name: '初回来店クーポン ¥100OFF',
      description: 'LINE友だち追加ありがとうございます！初回のお買い物にご利用ください。',
      discountType: 'fixed',
      discountValue: 100,
      minPurchase: 500,
      validFrom: now,
      validUntil: oneMonthLater,
      conditions: 'first_visit',
    },
    {
      code: 'BREAD15',
      name: '食パン15%OFF',
      description: '食パン全品が15%OFF！朝食にぴったりの食パンをお得にお求めください。',
      discountType: 'percentage',
      discountValue: 15,
      validFrom: now,
      validUntil: oneMonthLater,
      conditions: null,
    },
  ]

  for (const coupon of coupons) {
    await prisma.coupon.create({ data: coupon })
  }

  console.log('Coupons created:', coupons.length)

  // Create regular holiday (Monday)
  await prisma.regularHoliday.create({
    data: { dayOfWeek: 1 }, // Monday
  })

  console.log('Regular holidays set')

  // Create demo user
  const demoUser = await prisma.user.create({
    data: {
      lineUserId: 'demo-user',
      displayName: 'デモユーザー',
      totalPoints: 150,
    },
  })

  console.log('Demo user created')

  // Assign welcome coupon to demo user
  const welcomeCoupon = await prisma.coupon.findFirst({
    where: { conditions: 'first_visit' },
  })

  if (welcomeCoupon) {
    await prisma.userCoupon.create({
      data: {
        userId: demoUser.id,
        couponId: welcomeCoupon.id,
      },
    })
  }

  // Add some point history
  await prisma.pointHistory.create({
    data: {
      userId: demoUser.id,
      points: 100,
      type: 'earned',
      description: '初回登録ボーナス',
    },
  })

  await prisma.pointHistory.create({
    data: {
      userId: demoUser.id,
      points: 50,
      type: 'earned',
      description: 'お買い物ポイント',
    },
  })

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
