import db from "../drizzle.js";
import { userTable, orderTable, paymentTable } from "../schema.js";
import { eq, count, sum, avg, min, max, gt } from "drizzle-orm";

// 1. Create a new order
export const createOrderService = async (orderData) => {
  const result = await db.insert(orderTable).values(orderData).returning();
  return result[0];
};

// 2. Create a new payment record
export const createPaymentService = async (paymentData) => {
  const result = await db.insert(paymentTable).values(paymentData).returning();
  return result[0];
};

// 3. Retrieve all raw orders
export const getAllOrdersService = async () => {
  return await db.select().from(orderTable);
};

// 4. Retrieve all raw payments
export const getAllPaymentsService = async () => {
  return await db.select().from(paymentTable);
};

// 5. INNER JOIN Demonstration:
// Returns orders along with customer details (only where matching user exists)
export const getOrdersInnerJoinService = async () => {
  return await db
    .select({
      orderId: orderTable.id,
      productName: orderTable.product_name,
      quantity: orderTable.quantity,
      price: orderTable.price,
      status: orderTable.status,
      orderDate: orderTable.created_at,
      customerId: userTable.id,
      customerName: userTable.name,
      customerEmail: userTable.email,
    })
    .from(orderTable)
    .innerJoin(userTable, eq(orderTable.user_id, userTable.id));
};

// 6. LEFT JOIN Demonstration:
// Returns ALL users, including those who have NOT placed any orders
export const getUsersLeftJoinOrdersService = async () => {
  return await db
    .select({
      userId: userTable.id,
      userName: userTable.name,
      userEmail: userTable.email,
      orderId: orderTable.id,
      productName: orderTable.product_name,
      price: orderTable.price,
      orderStatus: orderTable.status,
    })
    .from(userTable)
    .leftJoin(orderTable, eq(userTable.id, orderTable.user_id));
};

// 7. JOIN with WHERE Filtering Demonstration:
// Returns joined order & customer data filtered by specific status (e.g. "completed")
export const getOrdersWithWhereService = async (status = "completed") => {
  return await db
    .select({
      orderId: orderTable.id,
      productName: orderTable.product_name,
      price: orderTable.price,
      status: orderTable.status,
      customerName: userTable.name,
      customerEmail: userTable.email,
    })
    .from(orderTable)
    .innerJoin(userTable, eq(orderTable.user_id, userTable.id))
    .where(eq(orderTable.status, status));
};

// 8. Aggregate Functions Demonstration (COUNT, SUM, AVG, MIN, MAX):
// Computes summary statistics over all orders
export const getOrderAggregatesService = async () => {
  const result = await db
    .select({
      totalOrders: count(orderTable.id),
      totalRevenue: sum(orderTable.price),
      averagePrice: avg(orderTable.price),
      minPrice: min(orderTable.price),
      maxPrice: max(orderTable.price),
    })
    .from(orderTable);

  const row = result[0] || {};
  return {
    totalOrders: Number(row.totalOrders || 0),
    totalRevenue: row.totalRevenue !== null ? Number(row.totalRevenue) : 0,
    averagePrice: row.averagePrice !== null ? Number(Number(row.averagePrice).toFixed(2)) : 0,
    minPrice: row.minPrice !== null ? Number(row.minPrice) : 0,
    maxPrice: row.maxPrice !== null ? Number(row.maxPrice) : 0,
  };
};

// 9. GROUP BY Demonstration:
// Groups orders by user and calculates count and total spend per customer
export const getOrdersGroupByUserService = async () => {
  return await db
    .select({
      userId: userTable.id,
      userName: userTable.name,
      userEmail: userTable.email,
      orderCount: count(orderTable.id),
      totalSpent: sum(orderTable.price),
    })
    .from(userTable)
    .innerJoin(orderTable, eq(userTable.id, orderTable.user_id))
    .groupBy(userTable.id, userTable.name, userTable.email);
};

// 10. HAVING Demonstration:
// Groups orders by user and filters groups that have MORE THAN `minOrders` orders
export const getOrdersHavingFilterService = async (minOrders = 1) => {
  return await db
    .select({
      userId: userTable.id,
      userName: userTable.name,
      userEmail: userTable.email,
      orderCount: count(orderTable.id),
      totalSpent: sum(orderTable.price),
    })
    .from(userTable)
    .innerJoin(orderTable, eq(userTable.id, orderTable.user_id))
    .groupBy(userTable.id, userTable.name, userTable.email)
    .having(gt(count(orderTable.id), minOrders));
};

// 11. Multi-Table (3-Table) JOIN Demonstration:
// Orders + Users + Payments (Complete lifecycle)
export const getOrdersFullDetailsService = async () => {
  return await db
    .select({
      orderId: orderTable.id,
      productName: orderTable.product_name,
      price: orderTable.price,
      orderStatus: orderTable.status,
      customerName: userTable.name,
      customerEmail: userTable.email,
      paymentId: paymentTable.id,
      paymentAmount: paymentTable.amount,
      paymentMethod: paymentTable.payment_method,
      paymentStatus: paymentTable.status,
    })
    .from(orderTable)
    .innerJoin(userTable, eq(orderTable.user_id, userTable.id))
    .leftJoin(paymentTable, eq(orderTable.id, paymentTable.order_id));
};
