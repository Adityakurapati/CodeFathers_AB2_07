import { HealthInsights } from "@/components/health-insights"

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
  reports: {
    id: string
    name: string
    date: string
    fileUrl: string
  }[]
}

interface ProfileHealthTabProps {
  healthData: HealthData
}

export function ProfileHealthTab({ healthData }: ProfileHealthTabProps) {
  return <HealthInsights healthData={healthData} />
}

