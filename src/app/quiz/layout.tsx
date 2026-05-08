import { QuizShell } from "@/components/quiz/QuizShell";

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QuizShell>{children}</QuizShell>;
}