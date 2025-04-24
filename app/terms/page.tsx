import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function TermsOfServicePage() {
  const lastUpdated = "October 26, 2023"; // Update this date

  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20"> {/* Adjust padding for fixed navbar */}

        {/* Header Section */}
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Terms of Service
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
              <h2>1. Agreement to Terms</h2>
              <p>
                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and [Your Company Name] (“we,” “us” or “our”), concerning your access to and use of the [Your Website URL] website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “Site” and the &quot;Services&quot;).
              </p>
              <p>
                You agree that by accessing the Services, you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the Services and you must discontinue use immediately.
              </p>

              <h2>2. Use of Our Service</h2>
              <p>
                We grant you a limited, non-exclusive, non-transferable, and revocable license to use our Service, subject to the Terms. You agree not to use the Service for any purpose that is illegal or prohibited by these Terms.
              </p>
              <p>
                [Add specific conditions of use, e.g., eligibility requirements, acceptable use policies].
              </p>

              <h2>3. User Accounts</h2>
              <p>
                When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>
              <p>
                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.
              </p>

              <h2>4. Intellectual Property Rights</h2>
              <p>
                Unless otherwise indicated, the Services are our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
              </p>
              <p>
                Except as expressly provided in these Terms of Service, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
              </p>

              <h2>5. User Content</h2>
              <p>
                You may be able to submit content, including text, documents, images, and other materials (&quot;User Content&quot;) to the Service. You retain ownership of your User Content, but you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute your User Content in connection with providing and promoting the Service.
              </p>
              <p>
                [Add details about responsibility for User Content, prohibited content, rights we have over User Content].
              </p>

              <h2>6. Prohibited Activities</h2>
              <p>
                You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
              </p>
              <p>
                [List specific prohibited activities, e.g., scraping data, interfering with security features, unauthorized framing, attempting to impersonate another user, harassing employees, etc.].
              </p>

              <h2>7. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
              <p>
                If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party, even if you may be acting on behalf of the third party.
              </p>

              <h2>8. Disclaimers</h2>
              <p>
                THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                [Add further disclaimers as relevant, e.g., regarding accuracy of information, availability, security].
              </p>

              <h2>9. Limitation of Liability</h2>
              <p>
                IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </p>
              <p>
                [Include any specific limitations or exceptions as required by law or desired].
              </p>

              <h2>10. Governing Law</h2>
              <p>
                These Terms of Service and your use of the Services are governed by and construed in accordance with the laws of the State of [Your State/Jurisdiction], without regard to its conflict of law principles.
              </p>

              <h2>11. Changes to These Terms</h2>
              <p>
                We reserve the right, in our sole discretion, to make changes or modifications to these Terms of Service at any time and for any reason. We will alert you about any changes by updating the “Last updated” date of these Terms of Service, and you waive any right to receive specific notice of each such change.
              </p>

              <h2>12. Contact Us</h2>
              <p>
                In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:
              </p>
              <p>
                Email: [Your Contact Email Address]<br />
                Address:<br />
                [Your Company Name]<br />
                [Your Company Address Line 1]<br />
                [Your Company Address Line 2]<br />
                [City, State, Zip Code]<br />
                [Country]
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
} 