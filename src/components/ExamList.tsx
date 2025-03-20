'use client';

import { gql, useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const GET_ALL_EXAMS = gql`
  query GetAll {
    getAll {
      summary
      recommendations
      records {
        group
        name
        normalRange
        unit
        value
        id
      }
      id
      collectedDate
    }
  }
`;

interface Record {
  group: string;
  name: string;
  normalRange: string;
  unit: string;
  value: string;
  id: string;
}

interface Exam {
  id: string;
  summary: string;
  recommendations: string;
  records: Record[];
  collectedDate: string;
}

interface ExamListProps {
  selectedExamId: string | null;
}

export function ExamList({ selectedExamId }: ExamListProps) {
  const { loading, error, data } = useQuery(GET_ALL_EXAMS, {
    fetchPolicy: 'cache-and-network'
  });

  if (error) {
    return (
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="text-red-500">Error loading exams: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  if (loading && !data) {
    return (
      <div className="space-y-4 mt-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[400px] mb-4" />
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-24 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const selectedExam = data?.getAll.find((exam: Exam) => exam.id === selectedExamId);
  
  if (!selectedExam && data?.getAll?.length > 0) {
    return <div className="p-4">Please select an exam from the sidebar</div>;
  }

  return (
    <div className="space-y-4 p-6">
      {selectedExam && (
        <Card key={selectedExam.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Exam Results</span>
              <span className="text-sm font-normal text-muted-foreground">
                {format(new Date(selectedExam.collectedDate), 'PPP')}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="summary">
                <AccordionTrigger>Summary</AccordionTrigger>
                <AccordionContent>
                  {selectedExam.summary}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="recommendations">
                <AccordionTrigger>Recommendations</AccordionTrigger>
                <AccordionContent>
                  {selectedExam.recommendations}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {selectedExam.records.map((record) => (
                <Card key={record.id} className="bg-secondary/20">
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-2">{record.name}</h4>
                    <div className="text-sm space-y-1">
                      <p>Value: <span className="font-medium">{record.value} {record.unit}</span></p>
                      <p>Range: <span className="text-muted-foreground">{record.normalRange}</span></p>
                      <p>Group: <span className="text-muted-foreground">{record.group}</span></p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
