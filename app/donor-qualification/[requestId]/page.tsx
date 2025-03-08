"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Bot, ArrowLeft, ArrowRight, Check, X, AlertTriangle, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  getBloodRequestById,
  createDonorQualification,
  updateDonorQualification,
  updateBloodRequestStatus,
} from "@/lib/api"
import type { BloodRequest } from "@/lib/types"
import { auth } from "@/lib/firebase"

// Hardcoded qualification questions
const QUALIFICATION_QUESTIONS = [
  {
    id: "bloodType",
    type: "select",
    question: "What is your blood type?",
    description: "Your blood type must be compatible with the recipient's needs.",
    options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
    category: "bloodType"
  },
  {
    id: "lastDonation",
    type: "select",
    question: "When was your last blood donation?",
    description: "Males must wait 12 weeks and females must wait 16 weeks between donations.",
    options: ["Never donated", "Less than 8 weeks ago", "8-12 weeks ago", "12-16 weeks ago", "More than 16 weeks ago"],
    required: true,
    category: "critical",
    disqualifyingAnswers: ["Less than 8 weeks ago"],
    disqualificationReason: "You must wait at least 8 weeks between blood donations."
  },
  {
    id: "weight",
    type: "select",
    question: "Is your weight at least 50kg (110 pounds)?",
    description: "Donors must weigh at least 50kg to safely donate blood.",
    options: ["Yes", "No"],
    required: true,
    category: "critical",
    disqualifyingAnswers: ["No"],
    disqualificationReason: "You must weigh at least 50kg (110 pounds) to donate blood."
  },
  {
    id: "age",
    type: "select",
    question: "Are you between 18 and 65 years old?",
    description: "First-time donors over 60 may require medical evaluation.",
    options: ["Yes", "No"],
    required: true,
    category: "critical",
    disqualifyingAnswers: ["No"],
    disqualificationReason: "You must be between 18 and 65 years old to donate blood."
  },
  {
    id: "recentIllness",
    type: "boolean",
    question: "Have you had a fever, cold, or flu in the past 2 weeks?",
    description: "Recent illness may affect eligibility.",
    required: true,
    category: "critical",
    disqualifyingAnswers: ["Yes"],
    disqualificationReason: "You must be healthy without recent illness to donate blood."
  },
  {
    id: "recentSurgery",
    type: "boolean",
    question: "Have you had surgery or dental work in the past 3 months?",
    description: "Recent procedures may temporarily affect eligibility.",
    required: true,
    category: "critical",
    disqualifyingAnswers: ["Yes"],
    disqualificationReason: "Recent surgery or dental work may temporarily disqualify you from donating."
  },
  {
    id: "takingMedications",
    type: "boolean",
    question: "Are you currently taking any medications?",
    description: "Some medications may affect donor eligibility.",
    required: true,
    category: "medical"
  },
  {
    id: "medicationList",
    type: "text",
    question: "Please list all medications you are currently taking.",
    description: "Include prescription and over-the-counter medications.",
    required: false,
    category: "medical",
    conditionalDisplay: (responses) => responses.takingMedications === "Yes"
  },
  {
    id: "recentVaccination",
    type: "boolean",
    question: "Have you received any vaccines in the past 4 weeks?",
    description: "Recent vaccinations may temporarily affect eligibility.",
    required: true,
    category: "medical",
    disqualifyingAnswers: ["Yes"],
    disqualificationReason: "Recent vaccinations may temporarily disqualify you from donating."
  },
  {
    id: "pregnancyStatus",
    type: "boolean",
    question: "Are you currently pregnant or have you given birth in the past 6 months?",
    description: "Pregnancy and recent childbirth affect eligibility.",
    required: true,
    category: "medical",
    disqualifyingAnswers: ["Yes"],
    disqualificationReason: "Pregnancy or recent childbirth temporarily disqualifies you from donating."
  },
  {
    id: "tattooOrPiercing",
    type: "boolean",
    question: "Have you had a tattoo or body piercing in the past 4 months?",
    description: "Recent tattoos or piercings may affect eligibility.",
    required: true,
    category: "critical",
    disqualifyingAnswers: ["Yes"],
    disqualificationReason: "Recent tattoos or piercings temporarily disqualify you from donating."
  },
  {
    id: "travelHistory",
    type: "boolean",
    question: "Have you traveled outside your country in the past 6 months?",
    description: "Travel to certain regions may affect eligibility due to disease exposure risk.",
    required: true,
    category: "risk"
  },
  {
    id: "travelDetails",
    type: "text",
    question: "Please list the countries you visited in the past 6 months.",
    description: "Some countries may have malaria or other disease risks.",
    required: false,
    category: "risk",
    conditionalDisplay: (responses) => responses.travelHistory === "Yes"
  },
  {
    id: "highriskBehavior",
    type: "boolean",
    question: "In the past 3 months, have you engaged in behaviors that may increase risk for HIV or hepatitis?",
    description: "This includes unprotected sex with multiple partners, IV drug use, etc.",
    required: true,
    category: "critical",
    disqualifyingAnswers: ["Yes"],
    disqualificationReason: "Recent high-risk behaviors may temporarily disqualify you from donating."
  }
];

// Define question type
interface QualificationQuestion {
  id: string;
  type: "select" | "boolean" | "text";
  question: string;
  description?: string;
  options?: string[];
  required: boolean;
  category: string;
  disqualifyingAnswers?: string[];
  disqualificationReason?: string;
  conditionalDisplay?: (responses: Record<string, any>) => boolean;
}

export default function DonorQualification() {
  const router = useRouter()
  const params = useParams()
  const requestId = params.requestId as string

  const [userId, setUserId] = useState<string | null>(null)
  const [request, setRequest] = useState<BloodRequest | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [qualificationId, setQualificationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isQualified, setIsQualified] = useState<boolean | null>(null)
  const [disqualificationReason, setDisqualificationReason] = useState<string | null>(null)

  useEffect(() => {
    // Check authentication
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid)
      } else {
        // Redirect to login if not authenticated
        router.push("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    if (!requestId || !userId) return

    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch request details
        const requestData = await getBloodRequestById(requestId)
        setRequest(requestData)

        // Create a qualification record
        const { id } = await createDonorQualification(requestId, userId)
        setQualificationId(id)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          variant: "destructive",
          title: "Error loading qualification process",
          description: "Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [requestId, userId])

  // Get visible questions based on conditional display logic
  const getVisibleQuestions = () => {
    return QUALIFICATION_QUESTIONS.filter(question => {
      if (question.conditionalDisplay) {
        return question.conditionalDisplay(responses);
      }
      return true;
    });
  };

  const visibleQuestions = getVisibleQuestions();

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleNext = () => {
    // Validate current question
    const currentQuestion = visibleQuestions[currentStep]
    if (currentQuestion.required && !responses[currentQuestion.id]) {
      toast({
        variant: "destructive",
        title: "Required field",
        description: "Please answer this question before proceeding.",
      })
      return
    }

    // Check if the answer is disqualifying
    if (
      currentQuestion.disqualifyingAnswers &&
      currentQuestion.disqualifyingAnswers.includes(responses[currentQuestion.id])
    ) {
      // Store reason for disqualification
      setDisqualificationReason(currentQuestion.disqualificationReason || 
        "Your answer indicates you may not be eligible to donate at this time.");
      handleDisqualification();
      return
    }
    
    // Special check for blood type compatibility
    if (currentQuestion.id === 'bloodType' && request?.bloodType) {
      const donorBloodType = responses[currentQuestion.id];
      if (!isBloodTypeCompatible(donorBloodType, request.bloodType)) {
        setDisqualificationReason(
          `Your blood type ${donorBloodType} is not compatible with the recipient's blood type ${request.bloodType}.`
        );
        handleDisqualification();
        return;
      }
    }

    // Move to next question
    if (currentStep < visibleQuestions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Final submission - all questions passed
      handleFinalSubmission()
    }
  }

  // Function to check blood type compatibility
  const isBloodTypeCompatible = (donorType: string, recipientType: string): boolean => {
    // Basic compatibility check
    // O- can donate to anyone
    if (donorType === "O-") return true;
    
    // O+ can donate to O+, A+, B+, AB+
    if (donorType === "O+" && [
      "O+", "A+", "B+", "AB+"
    ].includes(recipientType)) return true;
    
    // A- can donate to A-, A+, AB-, AB+
    if (donorType === "A-" && [
      "A-", "A+", "AB-", "AB+"
    ].includes(recipientType)) return true;
    
    // A+ can donate to A+, AB+
    if (donorType === "A+" && [
      "A+", "AB+"
    ].includes(recipientType)) return true;
    
    // B- can donate to B-, B+, AB-, AB+
    if (donorType === "B-" && [
      "B-", "B+", "AB-", "AB+"
    ].includes(recipientType)) return true;
    
    // B+ can donate to B+, AB+
    if (donorType === "B+" && [
      "B+", "AB+"
    ].includes(recipientType)) return true;
    
    // AB- can donate to AB-, AB+
    if (donorType === "AB-" && [
      "AB-", "AB+"
    ].includes(recipientType)) return true;
    
    // AB+ can donate to AB+ only
    if (donorType === "AB+" && recipientType === "AB+") return true;
    
    return false;
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleDisqualification = async () => {
    setIsSubmitting(true)
    try {
      if (!qualificationId) return

      // Store the reason for disqualification in responses
      const updatedResponses = {
        ...responses,
        disqualificationReason: disqualificationReason
      };

      // Update qualification status to disqualified
      await updateDonorQualification(qualificationId, updatedResponses, "disqualified")
      setIsQualified(false)
    } catch (error) {
      console.error("Error updating qualification:", error)
      toast({
        variant: "destructive",
        title: "Error processing qualification",
        description: "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinalSubmission = async () => {
    setIsSubmitting(true)
    try {
      if (!qualificationId || !requestId || !userId) return

      // Final validation check across all responses
      const isDisqualified = validateAllResponses();
      
      if (isDisqualified.disqualified) {
        setDisqualificationReason(isDisqualified.reason);
        handleDisqualification();
        return;
      }

      // Update qualification status to qualified
      await updateDonorQualification(qualificationId, responses, "qualified")

      // Update blood request status to accepted
      await updateBloodRequestStatus(requestId, "accepted", userId)

      setIsQualified(true)
    } catch (error) {
      console.error("Error updating qualification:", error)
      toast({
        variant: "destructive",
        title: "Error processing qualification",
        description: "Please try again later.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Comprehensive validation of all responses
  const validateAllResponses = () => {
    // Check for high-risk countries in travel history
    if (responses.travelHistory === "Yes" && responses.travelDetails) {
      const travelDetails = responses.travelDetails.toLowerCase();
      const highRiskCountries = ["india", "pakistan", "cambodia", "nigeria", "uganda", "kenya", "brazil", "haiti"];
      
      for (const country of highRiskCountries) {
        if (travelDetails.includes(country)) {
          return { 
            disqualified: true, 
            reason: `Recent travel to ${country} may temporarily disqualify you from donating at this time.` 
          };
        }
      }
    }
    
    // Check for medication conflicts
    if (responses.takingMedications === "Yes" && responses.medicationList) {
      const medications = responses.medicationList.toLowerCase();
      const disqualifyingMeds = ["blood thinner", "warfarin", "accutane", "finasteride", "antibiotic"];
      
      for (const med of disqualifyingMeds) {
        if (medications.includes(med)) {
          return { 
            disqualified: true, 
            reason: `Your current medication (containing ${med}) may temporarily disqualify you from donating.` 
          };
        }
      }
    }
    
    // All validations passed
    return { disqualified: false, reason: null };
  };

  const renderQuestion = (question: QualificationQuestion) => {
    switch (question.type) {
      case "select":
        return (
          <div className="space-y-3">
            <Label htmlFor={question.id}>{question.question}</Label>
            {question.description && (
              <p className="text-sm text-muted-foreground">{question.description}</p>
            )}
            <Select
              value={responses[question.id] || ""}
              onValueChange={(value) => handleResponseChange(question.id, value)}
            >
              <SelectTrigger id={question.id}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case "boolean":
        return (
          <div className="space-y-3">
            <Label>{question.question}</Label>
            {question.description && (
              <p className="text-sm text-muted-foreground">{question.description}</p>
            )}
            <RadioGroup
              value={responses[question.id] || ""}
              onValueChange={(value) => handleResponseChange(question.id, value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Yes" id={`${question.id}-yes`} />
                <Label htmlFor={`${question.id}-yes`}>Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="No" id={`${question.id}-no`} />
                <Label htmlFor={`${question.id}-no`}>No</Label>
              </div>
            </RadioGroup>
          </div>
        )

      case "text":
      default:
        return (
          <div className="space-y-3">
            <Label htmlFor={question.id}>{question.question}</Label>
            {question.description && (
              <p className="text-sm text-muted-foreground">{question.description}</p>
            )}
            <Textarea
              id={question.id}
              value={responses[question.id] || ""}
              onChange={(e) => handleResponseChange(question.id, e.target.value)}
              placeholder="Enter your answer"
            />
          </div>
        )
    }
  }

  const renderQualificationResult = () => {
    if (isQualified === true) {
      return (
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle>You're Qualified!</CardTitle>
            <CardDescription>
              Thank you for completing the qualification process. You are eligible to donate blood for this request.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                You have been matched with {request?.fullName} who needs {request?.bloodType} blood type. The recipient
                has been notified that you're on your way.
              </p>
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Please make sure to bring a valid ID with you. Stay hydrated and have a light meal before
                        donating.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => router.push("/dashboard/donor")}>
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      )
    } else if (isQualified === false) {
      return (
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <X className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Not Eligible at This Time</CardTitle>
            <CardDescription>
              Based on your responses, you are not eligible to donate blood at this time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                For the safety of both donors and recipients, we cannot proceed with your blood donation at this time.
                This is temporary and you may be eligible to donate in the future.
              </p>
              
              {disqualificationReason && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Reason for Deferral</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{disqualificationReason}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="rounded-md bg-yellow-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Common Reasons for Deferral</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-inside list-disc space-y-1">
                        <li>Recent illness or fever</li>
                        <li>Low hemoglobin or iron levels</li>
                        <li>Recent travel to certain regions</li>
                        <li>Certain medications</li>
                        <li>Recent tattoos or piercings</li>
                        <li>Blood type incompatibility</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => router.push("/dashboard/donor")}>
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      )
    }

    return null
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-red-600" />
          <p className="mt-2">Loading qualification process...</p>
        </div>
      </div>
    )
  }

  if (isQualified !== null) {
    return <div className="container mx-auto px-4 py-8">{renderQualificationResult()}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-4" onClick={() => router.push("/dashboard/donor")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card className="mx-auto max-w-md">
        <CardHeader>
          <div className="flex items-center">
            <Bot className="mr-2 h-6 w-6 text-red-600" />
            <CardTitle>Donor Qualification Assistant</CardTitle>
          </div>
          <CardDescription>
            Please answer the following questions to determine your eligibility to donate blood.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {visibleQuestions.length > 0 && currentStep < visibleQuestions.length && (
            <div className="space-y-6">
              <div className="text-sm text-muted-foreground">
                Question {currentStep + 1} of {visibleQuestions.length}
              </div>

              {renderQuestion(visibleQuestions[currentStep])}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0 || isSubmitting}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button onClick={handleNext} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : currentStep === visibleQuestions.length - 1 ? (
              <>
                Submit
                <Check className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}