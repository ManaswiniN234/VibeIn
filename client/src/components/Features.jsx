import React from 'react';
import { Users, MapPin, Heart, Zap, Shield, Smartphone } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Users,
      title: 'Find Your People',
      description: 'Connect with students who share your interests, hobbies, and academic pursuits.',
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: MapPin,
      title: 'Local Communities',
      description: 'Discover communities and events happening right in your city and campus.',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Heart,
      title: 'Interest Matching',
      description: 'Our smart algorithm matches you with communities based on your preferences.',
      color: 'from-teal-400 to-teal-600',
    },
    {
      icon: Zap,
      title: 'Instant Connect',
      description: 'Join conversations and meet new friends instantly with our seamless platform.',
      color: 'from-orange-400 to-orange-600',
    },
    {
      icon: Shield,
      title: 'Safe & Verified',
      description: 'All communities are verified and moderated to ensure a safe, welcoming environment.',
      color: 'from-green-400 to-green-600',
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Access your communities anywhere with our mobile-optimized experience.',
      color: 'from-pink-400 to-pink-600',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Why Students Love
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              VibeIn
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're building more than just an app – we're creating a movement that transforms 
            how college students connect and build meaningful relationships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <div className="relative">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;