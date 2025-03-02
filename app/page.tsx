'use client'
import Link from "next/link"
import { ArrowRight, Droplet, Heart, MapPin, Bell, Info } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
        const [activeFaq, setActiveFaq] = useState(null)

        const faqs = [
                {
                        question: "What blood types are most needed?",
                        answer: "All blood types are needed, but O-negative, O-positive, and B-negative are often in highest demand."
                },
                {
                        question: "How often can I donate blood?",
                        answer: "Most people can donate whole blood every 56 days (8 weeks)."
                },
                {
                        question: "Is blood donation safe?",
                        answer: "Yes, blood donation is very safe. All equipment is sterile and used only once."
                }
        ]

        return (
                <div className="flex min-h-screen flex-col">
                        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                                <div className="container flex h-16 items-center justify-between">
                                        <div className="flex items-center gap-2 font-bold text-xl text-primary">
                                                <Droplet className="h-6 w-6 fill-primary" />
                                                <span>BloodConnect</span>
                                        </div>
                                        <nav className="flex items-center gap-4 sm:gap-6">
                                                <Link href="/about" className="text-sm font-medium hidden sm:inline-block">
                                                        About
                                                </Link>
                                                <Link href="/locations" className="text-sm font-medium hidden sm:inline-block">
                                                        Locations
                                                </Link>
                                                <Link href="/login" className="text-sm font-medium">
                                                        Login
                                                </Link>
                                                <Link href="/register">
                                                        <Button size="sm" variant="secondary">
                                                                Register
                                                        </Button>
                                                </Link>
                                        </nav>
                                </div>
                        </header>

                        <main className="flex-1">
                                {/* Hero Section */}
                                <section className="w-full py-12 md:py-24 lg:py-32">
                                        <div className="container px-4 md:px-6">
                                                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center px-24">
                                                        <div className="flex flex-col justify-center space-y-4">
                                                                <div className="space-y-2">
                                                                        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                                                                Connecting Blood Donors with Those in Need
                                                                        </h1>
                                                                        <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                                                                BloodConnect is a platform that connects blood donors with recipients in real-time, making the blood
                                                                                donation process faster and more efficient.
                                                                        </p>
                                                                </div>
                                                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                                                        <Link href="/register?type=donor">
                                                                                <Button size="lg" className="w-full">
                                                                                        Register as Donor
                                                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                                                </Button>
                                                                        </Link>
                                                                        <Link href="/register?type=recipient">
                                                                                <Button size="lg" variant="outline" className="w-full">
                                                                                        Register as Recipient
                                                                                </Button>
                                                                        </Link>
                                                                </div>
                                                        </div>
                                                        <div className="flex justify-center lg:justify-end">
                                                                <img
                                                                        src="/images/blood-bg.png"
                                                                        alt="Blood Donation"
                                                                        className="aspect-square overflow-hidden rounded-xl object-cover object-center max-w-full"
                                                                />
                                                        </div>
                                                </div>
                                        </div>
                                </section>

                                {/* How It Works Section */}
                                <section className="w-full py-12 md:py-24 bg-muted">
                                        <div className="container px-4 md:px-6">
                                                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                                                        <div className="space-y-2">
                                                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                                                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                                                        BloodConnect makes blood donation simple, efficient, and life-saving.
                                                                </p>
                                                        </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
                                                        <Card className="flex flex-col items-center text-center h-full">
                                                                <CardContent className="pt-6 flex flex-col items-center space-y-4">
                                                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                                                                <Droplet className="h-8 w-8 text-primary" />
                                                                        </div>
                                                                        <h3 className="text-xl font-bold">Register</h3>
                                                                        <p className="text-center text-muted-foreground">
                                                                                Sign up as a donor or recipient with your details and location.
                                                                        </p>
                                                                </CardContent>
                                                        </Card>

                                                        <Card className="flex flex-col items-center text-center h-full">
                                                                <CardContent className="pt-6 flex flex-col items-center space-y-4">
                                                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                                                                <Heart className="h-8 w-8 text-primary" />
                                                                        </div>
                                                                        <h3 className="text-xl font-bold">Request or Donate</h3>
                                                                        <p className="text-center text-muted-foreground">
                                                                                Submit a blood request or receive notifications for donation opportunities.
                                                                        </p>
                                                                </CardContent>
                                                        </Card>

                                                        <Card className="flex flex-col items-center text-center h-full">
                                                                <CardContent className="pt-6 flex flex-col items-center space-y-4">
                                                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                                                                <MapPin className="h-8 w-8 text-primary" />
                                                                        </div>
                                                                        <h3 className="text-xl font-bold">Connect</h3>
                                                                        <p className="text-center text-muted-foreground">
                                                                                Get matched based on blood type and location, and save lives together.
                                                                        </p>
                                                                </CardContent>
                                                        </Card>
                                                </div>
                                        </div>
                                </section>

                                {/* Blood Type Info & Stats Section */}
                                <section className="w-full py-12 md:py-24">
                                        <div className="container px-4 md:px-6">
                                                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                                                        <div className="space-y-2">
                                                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Blood Type Information</h2>
                                                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                                                        Learn about different blood types and their compatibility.
                                                                </p>
                                                        </div>
                                                </div>

                                                <Tabs defaultValue="donate" className="w-full max-w-4xl mx-auto">
                                                        <TabsList className="grid w-full grid-cols-2">
                                                                <TabsTrigger value="donate">Who Can I Donate To?</TabsTrigger>
                                                                <TabsTrigger value="receive">Who Can I Receive From?</TabsTrigger>
                                                        </TabsList>

                                                        <TabsContent value="donate" className="p-4 border rounded-lg mt-4">
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                                                                                <Card key={type} className="text-center">
                                                                                        <CardContent className="pt-6">
                                                                                                <h3 className="text-2xl font-bold">{type}</h3>
                                                                                                <p className="text-sm text-muted-foreground mt-2">
                                                                                                        {type === "O-" ? "Universal Donor" :
                                                                                                                type === "AB+" ? "Universal Recipient" :
                                                                                                                        "Compatible with specific types"}
                                                                                                </p>
                                                                                        </CardContent>
                                                                                </Card>
                                                                        ))}
                                                                </div>
                                                        </TabsContent>

                                                        <TabsContent value="receive" className="p-4 border rounded-lg mt-4">
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                                                                                <Card key={type} className="text-center">
                                                                                        <CardContent className="pt-6">
                                                                                                <h3 className="text-2xl font-bold">{type}</h3>
                                                                                                <p className="text-sm text-muted-foreground mt-2">
                                                                                                        {type === "AB+" ? "Can receive from all types" :
                                                                                                                type === "O-" ? "Can receive from O- only" :
                                                                                                                        "Compatible with specific types"}
                                                                                                </p>
                                                                                        </CardContent>
                                                                                </Card>
                                                                        ))}
                                                                </div>
                                                        </TabsContent>
                                                </Tabs>
                                        </div>
                                </section>

                                {/* FAQ Section */}
                                <section className="w-full py-12 md:py-24 bg-muted">
                                        <div className="container px-4 md:px-6">
                                                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                                                        <div className="space-y-2">
                                                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
                                                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                                                        Common questions about blood donation and our platform.
                                                                </p>
                                                        </div>
                                                </div>

                                                <div className="max-w-3xl mx-auto space-y-4">
                                                        {faqs.map((faq, index) => (
                                                                <div
                                                                        key={index}
                                                                        className="border rounded-lg overflow-hidden"
                                                                >
                                                                        <button
                                                                                className="flex justify-between items-center w-full p-4 text-left font-medium"
                                                                                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                                                                        >
                                                                                <span>{faq.question}</span>
                                                                                <Info className={`h-5 w-5 transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} />
                                                                        </button>
                                                                        {activeFaq === index && (
                                                                                <div className="p-4 pt-0 border-t">
                                                                                        <p className="text-muted-foreground">{faq.answer}</p>
                                                                                </div>
                                                                        )}
                                                                </div>
                                                        ))}
                                                </div>
                                        </div>
                                </section>

                                {/* CTA Section */}
                                <section className="w-full py-12 md:py-24 bg-primary/5">
                                        <div className="container px-4 md:px-6">
                                                <div className="flex flex-col items-center text-center space-y-4">
                                                        <div className="space-y-2">
                                                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Make a Difference?</h2>
                                                                <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed">
                                                                        Join our community of donors and recipients and help save lives today.
                                                                </p>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                                                <Button size="lg" className="w-full sm:w-auto">
                                                                        Register Now
                                                                        <ArrowRight className="ml-2 h-4 w-4" />
                                                                </Button>
                                                                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                                                        Learn More
                                                                </Button>
                                                        </div>
                                                </div>
                                        </div>
                                </section>
                        </main>

                        <footer className="w-full border-t py-6 bg-background">
                                <div className="container px-4 md:px-6">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                                <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-primary">
                                                                <Droplet className="h-5 w-5 fill-primary" />
                                                                <span className="font-semibold">BloodConnect</span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                                Connecting blood donors with recipients to save lives.
                                                        </p>
                                                </div>

                                                <div className="space-y-2">
                                                        <h3 className="font-medium">Platform</h3>
                                                        <nav className="flex flex-col space-y-1">
                                                                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
                                                                <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground">How It Works</Link>
                                                                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
                                                        </nav>
                                                </div>

                                                <div className="space-y-2">
                                                        <h3 className="font-medium">Resources</h3>
                                                        <nav className="flex flex-col space-y-1">
                                                                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">FAQs</Link>
                                                                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link>
                                                                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                                                        </nav>
                                                </div>

                                                <div className="space-y-2">
                                                        <h3 className="font-medium">Subscribe to Updates</h3>
                                                        <div className="flex">
                                                                <input
                                                                        type="email"
                                                                        placeholder="Enter your email"
                                                                        className="flex-1 rounded-l-md border border-r-0 px-3 py-2 text-sm"
                                                                />
                                                                <Button className="rounded-l-none">
                                                                        <Bell className="h-4 w-4" />
                                                                </Button>
                                                        </div>
                                                </div>
                                        </div>

                                        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                                                <p className="text-center text-sm text-muted-foreground">
                                                        © {new Date().getFullYear()} BloodConnect. All rights reserved.
                                                </p>
                                                <div className="flex items-center gap-4">
                                                        <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">Terms</Link>
                                                        <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">Privacy</Link>
                                                        <Link href="/cookies" className="text-xs text-muted-foreground hover:text-foreground">Cookies</Link>
                                                </div>
                                        </div>
                                </div>
                        </footer>
                </div>
        )
}