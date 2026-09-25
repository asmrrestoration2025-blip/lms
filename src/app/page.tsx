import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FCFCF9]">
      {/* Top bar */}
      <div className="hidden bg-[#0F2040] px-6 py-1 text-xs text-white/70 md:block">
        <div className="mx-auto flex max-w-6xl justify-between">
          <span>123 Education Lane, Knowledge City • info@lumen.edu</span>
          <span className="flex gap-4"><Link href="/login">Student Login</Link><Link href="/register">Parent Portal</Link></span>
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0F2040] font-serif text-lg font-bold text-[#C59A2E]">L</span>
            <span className="leading-tight"><span className="block text-sm font-bold tracking-widest text-[#0F2040]">LUMEN</span><span className="block -mt-1 text-[10px] tracking-[0.2em] text-muted-foreground">LEARNING MARKETPLACE</span></span>
          </Link>
          <nav className="hidden items-center gap-6 text-xs font-semibold tracking-widest text-[#0F2040] md:flex">
            <Link href="/">HOME</Link><Link href="/courses">COURSES</Link><Link href="/dashboard">DASHBOARD</Link><Link href="#programs">PROGRAMS</Link><Link href="#contact">CONTACT</Link>
          </nav>
          <Button className="rounded-none bg-[#C59A2E] px-6 text-xs font-bold tracking-widest text-[#0F2040] hover:bg-[#B88F2A]">APPLY NOW</Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-2 md:py-16">
        <div className="space-y-6">
          <h1 className="font-serif text-4xl font-bold leading-tight text-[#0F2040] md:text-5xl">
            Inspiring Minds.<br /><span className="text-[#C59A2E]">Shaping Futures.</span>
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            A global LMS where students discover expert-led courses, instructors build thriving schools, and organizations scale learning — with verified certificates and real outcomes.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="rounded-none bg-[#0F2040] px-6 text-xs font-bold tracking-widest"><Link href="/register">DISCOVER COURSES →</Link></Button>
            <Button variant="outline" className="rounded-none border-[#0F2040] bg-white text-xs font-bold tracking-widest text-[#0F2040]">WATCH VIDEO</Button>
          </div>
        </div>
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" alt="Learners" className="h-[380px] w-full rounded-2xl object-cover" />
          <div className="absolute -bottom-4 right-4 flex items-center gap-3 rounded-xl bg-white p-4 shadow-xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C59A2E] text-white">★</span>
            <span className="text-sm leading-tight"><strong>A Legacy of Excellence</strong><br /><span className="text-xs text-muted-foreground">Since 2026 • 1000+ learners</span></span>
          </div>
        </div>
      </section>

      {/* Feature bar */}
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-4 rounded-2xl bg-[#0F2040] p-6 text-white md:grid-cols-5">
          {[
            ["Holistic Learning", "Curated paths, growth & outcomes"],
            ["Expert Instructors", "Vetted educators, real-world skills"],
            ["Innovative Labs", "Video, quizzes, certificates"],
            ["Global Perspective", "Learn in EN, multi-currency"],
            ["Safe & Supportive", "RLS, audit logs, verified payouts"],
          ].map(([t, d]) => (
            <div key={t} className="flex gap-3 border-b border-white/10 pb-4 last:border-0 md:border-b-0 md:border-r md:pb-0 md:pr-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#C59A2E] text-[#C59A2E]">◆</span>
              <div><p className="text-xs font-bold">{t}</p><p className="text-xs text-white/60">{d}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-2">
        <div className="space-y-4">
          <Badge variant="secondary" className="rounded-none bg-[#FFF4D6] text-xs tracking-widest text-[#0F2040]">ABOUT LUMEN</Badge>
          <h2 className="font-serif text-2xl font-bold text-[#0F2040]">Excellence in Learning<br /><span className="text-[#C59A2E]">Character for Life</span></h2>
          <p className="text-sm text-muted-foreground">We blend rigorous pedagogy with caring mentorship. Every course is reviewed, every instructor is supported, and every learner is seen.</p>
          <Button variant="outline" className="rounded-none border-[#0F2040] text-xs font-bold tracking-widest">LEARN MORE ABOUT US →</Button>
          <div className="flex gap-6 pt-4 text-xs">
            <span><strong className="text-[#0F2040]">25+</strong> Years</span><span><strong className="text-[#0F2040]">1500+</strong> Learners</span><span><strong className="text-[#0F2040]">100+</strong> Awards</span>
          </div>
        </div>
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" alt="Campus" className="h-[280px] w-full rounded-2xl object-cover" />
      </section>

      {/* Programs / Categories */}
      <section id="programs" className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs font-bold tracking-[0.2em] text-[#C59A2E]">CATEGORIES</p>
          <h2 className="text-center font-serif text-2xl font-bold text-[#0F2040]">Discover Our Programs</h2>
          <p className="mx-auto max-w-xl text-center text-sm text-muted-foreground">From Early Years to Career — a pathway for every learner.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3 md:grid-cols-5">
            {[
              ["Early Foundations", "Ages 5-9", "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80"],
              ["Primary Skills", "Grades 1-5", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80"],
              ["Middle Mastery", "Grades 6-8", "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80"],
              ["High Achievement", "Grades 9-12", "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&q=80"],
              ["Co-curricular", "Clubs & beyond", "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=80"],
            ].map(([title, sub, img]) => (
              <Card key={title} className="overflow-hidden rounded-none border-0 shadow-sm">
                <img src={img} alt={title} className="h-36 w-full object-cover" />
                <CardContent className="p-4"><p className="text-sm font-bold text-[#0F2040]">{title}</p><p className="text-xs text-muted-foreground">{sub}</p></CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 text-center"><Button className="rounded-none bg-[#0F2040] text-xs tracking-widest">VIEW ALL PROGRAMS →</Button></div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-[#0F2040] py-6 text-center text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4 px-6 text-xs md:grid-cols-5">
          <span><strong className="text-lg text-[#C59A2E]">25+</strong><br />Years of Excellence</span>
          <span><strong className="text-lg text-[#C59A2E]">1500+</strong><br />Students Enrolled</span>
          <span><strong className="text-lg text-[#C59A2E]">120+</strong><br />Qualified Teachers</span>
          <span><strong className="text-lg text-[#C59A2E]">100+</strong><br />Awards Won</span>
          <span><strong className="text-lg text-[#C59A2E]">98%</strong><br />Completion Rate</span>
        </div>
      </div>

      {/* CTA */}
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-2">
        <img src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80" alt="Learners" className="h-[300px] w-full rounded-2xl object-cover" />
        <div className="space-y-4">
          <p className="text-xs font-bold tracking-widest text-[#C59A2E]">ADMISSIONS</p>
          <h2 className="font-serif text-2xl font-bold text-[#0F2040]">Begin Your Journey<br />Toward a Bright Future</h2>
          <p className="text-sm text-muted-foreground">Join a community where your talent is nurtured and your future is built.</p>
          <div className="flex gap-3"><Button className="rounded-none bg-[#C59A2E] text-[#0F2040]">APPLY NOW →</Button><Button variant="outline" className="rounded-none">SCHEDULE A TOUR</Button></div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-[#0C1A33] px-6 py-10 text-sm text-white/70">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-4">
          <div><p className="font-bold text-white">LUMEN</p><p className="mt-2 text-xs">Inspiring minds. Shaping futures. Building a better tomorrow.</p></div>
          <div><p className="font-bold text-white">QUICK LINKS</p><p className="mt-2 text-xs">About • Admissions • Academics • Campus Life</p></div>
          <div><p className="font-bold text-white">CONTACT US</p><p className="mt-2 text-xs">123 Education Lane<br />+1 (555) 123-4567<br />info@lumen.edu</p></div>
          <div><p className="font-bold text-white">NEWSLETTER</p><div className="mt-2 flex"><input placeholder="Enter your email" className="w-full rounded-l bg-white px-3 py-2 text-xs text-black" /><button className="rounded-r bg-[#C59A2E] px-4 text-[#0F2040]">→</button></div></div>
        </div>
        <p className="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-4 text-center text-xs">© 2026 Lumen Learning. All Rights Reserved. Original design — inspired by modern school UI, not a copy.</p>
      </footer>
    </main>
  );
}
