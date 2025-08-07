'use client'

import { SignIn } from "@clerk/nextjs"
import { neobrutalism } from "@clerk/themes"
import Image from "next/image"

export default function LandingPage() {
    return (
        <main className="flex items-center p-10 gap-24 animate-fade-in max-md:flex-col">
            <section className="flex flex-col items-center">
                <Image src='/assets/logo.svg' width={300} height={300} alt='logo'></Image>
                <h1 className="text-2xl font-black lg:text-3xl">your time, perfectly planned</h1>
                <p className="font-extralight">join millions of professionals who easily book meetings</p>
                <Image src='/assets/planning.svg' width={500} height={500} alt="logo"></Image>
            </section>
            <div className="mt-3">
                <SignIn routing='hash' appearance={{ baseTheme: neobrutalism }}></SignIn>
            </div>
        </main>
    )
}