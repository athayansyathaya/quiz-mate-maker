import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const PLANS = {
  "b2c-payperuse": { plan: "B2C Pay-per-use", price: 20000, days: 30 },
  "b2c-monthly":   { plan: "B2C Bulanan",      price: 99000, days: 30 },
  "b2b-annual":    { plan: "B2B Tahunan",      price: 10000000, days: 365 },
};

router.get("/plans", (_req, res) => res.json(PLANS));

router.get("/me", requireAuth, async (req, res) => {
  const subs = await prisma.subscription.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(subs);
});

router.post("/subscribe", requireAuth, async (req, res) => {
  const { planKey } = req.body;
  const plan = PLANS[planKey];
  if (!plan) return res.status(400).json({ error: "Plan tidak valid" });
  const sub = await prisma.subscription.create({
    data: {
      userId: req.user.id,
      plan: plan.plan,
      price: plan.price,
      endDate: new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000),
    },
  });
  res.json(sub);
});

export default router;
