'use client';

import { cn } from "@/lib/utils";
import { useAuth, useClerk } from "@clerk/nextjs";
import { format } from "date-fns";
import { useRouter } from "next/navigation"; // Changed from next/router
import { Button } from "./ui/button";
import { useEffect } from "react";

interface ExamSidebarProps {
  exams: Array<{ id: string; collectedDate: string }>;
  selectedExamId: string | null;
  onSelectExam: (examId: string) => void;
}

export function ExamSidebar({ exams, selectedExamId, onSelectExam }: ExamSidebarProps) {
  const { userId } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (!userId) {
      router.push('/sign-in');
    }
  }, [userId, router]);

  if (!userId) {
    return null; // or a loading spinner
  }

  const handleLogout = () => {
    signOut(() => router.push('/sign-in'));
  };

  return (
    <div className="w-64 border-r h-full p-4 space-y-2">
      <Button variant="outline" size={"sm"} className="float-right" onClick={handleLogout}>
        Sign Out
      </Button>

      <h3 className="font-semibold mb-4 mt-12">Exam History</h3>
      
      {exams.map((exam) => (
        <button
          key={exam.id}
          onClick={() => onSelectExam(exam.id)}
          className={cn(
            "w-full text-left p-2 rounded hover:bg-secondary/50 transition-colors",
            selectedExamId === exam.id && "bg-secondary"
          )}
        >
          <div className="text-sm text-muted-foreground">
            {format(new Date(exam.collectedDate), 'PPP')}
          </div>
        </button>
      ))}
    </div>
  );
}
