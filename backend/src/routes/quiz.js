import { Router } from "express";
import { prisma } from "../prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_req, res) => {
  const quizzes = await prisma.quiz.findMany({
    include: { questions: { orderBy: { order: "asc" } } },
  });
  // Hide correctIndex from public
  const sanitized = quizzes.map((q) => ({
    ...q,
    questions: q.questions.map((qq) => ({
      id: qq.id,
      order: qq.order,
      question: qq.question,
      options: qq.options,
    })),
  }));
  res.json(sanitized);
});

router.post("/:quizId/submit", requireAuth, async (req, res) => {
  const { answers } = req.body; // { [questionId]: number }
  const quiz = await prisma.quiz.findUnique({
    where: { id: req.params.quizId },
    include: { questions: true },
  });
  if (!quiz) return res.status(404).json({ error: "Kuis tidak ditemukan" });

  let score = 0;
  const detail = quiz.questions.map((q) => {
    const userAns = answers?.[q.id];
    const correct = userAns === q.correctIndex;
    if (correct) score++;
    return {
      questionId: q.id,
      question: q.question,
      userAnswer: userAns,
      correctIndex: q.correctIndex,
      correct,
      explanation: q.explanation,
    };
  });

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: req.user.id,
      quizId: quiz.id,
      score,
      totalQ: quiz.questions.length,
      answersJson: detail,
    },
  });

  res.json({ attempt, detail, score, total: quiz.questions.length });
});

router.get("/attempts/me", requireAuth, async (req, res) => {
  const attempts = await prisma.quizAttempt.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
    include: { quiz: { select: { title: true } } },
  });
  res.json(attempts);
});

export default router;
