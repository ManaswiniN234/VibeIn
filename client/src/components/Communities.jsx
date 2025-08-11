import React from 'react';
import { 
  Gamepad2, 
  Camera, 
  Music, 
  Book, 
  Dumbbell, 
  Code, 
  Palette, 
  Utensils,
  Users
} from 'lucide-react';

const Communities = () => {
  const communities = [
    {
      icon: Gamepad2,
      name: 'Gaming',
      members: '12K+',
      description: 'From casual mobile games to competitive esports',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Camera,
      name: 'Photography',
      members: '8K+',
      description: 'Capture memories and share your perspective',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Music,
      name: 'Music',
      members: '15K+',
      description: 'Musicians, singers, and music enthusiasts',
      color: 'from-teal-400 to-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      icon: Book,
      name: 'Book Clubs',
      members: '6K+',
      description: 'Discuss literature and discover new reads',
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Dumbbell,
      name: 'Fitness',
      members: '10K+',
      description: 'Workout buddies and fitness motivation',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Code,
      name: 'Tech & Coding',
      members: '18K+',
      description: 'Developers, programmers, and tech enthusiasts',
      color: 'from-indigo-400 to-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      icon: Palette,
      name: 'Arts & Design',
      members: '9K+',
      description: 'Creative minds and artistic expression',
      color: 'from-pink-400 to-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      icon: Utensils,
      name: 'Food & Cooking',
      members: '7K+',
      description: 'Foodies, chefs, and culinary adventures',
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <section id="communities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Popular
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Communities
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover thriving communities where students with shared interests come together to connect, 
            learn, and have fun.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {communities.map((community, index) => {
            const IconComponent = community.icon;
            return (
              <div
                key={index}
                className={`${community.bgColor} p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${community.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">{community.members}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {community.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {community.description}
                </p>
                
                <button className="mt-4 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors duration-200">
                  Explore →
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">Can't find what you're looking for?</p>
          <button className="text-purple-600 hover:text-purple-700 font-semibold transition-colors duration-200">
            Browse All Communities →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Communities;