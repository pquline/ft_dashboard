import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPeriodMonthName, parseISODuration, formatDuration } from "@/lib/utils";
import { SourceType } from "@/types/attendance";

interface SourcesDetailsTableProps {
  currentPeriod: any;
  selectedSource: SourceType;
}

export function SourcesDetailsTable({
  currentPeriod,
  selectedSource,
}: SourcesDetailsTableProps) {
  const filteredDetails = currentPeriod?.detailed_attendance
    .filter((detail: any) => {
      if (detail.name === "locations") return false;
      if (selectedSource === "all") return true;
      return detail.name === selectedSource;
    }) || [];

  return (
    <Card className="card-modern group overflow-hidden">
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Sources Details in{" "}
          {currentPeriod
            ? getPeriodMonthName(
                currentPeriod.from_date,
                currentPeriod.to_date
              )
            : "selected month"}
        </CardTitle>
        <CardDescription className="text-muted-foreground/80">
          {selectedSource === "all"
            ? "All sources"
            : `${selectedSource} source only`}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 relative z-10">
        {filteredDetails.length > 0 ? (
          <div className='border rounded-md border-border p-2'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDetails.map((detail: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Badge variant="outline">
                        {detail.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          detail.type === "on_site"
                            ? "secondary"
                            : "outline"
                        }
                        className={`${
                          detail.type === "on_site"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        }`}
                      >
                        {detail.type === "on_site"
                          ? "On Campus"
                          : "Remote"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatDuration(
                        parseISODuration(detail.duration)
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[320px] text-muted-foreground">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <span className="text-2xl">📋</span>
              </div>
              <p>
                No data available for the selected source in
                selected month
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
