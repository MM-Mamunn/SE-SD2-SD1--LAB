import {
  createOrderService,
  createPaymentService,
  getAllOrdersService,
  getAllPaymentsService,
  getOrdersInnerJoinService,
  getUsersLeftJoinOrdersService,
  getOrdersWithWhereService,
  getOrderAggregatesService,
  getOrdersGroupByUserService,
  getOrdersHavingFilterService,
  getOrdersFullDetailsService,
} from "../services/order.service.js";

// 1. POST /api/orders - Create a new order
export const createOrderController = async (req, res) => {
  try {
    const { id, user_id, product_name, quantity, price, status } = req.body;

    if (!user_id || !product_name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "user_id, product_name, and price are required fields",
      });
    }

    const newOrder = await createOrderService({
      ...(id !== undefined && { id: Number(id) }),
      user_id: Number(user_id),
      product_name: String(product_name).trim(),
      quantity: quantity !== undefined ? Number(quantity) : 1,
      price: Number(price),
      status: status ? String(status).trim() : "completed",
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (err) {
    console.error("Create order error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 2. POST /api/orders/payment - Create a new payment record
export const createPaymentController = async (req, res) => {
  try {
    const { id, order_id, user_id, amount, payment_method, status } = req.body;

    if (!order_id || !user_id || amount === undefined || !payment_method) {
      return res.status(400).json({
        success: false,
        message: "order_id, user_id, amount, and payment_method are required fields",
      });
    }

    const newPayment = await createPaymentService({
      ...(id !== undefined && { id: Number(id) }),
      order_id: Number(order_id),
      user_id: Number(user_id),
      amount: Number(amount),
      payment_method: String(payment_method).trim(),
      status: status ? String(status).trim() : "completed",
    });

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: newPayment,
    });
  } catch (err) {
    console.error("Create payment error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 3. GET /api/orders - Get all raw orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await getAllOrdersService();
    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (err) {
    console.error("Get orders error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 4. GET /api/orders/payments - Get all raw payments
export const getAllPaymentsController = async (req, res) => {
  try {
    const payments = await getAllPaymentsService();
    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (err) {
    console.error("Get payments error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 5. GET /api/orders/inner-join - Basic INNER JOIN
export const getOrdersInnerJoinController = async (req, res) => {
  try {
    const results = await getOrdersInnerJoinService();
    return res.status(200).json({
      success: true,
      description: "INNER JOIN: Orders matched with their corresponding User",
      count: results.length,
      data: results,
    });
  } catch (err) {
    console.error("INNER JOIN error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 6. GET /api/orders/left-join - LEFT JOIN
export const getUsersLeftJoinOrdersController = async (req, res) => {
  try {
    const results = await getUsersLeftJoinOrdersService();
    return res.status(200).json({
      success: true,
      description: "LEFT JOIN: All Users returned, with orders attached or null if none",
      count: results.length,
      data: results,
    });
  } catch (err) {
    console.error("LEFT JOIN error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 7. GET /api/orders/with-where - JOIN with WHERE filtering
export const getOrdersWithWhereController = async (req, res) => {
  try {
    const status = req.query.status || "completed";
    const results = await getOrdersWithWhereService(status);
    return res.status(200).json({
      success: true,
      description: `JOIN with WHERE: Filtered by status = '${status}'`,
      filter: { status },
      count: results.length,
      data: results,
    });
  } catch (err) {
    console.error("JOIN with WHERE error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 8. GET /api/orders/aggregates - Aggregate functions (COUNT, SUM, AVG, MIN, MAX)
export const getOrderAggregatesController = async (req, res) => {
  try {
    const stats = await getOrderAggregatesService();
    return res.status(200).json({
      success: true,
      description: "Aggregate functions: COUNT, SUM, AVG, MIN, MAX over all orders",
      data: stats,
    });
  } catch (err) {
    console.error("Aggregates error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 9. GET /api/orders/group-by-user - GROUP BY
export const getOrdersGroupByUserController = async (req, res) => {
  try {
    const results = await getOrdersGroupByUserService();
    return res.status(200).json({
      success: true,
      description: "GROUP BY: Orders grouped by User to compute count and total spent per user",
      count: results.length,
      data: results,
    });
  } catch (err) {
    console.error("GROUP BY error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 10. GET /api/orders/having-filter - HAVING
export const getOrdersHavingFilterController = async (req, res) => {
  try {
    const minOrders = req.query.minOrders ? Number(req.query.minOrders) : 1;
    const results = await getOrdersHavingFilterService(minOrders);
    return res.status(200).json({
      success: true,
      description: `HAVING: Groups filtered by HAVING COUNT(orders.id) > ${minOrders}`,
      filter: { minOrders },
      count: results.length,
      data: results,
    });
  } catch (err) {
    console.error("HAVING error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// 11. GET /api/orders/full-details - Multi-table (3-Table) JOIN
export const getOrdersFullDetailsController = async (req, res) => {
  try {
    const results = await getOrdersFullDetailsService();
    return res.status(200).json({
      success: true,
      description: "3-Table JOIN: Orders + Users + Payments",
      count: results.length,
      data: results,
    });
  } catch (err) {
    console.error("3-Table JOIN error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
