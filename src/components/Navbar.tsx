/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Button } from "@/components/ui/button";
import { ApolloQueryResult, gql, OperationVariables, useMutation } from '@apollo/client';
import { Loader2, Upload } from "lucide-react";
import { useState } from 'react';
import { toast } from 'sonner';

const UPLOAD_EXAM = gql`
  mutation UploadExam($file: Upload!) {
    uploadExam(file: $file) {
      id
    }
  }
`;

interface NavbarProps {
  onUploadSuccess: (examId: string) => void;
  onRefetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>;
}

export function Navbar({ onUploadSuccess, onRefetch }: NavbarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadExam] = useMutation(UPLOAD_EXAM);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const result = await uploadExam({
        variables: { file },
        context: { hasUpload: true }
      });
      
      await onRefetch();
      onUploadSuccess(result.data.uploadExam.id);
      event.target.value = '';
      
      toast.success('Exam uploaded successfully');
    } catch (error: any) {
      toast.error('Upload failed', {
        description: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="text-xl font-bold">Exam AI</div>
          <div>
            <label htmlFor="file-upload">
              <Button 
                variant="outline"
                size="sm"
                disabled={isUploading}
                asChild
              >
                <span>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Exam
                    </>
                  )}
                </span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
              disabled={isUploading}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
