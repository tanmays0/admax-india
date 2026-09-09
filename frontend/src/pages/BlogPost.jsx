import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import PublicLayout from "../layouts/PublicLayout";
import Button from "../components/ui/Button";
import { getBlogPost } from "../constants/blogPosts";
import NotFound from "./NotFound";

const tagColors = {
  Trends: "bg-admax-green/10 text-admax-green",
  Campaigns: "bg-admax-orange/10 text-admax-orange",
  Feature: "bg-indigo-100 text-indigo-600",
  Earnings: "bg-sky-100 text-sky-600",
  Report: "bg-amber-100 text-amber-700",
  Creative: "bg-pink-100 text-pink-600",
};

export default function BlogPost() {
  const { id } = useParams();
  const post = getBlogPost(id);

  if (!post) return <NotFound />;

  return (
    <PublicLayout>
      <article>
        <section className="relative overflow-hidden bg-dark py-16 lg:py-20">
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/95 to-dark/70" />
          <div className="container-page relative">
            <Link
              to="/blog"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Journal
            </Link>
            <span
              className={`mb-4 inline-block rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${tagColors[post.tag]}`}
            >
              {post.category} · {post.tag}
            </span>
            <h1 className="max-w-3xl font-display text-3xl font-bold text-white lg:text-5xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <span>{post.author}</span>
              <span>{post.date}</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime} read
              </span>
            </div>
          </div>
        </section>

        <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_280px] lg:py-16">
          <div className="space-y-5 text-base leading-relaxed text-gray-700">
            {post.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="pt-4">
              <Link to="/pricing">
                <Button>Start a campaign</Button>
              </Link>
            </div>
          </div>
          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Key takeaway</p>
            <p className="mt-3 font-mono text-3xl font-bold text-admax-green">{post.stat}</p>
            <p className="mt-1 text-sm text-gray-500">{post.statLabel}</p>
            <p className="mt-4 text-sm text-gray-600">{post.excerpt}</p>
          </aside>
        </div>
      </article>
    </PublicLayout>
  );
}
