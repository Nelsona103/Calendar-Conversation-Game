import React, { useState, useEffect } from 'react';
import { Calendar, Volume2, HelpCircle, Star, Zap, Target, Flame, Trophy, CheckCircle, XCircle, Plus, Edit, BarChart3, Download, Eye } from 'lucide-react';

const CalendarVerbGame = () => {
  // Game state
  const [gamePhase, setGamePhase] = useState('setup'); // setup, playing, finished
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 or 2
  const [currentRole, setCurrentRole] = useState('asking'); // asking or answering
  const [selectedDay, setSelectedDay] = useState(null);
  const [player1Calendar, setPlayer1Calendar] = useState({});
  const [player2Calendar, setPlayer2Calendar] = useState({});
  const [round, setRound] = useState(1);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [streak, setStreak] = useState(0);
  const [showScaffold, setShowScaffold] = useState(true);
  const [difficulty, setDifficulty] = useState(1);
  const [achievements, setAchievements] = useState([]);
  const [tempAchievement, setTempAchievement] = useState(null);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [questionTargets, setQuestionTargets] = useState([]);

  // New states for custom activities
  const [customActivities, setCustomActivities] = useState([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customActivityForm, setCustomActivityForm] = useState({
    emoji: '',
    verb: '',
    past: '',
    present: '',
    type: 'regular'
  });

  // Phase 2: Adaptive Scaffolding States
  const [errorTracking, setErrorTracking] = useState({
    irregularVerbs: { attempts: 0, errors: 0 },
    pastTense: { attempts: 0, errors: 0 },
    presentTense: { attempts: 0, errors: 0 },
    futureTense: { attempts: 0, errors: 0 },
    temporalExpressions: { attempts: 0, errors: 0 },
    culturalActivities: { attempts: 0, errors: 0 }
  });
  const [showAdaptiveHint, setShowAdaptiveHint] = useState(false);
  const [adaptiveHintContent, setAdaptiveHintContent] = useState('');
  const [adaptiveSupport, setAdaptiveSupport] = useState({
    irregularVerbHighlight: false,
    extraScaffolding: false,
    simplifiedInstructions: false,
    visualCues: false
  });
  const [strugglingConcepts, setStrugglingConcepts] = useState([]);

  // Phase 3: Learning Analytics States
  const [analyticsData, setAnalyticsData] = useState([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [sessionAnalytics, setSessionAnalytics] = useState({
    totalQuestions: 0,
    conceptDifficulty: {},
    temporalPatterns: {},
    verbTypePerformance: {},
    culturalVsRegularPerformance: { cultural: { correct: 0, total: 0 }, regular: { correct: 0, total: 0 } },
    timeSpentPerQuestion: [],
    commonErrorPatterns: [],
    sessionStartTime: null,
    sessionEndTime: null
  });

  // Enhanced activities with more Mexican/Latino cultural activities
  const activities = [
    // Daily activities
    { id: 1, emoji: '🚶', verb: 'walk to school', past: 'walked to school', present: 'walking to school', type: 'regular', category: 'daily' },
    { id: 2, emoji: '🏃', verb: 'run', past: 'ran', present: 'running', type: 'irregular', category: 'daily' },
    { id: 3, emoji: '🍳', verb: 'cook breakfast', past: 'cooked breakfast', present: 'cooking breakfast', type: 'regular', category: 'daily' },
    { id: 4, emoji: '🍽️', verb: 'eat lunch', past: 'ate lunch', present: 'eating lunch', type: 'irregular', category: 'daily' },
    { id: 5, emoji: '📚', verb: 'do homework', past: 'did homework', present: 'doing homework', type: 'irregular', category: 'school' },
    { id: 6, emoji: '📖', verb: 'read', past: 'read', present: 'reading', type: 'irregular', category: 'school' },
    { id: 7, emoji: '✏️', verb: 'write', past: 'wrote', present: 'writing', type: 'irregular', category: 'school' },
    { id: 28, emoji: '🚌', verb: 'ride the bus', past: 'rode the bus', present: 'riding the bus', type: 'irregular', category: 'daily' },

    // Mexican/Latino Cultural Activities - NEW!
    { id: 31, emoji: '🎊', verb: 'go to quinceañera', past: 'went to quinceañera', present: 'going to quinceañera', type: 'irregular', category: 'cultural' },
    { id: 32, emoji: '💀', verb: 'celebrate Día de los Muertos', past: 'celebrated Día de los Muertos', present: 'celebrating Día de los Muertos', type: 'regular', category: 'cultural' },
    { id: 33, emoji: '🏪', verb: 'go to mercado', past: 'went to mercado', present: 'going to mercado', type: 'irregular', category: 'cultural' },
    { id: 34, emoji: '👨‍👩‍👧‍👦', verb: 'visit family in Mexico', past: 'visited family in Mexico', present: 'visiting family in Mexico', type: 'regular', category: 'cultural' },
    { id: 35, emoji: '🌯', verb: 'make burritos', past: 'made burritos', present: 'making burritos', type: 'irregular', category: 'cultural' },
    { id: 36, emoji: '⛪', verb: 'go to misa', past: 'went to misa', present: 'going to misa', type: 'irregular', category: 'cultural' },
    { id: 37, emoji: '🎺', verb: 'listen to mariachi', past: 'listened to mariachi', present: 'listening to mariachi', type: 'regular', category: 'cultural' },
    { id: 38, emoji: '🕯️', verb: 'light candles for abuela', past: 'lit candles for abuela', present: 'lighting candles for abuela', type: 'irregular', category: 'cultural' },
    { id: 39, emoji: '🎭', verb: 'watch telenovela', past: 'watched telenovela', present: 'watching telenovela', type: 'regular', category: 'cultural' },
    { id: 40, emoji: '🌮', verb: 'make tacos al pastor', past: 'made tacos al pastor', present: 'making tacos al pastor', type: 'irregular', category: 'cultural' },
    { id: 41, emoji: '💃', verb: 'dance cumbia', past: 'danced cumbia', present: 'dancing cumbia', type: 'regular', category: 'cultural' },
    { id: 42, emoji: '🎉', verb: 'celebrate bautizo', past: 'celebrated bautizo', present: 'celebrating bautizo', type: 'regular', category: 'cultural' },
    { id: 43, emoji: '🏠', verb: 'send money to familia', past: 'sent money to familia', present: 'sending money to familia', type: 'irregular', category: 'cultural' },
    { id: 44, emoji: '📞', verb: 'call Mexico', past: 'called Mexico', present: 'calling Mexico', type: 'regular', category: 'cultural' },
    { id: 45, emoji: '🎄', verb: 'break piñata', past: 'broke piñata', present: 'breaking piñata', type: 'irregular', category: 'cultural' },
    { id: 46, emoji: '🌺', verb: 'make altar for Día de los Muertos', past: 'made altar for Día de los Muertos', present: 'making altar for Día de los Muertos', type: 'irregular', category: 'cultural' },

    // Family & Cultural (existing)
    { id: 8, emoji: '👵🏼', verb: 'visit grandma', past: 'visited grandma', present: 'visiting grandma', type: 'regular', category: 'family' },
    { id: 9, emoji: '🫔', verb: 'make tamales', past: 'made tamales', present: 'making tamales', type: 'irregular', category: 'family' },
    { id: 10, emoji: '🌮', verb: 'eat tacos', past: 'ate tacos', present: 'eating tacos', type: 'irregular', category: 'family' },
    { id: 11, emoji: '🎉', verb: 'go to party', past: 'went to party', present: 'going to party', type: 'irregular', category: 'family' },
    { id: 12, emoji: '⛪', verb: 'go to church', past: 'went to church', present: 'going to church', type: 'irregular', category: 'family' },
    { id: 13, emoji: '🎂', verb: 'celebrate birthday', past: 'celebrated birthday', present: 'celebrating birthday', type: 'regular', category: 'family' },
    { id: 27, emoji: '🍕', verb: 'order pizza', past: 'ordered pizza', present: 'ordering pizza', type: 'regular', category: 'family' },

    // Sports & Fun
    { id: 14, emoji: '⚽', verb: 'play soccer', past: 'played soccer', present: 'playing soccer', type: 'regular', category: 'sports' },
    { id: 15, emoji: '🏀', verb: 'play basketball', past: 'played basketball', present: 'playing basketball', type: 'regular', category: 'sports' },
    { id: 16, emoji: '🎮', verb: 'play video games', past: 'played video games', present: 'playing video games', type: 'regular', category: 'sports' },
    { id: 17, emoji: '💃', verb: 'dance', past: 'danced', present: 'dancing', type: 'regular', category: 'sports' },
    { id: 18, emoji: '📱', verb: 'text friends', past: 'texted friends', present: 'texting friends', type: 'regular', category: 'sports' },
    { id: 19, emoji: '📺', verb: 'watch TV', past: 'watched TV', present: 'watching TV', type: 'regular', category: 'sports' },
    { id: 29, emoji: '🎵', verb: 'listen to music', past: 'listened to music', present: 'listening to music', type: 'regular', category: 'sports' },
    { id: 30, emoji: '⚾', verb: 'play baseball', past: 'played baseball', present: 'playing baseball', type: 'regular', category: 'sports' },

    // Chores & Responsibilities
    { id: 20, emoji: '🏠', verb: 'clean house', past: 'cleaned house', present: 'cleaning house', type: 'regular', category: 'chores' },
    { id: 21, emoji: '🐕', verb: 'walk the dog', past: 'walked the dog', present: 'walking the dog', type: 'regular', category: 'chores' },
    { id: 22, emoji: '👶', verb: 'babysit', past: 'babysat', present: 'babysitting', type: 'irregular', category: 'chores' },
    { id: 23, emoji: '🛒', verb: 'go shopping', past: 'went shopping', present: 'going shopping', type: 'irregular', category: 'chores' },
    { id: 24, emoji: '🚗', verb: 'wash the car', past: 'washed the car', present: 'washing the car', type: 'regular', category: 'chores' },
    { id: 25, emoji: '🧹', verb: 'sweep', past: 'swept', present: 'sweeping', type: 'irregular', category: 'chores' },
    { id: 26, emoji: '🧺', verb: 'do laundry', past: 'did laundry', present: 'doing laundry', type: 'irregular', category: 'chores' }
  ];

  // Load custom activities from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('calendarGameCustomActivities');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCustomActivities(parsed);
      } catch (error) {
        console.log('Error loading custom activities:', error);
      }
    }
  }, []);

  // Save custom activities to localStorage whenever they change
  useEffect(() => {
    if (customActivities.length > 0) {
      localStorage.setItem('calendarGameCustomActivities', JSON.stringify(customActivities));
    }
  }, [customActivities]);

  // Combine default and custom activities
  const getAllActivities = () => {
    return [...activities, ...customActivities];
  };

  // Generate calendar dates
  const generateCalendarDates = () => {
    const today = new Date();
    const dates = [];

    // Get the start of this week (Sunday)
    const thisWeekStart = new Date(today);
    const currentDay = thisWeekStart.getDay();
    thisWeekStart.setDate(thisWeekStart.getDate() - currentDay); // Go back to Sunday of this week
    thisWeekStart.setHours(0, 0, 0, 0);

    // Get the start of last week (Sunday)
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    // Get the start of next week (Sunday)
    const nextWeekStart = new Date(thisWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);

    // Start from two weeks ago (for context)
    const startDate = new Date(lastWeekStart);
    startDate.setDate(startDate.getDate() - 7);

    // Generate 5 weeks of dates (35 days total)
    for (let i = 0; i < 35; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      // Determine which week this date belongs to
      let week = 'other';
      if (date >= lastWeekStart && date < thisWeekStart) {
        week = 'last';
      } else if (date >= thisWeekStart && date < nextWeekStart) {
        week = 'this';
      } else if (date >= nextWeekStart) {
        week = 'next';
      }

      // Check if this is today
      const isToday = date.toDateString() === today.toDateString();

      dates.push({
        date: date,
        week: week,
        isToday: isToday,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate()
      });
    }

    return dates;
  };

  const calendarDates = generateCalendarDates();

  // Pre-fill calendars with random activities (now includes custom activities)
  const prefillCalendar = () => {
    const newCalendar = {};
    const allActivities = getAllActivities();
    const shuffledActivities = [...allActivities].sort(() => Math.random() - 0.5);

    calendarDates.forEach((dateInfo, index) => {
      const dateKey = dateInfo.date.toISOString().split('T')[0];
      // Use modulo to cycle through activities if we have more dates than activities
      newCalendar[dateKey] = shuffledActivities[index % shuffledActivities.length];
    });

    return newCalendar;
  };

  // Initialize calendars when component mounts or game restarts
  useEffect(() => {
    if (gamePhase === 'setup') {
      setPlayer1Calendar(prefillCalendar());
      setPlayer2Calendar(prefillCalendar());
    }
  }, [gamePhase, customActivities]); // Added customActivities dependency

  // Generate varied question targets at game start
  useEffect(() => {
    if (gamePhase === 'playing' && round === 1) {
      generateQuestionTargets();
    }
  }, [gamePhase]);

  // Handle custom activity form submission
  const handleCustomActivitySubmit = (e) => {
    e.preventDefault();

    if (!customActivityForm.emoji || !customActivityForm.verb || !customActivityForm.past || !customActivityForm.present) {
      alert('Please fill in all fields!');
      return;
    }

    if (customActivities.length >= 5) {
      alert('Maximum 5 custom activities allowed!');
      return;
    }

    const newActivity = {
      id: Date.now(), // Simple ID generation
      emoji: customActivityForm.emoji,
      verb: customActivityForm.verb.toLowerCase(),
      past: customActivityForm.past.toLowerCase(),
      present: customActivityForm.present.toLowerCase(),
      type: customActivityForm.type,
      category: 'custom'
    };

    setCustomActivities(prev => [...prev, newActivity]);
    setCustomActivityForm({ emoji: '', verb: '', past: '', present: '', type: 'regular' });
    setShowCustomModal(false);

    // Show achievement for adding custom activity
    showAchievement('✨ Custom Activity Added!');
  };

  // Delete custom activity
  const deleteCustomActivity = (id) => {
    setCustomActivities(prev => prev.filter(activity => activity.id !== id));
  };

  // Phase 2: Adaptive Scaffolding Functions

  // Track errors and adjust support
  const trackPerformance = (correct, activity, tense) => {
    const conceptsToTrack = [];

    // Determine which concepts to track
    if (activity && activity.type === 'irregular') {
      conceptsToTrack.push('irregularVerbs');
    }
    if (activity && activity.category === 'cultural') {
      conceptsToTrack.push('culturalActivities');
    }

    // Track tense-specific performance
    if (tense === 'past') conceptsToTrack.push('pastTense');
    else if (tense === 'present') conceptsToTrack.push('presentTense');
    else if (tense === 'future') conceptsToTrack.push('futureTense');

    // Complex temporal expressions (not just yesterday/tomorrow)
    const target = getCurrentQuestionTarget();
    if (target && target.label.includes('days') || target.label.includes('last') || target.label.includes('next')) {
      conceptsToTrack.push('temporalExpressions');
    }

    // Update error tracking
    setErrorTracking(prev => {
      const newTracking = { ...prev };
      conceptsToTrack.forEach(concept => {
        newTracking[concept] = {
          attempts: newTracking[concept].attempts + 1,
          errors: correct ? newTracking[concept].errors : newTracking[concept].errors + 1
        };
      });
      return newTracking;
    });

    // Determine struggling concepts and activate support
    updateAdaptiveSupport(conceptsToTrack, correct);
  };

  // Update adaptive support based on performance
  const updateAdaptiveSupport = (currentConcepts, wasCorrect) => {
    if (!wasCorrect) {
      // Analyze current error patterns
      setErrorTracking(current => {
        const strugglingList = [];

        // Check error rates for different concepts
        Object.entries(current).forEach(([concept, data]) => {
          if (data.attempts >= 3 && data.errors / data.attempts > 0.5) {
            strugglingList.push(concept);
          }
        });

        setStrugglingConcepts(strugglingList);

        // Activate adaptive support based on struggles
        setAdaptiveSupport({
          irregularVerbHighlight: strugglingList.includes('irregularVerbs'),
          extraScaffolding: strugglingList.includes('pastTense') || strugglingList.includes('temporalExpressions'),
          simplifiedInstructions: strugglingList.length >= 2,
          visualCues: strugglingList.includes('culturalActivities')
        });

        return current;
      });

      // Show contextual hint based on current struggle
      showContextualHint(currentConcepts);
    }
  };

  // Show adaptive hints based on specific struggles
  const showContextualHint = (concepts) => {
    let hintContent = '';

    if (concepts.includes('irregularVerbs')) {
      hintContent = '💡 Irregular Verb Tip: Remember, irregular verbs don\'t follow the -ed pattern. Examples: go→went, eat→ate, make→made';
    } else if (concepts.includes('pastTense')) {
      hintContent = '💡 Past Tense Tip: For past events, use the past form. Regular verbs add -ed, but watch out for irregular verbs!';
    } else if (concepts.includes('temporalExpressions')) {
      hintContent = '💡 Time Expression Tip: "Last Tuesday" = past, "Next Friday" = future, "In 3 days" = future';
    } else if (concepts.includes('culturalActivities')) {
      hintContent = '💡 Cultural Activity Tip: These are special events! Practice the verb forms: celebrate→celebrated, go to quinceañera→went to quinceañera';
    } else {
      hintContent = '💡 Keep practicing! Listen to the pronunciation and try to match the pattern.';
    }

    setAdaptiveHintContent(hintContent);
    setShowAdaptiveHint(true);

    // Hide hint after 4 seconds
    setTimeout(() => setShowAdaptiveHint(false), 4000);
  };

  // Get adaptive help examples based on current struggles
  const getAdaptiveHelpExamples = (tense) => {
    const examples = [];
    const isStruggling = (concept) => strugglingConcepts.includes(concept);

    if (tense === 'past') {
      if (isStruggling('irregularVerbs')) {
        examples.push('🔴 IRREGULAR: eat → ate, go → went, make → made');
        examples.push('🔴 IRREGULAR: break → broke, light → lit, read → read');
      }
      if (isStruggling('culturalActivities')) {
        examples.push('🎉 CULTURAL: celebrated quinceañera, went to mercado, made tamales');
      }
      if (!isStruggling('irregularVerbs') && !isStruggling('culturalActivities')) {
        examples.push('Regular: played soccer, cooked breakfast, cleaned house');
      }
    } else if (tense === 'present') {
      if (isStruggling('culturalActivities')) {
        examples.push('🎉 CULTURAL: celebrating Día de los Muertos, going to misa, making burritos');
      }
      examples.push('Add -ing: playing, eating, reading, dancing');
    } else if (tense === 'future') {
      if (isStruggling('temporalExpressions')) {
        examples.push('⏰ TIME: Tomorrow, I will... / Next Tuesday, I will... / In 3 days, I will...');
      }
      examples.push('Use base form: will play, will eat, will go, will make');
    }

    return examples.length > 0 ? examples : [`Practice ${tense} tense patterns`];
  };

  // Phase 3: Analytics Collection Functions

  // Load analytics data from localStorage
  useEffect(() => {
    const savedAnalytics = localStorage.getItem('calendarGameAnalytics');
    if (savedAnalytics) {
      try {
        const parsed = JSON.parse(savedAnalytics);
        setAnalyticsData(parsed);
      } catch (error) {
        console.log('Error loading analytics data:', error);
      }
    }
  }, []);

  // Initialize session analytics when game starts
  useEffect(() => {
    if (gamePhase === 'playing' && round === 1) {
      setSessionAnalytics(prev => ({
        ...prev,
        sessionStartTime: new Date().toISOString(),
        totalQuestions: 0,
        conceptDifficulty: {},
        temporalPatterns: {},
        verbTypePerformance: {},
        culturalVsRegularPerformance: { cultural: { correct: 0, total: 0 }, regular: { correct: 0, total: 0 } },
        timeSpentPerQuestion: [],
        commonErrorPatterns: []
      }));
    }
  }, [gamePhase, round]);

  // Collect analytics data during gameplay
  const collectAnalyticsData = (correct, activity, tense, questionTarget, timeSpent = 5000) => {
    const timestamp = new Date().toISOString();

    setSessionAnalytics(prev => {
      const updated = { ...prev };

      // Track total questions
      updated.totalQuestions += 1;

      // Track concept difficulty
      const conceptKey = tense || 'unknown';
      if (!updated.conceptDifficulty[conceptKey]) {
        updated.conceptDifficulty[conceptKey] = { correct: 0, total: 0, errorRate: 0 };
      }
      updated.conceptDifficulty[conceptKey].total += 1;
      if (correct) updated.conceptDifficulty[conceptKey].correct += 1;
      updated.conceptDifficulty[conceptKey].errorRate =
        ((updated.conceptDifficulty[conceptKey].total - updated.conceptDifficulty[conceptKey].correct) /
         updated.conceptDifficulty[conceptKey].total * 100).toFixed(1);

      // Track temporal patterns
      const temporalKey = questionTarget?.label || 'unknown';
      if (!updated.temporalPatterns[temporalKey]) {
        updated.temporalPatterns[temporalKey] = { correct: 0, total: 0, errorRate: 0 };
      }
      updated.temporalPatterns[temporalKey].total += 1;
      if (correct) updated.temporalPatterns[temporalKey].correct += 1;
      updated.temporalPatterns[temporalKey].errorRate =
        ((updated.temporalPatterns[temporalKey].total - updated.temporalPatterns[temporalKey].correct) /
         updated.temporalPatterns[temporalKey].total * 100).toFixed(1);

      // Track verb type performance
      const verbType = activity?.type || 'unknown';
      if (!updated.verbTypePerformance[verbType]) {
        updated.verbTypePerformance[verbType] = { correct: 0, total: 0, errorRate: 0 };
      }
      updated.verbTypePerformance[verbType].total += 1;
      if (correct) updated.verbTypePerformance[verbType].correct += 1;
      updated.verbTypePerformance[verbType].errorRate =
        ((updated.verbTypePerformance[verbType].total - updated.verbTypePerformance[verbType].correct) /
         updated.verbTypePerformance[verbType].total * 100).toFixed(1);

      // Track cultural vs regular activity performance
      const activityType = activity?.category === 'cultural' ? 'cultural' : 'regular';
      updated.culturalVsRegularPerformance[activityType].total += 1;
      if (correct) updated.culturalVsRegularPerformance[activityType].correct += 1;

      // Track time spent (simulated - in real implementation could track actual time)
      updated.timeSpentPerQuestion.push({
        question: updated.totalQuestions,
        timeMs: timeSpent,
        concept: conceptKey,
        correct: correct
      });

      // Track error patterns
      if (!correct && activity) {
        const errorPattern = {
          concept: conceptKey,
          verbType: verbType,
          temporalRef: temporalKey,
          activityCategory: activity.category,
          timestamp: timestamp
        };
        updated.commonErrorPatterns.push(errorPattern);
      }

      return updated;
    });
  };

  // Save session data to persistent analytics
  const saveSessionAnalytics = () => {
    const sessionEnd = new Date().toISOString();
    const sessionData = {
      ...sessionAnalytics,
      sessionEndTime: sessionEnd,
      sessionId: `session_${Date.now()}`,
      player1Name: player1Name || 'Player1',
      player2Name: player2Name || 'Player2',
      finalScores: score,
      customActivitiesUsed: customActivities.length,
      adaptiveSupportTriggered: strugglingConcepts.length > 0,
      strugglingConcepts: [...strugglingConcepts]
    };

    setAnalyticsData(prev => {
      const updated = [...prev, sessionData];
      // Keep only last 50 sessions to prevent storage bloat
      const trimmed = updated.slice(-50);
      localStorage.setItem('calendarGameAnalytics', JSON.stringify(trimmed));
      return trimmed;
    });
  };

  // Generate aggregated insights across all sessions
  const generateTeacherInsights = () => {
    if (analyticsData.length === 0) return null;

    const insights = {
      totalSessions: analyticsData.length,
      totalQuestions: analyticsData.reduce((sum, session) => sum + session.totalQuestions, 0),
      overallPerformance: {},
      mostChallengingConcepts: [],
      mostChallengingTemporalExpressions: [],
      irregularVsRegularPerformance: { irregular: { correct: 0, total: 0 }, regular: { correct: 0, total: 0 } },
      culturalActivityPerformance: { correct: 0, total: 0 },
      commonErrorPatterns: [],
      adaptiveSupportUsage: analyticsData.filter(s => s.adaptiveSupportTriggered).length
    };

    // Aggregate concept difficulty across sessions
    const conceptAggregation = {};
    const temporalAggregation = {};
    const verbTypeAggregation = {};

    analyticsData.forEach(session => {
      // Aggregate concepts
      Object.entries(session.conceptDifficulty || {}).forEach(([concept, data]) => {
        if (!conceptAggregation[concept]) {
          conceptAggregation[concept] = { correct: 0, total: 0 };
        }
        conceptAggregation[concept].correct += data.correct;
        conceptAggregation[concept].total += data.total;
      });

      // Aggregate temporal patterns
      Object.entries(session.temporalPatterns || {}).forEach(([temporal, data]) => {
        if (!temporalAggregation[temporal]) {
          temporalAggregation[temporal] = { correct: 0, total: 0 };
        }
        temporalAggregation[temporal].correct += data.correct;
        temporalAggregation[temporal].total += data.total;
      });

      // Aggregate verb types
      Object.entries(session.verbTypePerformance || {}).forEach(([verbType, data]) => {
        if (!verbTypeAggregation[verbType]) {
          verbTypeAggregation[verbType] = { correct: 0, total: 0 };
        }
        verbTypeAggregation[verbType].correct += data.correct;
        verbTypeAggregation[verbType].total += data.total;
      });

      // Aggregate cultural performance
      if (session.culturalVsRegularPerformance?.cultural) {
        insights.culturalActivityPerformance.correct += session.culturalVsRegularPerformance.cultural.correct;
        insights.culturalActivityPerformance.total += session.culturalVsRegularPerformance.cultural.total;
      }
    });

    // Calculate error rates and find most challenging
    insights.mostChallengingConcepts = Object.entries(conceptAggregation)
      .map(([concept, data]) => ({
        concept,
        errorRate: ((data.total - data.correct) / data.total * 100).toFixed(1),
        attempts: data.total,
        correct: data.correct
      }))
      .sort((a, b) => parseFloat(b.errorRate) - parseFloat(a.errorRate))
      .slice(0, 5);

    insights.mostChallengingTemporalExpressions = Object.entries(temporalAggregation)
      .map(([temporal, data]) => ({
        temporal,
        errorRate: ((data.total - data.correct) / data.total * 100).toFixed(1),
        attempts: data.total,
        correct: data.correct
      }))
      .sort((a, b) => parseFloat(b.errorRate) - parseFloat(a.errorRate))
      .slice(0, 5);

    // Irregular vs Regular performance
    if (verbTypeAggregation.irregular) {
      insights.irregularVsRegularPerformance.irregular = verbTypeAggregation.irregular;
    }
    if (verbTypeAggregation.regular) {
      insights.irregularVsRegularPerformance.regular = verbTypeAggregation.regular;
    }

    return insights;
  };

  // Export analytics data to CSV
  const exportAnalyticsToCSV = () => {
    const insights = generateTeacherInsights();
    if (!insights) return;

    const csvData = [];

    // Header
    csvData.push(['Calendar Conversation Game - Teacher Analytics Report']);
    csvData.push(['Generated:', new Date().toLocaleString()]);
    csvData.push(['Total Sessions:', insights.totalSessions]);
    csvData.push(['Total Questions:', insights.totalQuestions]);
    csvData.push(['Sessions with Adaptive Support:', insights.adaptiveSupportUsage]);
    csvData.push([]);

    // Most Challenging Concepts
    csvData.push(['Most Challenging Concepts (Highest Error Rates)']);
    csvData.push(['Concept', 'Error Rate (%)', 'Total Attempts', 'Correct Answers']);
    insights.mostChallengingConcepts.forEach(item => {
      csvData.push([item.concept, item.errorRate, item.attempts, item.correct]);
    });
    csvData.push([]);

    // Most Challenging Temporal Expressions
    csvData.push(['Most Challenging Time Expressions']);
    csvData.push(['Time Expression', 'Error Rate (%)', 'Total Attempts', 'Correct Answers']);
    insights.mostChallengingTemporalExpressions.forEach(item => {
      csvData.push([item.temporal, item.errorRate, item.attempts, item.correct]);
    });
    csvData.push([]);

    // Verb Type Performance
    csvData.push(['Verb Type Performance Comparison']);
    csvData.push(['Verb Type', 'Correct', 'Total', 'Success Rate (%)']);
    Object.entries(insights.irregularVsRegularPerformance).forEach(([type, data]) => {
      const successRate = data.total > 0 ? (data.correct / data.total * 100).toFixed(1) : '0';
      csvData.push([type, data.correct, data.total, successRate]);
    });
    csvData.push([]);

    // Cultural Activity Performance
    csvData.push(['Cultural Activity Performance']);
    csvData.push(['Activity Type', 'Correct', 'Total', 'Success Rate (%)']);
    const culturalSuccess = insights.culturalActivityPerformance.total > 0 ?
      (insights.culturalActivityPerformance.correct / insights.culturalActivityPerformance.total * 100).toFixed(1) : '0';
    csvData.push(['Cultural Activities', insights.culturalActivityPerformance.correct,
                  insights.culturalActivityPerformance.total, culturalSuccess]);

    // Convert to CSV string
    const csvContent = csvData.map(row =>
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `calendar_game_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Generate a list of varied temporal references
  const generateQuestionTargets = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targets = [];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayDayIndex = today.getDay(); // 0 = Sunday, 6 = Saturday

    // Mix of different temporal references
    const variations = [
      { days: -1, label: 'yesterday' },
      { days: 1, label: 'tomorrow' },
      { days: -2, label: '2 days ago' },
      { days: 2, label: 'in 2 days' },
      { days: -3, label: '3 days ago' },
      { days: 3, label: 'in 3 days' },
      { days: 0, label: 'today' },
      { days: -4, label: '4 days ago' },
      { days: 4, label: 'in 4 days' },
    ];

    // Add "last [day]" - meaning the most recent occurrence of that day
    // For example, if today is Wednesday:
    // - last Tuesday = yesterday (1 day ago)
    // - last Thursday = 6 days ago
    // - last Sunday = 3 days ago
    for (let targetDayIndex = 0; targetDayIndex < 7; targetDayIndex++) {
      if (targetDayIndex === todayDayIndex) continue; // Skip today

      // Calculate days since last occurrence
      let daysSince = todayDayIndex - targetDayIndex;
      if (daysSince <= 0) {
        daysSince += 7; // Wrap around to previous week
      }

      variations.push({
        days: -daysSince,
        label: `last ${dayNames[targetDayIndex]}`
      });
    }

    // Add "next [day]" - meaning the next occurrence of that day
    // For example, if today is Wednesday:
    // - next Thursday = tomorrow (1 day ahead)
    // - next Monday = 5 days ahead
    // - next Wednesday = 7 days ahead
    for (let targetDayIndex = 0; targetDayIndex < 7; targetDayIndex++) {
      if (targetDayIndex === todayDayIndex) continue; // Skip today

      // Calculate days until next occurrence
      let daysUntil = targetDayIndex - todayDayIndex;
      if (daysUntil <= 0) {
        daysUntil += 7; // Wrap around to next week
      }

      variations.push({
        days: daysUntil,
        label: `next ${dayNames[targetDayIndex]}`
      });
    }

    // Remove any duplicates and shuffle
    const uniqueVariations = variations.filter((item, index, self) =>
      index === self.findIndex((t) => t.days === item.days)
    );

    // Shuffle and take 16 for the game
    const shuffled = uniqueVariations.sort(() => Math.random() - 0.5).slice(0, 16);
    setQuestionTargets(shuffled);
  };

  // Get the next question target
  const getCurrentQuestionTarget = () => {
    if (questionTargets.length > 0) {
      return questionTargets[round - 1] || questionTargets[0];
    }
    return { days: 0, label: 'today' };
  };

  // Generate question and answer together
  const generateQuestionAndAnswer = () => {
    const target = getCurrentQuestionTarget();
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + target.days);
    targetDate.setHours(0, 0, 0, 0);

    setSelectedDay(targetDate);

    const tense = getTenseForDay(targetDate);

    // Generate question
    let question = '';
    if (tense === 'past') {
      question = `What did you do ${target.label}?`;
    } else if (tense === 'future') {
      question = `What will you do ${target.label}?`;
    } else {
      question = `What are you doing ${target.label}?`;
    }

    // Generate answer using the same date
    const targetCalendar = currentPlayer === 1 ? player2Calendar : player1Calendar;
    const dateKey = targetDate.toISOString().split('T')[0];
    const activity = targetCalendar[dateKey];

    let answer = 'No activity scheduled';
    if (activity) {
      if (tense === 'past') {
        const labelLower = target.label.toLowerCase();
        if (labelLower === 'yesterday') {
          answer = `Yesterday, I ${activity.past}.`;
        } else if (labelLower.includes('days ago')) {
          const capitalizedLabel = target.label.charAt(0).toUpperCase() + target.label.slice(1);
          answer = `${capitalizedLabel}, I ${activity.past}.`;
        } else if (labelLower.includes('last')) {
          const capitalizedLabel = target.label.charAt(0).toUpperCase() + target.label.slice(1);
          answer = `${capitalizedLabel}, I ${activity.past}.`;
        } else {
          answer = `I ${activity.past}.`;
        }
      } else if (tense === 'future') {
        const labelLower = target.label.toLowerCase();
        if (labelLower === 'tomorrow') {
          answer = `Tomorrow, I will ${activity.verb}.`;
        } else if (labelLower.includes('in ')) {
          const capitalizedLabel = target.label.charAt(0).toUpperCase() + target.label.slice(1);
          answer = `${capitalizedLabel}, I will ${activity.verb}.`;
        } else if (labelLower.includes('next') || labelLower.includes('this')) {
          const capitalizedLabel = target.label.charAt(0).toUpperCase() + target.label.slice(1);
          answer = `${capitalizedLabel}, I will ${activity.verb}.`;
        } else {
          answer = `I will ${activity.verb}.`;
        }
      } else {
        answer = `Today, I am ${activity.present}.`;
      }
    }

    setCurrentQuestion(question);
    setCurrentAnswer(answer);
  };

  // Get the tense for a specific day
  const getTenseForDay = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    const timeDiff = compareDate.getTime() - today.getTime();

    if (timeDiff < 0) return 'past';
    if (timeDiff > 0) return 'future';
    return 'present';
  };

  // Update question and answer when starting a new asking phase
  useEffect(() => {
    if (gamePhase === 'playing' && currentRole === 'asking' && questionTargets.length > 0) {
      generateQuestionAndAnswer();
    }
  }, [currentRole, gamePhase, round]);

  // Pronunciation helper
  const playPronunciation = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  // Handle turn completion
  const handleAnswerComplete = (correct) => {
    setIsCorrect(correct);
    setShowFeedback(true);

    // Phase 2: Track performance for adaptive scaffolding
    if (selectedDay) {
      const targetCalendar = currentPlayer === 1 ? player2Calendar : player1Calendar;
      const dateKey = selectedDay.toISOString().split('T')[0];
      const activity = targetCalendar[dateKey];
      const tense = getTenseForDay(selectedDay);

      trackPerformance(correct, activity, tense);

      // Phase 3: Collect analytics data
      const questionTarget = getCurrentQuestionTarget();
      collectAnalyticsData(correct, activity, tense, questionTarget);
    }

    if (correct) {
      // The answerer gets points (opposite of currentPlayer since currentPlayer is the asker)
      const answerer = currentPlayer === 1 ? 'player2' : 'player1';
      setScore(prev => ({
        ...prev,
        [answerer]: prev[answerer] + 10
      }));
      setStreak(prev => prev + 1);

      // Check for achievements
      if (streak === 4) {
        showAchievement('🔥 5 Streak!');
      }
      if (round === 5 && difficulty < 3) {
        setDifficulty(prev => prev + 1);
        showAchievement('⬆️ Level Up!');
      }

      // Phase 2: Extra celebration for struggling concepts
      if (selectedDay) {
        const targetCalendar = currentPlayer === 1 ? player2Calendar : player1Calendar;
        const dateKey = selectedDay.toISOString().split('T')[0];
        const activity = targetCalendar[dateKey];

        if (activity && activity.type === 'irregular' && strugglingConcepts.includes('irregularVerbs')) {
          showAchievement('🎯 Irregular Verb Mastery!');
        }
        if (activity && activity.category === 'cultural' && strugglingConcepts.includes('culturalActivities')) {
          showAchievement('🎉 Cultural Activity Pro!');
        }
      }
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      setShowFeedback(false);
      nextTurn();
    }, 2000);
  };

  // Show achievement popup
  const showAchievement = (text) => {
    setTempAchievement(text);
    setTimeout(() => setTempAchievement(null), 2000);
  };

  // Move to next turn
  const nextTurn = () => {
    if (round >= 16) {
      // Phase 3: Save analytics when game finishes
      saveSessionAnalytics();
      setGamePhase('finished');
      return;
    }

    if (currentRole === 'asking') {
      setCurrentRole('answering');
    } else {
      setCurrentRole('asking');
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      setRound(prev => prev + 1);
    }
  };

  // Start game
  const startGame = () => {
    if (player1Name && player2Name) {
      setGamePhase('playing');
      setRound(1);
      setCurrentPlayer(1);
      setCurrentRole('asking');
      generateQuestionTargets();
    } else {
      alert('Please enter both names to start!');
    }
  };

  // Restart game
  const restartGame = () => {
    setGamePhase('setup');
    setCurrentPlayer(1);
    setCurrentRole('asking');
    setRound(1);
    setScore({ player1: 0, player2: 0 });
    setStreak(0);
    setDifficulty(1);
    setSelectedDay(null);
    const newCalendar1 = prefillCalendar();
    const newCalendar2 = prefillCalendar();
    setPlayer1Calendar(newCalendar1);
    setPlayer2Calendar(newCalendar2);
    setCurrentQuestion('');
    setCurrentAnswer('');
    setQuestionTargets([]);

    // Phase 2: Reset adaptive scaffolding
    setErrorTracking({
      irregularVerbs: { attempts: 0, errors: 0 },
      pastTense: { attempts: 0, errors: 0 },
      presentTense: { attempts: 0, errors: 0 },
      futureTense: { attempts: 0, errors: 0 },
      temporalExpressions: { attempts: 0, errors: 0 },
      culturalActivities: { attempts: 0, errors: 0 }
    });
    setStrugglingConcepts([]);
    setAdaptiveSupport({
      irregularVerbHighlight: false,
      extraScaffolding: false,
      simplifiedInstructions: false,
      visualCues: false
    });
    setShowAdaptiveHint(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4">
      {/* Achievement Popup */}
      {tempAchievement && (
        <div className="fixed top-4 right-4 bg-yellow-400 text-black px-6 py-3 rounded-lg shadow-lg animate-bounce z-50">
          {tempAchievement}
        </div>
      )}

      {/* Phase 2: Adaptive Hint Popup */}
      {showAdaptiveHint && (
        <div className="fixed top-16 right-4 bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm z-50">
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0">💡</div>
            <div className="text-sm">{adaptiveHintContent}</div>
          </div>
        </div>
      )}

      {/* Phase 2: Struggling Concepts Indicator */}
      {strugglingConcepts.length > 0 && gamePhase === 'playing' && (
        <div className="fixed top-4 left-4 bg-orange-100 border border-orange-300 px-3 py-2 rounded-lg shadow-lg z-40">
          <div className="text-xs font-semibold text-orange-800 mb-1">Getting Extra Help With:</div>
          <div className="flex flex-wrap gap-1">
            {strugglingConcepts.map(concept => (
              <span key={concept} className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded">
                {concept === 'irregularVerbs' ? '🔴 Irregular Verbs' :
                 concept === 'pastTense' ? '🕐 Past Tense' :
                 concept === 'presentTense' ? '📍 Present Tense' :
                 concept === 'futureTense' ? '🔮 Future Tense' :
                 concept === 'temporalExpressions' ? '⏰ Time Words' :
                 concept === 'culturalActivities' ? '🎉 Cultural Activities' : concept}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Custom Activity Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Add Your Personal Activity</h3>
            <form onSubmit={handleCustomActivitySubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Emoji</label>
                  <input
                    type="text"
                    value={customActivityForm.emoji}
                    onChange={(e) => setCustomActivityForm(prev => ({ ...prev, emoji: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="🎸"
                    maxLength="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Verb (present)</label>
                  <input
                    type="text"
                    value={customActivityForm.verb}
                    onChange={(e) => setCustomActivityForm(prev => ({ ...prev, verb: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="play guitar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Past tense</label>
                  <input
                    type="text"
                    value={customActivityForm.past}
                    onChange={(e) => setCustomActivityForm(prev => ({ ...prev, past: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="played guitar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Present continuous</label>
                  <input
                    type="text"
                    value={customActivityForm.present}
                    onChange={(e) => setCustomActivityForm(prev => ({ ...prev, present: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="playing guitar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Verb type</label>
                  <select
                    value={customActivityForm.type}
                    onChange={(e) => setCustomActivityForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="regular">Regular</option>
                    <option value="irregular">Irregular</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                >
                  Add Activity
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Phase 3: Teacher Analytics Dashboard Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="text-blue-600" />
                Teacher Analytics Dashboard
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={exportAnalyticsToCSV}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={() => setShowAnalytics(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>

            {(() => {
              const insights = generateTeacherInsights();
              if (!insights) {
                return <div className="text-center text-gray-500 py-8">No data available yet. Play some games to see analytics!</div>;
              }

              return (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{insights.totalSessions}</div>
                      <div className="text-sm text-blue-800">Total Sessions</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">{insights.totalQuestions}</div>
                      <div className="text-sm text-green-800">Questions Answered</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">{insights.adaptiveSupportUsage}</div>
                      <div className="text-sm text-orange-800">Sessions with Adaptive Support</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {insights.culturalActivityPerformance.total > 0 ?
                          ((insights.culturalActivityPerformance.correct / insights.culturalActivityPerformance.total) * 100).toFixed(1) : '0'}%
                      </div>
                      <div className="text-sm text-purple-800">Cultural Activity Success</div>
                    </div>
                  </div>

                  {/* Most Challenging Concepts */}
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                      🎯 Most Challenging Concepts (Focus Areas for Instruction)
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {insights.mostChallengingConcepts.map((concept, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-3 rounded border">
                          <span className="font-medium">{concept.concept}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">{concept.attempts} attempts</span>
                            <span className={`font-bold ${parseFloat(concept.errorRate) > 50 ? 'text-red-600' : 'text-orange-600'}`}>
                              {concept.errorRate}% error rate
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Most Challenging Temporal Expressions */}
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                      ⏰ Most Challenging Time Expressions
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {insights.mostChallengingTemporalExpressions.map((temporal, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-3 rounded border">
                          <span className="font-medium">"{temporal.temporal}"</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">{temporal.attempts} attempts</span>
                            <span className={`font-bold ${parseFloat(temporal.errorRate) > 50 ? 'text-red-600' : 'text-orange-600'}`}>
                              {temporal.errorRate}% error rate
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verb Type Performance Comparison */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                      📊 Irregular vs Regular Verb Performance
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(insights.irregularVsRegularPerformance).map(([type, data]) => {
                        const successRate = data.total > 0 ? ((data.correct / data.total) * 100).toFixed(1) : '0';
                        return (
                          <div key={type} className="bg-white p-4 rounded border">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium capitalize">{type} Verbs</span>
                              <span className={`font-bold ${parseFloat(successRate) < 70 ? 'text-red-600' : 'text-green-600'}`}>
                                {successRate}%
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {data.correct} correct out of {data.total} attempts
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                              <div
                                className={`h-2 rounded-full ${parseFloat(successRate) < 70 ? 'bg-red-500' : 'bg-green-500'}`}
                                style={{ width: `${successRate}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Teaching Recommendations */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                      💡 Teaching Recommendations Based on Data
                    </h4>
                    <div className="space-y-2 text-sm">
                      {insights.mostChallengingConcepts.length > 0 && (
                        <div className="bg-white p-3 rounded border">
                          <strong>Focus Area:</strong> Students need extra support with "{insights.mostChallengingConcepts[0].concept}"
                          ({insights.mostChallengingConcepts[0].errorRate}% error rate)
                        </div>
                      )}
                      {insights.irregularVsRegularPerformance.irregular?.total > 0 && (
                        <div className="bg-white p-3 rounded border">
                          <strong>Irregular Verbs:</strong>
                          {((insights.irregularVsRegularPerformance.irregular.correct / insights.irregularVsRegularPerformance.irregular.total) * 100) < 70 ?
                            " Students struggling with irregular verbs - recommend extra practice and memory aids" :
                            " Students performing well with irregular verbs - maintain current approach"}
                        </div>
                      )}
                      {insights.adaptiveSupportUsage > insights.totalSessions * 0.5 && (
                        <div className="bg-white p-3 rounded border">
                          <strong>Adaptive Support:</strong> High usage of adaptive features indicates students benefit from scaffolding -
                          consider incorporating similar supports in regular instruction
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="text-blue-600" />
            Calendar Conversation Game
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">
              Full AI-Powered Learning System!
            </span>
            {strugglingConcepts.length > 0 && (
              <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded-full ml-1">
                Adaptive Mode
              </span>
            )}
          </h1>
          <div className="flex gap-4 items-center">
            {gamePhase === 'playing' && (
              <>
                <div className="text-sm">
                  <span className="font-semibold">Round:</span> {round}/16
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Level:</span> {difficulty}
                </div>
                <div className="text-sm flex items-center gap-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold">Streak:</span> {streak}
                </div>
              </>
            )}

            {/* Phase 3: Teacher Analytics Button */}
            {analyticsData.length > 0 && (
              <button
                onClick={() => setShowAnalytics(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-2 rounded-lg flex items-center gap-2"
                title="View Learning Analytics (Teacher)"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics ({analyticsData.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Setup Phase */}
      {gamePhase === 'setup' && (
        <div className="space-y-4">
          {/* Name Input */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Enter Your Names</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Player 1 Name"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Player 2 Name"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-800">
                <strong>How to Play:</strong> The calendars below are already filled with activities including
                Mexican cultural activities like quinceañeras, Día de los Muertos, and family traditions!
                You'll take turns asking and answering questions about different days.
                Practice using past, present, and future tenses correctly!
              </p>
            </div>

            {/* Custom Activities Section */}
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-green-800">Your Personal Activities</h3>
                <button
                  onClick={() => setShowCustomModal(true)}
                  className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded-lg flex items-center gap-1"
                  disabled={customActivities.length >= 5}
                >
                  <Plus className="w-4 h-4" />
                  Add Activity ({customActivities.length}/5)
                </button>
              </div>

              {customActivities.length === 0 ? (
                <p className="text-sm text-green-700">
                  Add up to 5 personal activities that are special to you!
                  Examples: play guitar, cook pozole, practice ballet
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {customActivities.map((activity) => (
                    <div key={activity.id} className="bg-white rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
                      <span>{activity.emoji}</span>
                      <span>{activity.verb}</span>
                      <span className={`text-xs ${activity.type === 'irregular' ? 'text-red-600' : 'text-green-600'}`}>
                        ({activity.type})
                      </span>
                      <button
                        onClick={() => deleteCustomActivity(activity.id)}
                        className="text-red-500 hover:text-red-700 text-xs ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={startGame}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Start Game!
            </button>
          </div>

          {/* Pre-filled Calendars Preview */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Your Calendars (Pre-filled with Activities)</h2>

            <div className="text-center text-sm text-gray-600 mb-4">
              <span className="inline-block px-2 py-1 bg-gray-100 rounded mx-1">Previous Weeks (faded)</span>
              <span className="inline-block px-2 py-1 bg-white border-2 border-gray-300 rounded mx-1">This Week</span>
              <span className="inline-block px-2 py-1 bg-gray-100 rounded mx-1">Next Weeks (faded)</span>
            </div>

            {/* Cultural Activities Legend */}
            <div className="bg-purple-50 p-3 rounded-lg mb-4">
              <h4 className="font-semibold text-purple-800 mb-2">🎉 New Cultural Activities Include:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <span>🎊 quinceañera</span>
                <span>💀 Día de los Muertos</span>
                <span>🏪 mercado</span>
                <span>🌯 make burritos</span>
                <span>⛪ misa</span>
                <span>🎺 mariachi</span>
                <span>🕯️ light candles</span>
                <span>📞 call Mexico</span>
              </div>
              {customActivities.length > 0 && (
                <div className="mt-2 pt-2 border-t border-purple-200">
                  <span className="font-semibold">✨ Your custom activities: </span>
                  {customActivities.map(activity => `${activity.emoji} ${activity.verb}`).join(', ')}
                </div>
              )}
            </div>

            {/* Two Player Calendars */}
            <div className="grid grid-cols-2 gap-4">
              {/* Player 1 Calendar */}
              <div>
                <h3 className="font-semibold mb-2 text-blue-600">
                  {player1Name || 'Player 1'}'s Calendar
                </h3>
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-bold text-xs text-gray-700">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDates.map((dateInfo, idx) => {
                    const dateKey = dateInfo.date.toISOString().split('T')[0];
                    const activity = player1Calendar[dateKey];
                    const isCustom = activity && activity.category === 'custom';
                    const isCultural = activity && activity.category === 'cultural';
                    return (
                      <div
                        key={idx}
                        className={`border rounded p-1 min-h-[90px] flex flex-col items-center justify-start text-xs
                          ${dateInfo.isToday ? 'bg-yellow-100 border-yellow-500 border-2' : 'bg-white'}
                          ${dateInfo.week === 'last' || dateInfo.week === 'next' || dateInfo.week === 'other' ? 'opacity-60' : ''}
                          ${isCustom ? 'ring-2 ring-green-300' : ''}
                          ${isCultural ? 'ring-2 ring-purple-300' : ''}
                        `}
                      >
                        <div className="text-gray-500 text-[10px]">{dateInfo.dayNum}</div>
                        {activity && (
                          <>
                            <div className="text-base mt-auto mb-auto" title={activity.verb}>
                              {activity.emoji}
                            </div>
                            {isCustom && <div className="text-[8px] text-green-600 font-bold">YOURS</div>}
                            {isCultural && <div className="text-[8px] text-purple-600 font-bold">CULTURAL</div>}
                          </>
                        )}
                        {dateInfo.isToday && (
                          <div className="text-[10px] font-bold text-yellow-600 mt-auto">TODAY</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Player 2 Calendar */}
              <div>
                <h3 className="font-semibold mb-2 text-green-600">
                  {player2Name || 'Player 2'}'s Calendar
                </h3>
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-bold text-xs text-gray-700">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDates.map((dateInfo, idx) => {
                    const dateKey = dateInfo.date.toISOString().split('T')[0];
                    const activity = player2Calendar[dateKey];
                    const isCustom = activity && activity.category === 'custom';
                    const isCultural = activity && activity.category === 'cultural';
                    return (
                      <div
                        key={idx}
                        className={`border rounded p-1 min-h-[90px] flex flex-col items-center justify-start text-xs
                          ${dateInfo.isToday ? 'bg-yellow-100 border-yellow-500 border-2' : 'bg-white'}
                          ${dateInfo.week === 'last' || dateInfo.week === 'next' || dateInfo.week === 'other' ? 'opacity-60' : ''}
                          ${isCustom ? 'ring-2 ring-green-300' : ''}
                          ${isCultural ? 'ring-2 ring-purple-300' : ''}
                        `}
                      >
                        <div className="text-gray-500 text-[10px]">{dateInfo.dayNum}</div>
                        {activity && (
                          <>
                            <div className="text-base mt-auto mb-auto" title={activity.verb}>
                              {activity.emoji}
                            </div>
                            {isCustom && <div className="text-[8px] text-green-600 font-bold">YOURS</div>}
                            {isCultural && <div className="text-[8px] text-purple-600 font-bold">CULTURAL</div>}
                          </>
                        )}
                        {dateInfo.isToday && (
                          <div className="text-[10px] font-bold text-yellow-600 mt-auto">TODAY</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Playing Phase */}
      {gamePhase === 'playing' && (
        <div className="space-y-4">
          {/* Turn Indicator */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold">
                {currentRole === 'asking' ?
                  <>
                    <span className="text-blue-600">{currentPlayer === 1 ? player1Name : player2Name}</span>
                    <span> asks about </span>
                    <span className="text-green-600">{currentPlayer === 1 ? player2Name : player1Name}'s day</span>
                  </> :
                  <>
                    <span className="text-green-600">{currentPlayer === 1 ? player2Name : player1Name}</span>
                    <span> answers about their day</span>
                  </>
                }
              </h2>
            </div>

            {/* Score Display */}
            <div className="flex justify-center gap-8 mb-4">
              <div className={`text-center px-4 py-2 rounded-lg ${currentRole === 'asking' && currentPlayer === 1 ? 'bg-blue-100 ring-2 ring-blue-400' : ''}`}>
                <div className="text-sm text-gray-600">{player1Name}</div>
                <div className="text-2xl font-bold text-blue-600">{score.player1}</div>
                {currentRole === 'asking' && currentPlayer === 1 && <div className="text-xs text-blue-600">Asking</div>}
                {currentRole === 'answering' && currentPlayer === 2 && <div className="text-xs text-green-600">Answering</div>}
              </div>
              <div className={`text-center px-4 py-2 rounded-lg ${currentRole === 'asking' && currentPlayer === 2 ? 'bg-blue-100 ring-2 ring-blue-400' : ''}`}>
                <div className="text-sm text-gray-600">{player2Name}</div>
                <div className="text-2xl font-bold text-green-600">{score.player2}</div>
                {currentRole === 'asking' && currentPlayer === 2 && <div className="text-xs text-blue-600">Asking</div>}
                {currentRole === 'answering' && currentPlayer === 1 && <div className="text-xs text-green-600">Answering</div>}
              </div>
            </div>
          </div>

          {/* Game Calendar */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold mb-4 text-center text-lg">
              {/* Always show whose calendar this is */}
              <span className="text-green-600">{currentPlayer === 1 ? player2Name : player1Name}'s</span> Calendar
              {currentRole === 'asking' &&
                <span className="text-sm text-gray-600 block mt-1">Ask about their activities</span>
              }
              {currentRole === 'answering' &&
                <span className="text-sm text-gray-600 block mt-1">Use this calendar to answer</span>
              }
            </h3>

            {/* Calendar Display */}
            <div className="mb-4">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-bold text-sm text-gray-700">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {calendarDates.map((dateInfo, idx) => {
                  const dateKey = dateInfo.date.toISOString().split('T')[0];
                  // Always show the answerer's calendar (opposite of current player when asking)
                  const targetCalendar = currentPlayer === 1 ? player2Calendar : player1Calendar;
                  const activity = targetCalendar[dateKey];

                  // More reliable date comparison
                  const isSelected = selectedDay &&
                    dateInfo.date.getFullYear() === selectedDay.getFullYear() &&
                    dateInfo.date.getMonth() === selectedDay.getMonth() &&
                    dateInfo.date.getDate() === selectedDay.getDate();

                  const isCustom = activity && activity.category === 'custom';
                  const isCultural = activity && activity.category === 'cultural';
                  const isIrregular = activity && activity.type === 'irregular';

                  // Phase 2: Enhanced visual cues based on adaptive support
                  const shouldHighlightIrregular = isIrregular && adaptiveSupport.irregularVerbHighlight;
                  const shouldShowVisualCues = isCultural && adaptiveSupport.visualCues;

                  return (
                    <div
                      key={idx}
                      className={`border rounded-lg p-2 min-h-[110px] flex flex-col items-center justify-start transition-all
                        ${dateInfo.isToday ? 'bg-yellow-100 border-yellow-500 border-2' : ''}
                        ${isSelected ? 'bg-blue-200 border-blue-600 border-2 scale-105 shadow-lg' : ''}
                        ${!isSelected && !dateInfo.isToday && dateInfo.week !== 'last' && dateInfo.week !== 'next' && dateInfo.week !== 'other' ? 'bg-white' : ''}
                        ${(dateInfo.week === 'last' || dateInfo.week === 'next' || dateInfo.week === 'other') && !isSelected ? 'opacity-60' : ''}
                        ${isCustom ? 'ring-2 ring-green-300' : ''}
                        ${isCultural ? 'ring-2 ring-purple-300' : ''}
                        ${isIrregular ? 'ring-2 ring-red-300' : ''}
                        ${shouldHighlightIrregular ? 'ring-4 ring-red-500 ring-offset-2 animate-pulse' : ''}
                        ${shouldShowVisualCues ? 'ring-4 ring-purple-500 ring-offset-2' : ''}
                      `}
                    >
                      <div className="text-xs text-gray-500">{dateInfo.dayNum}</div>
                      {activity && (
                        <>
                          <div className="text-2xl mt-auto">{activity.emoji}</div>
                          <div className={`text-xs text-center ${activity.type === 'irregular' ? 'text-red-600 font-bold' : ''}`}>
                            {activity.verb}
                          </div>
                          {isCustom && <div className="text-[8px] text-green-600 font-bold">YOURS</div>}
                          {isCultural && <div className="text-[8px] text-purple-600 font-bold">CULTURAL</div>}
                        </>
                      )}
                      {dateInfo.isToday && !isSelected && (
                        <div className="text-[10px] font-bold text-yellow-600 mt-auto pb-1">TODAY</div>
                      )}
                      {isSelected && (
                        <div className="text-[10px] font-bold text-blue-600 mt-auto pb-1">SELECTED</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Question/Answer Section */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              {currentRole === 'asking' ? (
                <div>
                  <h4 className="font-semibold mb-2">
                    <span className="text-blue-600">{currentPlayer === 1 ? player1Name : player2Name}</span>, ask this question:
                  </h4>
                  <div className="text-xl mb-2 flex items-center gap-2 bg-white p-3 rounded-lg">
                    <span className="flex-1">{currentQuestion}</span>
                    <button
                      onClick={() => playPronunciation(currentQuestion)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  {selectedDay && (
                    <div className="text-xs text-gray-600 mb-2">
                      (Looking at {currentPlayer === 1 ? player2Name : player1Name}'s {selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })})
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setCurrentRole('answering');
                      // The answer should already be generated and will stay the same
                      showAchievement('✅ Good question!');
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    I asked the question ➡️
                  </button>
                </div>
              ) : (
                <div>
                  <h4 className="font-semibold mb-2">
                    <span className="text-green-600">{currentPlayer === 1 ? player2Name : player1Name}</span>, your answer should be:
                  </h4>
                  <div className="text-xl mb-2 flex items-center gap-2 bg-white p-3 rounded-lg">
                    <span className="flex-1">{currentAnswer}</span>
                    <button
                      onClick={() => playPronunciation(currentAnswer)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  {selectedDay && (
                    <div className="text-xs text-gray-600 mb-2">
                      (Your activity on {selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })})
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAnswerComplete(true)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Correct Answer
                    </button>
                    <button
                      onClick={() => handleAnswerComplete(false)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      Need Practice
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Feedback Display */}
            {showFeedback && (
              <div className={`text-center p-4 rounded-lg mb-4 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className="text-2xl font-bold">
                  {isCorrect ? '✅ Great job!' : '❌ Keep practicing!'}
                </div>
              </div>
            )}
          </div>

          {/* Phase 2: Adaptive Scaffold Panel */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <button
              onClick={() => setShowScaffold(!showScaffold)}
              className="flex items-center gap-2 text-blue-600 mb-3 hover:text-blue-800"
            >
              <HelpCircle className="w-5 h-5" />
              {showScaffold ? 'Hide' : 'Show'} Help
              {strugglingConcepts.length > 0 && (
                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full ml-2">
                  Extra Help Available!
                </span>
              )}
            </button>

            {showScaffold && (
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className={`bg-red-50 p-3 rounded ${strugglingConcepts.includes('pastTense') ? 'ring-2 ring-red-400' : ''}`}>
                  <h4 className="font-semibold text-red-700 mb-2">
                    🕐 Past (Before Today)
                    {strugglingConcepts.includes('pastTense') && <span className="ml-1 text-xs bg-red-200 px-1 rounded">FOCUS</span>}
                  </h4>
                  <div className="space-y-1">
                    <p className="font-medium">Questions:</p>
                    <p className="text-xs">What did you do...?</p>
                    <p className="font-medium mt-2">Answers:</p>
                    <p className="text-xs">Yesterday, I [past verb]</p>
                    <p className="text-xs">Last Monday, I [past verb]</p>
                    <p className="text-xs">3 days ago, I [past verb]</p>

                    {/* Adaptive examples based on current struggles */}
                    <div className="mt-2 pt-2 border-t border-red-200">
                      {getAdaptiveHelpExamples('past').map((example, idx) => (
                        <p key={idx} className={`text-xs ${example.includes('IRREGULAR') ? 'font-bold text-red-700' : ''} ${example.includes('CULTURAL') ? 'font-bold text-purple-700' : ''}`}>
                          {example}
                        </p>
                      ))}
                    </div>

                    {/* Extra scaffolding for struggling students */}
                    {adaptiveSupport.extraScaffolding && (
                      <div className="mt-2 pt-2 border-t border-red-300 bg-red-100 p-2 rounded">
                        <p className="font-semibold text-red-800 text-xs">🎯 Extra Help:</p>
                        <p className="text-xs">Look for time clues: yesterday, last week, 3 days ago = PAST</p>
                        <p className="text-xs">Pattern: [time] + I + [past verb]</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className={`bg-blue-50 p-3 rounded ${strugglingConcepts.includes('presentTense') ? 'ring-2 ring-blue-400' : ''}`}>
                  <h4 className="font-semibold text-blue-700 mb-2">
                    📍 Present (Today)
                    {strugglingConcepts.includes('presentTense') && <span className="ml-1 text-xs bg-blue-200 px-1 rounded">FOCUS</span>}
                  </h4>
                  <div className="space-y-1">
                    <p className="font-medium">Questions:</p>
                    <p className="text-xs">What are you doing...?</p>
                    <p className="font-medium mt-2">Answers:</p>
                    <p className="text-xs">Today, I am [verb+ing]</p>
                    <p className="text-xs">Right now, I am [verb+ing]</p>
                    <div className="mt-2 pt-2 border-t border-blue-200">
                      {getAdaptiveHelpExamples('present').map((example, idx) => (
                        <p key={idx} className={`text-xs ${example.includes('CULTURAL') ? 'font-bold text-purple-700' : ''}`}>
                          {example}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`bg-green-50 p-3 rounded ${strugglingConcepts.includes('futureTense') ? 'ring-2 ring-green-400' : ''}`}>
                  <h4 className="font-semibold text-green-700 mb-2">
                    🔮 Future (After Today)
                    {strugglingConcepts.includes('futureTense') && <span className="ml-1 text-xs bg-green-200 px-1 rounded">FOCUS</span>}
                  </h4>
                  <div className="space-y-1">
                    <p className="font-medium">Questions:</p>
                    <p className="text-xs">What will you do...?</p>
                    <p className="font-medium mt-2">Answers:</p>
                    <p className="text-xs">Tomorrow, I will [verb]</p>
                    <p className="text-xs">Next Tuesday, I will [verb]</p>
                    <p className="text-xs">In 2 days, I will [verb]</p>
                    <div className="mt-2 pt-2 border-t border-green-200">
                      {getAdaptiveHelpExamples('future').map((example, idx) => (
                        <p key={idx} className={`text-xs ${example.includes('TIME') ? 'font-bold text-green-700' : ''}`}>
                          {example}
                        </p>
                      ))}
                    </div>

                    {/* Extra scaffolding for struggling students */}
                    {adaptiveSupport.extraScaffolding && (
                      <div className="mt-2 pt-2 border-t border-green-300 bg-green-100 p-2 rounded">
                        <p className="font-semibold text-green-800 text-xs">🎯 Extra Help:</p>
                        <p className="text-xs">Look for time clues: tomorrow, next week, in 2 days = FUTURE</p>
                        <p className="text-xs">Pattern: [time] + I will + [base verb]</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Phase 2: Quick Hint Button for Struggling Students */}
            {strugglingConcepts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    const target = getCurrentQuestionTarget();
                    const tense = selectedDay ? getTenseForDay(selectedDay) : 'present';
                    showContextualHint([tense, ...strugglingConcepts]);
                  }}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-2 rounded-lg flex items-center gap-2"
                >
                  💡 Need a Hint?
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game Finished */}
      {gamePhase === 'finished' && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-3xl font-bold mb-6">¡Excelente! Great Job! 🎉</h2>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <div className="text-xl font-semibold text-blue-600">{player1Name}</div>
              <div className="text-4xl font-bold mt-2">{score.player1} points</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-green-600">{player2Name}</div>
              <div className="text-4xl font-bold mt-2">{score.player2} points</div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Achievements Earned:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="bg-yellow-200 px-3 py-1 rounded-full">🎯 Completed Game</span>
              {score.player1 + score.player2 > 200 && (
                <span className="bg-purple-200 px-3 py-1 rounded-full">⭐ Super Stars</span>
              )}
              {(score.player1 > 100 || score.player2 > 100) && (
                <span className="bg-blue-200 px-3 py-1 rounded-full">🏆 Champion</span>
              )}
              <span className="bg-green-200 px-3 py-1 rounded-full">💪 Practiced All Tenses</span>
              <span className="bg-purple-200 px-3 py-1 rounded-full">🎉 Cultural Activities Master</span>
              {customActivities.length > 0 && (
                <span className="bg-green-200 px-3 py-1 rounded-full">✨ Personal Touch</span>
              )}
              {/* Phase 2: Adaptive Learning Achievements */}
              {strugglingConcepts.length > 0 && (
                <span className="bg-orange-200 px-3 py-1 rounded-full">🎯 Growth Mindset</span>
              )}
              {Object.values(errorTracking).some(concept => concept.attempts >= 5) && (
                <span className="bg-blue-200 px-3 py-1 rounded-full">🏋️ Persistent Learner</span>
              )}
              {errorTracking.irregularVerbs.attempts > 3 && errorTracking.irregularVerbs.errors / errorTracking.irregularVerbs.attempts < 0.3 && (
                <span className="bg-red-200 px-3 py-1 rounded-full">🔴 Irregular Verb Expert</span>
              )}
            </div>
          </div>

          <button
            onClick={restartGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
          >
            Play Again with New Partner
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarVerbGame;