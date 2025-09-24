import React, { useState, useEffect } from 'react';
import { Calendar, Volume2, HelpCircle, Star, Zap, Target, Flame, Trophy, CheckCircle, XCircle } from 'lucide-react';

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

  // Activities with emojis and verbs
  const activities = [
    // Daily activities
    { id: 1, emoji: '🚶', verb: 'walk to school', past: 'walked to school', present: 'walking to school', type: 'regular', category: 'daily' },
    { id: 2, emoji: '🏃', verb: 'run', past: 'ran', present: 'running', type: 'irregular', category: 'daily' },
    { id: 3, emoji: '🍳', verb: 'cook breakfast', past: 'cooked breakfast', present: 'cooking breakfast', type: 'regular', category: 'daily' },
    { id: 4, emoji: '🍽️', verb: 'eat lunch', past: 'ate lunch', present: 'eating lunch', type: 'irregular', category: 'daily' },
    { id: 5, emoji: '📚', verb: 'do homework', past: 'did homework', present: 'doing homework', type: 'irregular', category: 'school' },
    { id: 6, emoji: '📖', verb: 'read', past: 'read', present: 'reading', type: 'irregular', category: 'school' },
    { id: 7, emoji: '✏️', verb: 'write', past: 'wrote', present: 'writing', type: 'irregular', category: 'school' },

    // Family & Cultural
    { id: 8, emoji: '👵🏼', verb: 'visit grandma', past: 'visited grandma', present: 'visiting grandma', type: 'regular', category: 'family' },
    { id: 9, emoji: '🫔', verb: 'make tamales', past: 'made tamales', present: 'making tamales', type: 'irregular', category: 'family' },
    { id: 10, emoji: '🌮', verb: 'eat tacos', past: 'ate tacos', present: 'eating tacos', type: 'irregular', category: 'family' },
    { id: 11, emoji: '🎉', verb: 'go to party', past: 'went to party', present: 'going to party', type: 'irregular', category: 'family' },
    { id: 12, emoji: '⛪', verb: 'go to church', past: 'went to church', present: 'going to church', type: 'irregular', category: 'family' },
    { id: 13, emoji: '🎂', verb: 'celebrate birthday', past: 'celebrated birthday', present: 'celebrating birthday', type: 'regular', category: 'family' },

    // Sports & Fun
    { id: 14, emoji: '⚽', verb: 'play soccer', past: 'played soccer', present: 'playing soccer', type: 'regular', category: 'sports' },
    { id: 15, emoji: '🏀', verb: 'play basketball', past: 'played basketball', present: 'playing basketball', type: 'regular', category: 'sports' },
    { id: 16, emoji: '🎮', verb: 'play video games', past: 'played video games', present: 'playing video games', type: 'regular', category: 'sports' },
    { id: 17, emoji: '💃', verb: 'dance', past: 'danced', present: 'dancing', type: 'regular', category: 'sports' },
    { id: 18, emoji: '📱', verb: 'text friends', past: 'texted friends', present: 'texting friends', type: 'regular', category: 'sports' },
    { id: 19, emoji: '📺', verb: 'watch TV', past: 'watched TV', present: 'watching TV', type: 'regular', category: 'sports' },

    // Chores & Responsibilities
    { id: 20, emoji: '🏠', verb: 'clean house', past: 'cleaned house', present: 'cleaning house', type: 'regular', category: 'chores' },
    { id: 21, emoji: '🐕', verb: 'walk the dog', past: 'walked the dog', present: 'walking the dog', type: 'regular', category: 'chores' },
    { id: 22, emoji: '👶', verb: 'babysit', past: 'babysat', present: 'babysitting', type: 'irregular', category: 'chores' },
    { id: 23, emoji: '🛒', verb: 'go shopping', past: 'went shopping', present: 'going shopping', type: 'irregular', category: 'chores' },
    { id: 24, emoji: '🚗', verb: 'wash the car', past: 'washed the car', present: 'washing the car', type: 'regular', category: 'chores' },
    { id: 25, emoji: '🧹', verb: 'sweep', past: 'swept', present: 'sweeping', type: 'irregular', category: 'chores' },
    { id: 26, emoji: '🧺', verb: 'do laundry', past: 'did laundry', present: 'doing laundry', type: 'irregular', category: 'chores' },
    { id: 27, emoji: '🍕', verb: 'order pizza', past: 'ordered pizza', present: 'ordering pizza', type: 'regular', category: 'family' },
    { id: 28, emoji: '🚌', verb: 'ride the bus', past: 'rode the bus', present: 'riding the bus', type: 'irregular', category: 'daily' },
    { id: 29, emoji: '🎵', verb: 'listen to music', past: 'listened to music', present: 'listening to music', type: 'regular', category: 'sports' },
    { id: 30, emoji: '⚾', verb: 'play baseball', past: 'played baseball', present: 'playing baseball', type: 'regular', category: 'sports' },
  ];

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

  // Pre-fill calendars with random activities
  const prefillCalendar = () => {
    const newCalendar = {};
    const shuffledActivities = [...activities].sort(() => Math.random() - 0.5);

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
  }, [gamePhase]);

  // Generate varied question targets at game start
  useEffect(() => {
    if (gamePhase === 'playing' && round === 1) {
      generateQuestionTargets();
    }
  }, [gamePhase]);

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4">
      {/* Achievement Popup */}
      {tempAchievement && (
        <div className="fixed top-4 right-4 bg-yellow-400 text-black px-6 py-3 rounded-lg shadow-lg animate-bounce z-50">
          {tempAchievement}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="text-blue-600" />
            Calendar Conversation Game
          </h1>
          <div className="flex gap-4">
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
                <strong>How to Play:</strong> The calendars below are already filled with activities.
                You'll take turns asking and answering questions about different days.
                Practice using past, present, and future tenses correctly!
              </p>
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

            <div className="text-center text-sm text-gray-600 mb-2">
              <span className="inline-block px-2 py-1 bg-gray-100 rounded mx-1">Previous Weeks (faded)</span>
              <span className="inline-block px-2 py-1 bg-white border-2 border-gray-300 rounded mx-1">This Week</span>
              <span className="inline-block px-2 py-1 bg-gray-100 rounded mx-1">Next Weeks (faded)</span>
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
                    return (
                      <div
                        key={idx}
                        className={`border rounded p-1 min-h-[90px] flex flex-col items-center justify-start text-xs
                          ${dateInfo.isToday ? 'bg-yellow-100 border-yellow-500 border-2' : 'bg-white'}
                          ${dateInfo.week === 'last' || dateInfo.week === 'next' || dateInfo.week === 'other' ? 'opacity-60' : ''}
                        `}
                      >
                        <div className="text-gray-500 text-[10px]">{dateInfo.dayNum}</div>
                        {activity && (
                          <div className="text-base mt-auto mb-auto" title={activity.verb}>
                            {activity.emoji}
                          </div>
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
                    return (
                      <div
                        key={idx}
                        className={`border rounded p-1 min-h-[90px] flex flex-col items-center justify-start text-xs
                          ${dateInfo.isToday ? 'bg-yellow-100 border-yellow-500 border-2' : 'bg-white'}
                          ${dateInfo.week === 'last' || dateInfo.week === 'next' || dateInfo.week === 'other' ? 'opacity-60' : ''}
                        `}
                      >
                        <div className="text-gray-500 text-[10px]">{dateInfo.dayNum}</div>
                        {activity && (
                          <div className="text-base mt-auto mb-auto" title={activity.verb}>
                            {activity.emoji}
                          </div>
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

                  return (
                    <div
                      key={idx}
                      className={`border rounded-lg p-2 min-h-[110px] flex flex-col items-center justify-start transition-all
                        ${dateInfo.isToday ? 'bg-yellow-100 border-yellow-500 border-2' : ''}
                        ${isSelected ? 'bg-blue-200 border-blue-600 border-2 scale-105 shadow-lg' : ''}
                        ${!isSelected && !dateInfo.isToday && dateInfo.week !== 'last' && dateInfo.week !== 'next' && dateInfo.week !== 'other' ? 'bg-white' : ''}
                        ${(dateInfo.week === 'last' || dateInfo.week === 'next' || dateInfo.week === 'other') && !isSelected ? 'opacity-60' : ''}
                      `}
                    >
                      <div className="text-xs text-gray-500">{dateInfo.dayNum}</div>
                      {activity && (
                        <>
                          <div className="text-2xl mt-auto">{activity.emoji}</div>
                          <div className={`text-xs ${activity.type === 'irregular' ? 'text-red-600 font-bold' : ''}`}>
                            {activity.verb}
                          </div>
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

          {/* Scaffold Panel */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <button
              onClick={() => setShowScaffold(!showScaffold)}
              className="flex items-center gap-2 text-blue-600 mb-3 hover:text-blue-800"
            >
              <HelpCircle className="w-5 h-5" />
              {showScaffold ? 'Hide' : 'Show'} Help
            </button>

            {showScaffold && (
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-red-50 p-3 rounded">
                  <h4 className="font-semibold text-red-700 mb-2">🕐 Past (Before Today)</h4>
                  <div className="space-y-1">
                    <p className="font-medium">Questions:</p>
                    <p className="text-xs">What did you do...?</p>
                    <p className="font-medium mt-2">Answers:</p>
                    <p className="text-xs">Yesterday, I [past verb]</p>
                    <p className="text-xs">Last Monday, I [past verb]</p>
                    <p className="text-xs">3 days ago, I [past verb]</p>
                    <div className="mt-2 pt-2 border-t border-red-200">
                      <p className="font-semibold text-red-600">⚠️ Irregular verbs:</p>
                      <p className="text-xs">eat → ate</p>
                      <p className="text-xs">go → went</p>
                      <p className="text-xs">do → did</p>
                      <p className="text-xs">make → made</p>
                      <p className="text-xs">read → read</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded">
                  <h4 className="font-semibold text-blue-700 mb-2">📍 Present (Today)</h4>
                  <div className="space-y-1">
                    <p className="font-medium">Questions:</p>
                    <p className="text-xs">What are you doing...?</p>
                    <p className="font-medium mt-2">Answers:</p>
                    <p className="text-xs">Today, I am [verb+ing]</p>
                    <p className="text-xs">Right now, I am [verb+ing]</p>
                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <p className="font-semibold text-blue-600">Examples:</p>
                      <p className="text-xs">I am playing</p>
                      <p className="text-xs">I am eating</p>
                      <p className="text-xs">I am reading</p>
                      <p className="text-xs">I am doing homework</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded">
                  <h4 className="font-semibold text-green-700 mb-2">🔮 Future (After Today)</h4>
                  <div className="space-y-1">
                    <p className="font-medium">Questions:</p>
                    <p className="text-xs">What will you do...?</p>
                    <p className="font-medium mt-2">Answers:</p>
                    <p className="text-xs">Tomorrow, I will [verb]</p>
                    <p className="text-xs">Next Tuesday, I will [verb]</p>
                    <p className="text-xs">In 2 days, I will [verb]</p>
                    <div className="mt-2 pt-2 border-t border-green-200">
                      <p className="font-semibold text-green-600">Remember:</p>
                      <p className="text-xs">Use base verb form</p>
                      <p className="text-xs">will + verb</p>
                      <p className="text-xs">NO -ed, -ing endings</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game Finished */}
      {gamePhase === 'finished' && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Great Job! 🎉</h2>

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