'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { ExamList } from '@/components/ExamList';
import { ExamSidebar } from '@/components/ExamSidebar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Menu } from "lucide-react";
import { toast } from 'sonner';

const UPLOAD_EXAM = gql`
  mutation UploadExam($file: Upload!) {
    uploadExam(file: $file) {
      id
    }
  }
`;

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadExam] = useMutation(UPLOAD_EXAM);
  const { data, refetch } = useQuery(GET_ALL_EXAMS);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const result = await uploadExam({
        variables: {
          file: selectedFile
        },
        context: {
          hasUpload: true
        }
      });
      
      await refetch();
      setSelectedExamId(result.data.uploadExam.id);
      setSelectedFile(null);
      const form = event.target as HTMLFormElement;
      form.reset();
      
      toast.success('Exam uploaded successfully');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error('Upload failed', {
        description: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 pt-0 max-w-7xl">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Upload New Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
                className="w-full"
                disabled={isUploading}
              />
            </div>
            <Button 
              type="submit" 
              disabled={!selectedFile || isUploading}
              variant="default"
              className="w-full sm:w-auto"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Exam'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
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
  );
}