import { Router } from "express";
import handler from "express-async-handler";
import auth from "../middleware/auth.mid.js";
import { BAD_REQUEST } from "../constants/httpStatus.js";
import { OrderModel } from "../models/order.model.js";
import { OrderStatus } from "../constants/orderStatus.js";
import { UserModel } from "../models/user.model.js";
import { sendEmailReceipt } from "../helpers/mail.helper.js";

const router = Router();
router.use(auth);

router.post(
  '/create',
  handler(async (req, res) => {
    const order = req.body;

    if (order.items.length <= 0) res.status(BAD_REQUEST).send('Cart Is Empty!');

    // await OrderModel.deleteOne({
    //   user: req.user.id,
    //   status: OrderStatus.NEW,
    // });

    const newOrder = new OrderModel({ ...order, user: req.user.id });
    await newOrder.save();
    res.send(newOrder);
  })
);
router.put(
  '/pay',
  handler(async (req, res) => {
    const { paymentId } = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if (!order) {
      res.status(BAD_REQUEST).send('Order Not Found!');
      return;
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();

    sendEmailReceipt(order);

    res.send(order._id);
  })
);


router.get(
  "/track/:orderId",
  handler(async (req, res) => {
    const { orderId } = req.params;
    const user = await UserModel.findById(req.user.id);

    const filter = {
      _id: orderId,
    };

    if (!user.isAdmin) {
      filter.user = user._id;
    }

    const order = await OrderModel.findOne(filter);

    if (!order) return res.send(UNAUTHORIZED);

    return res.send(order);
  })
);

router.get(
  '/newOrderForCurrentUser',
  handler(async (req, res) => {
    const order = await getNewOrderForCurrentUser(req);
    if (order) res.send(order);
    else res.status(BAD_REQUEST).send();
  })
);

router.get("/allstatus", (req, res) => {
  const allStatus = Object.values(OrderStatus);
  res.send(allStatus);
});

router.get(
  "/:status?",
  handler(async (req, res) => {
    const status = req.params.status;
    const user = await UserModel.findById(req.user.id);
    const filter = {};

    if (!user.isAdmin) filter.user = user._id;
    if (status) filter.status = status;

    const orders = await OrderModel.find(filter).sort("-createdAt");
    res.send(orders);
  })
);

router.put(
  "/cancel/:orderId",
  handler(async (req, res) => {
    const { orderId } = req.params;
    const user = await UserModel.findById(req.user.id);

    const filter = { _id: orderId };
    if (!user.isAdmin) {
      filter.user = user._id; // Ensure that non-admin users can only cancel their own orders
    }

    const order = await OrderModel.findOne(filter);

    if (!order) {
      return res
        .status(BAD_REQUEST)
        .send(
          "Order not found or you do not have permission to cancel this order."
        );
    }

    // Update the order status to 'cancelled'
    order.status = OrderStatus.CANCELED;
    await order.save();

    res.send(order);
  })
);

router.put(
  "/accept/:orderId",
  handler(async (req, res) => {
    const { orderId } = req.params;
    const user = await UserModel.findById(req.user.id);
    const filter = { _id: orderId };
    if (!user.isAdmin) {
      filter.user = user._id; // Ensure that non-admin users can only accept their own orders
    }
    const order = await OrderModel.findOne(filter);
    if (!order) {
      return res
        .status(BAD_REQUEST)
        .send(
          "Order not found or you do not have permission to accept this order."
        );
    }
    // Update the order status to 'accepted'
    order.status = OrderStatus.ACCEPTED;
    await order.save();
    res.send(order);
  })
);

const getNewOrderForCurrentUser = async req =>
  await OrderModel.findOne({
    user: req.user.id,
    status: OrderStatus.NEW,
  }).populate('user');
export default router;
