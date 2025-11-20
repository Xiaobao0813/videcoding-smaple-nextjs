# Most Popular Category Integration with Database

## Changes Made

### 1. Database Schema Update (`prisma/schema.prisma`)
Added `isPopular` field to the Product model:
```prisma
model Product {
  // ... other fields
  isPopular   Boolean         @default(false) // For "Most popular" category
}
```

### 2. Seed Data Update (`prisma/seed.ts`)
Marked popular items with `isPopular: true`:
- Soy Milk (豆漿)
- Egg Crepe (蛋餅)
- Fried Dough Stick (油條)
- Black Tea (紅茶)

### 3. New API Route (`app/api/products/route.ts`)
Created a new API endpoint to fetch products by category:
- `GET /api/products?category=popular` - Returns popular products
- `GET /api/products?category=drinks` - Returns drinks
- `GET /api/products?category=breakfast` - Returns breakfast items (MAIN + SIDE)
- `GET /api/products?category=dinner` - Returns dinner items (MAIN + SIDE)

### 4. Client Component Update (`app/home-client.tsx`)
- Added state management for products and loading state
- Added `useEffect` to fetch products when category changes
- Integrated API calls with category selection
- Added loading and empty state handling

## How It Works

1. User clicks on a category button (Most popular, Dinner, Breakfast, Drinks)
2. `setActiveCategory` updates the active category state
3. `useEffect` detects the category change and calls the API
4. API filters products based on the category:
   - **Popular**: Products with `isPopular: true`
   - **Drinks**: Products with `category: "DRINK"`
   - **Breakfast/Dinner**: Products with `category: "MAIN" or "SIDE"`
5. Filtered products are displayed to the user

## Next Steps

To complete the setup, run these commands:

```bash
# 1. Generate Prisma Client (to update TypeScript types)
npm run prisma:generate

# 2. Push schema changes to database
npm run prisma:push

# 3. Seed the database with updated data
npm run db:seed
```

## Testing

After running the commands above, test the feature by:
1. Starting the dev server: `npm run dev`
2. Opening the app in your browser
3. Clicking through different category tabs
4. Verifying that products filter correctly

## Notes

- The category filtering is now server-side, ensuring consistency with database state
- Products are fetched dynamically when categories change
- The loading state provides better UX during data fetching
- All category logic is now integrated with the database schema
