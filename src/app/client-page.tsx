'use client';

import { ExamList } from '@/components/ExamList';
import { ExamSidebar } from '@/components/ExamSidebar';
import { Navbar } from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { gql, useQuery } from '@apollo/client';
import { Menu } from "lucide-react";
import { useState } from 'react';

const GET_ALL_EXAMS = gql`
  query GetAllExams {
    getAll {
      id
      collectedDate
    }
  }
`;

export default function ClientPage() {
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data, refetch } = useQuery(GET_ALL_EXAMS);

  return (
    <>
      <Navbar 
        onUploadSuccess={(id) => setSelectedExamId(id)}
        onRefetch={refetch}
      />
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="relative flex border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 lg:hidden z-50"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <div className={`
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
            transition-transform duration-200 ease-in-out
            absolute lg:relative 
            lg:translate-x-0
            bg-background
            z-40
            h-[calc(100vh-12rem)]
            lg:h-auto
          `}>
            <ExamSidebar 
              exams={data?.getAll || []}
              selectedExamId={selectedExamId}
              onSelectExam={(id) => {
                setSelectedExamId(id);
                if (window.innerWidth < 1024) {
                  setIsSidebarOpen(false);
                }
              }}
            />
          </div>
          
          <div className="flex-1">
            <ExamList selectedExamId={selectedExamId} />
          </div>
        </div>
      </div>
    </>
  );
}