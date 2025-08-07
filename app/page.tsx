import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import LandingPage from "../components/LandingPage"

export default async function HomePage() {
  const user = await currentUser()
  if (!user) return <LandingPage></LandingPage>
  return redirect('/events')
}