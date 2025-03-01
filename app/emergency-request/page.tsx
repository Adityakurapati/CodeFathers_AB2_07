"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertTriangle, Clock } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

const emergencyRequestSchema = z.object({
  patientName: z.string().min(2, { message: "Patient name is required" }),
  bloodType: z.string({ required_error: "Blood type is required" }),
  quantity: z.string().min(1, { message: "Quantity is required" }),
  urgencyLevel: z.string({ required_error: "Urgency level is required" }),
  hospitalName: z.string().min(2, { message: "Hospital name is required" }),
  hospitalAddress: z.string().min(5, { message: "Hospital address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Zip code is required" }),
  contactName: z.string().min(2, { message: "Contact name is required" }),
  contactPhone: z.string().min(10, { message: "Valid phone number is required" }),
  contactEmail: z.string().email({ message: "Valid email is required" }),
  patientCondition: z.string().min(10, { message: "Patient condition description is required" }),
  additionalNotes: z.string().optional(),
  consentToShare: z.boolean().refine((val) => val === true, {
    message: "You must consent to share this information with potential donors",
  }),
})

export default function EmergencyRequestPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof emergencyRequestSchema>>({
    resolver: zodResolver(emergencyRequestSchema),
    defaultValues: {
      patientName: "",
      quantity: "1",
      hospitalName: "",
      hospitalAddress: "",
      city: "",
      state: "",
      zipCode: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      patientCondition: "",
      additionalNotes: "",
      consentToShare: false,
    },
  })

  function onSubmit(data: z.infer<typeof emergencyRequestSchema>) {
    setIsSubmitting(true)
    console.log("Emergency request submitted:", data)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/dashboard?requestSubmitted=true")
    }, 1500)
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold">Emergency Blood Request</h1>
        <p className="text-muted-foreground">Fill out this form to submit an emergency request for blood donation.</p>

        <Alert variant="destructive" className="bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Emergency Request</AlertTitle>
          <AlertDescription>
            This form is for urgent blood requests. For non-urgent requests, please use the regular request form.
          </AlertDescription>
        </Alert>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4 rounded-md border p-4">
            <h2 className="text-xl font-semibold">Patient Information</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type Needed</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bloodTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Units Required</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="10" {...field} />
                    </FormControl>
                    <FormDescription>Specify how many units of blood are needed.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urgencyLevel"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Urgency Level</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="medium" />
                          </FormControl>
                          <FormLabel className="font-normal">Medium - Within 48 hours</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="high" />
                          </FormControl>
                          <FormLabel className="font-normal">High - Within 24 hours</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="critical" />
                          </FormControl>
                          <FormLabel className="font-normal text-red-500 font-semibold">Critical - Immediate</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="patientCondition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Patient Condition</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe the patient's condition and why blood is needed urgently."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This information helps donors understand the urgency and importance of their donation.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 rounded-md border p-4">
            <h2 className="text-xl font-semibold">Hospital Information</h2>

            <FormField
              control={form.control}
              name="hospitalName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hospital Name</FormLabel>
                  <FormControl>
                    <Input placeholder="City General Hospital" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hospitalAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hospital Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Medical Center Blvd" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="New York" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input placeholder="10001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4 rounded-md border p-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="(123) 456-7890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="doctor@hospital.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional information that might be helpful for donors." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="consentToShare"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <input type="checkbox" checked={field.value} onChange={field.onChange} className="h-4 w-4 mt-1" />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I consent to share this information with potential donors</FormLabel>
                  <FormDescription>
                    This information will be shared with potential donors to help them understand the urgency and
                    importance of their donation.
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2">
            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Emergency Request"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

