import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function PrivacyPolicyPage() {
  const lastUpdated = "April 1, 2025"; // Update this date

  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20"> {/* Adjust padding for fixed navbar */}

        {/* Header Section */}
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600">
              Last Updated: {lastUpdated}
            </p>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="prose prose-lg lg:prose-xl text-gray-700 mx-auto space-y-6">
              <p>
                Welcome to GovBiz Agent (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us at info @ xenvya.com.
              </p>

              <p>
                This privacy notice describes how we might use your information if you visit our website, use our services, or otherwise engage with us.
              </p>

              <h2>1. What Information Do We Collect?</h2>
              <p>
                <strong>Personal Information You Disclose to Us:</strong> We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services (such as posting messages in our online forums or entering competitions, contests or giveaways) or otherwise when you contact us.
              </p>
              <p>
                The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make and the products and features you use. The personal information we collect may include the following: Name, Email Address, Phone Number, Company Name, Job Title, Payment Information, User Credentials, Uploaded Documents like Capabilities Statements, Resumes, Statements of Work, and Past Proposals.
              </p>
              <p>
                <strong>Information Automatically Collected:</strong> We automatically collect certain information when you visit, use or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services and other technical information.
              </p>

              <h2>2. How Do We Use Your Information?</h2>
              <p>
                We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We indicate the specific processing grounds we rely on next to each purpose listed below.
              </p>
              <p>
                We use the information we collect or receive: To facilitate account creation, To manage user accounts, To send administrative information, To fulfill and manage your orders/subscriptions, To deliver and facilitate delivery of services, To respond to user inquiries/offer support, To send you marketing and promotional communications, To deliver targeted advertising, For data analysis, and identifying usage trends.
              </p>

              <h2>3. Will Your Information Be Shared With Anyone?</h2>
              <p>
                We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
              </p>
              <p>
                We may process or share your data that we hold based on the following legal basis: Consent, Legitimate Interests, Performance of a Contract, Legal Obligations, and Vital Interests. More specifically, we may need to process your data or share your personal information in the following situations:  Business Transfers, Affiliates, Business Partners, Third-Party Service Providers (e.g., payment processors, hosting services, analytics providers).
              </p>

              <h2>4. How Long Do We Keep Your Information?</h2>
              <p>
                We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law.
              </p>

              <h2>5. How Do We Keep Your Information Safe?</h2>
              <p>
                We aim to protect your personal information through a system of organizational and technical security measures. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.  Encryption and access controls are security measures used to protect your information.
              </p>

              <h2>6. What Are Your Privacy Rights?</h2>
              <p>
                In some regions (like the EEA, UK, and Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. In certain circumstances, you may also have the right to object to the processing of your personal information.  Users can exercise these rights by contacting us at info @ xenvya.com.
              </p>

              <h2>7. Updates To This Notice</h2>
              <p>
                We may update this privacy notice from time to time. The updated version will be indicated by an updated &quot;Last Updated&quot; date and the updated version will be effective as soon as it is accessible. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.
              </p>

              <h2>8. How Can You Contact Us About This Notice?</h2>
              <p>
                If you have questions or comments about this notice, you may email us at info @ xenvya.com.
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
} 