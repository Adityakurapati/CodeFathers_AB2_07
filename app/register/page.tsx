<<<<<<< HEAD
"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

const donorFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  bloodType: z.string({ required_error: "Please select your blood type." }),
  address: z.string().min(5, { message: "Please enter your address." }),
  city: z.string().min(2, { message: "Please enter your city." }),
  state: z.string().min(2, { message: "Please enter your state." }),
  zipCode: z.string().min(5, { message: "Please enter your zip code." }),
  availabilityStatus: z.string({ required_error: "Please select your availability status." }),
  medicalConditions: z.string().optional(),
  lastDonationDate: z.string().optional(),
})

const recipientFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  bloodType: z.string({ required_error: "Please select required blood type." }),
  hospitalName: z.string().min(2, { message: "Please enter hospital name." }),
  address: z.string().min(5, { message: "Please enter hospital address." }),
  city: z.string().min(2, { message: "Please enter your city." }),
  state: z.string().min(2, { message: "Please enter your state." }),
  zipCode: z.string().min(5, { message: "Please enter your zip code." }),
  urgencyLevel: z.string({ required_error: "Please select urgency level." }),
  patientDescription: z.string().min(10, { message: "Please provide a brief description." }),
})

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("donor")

  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "donor" || type === "recipient") {
      setActiveTab(type)
    }
  }, [searchParams])

  const donorForm = useForm<z.infer<typeof donorFormSchema>>({
    resolver: zodResolver(donorFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      medicalConditions: "",
      lastDonationDate: "",
    },
  })

  const recipientForm = useForm<z.infer<typeof recipientFormSchema>>({
    resolver: zodResolver(recipientFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      hospitalName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      patientDescription: "",
    },
  })

  function onDonorSubmit(data: z.infer<typeof donorFormSchema>) {
    console.log("Donor form submitted:", data)
    // In a real app, you would send this data to your API
    router.push("/dashboard")
  }

  function onRecipientSubmit(data: z.infer<typeof recipientFormSchema>) {
    console.log("Recipient form submitted:", data)
    // In a real app, you would send this data to your API
    router.push("/dashboard")
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8 space-y-4 text-center">
        <h1 className="text-3xl font-bold">Register with BloodConnect</h1>
        <p className="text-muted-foreground">Join our community to help save lives through blood donation.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="donor">Register as Donor</TabsTrigger>
          <TabsTrigger value="recipient">Register as Recipient</TabsTrigger>
        </TabsList>
        <TabsContent value="donor" className="p-4 border rounded-md mt-4">
          <Form {...donorForm}>
            <form onSubmit={donorForm.handleSubmit(onDonorSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={donorForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={donorForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={donorForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={donorForm.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your blood type" />
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

              <FormField
                control={donorForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={donorForm.control}
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
                  control={donorForm.control}
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
                  control={donorForm.control}
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

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={donorForm.control}
                  name="availabilityStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Availability Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your availability" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="unavailable">Unavailable</SelectItem>
                          <SelectItem value="emergency-only">Emergency Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={donorForm.control}
                  name="lastDonationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Donation Date (if any)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={donorForm.control}
                name="medicalConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medical Conditions (if any)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please list any medical conditions that might affect your ability to donate blood."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This information will be kept confidential and only used to determine eligibility.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Register as Donor
              </Button>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="recipient" className="p-4 border rounded-md mt-4">
          <Form {...recipientForm}>
            <form onSubmit={recipientForm.handleSubmit(onRecipientSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={recipientForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={recipientForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jane.smith@hospital.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={recipientForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="(123) 456-7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={recipientForm.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Blood Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select required blood type" />
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

              <FormField
                control={recipientForm.control}
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
                control={recipientForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital Address</FormLabel>
                    <FormControl>
                      <Input placeholder="456 Hospital Ave" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={recipientForm.control}
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
                  control={recipientForm.control}
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
                  control={recipientForm.control}
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

              <FormField
                control={recipientForm.control}
                name="urgencyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Urgency Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select urgency level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low - Within a week</SelectItem>
                        <SelectItem value="medium">Medium - Within 48 hours</SelectItem>
                        <SelectItem value="high">High - Within 24 hours</SelectItem>
                        <SelectItem value="critical">Critical - Immediate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={recipientForm.control}
                name="patientDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide a brief description of the patient's condition and why blood is needed."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This helps donors understand the urgency and importance of their donation.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Register as Recipient
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  )
=======
import { RegisterForm } from "@/components/register-form"
import { Droplet } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
        return (
                <div className="min-h-screen flex flex-col">
                        <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 lg:p-10">
                                <div className="w-full max-w-md space-y-6">
                                        <div className="space-y-2 text-center">
                                                <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-red-600">
                                                        <Droplet className="h-6 w-6" />
                                                        <span>BloodConnect</span>
                                                </Link>
                                                <h1 className="text-3xl font-bold">Create an account</h1>
                                                <p className="text-gray-500">Enter your information to create an account</p>
                                        </div>
                                        <RegisterForm />
                                        <div className="text-center text-sm">
                                                Already have an account?{" "}
                                                <Link href="/login" className="underline text-red-600">
                                                        Login
                                                </Link>
                                        </div>
                                </div>
                        </div>
                </div>
        )
>>>>>>> ashish
}

