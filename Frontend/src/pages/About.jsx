export default function About() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Securing Hedera's Future</h1>
        <p className="text-gray-600 text-xl max-w-3xl mx-auto">
          HashGuard combines Hedera's enterprise-grade blockchain with
          AI-powered security to create an unprecedented layer of protection for
          decentralized applications.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-gray-600 mb-6">
            Founded in 2025 by blockchain security experts, in nairobi hedera
            hashathon. HashGuard emerged from the need to address growing
            vulnerabilities in decentralized systems. Our team combines decades
            of experience in:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            <li>Cryptographic security protocols</li>
            <li>Distributed ledger technology</li>
            <li>Machine learning systems</li>
            <li>Enterprise blockchain solutions</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Hedera Partnership</h2>
          <div className="flex items-center mb-4">
            <img
              src="/hedera-logo.png"
              alt="Hedera Hashgraph"
              className="h-12 mr-4"
            />
            <p className="text-gray-600">
              Officially recognized as a Hedera HIP-27 compliant solution
            </p>
          </div>
          <ul className="space-y-2 text-gray-600">
            <li>✅ Enterprise-grade ABFT security</li>
            <li>✅ 10,000+ TPS capability</li>
            <li>✅ Carbon-negative network</li>
          </ul>
        </div>
      </div>

      <section className="bg-blue-50 p-12 rounded-2xl text-center">
        <h2 className="text-3xl font-bold mb-6">Project Milestones</h2>
        <div className="flex justify-center gap-8">
          <div className="bg-white p-6 rounded-xl w-40">
            <div className="text-blue-600 text-2xl font-bold mb-2">
              25/3/2025
            </div>
            <div className="text-sm">Concept Validation</div>
          </div>
          <div className="bg-white p-6 rounded-xl w-40">
            <div className="text-blue-600 text-2xl font-bold mb-2">
              28/3/2024
            </div>
            <div className="text-sm">Testnet Launch</div>
          </div>
        </div>
      </section>
    </div>
  );
}
