import { type NextRequest, NextResponse } from "next/server"
import { ShopifyService } from "@/lib/shopify-service"

export async function POST(request: NextRequest) {
  try {
    const { orderNumber, shopDomain } = await request.json()

    if (!orderNumber || !shopDomain) {
      return NextResponse.json({ error: "Order number and shop domain are required" }, { status: 400 })
    }

    // Handle demo environment - return mock data instead of calling Shopify
    if (shopDomain === "demo-store.myshopify.com" || shopDomain === "demo-store") {
      const mockOrder = {
        id: "12345",
        order_number: orderNumber,
        email: "customer@example.com",
        created_at: "2024-01-15T10:30:00Z",
        total_price: "89.97",
        currency: "USD",
        financial_status: "paid",
        fulfillment_status: "fulfilled",
        line_items: [
          {
            id: "item_1",
            product_id: "prod_123",
            variant_id: "var_123_m_blue",
            title: "Premium Cotton T-Shirt",
            variant_title: "Medium / Blue",
            quantity: 1,
            price: "29.99",
            sku: "TSHIRT-M-BLUE",
            fulfillment_status: "fulfilled",
          },
          {
            id: "item_2",
            product_id: "prod_456",
            variant_id: "var_456_32_dark",
            title: "Denim Jeans",
            variant_title: "32 / Dark Wash",
            quantity: 1,
            price: "59.99",
            sku: "JEANS-32-DARK",
            fulfillment_status: "fulfilled",
          },
        ],
        shipping_address: {
          first_name: "John",
          last_name: "Doe",
          address1: "123 Main St",
          city: "New York",
          province: "NY",
          zip: "10001",
          country: "United States",
        },
        billing_address: {
          first_name: "John",
          last_name: "Doe",
          address1: "123 Main St",
          city: "New York",
          province: "NY",
          zip: "10001",
          country: "United States",
        },
      }

      return NextResponse.json({ order: mockOrder })
    }

    // For non-demo environments, use actual Shopify API
    const shopifyService = new ShopifyService(shopDomain)
    const order = await shopifyService.findOrderByNumber(orderNumber)

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Failed to find order:", error)
    return NextResponse.json({ error: "Failed to find order" }, { status: 500 })
  }
}
