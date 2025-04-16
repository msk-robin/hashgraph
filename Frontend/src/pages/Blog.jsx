export default function Blog() {
  const posts = [
    {
      title: "Why Hedera for Security Solutions?",
      date: "March 15, 2024",
      excerpt:
        "Exploring Hedera's unique advantages in building enterprise security systems...",
      slug: "hedera-security-advantages",
    },
    {
      title: "AI in Blockchain Security",
      date: "March 10, 2024",
      excerpt:
        "How machine learning is revolutionizing threat detection in Web3...",
      slug: "ai-blockchain-security",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-12 text-center">HashGuard Blog</h1>

      <div className="space-y-12">
        {posts.map((post, index) => (
          <article key={index} className="bg-white p-8 rounded-xl shadow-md">
            <time className="text-gray-500 text-sm">{post.date}</time>
            <h2 className="text-2xl font-bold mt-2 mb-4">{post.title}</h2>
            <p className="text-gray-600 mb-6">{post.excerpt}</p>
            <a
              href={`/blog/${post.slug}`}
              className="text-blue-600 hover:underline font-medium"
            >
              Read More →
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
