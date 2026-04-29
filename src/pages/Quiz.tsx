import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { api, isLoggedIn } from "@/lib/api";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type Question = { id: string; order: number; question: string; options: string[] };
type Quiz = { id: string; title: string; questions: Question[] };
type ResultDetail = { questionId: string; question: string; userAnswer: number; correctIndex: number; correct: boolean; explanation: string };

export default function Quiz() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; total: number; detail: ResultDetail[] } | null>(null);

  useEffect(() => {
    api.quizzes().then((qs: Quiz[]) => setQuiz(qs[0] || null));
  }, []);

  const submit = async () => {
    if (!quiz) return;
    if (!isLoggedIn()) return toast.error("Login dulu untuk submit kuis");
    if (Object.keys(answers).length !== quiz.questions.length) return toast.error("Jawab semua pertanyaan");
    try {
      const res = await api.submitQuiz(quiz.id, answers);
      setResult(res);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal submit");
    }
  };

  const reset = () => { setAnswers({}); setResult(null); };

  if (!quiz) return <Layout><div className="container py-20 text-center text-muted-foreground">Memuat kuis...</div></Layout>;

  if (result) {
    const pct = Math.round((result.score / result.total) * 100);
    return (
      <Layout>
        <div className="container max-w-3xl py-12">
          <div className="rounded-3xl bg-gradient-hero p-10 text-center text-primary-foreground shadow-glow">
            <Trophy className="mx-auto h-14 w-14" />
            <h1 className="mt-4 text-3xl font-bold">Skormu: {result.score}/{result.total}</h1>
            <p className="mt-2 text-xl opacity-90">{pct}% benar</p>
          </div>
          <div className="mt-8 space-y-4">
            {result.detail.map((d, i) => (
              <div key={d.questionId} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  {d.correct ? <CheckCircle2 className="mt-1 h-5 w-5 text-success" /> : <XCircle className="mt-1 h-5 w-5 text-danger" />}
                  <div className="flex-1">
                    <p className="font-semibold">{i + 1}. {d.question}</p>
                    <p className="mt-2 text-sm">
                      Jawabanmu: <span className={d.correct ? "text-success font-semibold" : "text-danger font-semibold"}>
                        {quiz.questions[i].options[d.userAnswer] ?? "(kosong)"}
                      </span>
                    </p>
                    {!d.correct && (
                      <p className="mt-1 text-sm">Jawaban benar: <span className="font-semibold text-success">{quiz.questions[i].options[d.correctIndex]}</span></p>
                    )}
                    <p className="mt-2 rounded-lg bg-muted p-3 text-sm text-muted-foreground">{d.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={reset} className="mt-8 w-full bg-gradient-cta text-primary-foreground hover:opacity-90" size="lg">
            <RotateCcw className="mr-2 h-4 w-4" />Coba lagi
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-3xl py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold md:text-4xl">{quiz.title}</h1>
          <p className="mt-2 text-muted-foreground">Uji pemahamanmu tentang integritas akademik & plagiarisme</p>
          {!isLoggedIn() && (
            <p className="mt-3 text-sm text-warning">Login dulu untuk menyimpan hasil — <Link to="/login" className="font-semibold underline">Masuk</Link></p>
          )}
        </div>
        <div className="mt-8 space-y-5">
          {quiz.questions.map((q, qi) => (
            <div key={q.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="font-semibold">{qi + 1}. {q.question}</p>
              <div className="mt-4 space-y-2">
                {q.options.map((opt, oi) => (
                  <label key={oi} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${answers[q.id] === oi ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                    <input type="radio" name={q.id} checked={answers[q.id] === oi} onChange={() => setAnswers({ ...answers, [q.id]: oi })} className="accent-primary" />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <Button onClick={submit} className="mt-8 w-full bg-gradient-cta text-primary-foreground hover:opacity-90" size="lg">Submit jawaban</Button>
      </div>
    </Layout>
  );
}
