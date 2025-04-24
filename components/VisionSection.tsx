'use client'
import { motion } from 'framer-motion'
import { EyeIcon, LightBulbIcon, UsersIcon } from '@heroicons/react/24/outline'

export default function VisionSection() {
  const pillars = [
    {
      icon: <EyeIcon className="w-8 h-8" />,
      title: "Demystify Pre-Solicitation",
      description: "Cut through the noise of SAM.gov. We use AI to find the Sources Sought notices most relevant to your business.",
      color: "blue"
    },
    {
      icon: <LightBulbIcon className="w-8 h-8" />,
      title: "Provide Strategic Insight",
      description: "Go beyond simple notifications. Understand requirements, analyze fit, and get AI assistance drafting compelling responses.",
      color: "green"
    },
    {
      icon: <UsersIcon className="w-8 h-8" />,
      title: "Empower Small Businesses",
      description: "Give smaller contractors the tools and intelligence typically reserved for larger firms, fostering fair competition.",
      color: "purple"
    }
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      border: "border-blue-200",
      shadow: "shadow-blue-100"
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-600",
      border: "border-green-200",
      shadow: "shadow-green-100"
    },
    purple: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      border: "border-purple-200",
      shadow: "shadow-purple-100"
    }
  };

  return (
    <section className="relative py-24 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-32 text-blue-100 transform rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor"></path>
        </svg>
        
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gradient-to-tr from-purple-200 to-purple-300 rounded-full opacity-20 blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Our Core Vision
            </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            We aim to level the playing field by making pre-solicitation intelligence accessible and actionable for all federal contractors.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {pillars.map((pillar, index) => {
            const colors = colorClasses[pillar.color as keyof typeof colorClasses];
            
            return (
              <motion.div 
                key={index}
                className={`text-center p-8 bg-white rounded-2xl shadow-lg border ${colors.border}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <motion.div 
                  className={`inline-flex items-center justify-center w-16 h-16 mb-6 ${colors.bg} ${colors.text} rounded-full mx-auto`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  {pillar.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{pillar.title}</h3>
                <p className="text-gray-600">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  )
} 