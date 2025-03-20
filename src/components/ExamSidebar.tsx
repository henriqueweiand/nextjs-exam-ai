'use client';

import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ExamSidebarProps {
  exams: Array<{ id: string; collectedDate: string }>;
  selectedExamId: string | null;
  onSelectExam: (examId: string) => void;
}

export function ExamSidebar({ exams, selectedExamId, onSelectExam }: ExamSidebarProps) {
  return (
    <div className="w-64 border-r h-full p-4 space-y-2">
      <h3 className="font-semibold mb-4">Exam History</h3>
      {exams.map((exam) => (
        <button
          key={exam.id}
          onClick={() => onSelectExam(exam.id)}
          className={cn(
            "w-full text-left p-2 rounded hover:bg-secondary/50 transition-colors",
            selectedExamId === exam.id && "bg-secondary"
          )}
        >
          <div className="font-medium">Exam</div>
          <div className="text-sm text-muted-foreground">
            {format(new Date(exam.collectedDate), 'PPP')}
          </div>
        </button>
      ))}
    </div>
  );
}
