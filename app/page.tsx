import DrinkCard from "./components/drink-card";

// Mock products for development without database
const mockDrinks = [
  {
    id: "1",
    name: "豆漿",
    description: "濃郁豆漿，常溫或冰的",
    price: 2.50,
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e3d0a92d?w=300&h=300&fit=crop",
    category: "DRINK",
  },
  {
    id: "2",
    name: "珍珠奶茶",
    description: "滑順珍珠奶茶，香濃奶茶風味",
    price: 5.50,
    image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd5ccf1?w=300&h=300&fit=crop",
    category: "DRINK",
  },
  {
    id: "3",
    name: "檸檬茶",
    description: "清爽檸檬茶，帶有酸甜滋味",
    price: 3.50,
    image: "https://images.unsplash.com/photo-1600788532523-f96ca67dce0a?w=300&h=300&fit=crop",
    category: "DRINK",
  },
  {
    id: "4",
    name: "冰咖啡",
    description: "濃郁冰咖啡，深焙風味",
    price: 4.00,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop",
    category: "DRINK",
  },
  {
    id: "5",
    name: "鮮奶茶",
    description: "濃郁鮮奶茶，香醇順滑",
    price: 4.50,
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=300&fit=crop",
    category: "DRINK",
  },
  {
    id: "6",
    name: "果汁",
    description: "新鮮果汁，天然健康飲品",
    price: 3.00,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=300&fit=crop",
    category: "DRINK",
  },
  {
    id: "7",
    name: "烏龍茶",
    description: "傳統烏龍茶，回甘甘甜",
    price: 2.80,
    image: "https://images.unsplash.com/photo-1597318086657-6c73e72e72e0?w=300&h=300&fit=crop",
    category: "DRINK",
  },
  {
    id: "8",
    name: "熱巧克力",
    description: "濃滑熱巧克力，冬季必選",
    price: 4.50,
    image: "https://images.unsplash.com/photo-1578777346479-0e41b221bb19?w=300&h=300&fit=crop",
    category: "DRINK",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                飲料點單系統
              </h1>
              <p className="text-gray-600 mt-1">
                享受新鮮飲料，即刻開始點餐
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="text-3xl">🥤</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            精選飲料
          </h2>

          {/* Drinks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockDrinks.map((drink) => (
              <DrinkCard
                key={drink.id}
                id={drink.id}
                name={drink.name}
                description={drink.description}
                price={drink.price}
                image={drink.image}
              />
            ))}
          </div>
        </section>

        {/* Info Section */}
        <section className="mt-16 bg-orange-50 rounded-lg p-8 border border-orange-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            為什麼選擇我們？
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">✨</div>
              <h3 className="text-lg font-semibold text-gray-900">新鮮品質</h3>
              <p className="text-gray-600 text-sm mt-2">
                每杯飲料都採用新鮮食材製作，品質有保證
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900">快速配送</h3>
              <p className="text-gray-600 text-sm mt-2">
                訂單快速製作，及時送達您的手中
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💰</div>
              <h3 className="text-lg font-semibold text-gray-900">合理價格</h3>
              <p className="text-gray-600 text-sm mt-2">
                高品質低價格，讓您享受最好的飲料
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 飲料點單系統. 所有權利保留。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
