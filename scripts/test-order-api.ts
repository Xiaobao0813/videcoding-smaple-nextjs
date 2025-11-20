/**
 * 訂單 API 測試腳本
 *
 * 使用方式：
 * 1. 確保開發伺服器正在運行 (npm run dev)
 * 2. 執行此腳本：node --loader ts-node/esm scripts/test-order-api.ts
 *
 * 或在瀏覽器的開發者工具中執行相關的 fetch 請求
 */

const API_BASE_URL = "http://localhost:3000";

// 測試資料
const testOrderData = {
  items: [
    {
      productId: "1",
      productName: "Soy Milk",
      quantity: 2,
      price: 2.0,
    },
    {
      productId: "2",
      productName: "Egg Crepe",
      quantity: 1,
      price: 3.5,
    },
  ],
  paymentMethod: "MASTERCARD" as const,
};

async function testCreateOrder() {
  console.log("🧪 測試建立訂單...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testOrderData),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ 建立訂單成功！");
      console.log("訂單 ID:", data.order.id);
      console.log("訂單編號:", data.order.orderNumber);
      console.log("總金額:", data.order.total);
      console.log("訂單狀態:", data.order.status);
      return data.order.id;
    } else {
      console.error("❌ 建立訂單失敗:", data.error);
      return null;
    }
  } catch (error) {
    console.error("❌ 請求失敗:", error);
    return null;
  }
}

async function testGetOrder(orderId: string) {
  console.log("\n🧪 測試查詢訂單...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`);
    const data = await response.json();

    if (response.ok) {
      console.log("✅ 查詢訂單成功！");
      console.log("訂單編號:", data.order.orderNumber);
      console.log("項目數量:", data.order.items.length);
      return true;
    } else {
      console.error("❌ 查詢訂單失敗:", data.error);
      return false;
    }
  } catch (error) {
    console.error("❌ 請求失敗:", error);
    return false;
  }
}

async function testUpdateOrderStatus(orderId: string) {
  console.log("\n🧪 測試更新訂單狀態...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "CONFIRMED",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ 更新訂單狀態成功！");
      console.log("新狀態:", data.order.status);
      return true;
    } else {
      console.error("❌ 更新訂單狀態失敗:", data.error);
      return false;
    }
  } catch (error) {
    console.error("❌ 請求失敗:", error);
    return false;
  }
}

async function testGetAllOrders() {
  console.log("\n🧪 測試查詢所有訂單...");

  try {
    const response = await fetch(`${API_BASE_URL}/api/orders`);
    const data = await response.json();

    if (response.ok) {
      console.log("✅ 查詢所有訂單成功！");
      console.log("訂單總數:", data.orders.length);
      return true;
    } else {
      console.error("❌ 查詢所有訂單失敗:", data.error);
      return false;
    }
  } catch (error) {
    console.error("❌ 請求失敗:", error);
    return false;
  }
}

// 主測試流程
async function runTests() {
  console.log("🚀 開始測試訂單 API...\n");
  console.log("⚠️  請確保：");
  console.log("   1. 開發伺服器正在運行 (npm run dev)");
  console.log("   2. 資料庫已正確設置並執行 migration");
  console.log("   3. 資料庫中有測試用的產品資料\n");

  // 測試建立訂單
  const orderId = await testCreateOrder();

  if (!orderId) {
    console.log("\n❌ 測試失敗：無法建立訂單");
    return;
  }

  // 等待一秒
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 測試查詢訂單
  await testGetOrder(orderId);

  // 等待一秒
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 測試更新訂單狀態
  await testUpdateOrderStatus(orderId);

  // 等待一秒
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 測試查詢所有訂單
  await testGetAllOrders();

  console.log("\n✨ 測試完成！");
}

// 如果是直接執行此檔案，則運行測試
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export {
  testCreateOrder,
  testGetAllOrders,
  testGetOrder,
  testUpdateOrderStatus,
};
