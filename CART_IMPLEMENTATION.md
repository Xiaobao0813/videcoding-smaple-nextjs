# 購物車功能實作說明

## 功能概述

已成功實作完整的購物車功能,包含以下特點:

### 1. 購物車頁面 (`/cart`)

- ✅ 顯示所有購物車商品列表
- ✅ 商品名稱、數量和價格顯示
- ✅ 每個商品的數量調整按鈕 (+/-)
- ✅ 即時計算小計和總價
- ✅ 顯示預估準備時間 (15-20 分鐘)
- ✅ 返回按鈕可回到首頁
- ✅ Checkout 結帳按鈕

### 2. 購物車狀態管理

使用 React Context API 實作全域購物車狀態:

**檔案位置**: `/lib/cart-context.tsx`

**提供的功能**:

- `items` - 購物車商品列表
- `addItem()` - 新增商品到購物車
- `removeItem()` - 移除商品
- `updateQuantity()` - 更新商品數量
- `clearCart()` - 清空購物車
- `totalItems` - 總商品數量
- `totalPrice` - 購物車總金額

### 3. 首頁整合

- ✅ 購物車圖示顯示商品數量徽章
- ✅ 點擊購物車圖示跳轉到購物車頁面
- ✅ 商品數量調整會同步到購物車

## 頁面結構

```
app/
├── page.tsx          # 首頁 - 商品列表
├── cart/
│   └── page.tsx      # 購物車頁面
└── layout.tsx        # 全域 Layout (包含 CartProvider)

lib/
└── cart-context.tsx  # 購物車 Context
```

## 使用方式

### 在任何元件中使用購物車

```tsx
import { useCart } from "@/lib/cart-context";

function MyComponent() {
  const { items, updateQuantity, totalItems, totalPrice } = useCart();

  // 使用購物車資料和功能...
}
```

## 設計特色

### 視覺設計

- 遵循 Figma 設計規範
- 使用橘色 (#ed9c2a) 作為主色調
- 米色背景 (#f8f3ec) 作為次要色
- 響應式設計,適配手機尺寸

### 互動設計

- 按鈕有 hover 效果
- 數量調整有平滑動畫
- 自動過濾數量為 0 的商品

## 預設購物車內容

系統預設包含以下商品:

1. Soy Milk (豆漿) - $2.00 x 2
2. Egg Crepe (蛋餅) - $3.50 x 1
3. Radish Cake (蘿蔔糕) - $3.00 x 1
4. Fried Dough Stick (油條) - $2.00 x 1

總計: $12.50

## 後續可擴展功能

- [ ] 結帳流程
- [ ] 訂單歷史記錄
- [ ] 購物車持久化 (LocalStorage)
- [ ] 商品搜尋和篩選
- [ ] 優惠券和折扣碼
- [ ] 付款整合
