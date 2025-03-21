'use client';

import { gql, useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { AlertCircle, FileText } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const GET_EXAM_BY_ID = gql`
  query GetExamById($id: String!) {
    getById(id: $id) {
      id
      collectedDate
      records {
        group
        name
        normalRange
        unit
        value
        id
        createdDate
      }
    }
  }
`;

interface ExamRecord {
  id: string;
  group: string;
  name: string;
  normalRange: string;
  unit: string;
  value: string;
  createdDate: string;
}

export function ExamList({ selectedExamId }: { selectedExamId: string | null }) {
  const { data, loading, error } = useQuery(GET_EXAM_BY_ID, {
    variables: { id: selectedExamId },
    skip: !selectedExamId,
  });

  if (!selectedExamId) {
    return (
      <div className="p-4 flex items-center justify-center h-[calc(100vh-16rem)]">
        <div className="text-center text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-4" />
          <p>Select an exam to view details</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-[200px]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load exam details: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { getById: exam } = data || {};

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle>
              Exam Results - {exam.collectedDate}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {exam.records.map((record: ExamRecord) => (
                <Card key={record.id}>
                  <CardContent className="">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-lg font-semibold">{record.name}</p>
                        <p className="text-xs text-muted-foreground">{record.group}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Result</p>
                        <p className="text-lg font-semibold">
                          {record.value} {record.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Reference Range</p>
                        <p className="text-lg">{record.normalRange}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
