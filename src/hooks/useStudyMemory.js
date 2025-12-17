import { useState, useEffect } from 'react';

export const useStudyMemory = () => {
  const [memory, setMemory] = useState({
    conversations: [],
    struggledTopics: [],
    masteredTopics: [],
    studyPatterns: {
      bestTime: null,
      averageDuration: 0,
      frequency: 0,
      lastSession: null
    },
    stats: {
      totalSessions: 0,
      totalTime: 0,
      improvementRate: 0
    }
  });

  useEffect(() => {
    const stored = localStorage.getItem('studyMemory');
    if (stored) {
      setMemory(JSON.parse(stored));
    }
  }, []);

  const saveMemory = (newMemory) => {
    setMemory(newMemory);
    localStorage.setItem('studyMemory', JSON.stringify(newMemory));
  };

  const addConversation = (topic, question, response, performance = null) => {
    const conversation = {
      id: Date.now(),
      topic,
      question,
      response,
      performance,
      timestamp: new Date().toISOString(),
      date: new Date().toDateString()
    };

    const newMemory = {
      ...memory,
      conversations: [conversation, ...memory.conversations.slice(0, 19)]
    };

    if (performance !== null) {
      if (performance < 60) {
        addStruggledTopic(topic, performance);
      } else if (performance > 80) {
        addMasteredTopic(topic, performance);
      }
    }

    saveMemory(newMemory);
  };

  const addStruggledTopic = (topic, score) => {
    const existing = memory.struggledTopics.find(t => t.topic === topic);
    const newMemory = { ...memory };

    if (existing) {
      existing.attempts++;
      existing.lastScore = score;
      existing.lastAttempt = new Date().toISOString();
    } else {
      newMemory.struggledTopics.push({
        topic,
        attempts: 1,
        firstScore: score,
        lastScore: score,
        firstAttempt: new Date().toISOString(),
        lastAttempt: new Date().toISOString()
      });
    }

    saveMemory(newMemory);
  };

  const addMasteredTopic = (topic, score) => {
    const newMemory = { ...memory };
    const existing = newMemory.masteredTopics.find(t => t.topic === topic);

    if (!existing) {
      newMemory.masteredTopics.push({
        topic,
        score,
        masteredAt: new Date().toISOString()
      });
    }

    newMemory.struggledTopics = newMemory.struggledTopics.filter(t => t.topic !== topic);
    saveMemory(newMemory);
  };

  const getPersonalizedGreeting = () => {
    const { conversations } = memory;
    
    if (conversations.length === 0) {
      return "Welcome to YabvilPrep! I'm your Study Buddy AI. What would you like to learn today?";
    }

    const lastConversation = conversations[0];
    const daysSinceLastSession = Math.floor(
      (new Date() - new Date(lastConversation.timestamp)) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastSession === 0) {
      return `Welcome back! You were working on ${lastConversation.topic} earlier. Ready to continue?`;
    } else if (daysSinceLastSession === 1) {
      return `Good to see you again! Yesterday you studied ${lastConversation.topic}. What's on your mind today?`;
    } else {
      const recentTopics = [...new Set(conversations.slice(0, 5).map(c => c.topic))];
      return `Welcome back! You've been focusing on ${recentTopics.slice(0, 2).join(' and ')} recently. Let's keep going!`;
    }
  };

  const getProactiveSuggestions = () => {
    const suggestions = [];
    const { struggledTopics, masteredTopics } = memory;

    struggledTopics.forEach(topic => {
      const daysSinceLastAttempt = Math.floor(
        (new Date() - new Date(topic.lastAttempt)) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastAttempt >= 3) {
        suggestions.push({
          type: 'review',
          message: `You struggled with ${topic.topic} last week. Want to review before moving forward?`,
          topic: topic.topic,
          priority: 'high'
        });
      }
    });

    masteredTopics.forEach(topic => {
      const daysSinceMastered = Math.floor(
        (new Date() - new Date(topic.masteredAt)) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceMastered >= 7) {
        suggestions.push({
          type: 'advance',
          message: `You mastered ${topic.topic}! Ready for more advanced concepts?`,
          topic: topic.topic,
          priority: 'medium'
        });
      }
    });

    return suggestions.slice(0, 3);
  };

  const getProgressCelebrations = () => {
    const celebrations = [];
    const { stats, masteredTopics, struggledTopics } = memory;

    if (stats.totalSessions > 0 && stats.totalSessions % 10 === 0) {
      celebrations.push({
        type: 'milestone',
        message: `🎉 Congratulations! You've completed ${stats.totalSessions} study sessions!`,
        achievement: `${stats.totalSessions} Sessions`
      });
    }

    struggledTopics.forEach(topic => {
      if (topic.attempts > 1) {
        const improvement = topic.lastScore - topic.firstScore;
        if (improvement >= 20) {
          celebrations.push({
            type: 'improvement',
            message: `📈 Amazing! You've improved ${improvement}% in ${topic.topic}!`,
            achievement: `${improvement}% Improvement`
          });
        }
      }
    });

    return celebrations;
  };

  const getContextForAI = () => {
    const { conversations, struggledTopics, masteredTopics } = memory;
    
    const recentConversations = conversations.slice(0, 5).map(c => ({
      topic: c.topic,
      question: c.question,
      performance: c.performance,
      date: c.date
    }));

    return {
      recentTopics: recentConversations,
      struggledAreas: struggledTopics.map(t => ({ topic: t.topic, attempts: t.attempts })),
      masteredAreas: masteredTopics.map(t => t.topic),
      totalSessions: memory.stats.totalSessions
    };
  };

  return {
    memory,
    addConversation,
    getPersonalizedGreeting,
    getProactiveSuggestions,
    getProgressCelebrations,
    getContextForAI
  };
};

export default useStudyMemory;