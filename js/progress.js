/**
 * Système de progression, XP, séries (streak) – localStorage
 */
const Progress = (() => {
  const KEY = "prog-akartis-progress";
  const STREAK_KEY = "prog-akartis-streak";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || {};
    } catch {
      return {};
    }
  }

  function save(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function getCourseProgress(courseId) {
    const data = load();
    return data[courseId] || { completed: [], xp: 0 };
  }

  function completeLesson(courseId, lessonId, xp) {
    const data = load();
    if (!data[courseId]) data[courseId] = { completed: [], xp: 0 };
    if (!data[courseId].completed.includes(lessonId)) {
      data[courseId].completed.push(lessonId);
      data[courseId].xp += xp;
      save(data);
      addXP(xp);
      touchStreak();
      return true;
    }
    return false;
  }

  function isLessonDone(courseId, lessonId) {
    return getCourseProgress(courseId).completed.includes(lessonId);
  }

  function coursePercent(courseId) {
    const course = window.AKARTIS_COURSES?.[courseId];
    if (!course) return 0;
    const done = getCourseProgress(courseId).completed.length;
    return Math.round((done / course.lessons.length) * 100);
  }

  function isCourseComplete(courseId) {
    return coursePercent(courseId) === 100;
  }

  // --- XP global (défini plus bas avec support quiz) ---
  function addXP(amount) {
    // déjà compté dans completeLesson / saveQuizResult
  }

  // --- Streak ---
  function loadStreak() {
    try {
      return JSON.parse(localStorage.getItem(STREAK_KEY)) || { count: 0, lastDate: null, freezes: 2 };
    } catch {
      return { count: 0, lastDate: null, freezes: 2 };
    }
  }

  function saveStreak(s) {
    localStorage.setItem(STREAK_KEY, JSON.stringify(s));
  }

  function todayStr() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  function yesterdayStr() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  }

  function touchStreak() {
    const s = loadStreak();
    const today = todayStr();
    if (s.lastDate === today) return s; // déjà compté aujourd'hui

    if (s.lastDate === yesterdayStr()) {
      s.count += 1;
    } else if (s.lastDate && s.lastDate !== today) {
      // série cassée (sauf si freeze – simplifié : reset)
      s.count = 1;
    } else {
      s.count = Math.max(1, s.count);
    }
    s.lastDate = today;
    saveStreak(s);
    return s;
  }

  function getStreak() {
    const s = loadStreak();
    const today = todayStr();
    // si dernière activité > hier, série à 0 (affichage)
    if (s.lastDate && s.lastDate !== today && s.lastDate !== yesterdayStr()) {
      return { ...s, count: 0 };
    }
    return s;
  }

  function getStats() {
    const data = load();
    let lessonsDone = 0;
    let coursesStarted = 0;
    let coursesDone = 0;
    Object.keys(data).forEach((cid) => {
      if (cid === "_quizzes") return;
      const p = data[cid];
      lessonsDone += (p.completed || []).length;
      if ((p.completed || []).length > 0) coursesStarted++;
      if (isCourseComplete(cid)) coursesDone++;
    });
    const quizzes = getQuizStats();
    return {
      totalXP: getTotalXP(),
      lessonsDone,
      coursesStarted,
      coursesDone,
      streak: getStreak(),
      quizzesDone: quizzes.done,
      quizzesBestAvg: quizzes.bestAvg,
      exercisesDone: getExerciseStats().done,
    };
  }

  // --- Quizzes ---
  const QUIZ_KEY = "_quizzes";

  function getQuizzes() {
    const data = load();
    return data[QUIZ_KEY] || {};
  }

  function saveQuizResult(quizId, score, total, xpGained) {
    const data = load();
    if (!data[QUIZ_KEY]) data[QUIZ_KEY] = {};
    const prev = data[QUIZ_KEY][quizId];
    const pct = Math.round((score / total) * 100);
    const entry = {
      bestScore: prev ? Math.max(prev.bestScore, score) : score,
      bestPct: prev ? Math.max(prev.bestPct, pct) : pct,
      total,
      attempts: prev ? prev.attempts + 1 : 1,
      lastDate: new Date().toISOString().slice(0, 10),
    };
    data[QUIZ_KEY][quizId] = entry;

    // XP seulement si amélioration ou première fois, et score >= 50%
    let granted = 0;
    if (pct >= 50) {
      const already = prev && prev.xpGranted;
      if (!already) {
        granted = xpGained;
        entry.xpGranted = true;
        // ajouter XP via un bucket quiz
        if (!data._quiz_xp) data._quiz_xp = { completed: [], xp: 0 };
        data._quiz_xp.xp = (data._quiz_xp.xp || 0) + granted;
      }
      entry.xpGranted = true;
    }
    data[QUIZ_KEY][quizId] = entry;
    save(data);
    if (granted) touchStreak();
    return { entry, granted };
  }

  function getQuizResult(quizId) {
    return getQuizzes()[quizId] || null;
  }

  function getQuizStats() {
    const q = getQuizzes();
    const ids = Object.keys(q);
    let bestAvg = 0;
    if (ids.length) {
      bestAvg = Math.round(ids.reduce((s, id) => s + (q[id].bestPct || 0), 0) / ids.length);
    }
    return { done: ids.length, bestAvg };
  }

  function getTotalXP() {
    const data = load();
    let total = 0;
    Object.keys(data).forEach((k) => {
      if (k === QUIZ_KEY) return;
      total += data[k].xp || 0;
    });
    return total;
  }

  function completeExercise(exId, xp) {
    const data = load();
    if (!data._exercises) data._exercises = { completed: [], xp: 0 };
    if (!data._exercises.completed.includes(exId)) {
      data._exercises.completed.push(exId);
      data._exercises.xp += xp;
      save(data);
      touchStreak();
      return true;
    }
    return false;
  }

  function isExerciseDone(exId) {
    const data = load();
    return (data._exercises?.completed || []).includes(exId);
  }

  function getExerciseStats() {
    const data = load();
    return {
      done: (data._exercises?.completed || []).length,
      xp: data._exercises?.xp || 0,
    };
  }

  function resetAll() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(STREAK_KEY);
  }

  return {
    load,
    getCourseProgress,
    completeLesson,
    isLessonDone,
    coursePercent,
    isCourseComplete,
    getTotalXP,
    getStreak,
    touchStreak,
    getStats,
    resetAll,
    saveQuizResult,
    getQuizResult,
    getQuizStats,
    completeExercise,
    isExerciseDone,
    getExerciseStats,
  };
})();

window.Progress = Progress;
