import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface DemandData {
  day: string
  [key: string]: string | number
}

interface DemandTabProps {
  demandData: DemandData[]
}

export function DemandTab({ demandData }: DemandTabProps) {
  return (
    <>
      <h2 className="text-xl font-semibold">Demand Prediction</h2>
      <Card>
        <CardHeader>
          <CardTitle>7-Day Blood Demand Forecast</CardTitle>
          <CardDescription>Predicted units needed by blood type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="A+" fill="#ef4444" stackId="a" />
                <Bar dataKey="B+" fill="#3b82f6" stackId="a" />
                <Bar dataKey="AB+" fill="#10b981" stackId="a" />
                <Bar dataKey="O+" fill="#f59e0b" stackId="a" />
                <Bar dataKey="A-" fill="#ec4899" stackId="a" />
                <Bar dataKey="B-" fill="#6366f1" stackId="a" />
                <Bar dataKey="AB-" fill="#14b8a6" stackId="a" />
                <Bar dataKey="O-" fill="#f97316" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            This forecast is based on historical data and current hospital needs.
          </p>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Blood Type Distribution</CardTitle>
          <CardDescription>Current demand by blood type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bloodType) => {
              const totalDemand = demandData.reduce(
                (sum, day) => sum + ((day[bloodType as keyof typeof day] as number) || 0),
                0,
              )
              const percentage = Math.round(
                (totalDemand /
                  demandData.reduce(
                    (sum, day) =>
                      sum +
                      Object.entries(day)
                        .filter(([key]) => key !== "day")
                        .reduce((s, [, v]) => s + (v as number), 0),
                    0,
                  )) *
                  100,
              )
              return (
                <div key={bloodType}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-primary/10 text-primary mr-2">
                        {bloodType}
                      </Badge>
                      <span className="text-sm">{totalDemand} units</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </>
  )
}

