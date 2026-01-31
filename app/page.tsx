'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  const router = useRouter()

  useEffect(() => {
    // Optional: Auto redirect if session exists
    const checkSession = async () => {
      const user = await AuthService.getUser()
      if (user) {
        router.push('/chat')
      }
    }
    checkSession()
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Abstract Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-[128px] -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-6 max-w-2xl px-4"
      >
        <div className="h-20 w-20 bg-primary rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-primary/40 mb-8 transform -rotate-12">
          <MessageCircle className="h-10 w-10 text-primary-foreground" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
          Nexus Chat
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed">
          Connect instantly with friends and colleagues in a secure, realtime environment designed for modern communication.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button
            size="lg"
            className="w-full sm:w-auto text-lg h-12 px-8 rounded-xl gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all font-semibold"
            onClick={() => router.push('/auth')}
          >
            Get Started <ArrowRight className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-lg h-12 px-8 rounded-xl bg-background/50 border-input/50 hover:bg-secondary/50 backdrop-blur-md"
            onClick={() => window.open('https://github.com', '_blank')}
          >
            View Source
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
