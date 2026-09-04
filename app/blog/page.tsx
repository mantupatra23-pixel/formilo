import { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS } from '@/data/blogPosts';
import { ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Exam Preparation & Document Guides - Formilo Blog',
  description: 'Expert guides on SSC, banking, and railway photo dimensions, signature rules, and PDF compression techniques.',
  alternates: {
    canonical: 'https://www.formilo.in/blog',
  },
};

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Candidate Knowledge Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Exam Document Guides &amp; Tutorials
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl">
            In-depth guides to help government and entrance exam aspirants format photos, signatures, and marksheets without portal rejections.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 gap-5">
          {BLOG_POSTS.map((post) => (
            <article 
              key={post.slug}
              className="p-6 rounded-2xl bg-[#0c0d0e] border border-zinc-800 hover:border-emerald-500/40 transition-all space-y-3 group"
            >
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {post.description}
              </p>

              <div className="pt-2">
                <Link 
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                >
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </main>
  );
}
