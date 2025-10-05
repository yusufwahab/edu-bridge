import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Globe, Smartphone, CheckCircle, Star, ArrowRight, Menu, X, Play, Download, Target, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import YabvilPrepLogo from './Yabvilprep-logo.png'

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const navigate = useNavigate();

  const testimonials = [
    {
      name: "Fatima A.",
      role: "UTME Candidate",
      text: "YabvilPrep helped me pass UTME on my first try! The offline feature was a game-changer since I don't have constant internet access.",
      rating: 5
    },
    {
      name: "David O.",
      role: "WAEC Student",
      text: "The local language translation made understanding complex topics so much easier. My grades improved significantly!",
      rating: 5
    },
    {
      name: "Mrs. Sarah M.",
      role: "Parent",
      text: "Finally, an affordable solution for quality exam prep. My son's confidence has grown tremendously since using YabvilPrep.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: <Download className="w-6 h-6" />,
      title: "Offline Access",
      description: "Study anywhere, anytime - even without internet connectivity"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Local Language Support",
      description: "Break language barriers with native language translations"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Study Plans",
      description: "AI-powered study schedules tailored to your exam goals"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Interactive Quizzes",
      description: "Convert your notes into engaging quizzes automatically"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Mock Exams",
      description: "Practice with real WAEC/UTME past questions and get instant feedback"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics and insights"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <img src={YabvilPrepLogo} alt='Logo' />
              </div>
              <span className="text-2xl font-bold text-gray-900">YabvilPrep</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('problem')} className="text-gray-600 hover:text-blue-600 transition-colors">Problem</button>
              <button onClick={() => scrollToSection('solution')} className="text-gray-600 hover:text-blue-600 transition-colors">Solution</button>
              <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-blue-600 transition-colors">Features</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-blue-600 transition-colors">Reviews</button>
              <button onClick={() => {
                navigate('./login')
              } } className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300">
                Get Started
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button onClick={() => scrollToSection('problem')} className="block px-3 py-2 text-gray-600 hover:text-blue-600">Problem</button>
              <button onClick={() => scrollToSection('solution')} className="block px-3 py-2 text-gray-600 hover:text-blue-600">Solution</button>
              <button onClick={() => scrollToSection('features')} className="block px-3 py-2 text-gray-600 hover:text-blue-600">Features</button>
              <button onClick={() => scrollToSection('testimonials')} className="block px-3 py-2 text-gray-600 hover:text-blue-600">Reviews</button>
              <button onClick={ () => {navigate('./login')}} className="block w-full text-left px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg mt-2">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Bridging the gap in 
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> student learning</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Access quality education resources, practice with real exam questions, and prepare for WAEC/UTME success - even offline.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={ () => {navigate('./login')}}  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2">
                  <span>Start Learning Free</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>

              <div className="flex items-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>10,000+ Students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>500+ Lessons</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>95% Success Rate</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-2xl p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Today's Progress</h3>
                      <p className="text-sm text-gray-500">Mathematics - Algebra</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Lesson Completion</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full w-[85%]"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600">12</div>
                      <div className="text-xs text-gray-600">Quizzes Completed</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-600">8</div>
                      <div className="text-xs text-gray-600">Days Streak</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">The Educational Crisis We're Solving</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Millions of students across Africa face significant barriers to quality education and exam preparation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Limited Internet Access</h3>
              <p className="text-gray-600">Many students can't access online resources due to poor connectivity or high data costs.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Poor Exam Preparation</h3>
              <p className="text-gray-600">Students lack access to quality past questions and effective study methods for WAEC/UTME.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Language Barriers</h3>
              <p className="text-gray-600">Complex study materials in foreign languages hinder student comprehension.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expensive Resources</h3>
              <p className="text-gray-600">Quality educational materials and tutoring are often too expensive for many families.</p>
            </div>
          </div>

          {/* Student Story */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Meet Fatima's Challenge</h3>
              <p className="text-lg opacity-90 leading-relaxed">
                "I want to pass my UTME exam and get into university, but I can't afford daily data to study online. 
                The textbooks are expensive, and the local tutorial center is too far from home. 
                How can I compete with students who have better resources?"
              </p>
              <p className="mt-4 text-blue-200">- A story shared by thousands of students across Nigeria</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Solution: YabvilPrep</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive mobile and web platform that makes quality education accessible to every student, 
              regardless of their location or economic background.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Download className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Offline-First Learning</h3>
                    <p className="text-gray-600">Download tutorials, quizzes, and past questions to study anytime, anywhere - no internet required.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Quiz Generation</h3>
                    <p className="text-gray-600">Automatically convert your notes into interactive quizzes using AI technology.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Local Language Support</h3>
                    <p className="text-gray-600">Break language barriers with translations in Hausa, Yoruba, Igbo, and other local languages.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Study Plans</h3>
                    <p className="text-gray-600">Get customized study schedules and mock tests tailored to your exam goals and learning pace.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8">
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">WAEC Past Questions</h3>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700">Mathematics (2020-2024)</p>
                        <p className="text-xs text-gray-500">Available Offline • 150 Questions</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700">English Language</p>
                        <p className="text-xs text-gray-500">With Audio Support • 200 Questions</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">Language: Hausa</h3>
                    </div>
                    <p className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
                      "Kimiyyar lissafi tana nufin..." (Mathematics means...)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Powerful Features for Every Student</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to succeed in your exams, designed with African students in mind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-login-y-1">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Students Are Saying</h2>
            <p className="text-xl text-gray-600">Join thousands of students who have improved their results with YabvilPrep</p>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl text-gray-700 italic mb-6 leading-relaxed max-w-4xl mx-auto">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{testimonials[currentTestimonial].name}</p>
                  <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl opacity-90 max-w-4xl mx-auto leading-relaxed mb-8">
            YabvilPrep isn't just an app, it's a bridge to brighter futures. We believe every student deserves access to quality education, 
            regardless of their background or location. Our mission is to democratize learning and help millions of African students 
            achieve their academic dreams.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">2M+</div>
              <p className="opacity-90">Potential WAEC/UTME candidates yearly</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">60%</div>
              <p className="opacity-90">Mobile phone adoption growth in Africa</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">95%</div>
              <p className="opacity-90">Student satisfaction rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Bridge Your Learning Gap?</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Join thousands of students who are already improving their exam results with YabvilPrep. 
            Start your journey to academic success today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button onClick={ () => {navigate('./login')}} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2">
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
              Learn More
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Free basic features • Premium plans starting at ₦500/month • No commitment required
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">YabvilPrep</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Bridging the gap in student learning and exam preparation across Africa.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-gray-400">
                <p>Features</p>
                <p>Pricing</p>
                <p>Mobile App</p>
                <p>Offline Mode</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-gray-400">
                <p>Help Center</p>
                <p>Contact Us</p>
                <p>Study Guides</p>
                <p>Community</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-gray-400">
                <p>About Us</p>
                <p>Careers</p>
                <p>Privacy Policy</p>
                <p>Terms of Service</p>
                <p>yusufabdulwhab@gmail.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 YabvilPrep. All rights reserved. Abdulwahab Boluwatife Yusuf.</p>
          </div>
        </div>s
      </footer>
    </div>
  );
};

export default LandingPage;