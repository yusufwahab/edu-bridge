import React, { useState } from 'react';
import { Star, MapPin, Clock, DollarSign, Users, Video, MessageCircle, Filter, Search, Calendar } from 'lucide-react';

const StudyMarketplacePage = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [priceRange, setPriceRange] = useState('all');

  const tutors = [
    {
      id: 1,
      name: 'Chidi Okafor',
      subject: 'JAMB Mathematics',
      rating: 4.9,
      reviews: 89,
      price: 2000,
      location: 'Lagos',
      verified: true,
      avatar: 'CO',
      specialties: ['Algebra', 'Calculus', 'Statistics'],
      availability: 'Available now',
      sessions: 156,
      description: 'Expert JAMB Math tutor with 5+ years experience. 95% success rate.'
    },
    {
      id: 2,
      name: 'Amaka Nwankwo',
      subject: 'WAEC Physics',
      rating: 4.8,
      reviews: 67,
      price: 1500,
      location: 'Abuja',
      verified: true,
      avatar: 'AN',
      specialties: ['Mechanics', 'Waves', 'Electricity'],
      availability: 'Available today',
      sessions: 98,
      description: 'Physics graduate helping students excel in WAEC and JAMB.'
    },
    {
      id: 3,
      name: 'Tunde Adebayo',
      subject: 'JAMB Chemistry',
      rating: 4.7,
      reviews: 54,
      price: 1800,
      location: 'Ibadan',
      verified: false,
      avatar: 'TA',
      specialties: ['Organic', 'Inorganic', 'Physical'],
      availability: 'Available tomorrow',
      sessions: 72,
      description: 'Chemistry enthusiast with proven track record in JAMB prep.'
    }
  ];

  const learningRequests = [
    {
      id: 1,
      student: 'Kemi Adebayo',
      subject: 'JAMB English',
      topic: 'Comprehension and Summary',
      budget: 1000,
      deadline: '3 days',
      type: 'paid',
      description: 'Need help with JAMB English comprehension techniques and summary writing.',
      responses: 5
    },
    {
      id: 2,
      student: 'David Okon',
      subject: 'WAEC Biology',
      topic: 'Genetics and Heredity',
      budget: 0,
      deadline: '1 week',
      type: 'exchange',
      offer: 'Can teach JAMB Mathematics in return',
      description: 'Looking for help with genetics concepts. Can teach math in exchange.',
      responses: 3
    }
  ];

  const studyCircles = [
    {
      id: 1,
      name: 'JAMB Prep Circle',
      subject: 'Multi-subject',
      members: 8,
      maxMembers: 12,
      schedule: 'Saturdays 2-4 PM',
      price: 500,
      description: 'Weekly group study sessions covering all JAMB subjects',
      organizer: 'Chidi Okafor'
    },
    {
      id: 2,
      name: 'WAEC Science Circle',
      subject: 'Sciences',
      members: 6,
      maxMembers: 10,
      schedule: 'Sundays 10-12 PM',
      price: 300,
      description: 'Focus on Physics, Chemistry, and Biology for WAEC',
      organizer: 'Amaka Nwankwo'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Study Marketplace</h1>
              <p className="text-gray-600 mt-1">Find tutors, join study circles, exchange knowledge</p>
            </div>
            <button className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white px-6 py-3 rounded-lg hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 transition">
              Become a Tutor
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6 sm:mb-8 overflow-x-auto">
          {[
            { id: 'browse', label: 'Browse Tutors' },
            { id: 'requests', label: 'Learning Requests' },
            { id: 'circles', label: 'Study Circles' },
            { id: 'my-sessions', label: 'My Sessions' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-md transition ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Browse Tutors Tab */}
        {activeTab === 'browse' && (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tutors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Subjects</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="biology">Biology</option>
                  <option value="english">English</option>
                </select>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Prices</option>
                  <option value="0-1000">₦0 - ₦1,000</option>
                  <option value="1000-2000">₦1,000 - ₦2,000</option>
                  <option value="2000+">₦2,000+</option>
                </select>
                <button className="flex items-center justify-center space-x-2 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white px-4 py-2 rounded-lg hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 transition">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Tutor Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {tutors.map((tutor) => (
                <div key={tutor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{tutor.avatar}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
                          {tutor.verified && (
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{tutor.subject}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">₦{tutor.price.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">per session</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{tutor.rating}</span>
                      <span className="text-xs text-gray-500">({tutor.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{tutor.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{tutor.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {tutor.specialties.map((specialty, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>{tutor.availability}</span>
                    <span>{tutor.sessions} sessions</span>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white py-2 px-3 rounded-lg hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 transition text-sm">
                      Book Session
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                      <Video className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Learning Requests</h2>
              <button className="bg-gradient-to-br from-gray-800 via-blue-800 to-indigo-800 text-white px-4 py-2 rounded-lg hover:from-gray-700 hover:via-blue-700 hover:to-indigo-700 transition">
                Post Request
              </button>
            </div>

            {learningRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">{request.topic}</h3>
                    <p className="text-gray-600 text-sm">{request.subject} • by {request.student}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      request.type === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {request.type === 'paid' ? `₦${request.budget.toLocaleString()}` : 'Exchange'}
                    </span>
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                      {request.deadline}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{request.description}</p>

                {request.offer && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-blue-800 text-sm"><strong>Offering:</strong> {request.offer}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{request.responses} responses</span>
                  <button className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white px-4 py-2 rounded-lg hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 transition">
                    Respond
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Study Circles Tab */}
        {activeTab === 'circles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">Study Circles</h2>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                Create Circle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studyCircles.map((circle) => (
                <div key={circle.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">{circle.name}</h3>
                      <p className="text-gray-600 text-sm">{circle.subject}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">₦{circle.price.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">per session</div>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4">{circle.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{circle.members}/{circle.maxMembers}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{circle.schedule}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">by {circle.organizer}</span>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                      Join Circle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Sessions Tab */}
        {activeTab === 'my-sessions' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">No Sessions Yet</h3>
            <p className="text-gray-600 mb-6">Book your first tutoring session or join a study circle to get started.</p>
            <button className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white px-6 py-3 rounded-lg hover:from-gray-800 hover:via-blue-800 hover:to-indigo-800 transition">
              Browse Tutors
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMarketplacePage;