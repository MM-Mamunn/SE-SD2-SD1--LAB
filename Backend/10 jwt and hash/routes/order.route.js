import express from "express";
import {
  createOrderController,
  createPaymentController,
  getAllOrdersController,
  getAllPaymentsController,
  getOrdersInnerJoinController,
  getUsersLeftJoinOrdersController,
  getOrdersWithWhereController,
  getOrderAggregatesController,
  getOrdersGroupByUserController,
  getOrdersHavingFilterController,
  getOrdersFullDetailsController,
} from "../controllers/order.controller.js";

const router = express.Router();

// --- Data Creation Endpoints ---
// 1. POST /api/orders - Create an order
router.post("/", createOrderController);

// 2. POST /api/orders/payment - Create a payment record
router.post("/payment", createPaymentController);

// 3. GET /api/orders - Get all orders
router.get("/", getAllOrdersController);

// 4. GET /api/orders/payments - Get all payments
router.get("/payments", getAllPaymentsController);

// --- SQL Demonstrations ---
// 5. GET /api/orders/inner-join - Basic INNER JOIN (Orders + Users)
router.get("/inner-join", getOrdersInnerJoinController);

// 6. GET /api/orders/left-join - LEFT JOIN (All Users + Orders)
router.get("/left-join", getUsersLeftJoinOrdersController);

// 7. GET /api/orders/with-where - JOIN with WHERE filtering
router.get("/with-where", getOrdersWithWhereController);

// 8. GET /api/orders/aggregates - Aggregate Functions (COUNT, SUM, AVG, MIN, MAX)
router.get("/aggregates", getOrderAggregatesController);

// 9. GET /api/orders/group-by-user - GROUP BY (Orders aggregated per User)
router.get("/group-by-user", getOrdersGroupByUserController);

// 10. GET /api/orders/having-filter - HAVING (Groups filtered after aggregation)
router.get("/having-filter", getOrdersHavingFilterController);

// 11. GET /api/orders/full-details - 3-Table JOIN (Orders + Users + Payments)
router.get("/full-details", getOrdersFullDetailsController);

export default router;
