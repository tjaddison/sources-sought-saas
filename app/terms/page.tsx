import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TermsOfServicePage() {
  const lastUpdated = "June 15, 2023"; // Update this date as needed
  
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-20">
        <section className="py-10 bg-gradient-to-b from-blue-50 to-white">
          <div className="container mx-auto px-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              Terms of Service
            </h1>
            <p className="text-gray-600 text-center mb-2">Last Updated: {lastUpdated}</p>
          </div>
        </section>
        
        <section className="py-10">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="prose prose-lg lg:prose-xl text-gray-700 mx-auto space-y-6">
              <p>
                Welcome to GovCon Agent. By accessing or using our services, you agree to be bound by these Terms of Service.
              </p>
              
              <h2>1. Services Description</h2>
              <p>
                GovCon Agent provides AI-powered tools to help federal contractors discover, analyze, and respond to Sources Sought notices and other government contracting opportunities.
              </p>
              
              <h2>2. User Accounts</h2>
              <p>
                To access certain features of our services, you may be required to register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>
              
              <h2>3. Acceptable Use</h2>
              <p>
                You agree not to use the services for any unlawful purpose or in any way that could damage, disable, overburden, or impair our services.
              </p>
              
              <h2>4. Privacy</h2>
              <p>
                Your use of our services is also governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              
              <h2>5. Intellectual Property</h2>
              <p>
                All content, features, and functionality of our services, including but not limited to text, graphics, logos, and software, are owned by GovCon Agent and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              
              <h2>6. Limitation of Liability</h2>
              <p>
                GovCon Agent shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the services.
              </p>
              
              <h2>7. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Your continued use of the services after any such changes constitutes your acceptance of the new Terms.
              </p>
              
              <h2>8. Termination</h2>
              <p>
                We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason.
              </p>
              
              <h2>9. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
              </p>
              
              <h2>10. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at info@GovConagent.com.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
} 