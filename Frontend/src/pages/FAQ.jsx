export default function FAQ() {
  const faqs = [
    {
      question: "How does HashGuard protect my transactions?",
      answer:
        "Our AI analyzes transaction patterns and checks against known malicious addresses using Hedera's consensus network.",
    },
    {
      question: "Is my wallet information stored?",
      answer:
        "No personal data is stored. We only analyze public blockchain data.",
    },
    {
      question: "How does DAO governance work?",
      answer:
        "Token holders vote on disputed transactions and policy changes through HTS tokens.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>

      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
