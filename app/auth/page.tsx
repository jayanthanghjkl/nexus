'use client'

import { useState, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react'

export default function AuthPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        // Check if environment variables are set up
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        if (!supabaseUrl || supabaseUrl.includes('placeholder') || supabaseUrl.includes('your-project-url')) {
            setError("⚠️ Supabase credentials missing! Please configure .env.local with REAL keys")
            setLoading(false)
            return
        }

        try {
            const { data, error } = isSignUp
                ? await AuthService.signUp(email, password)
                : await AuthService.signIn(email, password)

            if (error) throw error

            if (isSignUp) {
                // Just for demo simplicity, we assume auto-confirm is enabled or we alert user
                // Often signup returns session null if confirm email needed
                if (!data.session) {
                    alert("Please check your email to confirm your account.")
                } else {
                    router.push('/chat')
                }
            } else {
                router.push('/chat')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Decor - clean glass effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-background to-secondary/20 -z-10" />
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-40 -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-xl">
                    <div className="text-center mb-8">
                        <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                            <Lock className="h-6 w-6" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight mb-2">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Enter your credentials to continue to Nexus
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {error && (
                            <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-lg flex items-center gap-2">
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    className="pl-9 bg-secondary/30"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    className="pl-9 bg-secondary/30"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <div className="flex items-center gap-2">
                                    {isSignUp ? 'Sign Up' : 'Sign In'}
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
