"use client"

import { useState } from "react"
import { AlertCircle, Brain, Download, FileText, Heart, TrendingUp, Droplet, CheckCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BloodReport {
  id: string
  name: string
  date: string
  fileUrl: string
}

interface HealthData {
  lastTestDate: string
  bloodPressure: string
  hemoglobin: number
  ironLevel: number
  cholesterol: {
    total: number
    hdl: number
    ldl: number
  }
  bloodSugar: number
  reports: BloodReport[]
}

interface HealthInsightsProps {
  healthData: HealthData
}

export function HealthInsights({ healthData }: HealthInsightsProps) {
  const [activeTab, setActiveTab] = useState<string>("reports")

  const getHealthStatus = (metric: string, value: number): { status: string; color: string } => {
    switch (metric) {
      case "hemoglobin":
        if (value < 12) return { status: "Low", color: "text-amber-500" }
        if (value > 16) return { status: "High", color: "text-amber-500" }
        return { status: "Normal", color: "text-green-500" }
      case "iron":
        if (value < 60) return { status: "Low", color: "text-amber-500" }
        if (value > 170) return { status: "High", color: "text-amber-500" }
        return { status: "Normal", color: "text-green-500" }
      case "cholesterol":
        if (value < 150) return { status: "Low", color: "text-blue-500" }
        if (value > 200) return { status: "High", color: "text-amber-500" }
        return { status: "Normal", color: "text-green-500" }
      case "hdl":
        if (value < 40) return { status: "Low", color: "text-amber-500" }
        return { status: "Good", color: "text-green-500" }
      case "ldl":
        if (value > 130) return { status: "High", color: "text-amber-500" }
        return { status: "Good", color: "text-green-500" }
      case "bloodSugar":
        if (value < 70) return { status: "Low", color: "text-amber-500" }
        if (value > 100) return { status: "High", color: "text-amber-500" }
        return { status: "Normal", color: "text-green-500" }
      default:
        return { status: "Unknown", color: "text-gray-500" }
    }
  }

  const getHealthSuggestion = (metric: string, value: number): string => {
    const status = getHealthStatus(metric, value).status

    switch (metric) {
      case "hemoglobin":
        if (status === "Low")
          return "Your hemoglobin is low. Consider increasing iron-rich foods in your diet before your next donation."
        if (status === "High")
          return "Your hemoglobin is high. This is generally good for donation, but consider consulting with a healthcare provider."
        return "Your hemoglobin level is normal. You're eligible to donate blood again in 8 weeks!"
      case "iron":
        if (status === "Low")
          return "Your iron level is low. Consider iron supplements and iron-rich foods before your next donation."
        if (status === "High") return "Your iron level is high. Consider consulting with a healthcare provider."
        return "Your iron level is normal. Maintain a balanced diet to keep it healthy for future donations."
      case "cholesterol":
        if (status === "High")
          return "Your total cholesterol is elevated. Consider reducing saturated fats in your diet."
        return "Your cholesterol levels are within normal range. Keep up the healthy lifestyle!"
      default:
        return "Maintain a balanced diet and regular exercise for optimal health and donation eligibility."
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reports">Blood Test Reports</TabsTrigger>
          <TabsTrigger value="insights">AI Health Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="pt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Blood Test Reports</CardTitle>
              <CardDescription>View and download your blood test reports from previous donations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthData.reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{new Date(report.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={report.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blood Test Results</CardTitle>
              <CardDescription>
                Summary of your latest blood test from {new Date(healthData.lastTestDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium flex items-center">
                        <Heart className="mr-2 h-4 w-4 text-primary" />
                        Blood Pressure
                      </h4>
                      <Badge variant="outline">{healthData.bloodPressure}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Normal range: 90/60 - 120/80 mmHg</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium flex items-center">
                        <Droplet className="mr-2 h-4 w-4 text-primary" />
                        Hemoglobin
                      </h4>
                      <Badge variant="outline" className={getHealthStatus("hemoglobin", healthData.hemoglobin).color}>
                        {healthData.hemoglobin} g/dL
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Normal range: 12.0 - 16.0 g/dL</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium flex items-center">
                        <TrendingUp className="mr-2 h-4 w-4 text-primary" />
                        Iron Level
                      </h4>
                      <Badge variant="outline" className={getHealthStatus("iron", healthData.ironLevel).color}>
                        {healthData.ironLevel} μg/dL
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Normal range: 60 - 170 μg/dL</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium flex items-center">
                        <AlertCircle className="mr-2 h-4 w-4 text-primary" />
                        Blood Sugar
                      </h4>
                      <Badge variant="outline" className={getHealthStatus("bloodSugar", healthData.bloodSugar).color}>
                        {healthData.bloodSugar} mg/dL
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Normal range: 70 - 100 mg/dL</p>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-3">Cholesterol Profile</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Cholesterol</span>
                      <Badge
                        variant="outline"
                        className={getHealthStatus("cholesterol", healthData.cholesterol.total).color}
                      >
                        {healthData.cholesterol.total} mg/dL
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">HDL (Good)</span>
                      <Badge variant="outline" className={getHealthStatus("hdl", healthData.cholesterol.hdl).color}>
                        {healthData.cholesterol.hdl} mg/dL
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">LDL (Bad)</span>
                      <Badge variant="outline" className={getHealthStatus("ldl", healthData.cholesterol.ldl).color}>
                        {healthData.cholesterol.ldl} mg/dL
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="pt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="mr-2 h-5 w-5 text-primary" />
                AI Health Insights
              </CardTitle>
              <CardDescription>Personalized health insights based on your blood test results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-primary/5">
                  <h4 className="font-medium mb-2">Donation Eligibility</h4>
                  <p className="text-sm mb-3">
                    Based on your latest test results, you are{" "}
                    <span className="font-semibold text-green-500">eligible</span> to donate blood.
                  </p>
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>
                      Your hemoglobin level is {healthData.hemoglobin} g/dL (Normal). Consider donating again in 8
                      weeks!
                    </span>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Health Recommendations</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-start gap-2">
                              <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
                              <span>{getHealthSuggestion("hemoglobin", healthData.hemoglobin)}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Based on your hemoglobin level of {healthData.hemoglobin} g/dL</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-start gap-2">
                              <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
                              <span>{getHealthSuggestion("iron", healthData.ironLevel)}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Based on your iron level of {healthData.ironLevel} μg/dL</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-start gap-2">
                              <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
                              <span>{getHealthSuggestion("cholesterol", healthData.cholesterol.total)}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Based on your cholesterol level of {healthData.cholesterol.total} mg/dL</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Nutrition Tips for Blood Donors</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2 text-sm">
                      <Heart className="h-4 w-4 text-primary mt-0.5" />
                      <span>
                        Increase iron-rich foods like lean red meat, beans, and leafy greens before and after donation.
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Heart className="h-4 w-4 text-primary mt-0.5" />
                      <span>Stay well-hydrated by drinking extra fluids for 48 hours before donation.</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <Heart className="h-4 w-4 text-primary mt-0.5" />
                      <span>Consume vitamin C with iron-rich foods to enhance absorption.</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">
                Note: These insights are generated based on your test results and general health guidelines. Always
                consult with a healthcare professional for personalized medical advice.
              </p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Donation Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  Your blood donations have directly helped save or improve the lives of up to{" "}
                  <span className="font-bold text-primary">15 people</span> so far!
                </p>
                <div className="p-4 border rounded-lg bg-primary/5">
                  <h4 className="font-medium mb-2">Health Benefits of Regular Donation</h4>
                  <div className="space-y-2 text-sm">
                    <p>Regular blood donation can have several health benefits for the donor:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Reduces iron stores, which may lower risk of heart disease</li>
                      <li>Free blood screening for various conditions</li>
                      <li>Burns calories (up to 650 calories per donation)</li>
                      <li>Stimulates blood cell production</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

