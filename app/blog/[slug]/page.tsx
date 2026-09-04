import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BLOG_POSTS, BlogPost } from '@/data/blogPosts';
import { ArrowLeft, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) return { title: 'Post Not Found - Formilo' };

  return {
    title: `${post.title} - Formilo Blog`,
    description: post.description,
    alternates: {
      canonical: `https://www.formilo.in/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.formilo.in/blog/${slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Formilo',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.formilo.in/logo.png',
      },
    },
  };

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 py-10 px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Back Link */}
        <nav aria-label="Breadcrumb">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Guides Hub</span>
          </Link>
        </nav>

        {/* Article Header */}
        <header className="space-y-4 border-b border-zinc-800 pb-6">
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              {post.readTime}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              {post.author}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
            {post.title}
          </h1>

          <p className="text-sm text-zinc-300 leading-relaxed">
            {post.description}
          </p>
        </header>

        {/* Article Body Content */}
        <article className="space-y-6 text-zinc-300 text-sm sm:text-base leading-relaxed">
          {post.content.map((section, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white pt-2">
                {section.heading}
              </h2>
              {section.paragraphs.map((para, pIdx) => (
                <p key={pIdx} className="text-zinc-400 leading-relaxed">
                  {para}
                </p>
              ))}
            </section>
          ))}
        </article>

        {/* Footer CTA */}
        <div className="p-6 rounded-2xl bg-[#0c0d0e] border border-zinc-800 space-y-3 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Ready to Format Your Application Documents?
            </h3>
            <p className="text-xs text-zinc-400">
              Use Formilo&apos;s 100% free, client-side browser tools instantly.
            </p>
          </div>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shrink-0 transition-all"
          >
            Explore All Tools
          </Link>
        </div>

      </div>
    </main>
  );
}
