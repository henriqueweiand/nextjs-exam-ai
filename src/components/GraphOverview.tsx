'use client';

import { gql, useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { Skeleton } from './ui/skeleton';

const GET_ALL_RECORDS_PER_GROUP = gql`
  query GetAllRecordsPerGroup {
    getAllRecordsPerGroup {
      name
      records {
        name
        unit
        value
        id
        exam {
          collectedDate
        }
      }
    }
  }
`;

interface Record {
  name: string;
  unit: string;
  value: string;
  id: string;
  exam: {
    collectedDate: string;
  };
}

interface GroupData {
  name: string;
  records: Record[];
}

export function GraphOverview() {
  const { data, loading, error } = useQuery(GET_ALL_RECORDS_PER_GROUP);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading graphs: {error.message}</div>;
  }

  const groups: GroupData[] = data?.getAllRecordsPerGroup || [];

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const chartData = group.records
          .map(record => ({
            date: record.exam.collectedDate,
            value: parseFloat(record.value)
          }));

        return (
          <Card key={group.name}>
            <CardHeader>
              <CardTitle>{group.name} ({group.records[0]?.unit})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => format(new Date(date), 'MMM d')}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => format(new Date(date), 'PPP')}
                      formatter={(value: number) => [`${value}`, group.name]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
