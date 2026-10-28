import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, Search, Bookmark, Award, Clock, FileText, CheckCircle2, 
  XCircle, AlertTriangle, ChevronRight, Filter, Download, User, 
  BarChart3, Settings, Moon, Sun, ShieldCheck, LogOut, Lock, 
  Mail, GraduationCap, Building, Sparkles, Plus, Eye, Share2, 
  FileCheck, HelpCircle, ArrowRight, Play, RefreshCw, Check, 
  Layers, Lightbulb, Bell, Menu, X, Trash2, Edit3, Send, Hash
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  Tooltip, CartesianGrid, BarChart, Bar, RadarChart, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, PieChart, Pie, Cell 
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// --- INITIAL DEMO DATABASE & CURRICULUM DATA ---
const INITIAL_BRANCHES = [
  { id: 'cse', name: 'Computer Science & Engg.' },
  { id: 'cse_aiml', name: 'CSE (AI & Machine Learning)' },
  { id: 'it', name: 'Information Technology' },
  { id: 'ece', name: 'Electronics & Comm. Engg.' },
  { id: 'ee', name: 'Electrical Engineering' },
  { id: 'me', name: 'Mechanical Engineering' },
  { id: 'ce', name: 'Civil Engineering' }
];

const INITIAL_SUBJECTS = [
  { 
    id: 'kcs301', 
    code: 'KCS-301', 
    name: 'Data Structures', 
    sem: 3, 
    branches: ['cse', 'cse_aiml', 'it'],
    verified: true,
    units: [
      { id: 1, name: 'Unit 1: Introduction to Data Structures & Stacks', topics: 'Arrays, Stacks, Queues, Recursion, Evaluation of Expressions' },
      { id: 2, name: 'Unit 2: Linked Lists & Polynomial Addition', topics: 'Singly, Doubly & Circular Linked Lists, Stack & Queue via Linked List' },
      { id: 3, name: 'Unit 3: Trees & Binary Search Trees', topics: 'Binary Trees, BST, AVL Trees, B-Trees, Threaded Trees, Traversals' },
      { id: 4, name: 'Unit 4: Graphs & Shortest Paths', topics: 'DFS, BFS, Dijkstra Algorithm, Minimum Spanning Trees (Kruskal, Prim)' },
      { id: 5, name: 'Unit 5: Searching, Sorting & Hashing', topics: 'Bubble, Quick, Merge, Heap Sort, Hash functions, Collision resolution' }
    ]
  },
  { 
    id: 'kcs302', 
    code: 'KCS-302', 
    name: 'Computer System Architecture (COA)', 
    sem: 3, 
    branches: ['cse', 'cse_aiml', 'it'],
    verified: true,
    units: [
      { id: 1, name: 'Unit 1: Functional Units & Register Transfer', topics: 'Bus & Memory Transfers, Arithmetic Logic Micro-operations, Instruction Codes' },
      { id: 2, name: 'Unit 2: Basic Computer Architecture & ALU', topics: 'Instruction Cycle, Memory-Reference Instructions, Booth Algorithm' },
      { id: 3, name: 'Unit 3: Microprogrammed Control Unit', topics: 'Control Memory, Address Sequencing, Microinstruction format' },
      { id: 4, name: 'Unit 4: Memory System Hierarchy', topics: 'Cache Memory Mapping (Direct, Associative, Set-Associative), Virtual Memory' },
      { id: 5, name: 'Unit 5: I/O & Pipeline Processing', topics: 'DMA, Interrupts, Pipelining hazards, Vector Processing' }
    ]
  },
  { 
    id: 'kcs303', 
    code: 'KCS-303', 
    name: 'Discrete Structures & Theory of Logic', 
    sem: 3, 
    branches: ['cse', 'cse_aiml', 'it'],
    verified: true,
    units: [
      { id: 1, name: 'Unit 1: Sets, Relations & Functions', topics: 'Equivalence Relations, Posets, Hasse Diagrams, Lattice' },
      { id: 2, name: 'Unit 2: Algebraic Structures', topics: 'Groups, Subgroups, Cosets, Lagrange Theorem, Rings & Fields' },
      { id: 3, name: 'Unit 3: Propositional Logic', topics: 'Tautology, CNF, DNF, Validity of Arguments, Predicate Calculus' },
      { id: 4, name: 'Unit 4: Combinatorics & Recurrence', topics: 'Pigeonhole Principle, Recurrence Relations, Generating Functions' },
      { id: 5, name: 'Unit 5: Graph Theory', topics: 'Eulerian & Hamiltonian Graphs, Graph Coloring, Planar Graphs' }
    ]
  },
  { 
    id: 'kcs401', 
    code: 'KCS-401', 
    name: 'Operating Systems', 
    sem: 4, 
    branches: ['cse', 'cse_aiml', 'it'],
    verified: true,
    units: [
      { id: 1, name: 'Unit 1: Introduction & System Calls', topics: 'OS Structure, Process State, Process Control Block, System Calls' },
      { id: 2, name: 'Unit 2: CPU Scheduling & Synchronization', topics: 'FCFS, SJF, Round Robin, Semaphores, Monitors, Peterson Solution' },
      { id: 3, name: 'Unit 3: Deadlocks', topics: 'Deadlock Conditions, Resource Allocation Graph, Banker\'s Algorithm' },
      { id: 4, name: 'Unit 4: Memory Management', topics: 'Paging, Segmentation, Page Replacement Algorithms (FIFO, LRU, Optimal)' },
      { id: 5, name: 'Unit 5: File Systems & I/O Systems', topics: 'File Allocation Methods, Disk Scheduling Algorithms (SSTF, SCAN, C-SCAN)' }
    ]
  },
  { 
    id: 'kcs402', 
    code: 'KCS-402', 
    name: 'Theory of Automata & Formal Languages', 
    sem: 4, 
    branches: ['cse', 'cse_aiml', 'it'],
    verified: true,
    units: [
      { id: 1, name: 'Unit 1: Finite Automata & Regular Expressions', topics: 'DFA, NFA, Equivalence, NFA to DFA conversion, Regular Expressions' },
      { id: 2, name: 'Unit 2: Regular Languages & Pumping Lemma', topics: 'Pumping Lemma for Regular Languages, Arden Theorem, Closure Properties' },
      { id: 3, name: 'Unit 3: Context-Free Languages & Grammars', topics: 'CFG, Derivation Trees, Ambiguity, Chomsky Normal Form (CNF), GNF' },
      { id: 4, name: 'Unit 4: Pushdown Automata (PDA)', topics: 'Deterministic & Non-Deterministic PDA, Equivalence with CFG' },
      { id: 5, name: 'Unit 5: Turing Machines & Decidability', topics: 'TM Construction, Universal TM, Halting Problem, Post Correspondence' }
    ]
  },
  { 
    id: 'kve301', 
    code: 'KVE-301', 
    name: 'Universal Human Values (UHV)', 
    sem: 3, 
    branches: ['cse', 'cse_aiml', 'it', 'ece', 'ee', 'me', 'ce'],
    verified: true,
    units: [
      { id: 1, name: 'Unit 1: Course Introduction & Self Exploration', topics: 'Right Understanding, Continuous Happiness & Prosperity' },
      { id: 2, name: 'Unit 2: Harmony in the Human Being', topics: 'Self (I) and Body, Needs of Self and Body, Sanyam & Swasthya' },
      { id: 3, name: 'Unit 3: Harmony in Family & Society', topics: 'Trust (Vishwas), Respect (Samman), Justice, Undivided Society' },
      { id: 4, name: 'Unit 4: Harmony in Nature & Existence', topics: 'Four Orders of Nature, Interconnectedness, Co-existence' },
      { id: 5, name: 'Unit 5: Holistic Understanding & Professional Ethics', topics: 'Natural Acceptance, Vision for Universal Human Order' }
    ]
  }
];

const INITIAL_PYQ_QUESTIONS = [
  {
    id: 'q101',
    subjectId: 'kcs301',
    unitId: 1,
    year: '2023-24',
    examType: 'End Sem',
    marks: 7,
    text: 'What is a Sparse Matrix? Explain its representation using array tri-tuple format with a suitable example.',
    repeatCount: 4,
    difficulty: 'Medium',
    solution: 'A sparse matrix is a matrix in which most of the elements are zero. It can be efficiently stored using a 3-column matrix containing: (Row Index, Column Index, Value).'
  },
  {
    id: 'q102',
    subjectId: 'kcs301',
    unitId: 3,
    year: '2022-23',
    examType: 'End Sem',
    marks: 10,
    text: 'Construct an AVL tree by inserting the following elements step-by-step: 15, 20, 24, 10, 13, 7, 30, 36. Show all rotations explicitly.',
    repeatCount: 5,
    difficulty: 'Hard',
    solution: 'AVL Tree maintains balance factor between -1 and +1. Use LL, RR, LR, RL rotations whenever balance factor becomes > 1 or < -1.'
  },
  {
    id: 'q103',
    subjectId: 'kcs401',
    unitId: 3,
    year: '2023-24',
    examType: 'End Sem',
    marks: 7,
    text: 'Consider a system with 5 processes (P0-P4) and 3 resource types (A, B, C). Apply Banker\'s Algorithm to determine if the system is in a safe state.',
    repeatCount: 6,
    difficulty: 'Hard',
    solution: 'Calculate Need Matrix = Max - Allocation. Find a safe sequence by comparing Available resources with Need.'
  },
  {
    id: 'q104',
    subjectId: 'kcs402',
    unitId: 2,
    year: '2021-22',
    examType: 'Carry-over',
    marks: 7,
    text: 'State and prove Pumping Lemma for Regular Languages. Show that L = { a^n b^n | n >= 0 } is not regular.',
    repeatCount: 7,
    difficulty: 'Hard',
    solution: 'Pumping Lemma states that any sufficiently long string w in a regular language can be divided into xyz such that xy^i z is also in L for all i >= 0.'
  },
  {
    id: 'q105',
    subjectId: 'kcs302',
    unitId: 4,
    year: '2022-23',
    examType: 'End Sem',
    marks: 7,
    text: 'Differentiate between Direct Mapping, Associative Mapping, and Set-Associative Mapping with neat diagrams.',
    repeatCount: 4,
    difficulty: 'Medium',
    solution: 'Direct mapping assigns each block to a fixed cache line. Associative allows placement anywhere. Set-Associative combines both.'
  },
  {
    id: 'q106',
    subjectId: 'kcs301',
    unitId: 1,
    year: '2020-21',
    examType: 'End Sem',
    marks: 2,
    text: 'Define Time Complexity and Space Complexity. What is Big-O notation?',
    repeatCount: 8,
    difficulty: 'Easy',
    solution: 'Time complexity measures execution time relative to input size. Big-O bounds the asymptotic growth rate.'
  }
];

const INITIAL_MOCK_TESTS = [
  {
    id: 'mt-1',
    title: 'Data Structures - Unit 1 & 2 Rapid Fire',
    subjectId: 'kcs301',
    durationMinutes: 20,
    totalMarks: 20,
    questionCount: 4,
    questions: [
      {
        id: 'mq1',
        text: 'Which data structure is used for evaluating postfix expressions?',
        options: ['Queue', 'Stack', 'Tree', 'Graph'],
        correctIndex: 1,
        explanation: 'Stacks use LIFO principle, which perfect aligns with storing operands for operator evaluation.',
        marks: 5
      },
      {
        id: 'mq2',
        text: 'Time complexity to search an element in a balanced BST of n nodes is:',
        options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'],
        correctIndex: 2,
        explanation: 'Height of a balanced BST is O(log n), making search bound to log n operations.',
        marks: 5
      },
      {
        id: 'mq3',
        text: 'Minimum number of queues required to implement a priority queue is:',
        options: ['1', '2', 'Equal to number of priority levels', '3'],
        correctIndex: 2,
        explanation: 'One queue per priority level is required when using simple linear queues.',
        marks: 5
      },
      {
        id: 'mq4',
        text: 'In a circular linked list, insertion of a node at head takes time:',
        options: ['O(1)', 'O(n) if no tail pointer is kept', 'O(log n)', 'Both A & B'],
        correctIndex: 3,
        explanation: 'If tail pointer is maintained, it is O(1). Without tail pointer, we must traverse to end resulting in O(n).',
        marks: 5
      }
    ]
  },
  {
    id: 'mt-2',
    title: 'Operating Systems - Deadlocks & Memory Mid-Sem Practice',
    subjectId: 'kcs401',
    durationMinutes: 15,
    totalMarks: 15,
    questionCount: 3,
    questions: [
      {
        id: 'osq1',
        text: 'Which of the following is NOT a necessary condition for Deadlock?',
        options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption', 'Circular Wait'],
        correctIndex: 2,
        explanation: 'NO Preemption is the condition. Voluntary preemption prevents deadlocks.',
        marks: 5
      },
      {
        id: 'osq2',
        text: 'Belady\'s Anomaly occurs in which Page Replacement algorithm?',
        options: ['LRU', 'FIFO', 'Optimal', 'LFU'],
        correctIndex: 1,
        explanation: 'FIFO suffers from Belady anomaly where increasing frame count leads to more page faults.',
        marks: 5
      },
      {
        id: 'osq3',
        text: 'Banker\'s Algorithm is used for:',
        options: ['Deadlock Prevention', 'Deadlock Avoidance', 'Deadlock Detection', 'Deadlock Recovery'],
        correctIndex: 1,
        explanation: 'Banker\'s algorithm dynamically checks resource requests to ensure safe states (Avoidance).',
        marks: 5
      }
    ]
  }
];

export default function App() {
  // --- LOCAL STORAGE STATE ENGINE ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aktu_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('aktu_theme') === 'dark';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [backendStatus, setBackendStatus] = useState({ state: 'connecting', error: '' });
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('aktu_subjects');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [pyqs, setPyqs] = useState(() => {
    const saved = localStorage.getItem('aktu_pyqs');
    return saved ? JSON.parse(saved) : INITIAL_PYQ_QUESTIONS;
  });

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('aktu_bookmarks');
    return saved ? JSON.parse(saved) : ['q101', 'q104'];
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('aktu_notes');
    return saved ? JSON.parse(saved) : { q101: 'Important formula: 3 columns (Row, Col, Val)' };
  });

  const [mockTests, setMockTests] = useState(() => {
    const saved = localStorage.getItem('aktu_mocks');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_TESTS;
  });

  const [testAttempts, setTestAttempts] = useState(() => {
    const saved = localStorage.getItem('aktu_attempts');
    return saved ? JSON.parse(saved) : [
      { id: 'att-1', testId: 'mt-1', score: 15, maxScore: 20, accuracy: 75, date: '2026-10-20' },
      { id: 'att-2', testId: 'mt-2', score: 15, maxScore: 15, accuracy: 100, date: '2026-10-24' }
    ];
  });

  // UI state variables
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [activePdfView, setActivePdfView] = useState(null);
  const [currentMock, setCurrentMock] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadBackendData = async () => {
      try {
        const [healthResponse, branchesResponse, subjectsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/health`),
          fetch(`${API_BASE_URL}/api/branches`),
          fetch(`${API_BASE_URL}/api/subjects`)
        ]);
        const responses = [healthResponse, branchesResponse, subjectsResponse];
        const failedResponse = responses.find(response => !response.ok);
        if (failedResponse) {
          throw new Error(`Backend request failed (${failedResponse.status})`);
        }

        const [health, remoteBranches, remoteSubjects] = await Promise.all(
          responses.map(response => response.json())
        );
        if (health.status !== 'ok' || !Array.isArray(remoteBranches) || !Array.isArray(remoteSubjects)) {
          throw new Error('Backend returned an unexpected response');
        }

        if (cancelled) return;
        setBranches(remoteBranches);
        setSubjects(currentSubjects => {
          const localSubjects = new Map(currentSubjects.map(subject => [subject.id, subject]));
          const remoteIds = new Set(remoteSubjects.map(subject => subject.id));
          const mergedSubjects = remoteSubjects.map(remoteSubject => {
            const localSubject = localSubjects.get(remoteSubject.id);
            return localSubject
              ? { ...localSubject, ...remoteSubject, units: localSubject.units?.length ? localSubject.units : remoteSubject.units }
              : remoteSubject;
          });
          return [...mergedSubjects, ...currentSubjects.filter(subject => !remoteIds.has(subject.id))];
        });
        setBackendStatus({ state: 'online', error: '' });
      } catch (error) {
        if (cancelled) return;
        console.error('Unable to connect to the AKTU backend:', error);
        setBackendStatus({ state: 'offline', error: error.message });
      }
    };

    loadBackendData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('aktu_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('aktu_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('aktu_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('aktu_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('aktu_pyqs', JSON.stringify(pyqs));
  }, [pyqs]);

  useEffect(() => {
    localStorage.setItem('aktu_attempts', JSON.stringify(testAttempts));
  }, [testAttempts]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleBookmarkToggle = (id) => {
    setBookmarks(prev => {
      const next = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      showToast(prev.includes(id) ? 'Bookmark removed' : 'Question bookmarked');
      return next;
    });
  };

  const handleSaveNote = (qId, noteText) => {
    setNotes(prev => ({ ...prev, [qId]: noteText }));
    showToast('Personal note updated');
  };

  // Keyboard shortcut for Cmd+K Search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter subjects for logged-in user's branch & sem
  const filteredSubjects = useMemo(() => {
    if (!user) return subjects;
    return subjects.filter(s => 
      s.sem === user.semester && (s.branches.includes(user.branch) || s.branches.includes('all'))
    );
  }, [user, subjects]);

  return (
      <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'} transition-colors duration-200 font-sans`}>
        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce border border-slate-700">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium">{toastMessage}</span>
          </div>
        )}

        {/* AUTH SCREEN OR MAIN APP */}
        {!user ? (
          <AuthScreen
            branches={branches}
            onLogin={(userObj) => { setUser(userObj); showToast(`Welcome, ${userObj.name}!`); }}
          />
        ) : (
          <div className="flex h-screen overflow-hidden">
            {/* DESKTOP SIDEBAR */}
            <aside className={`hidden md:flex flex-col w-64 border-r ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} backdrop-blur-md transition-all z-20`}>
              {/* BRAND LOGO */}
              <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                      AKTU Marks
                    </h1>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">2nd-Year Companion</p>
                  </div>
                </div>
              </div>

              {/* NAVIGATION MENU */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: Layers },
                  { id: 'pyqs', label: '10-Year PYQs', icon: FileText },
                  { id: 'units', label: 'Unit-Wise PYQs', icon: BookOpen },
                  { id: 'mocks', label: 'Mock Tests', icon: Clock },
                  { id: 'subjects', label: 'Syllabus & Subjects', icon: GraduationCap },
                  { id: 'bookmarks', label: 'Saved & Notes', icon: Bookmark },
                  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                  ...(user.role === 'admin' ? [{ id: 'admin', label: 'Admin Portal', icon: ShieldCheck }] : [])
                ].map(item => {
                  const Icon = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                        active 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                          : darkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* USER CARD & SETTINGS */}
              <div className={`p-4 border-t ${darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50/50'} space-y-3`}>
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{branches.find(b => b.id === user.branch)?.name} • Sem {user.semester}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2 rounded-lg border ${darkMode ? 'border-slate-700 text-yellow-400 hover:bg-slate-800' : 'border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                    title="Toggle Theme"
                  >
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => { setUser(null); localStorage.removeItem('aktu_user'); }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* TOP HEADER */}
              <header className={`h-16 px-4 md:px-8 border-b ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur-md flex items-center justify-between z-10`}>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Menu className="w-5 h-5" />
                  </button>

                  {/* SEARCH TRIGGER */}
                  <button
                    onClick={() => setIsSearchModalOpen(true)}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs md:text-sm border ${
                      darkMode ? 'bg-slate-800/60 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                    } hover:border-blue-500 transition w-44 md:w-80`}
                  >
                    <Search className="w-4 h-4 text-slate-400" />
                    <span className="flex-1 text-left truncate">Search subjects, PYQs, topics...</span>
                    <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200 dark:bg-slate-700 rounded">⌘K</kbd>
                  </button>
                </div>

                {/* HEADER RIGHT METRICS */}
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>5 Day Streak 🔥</span>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold">
                    AKTU Sem {user.semester}
                  </div>
                  <div
                    className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${
                      backendStatus.state === 'online'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : backendStatus.state === 'offline'
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
                          : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                    }`}
                    title={backendStatus.error || 'Backend API connection status'}
                    aria-live="polite"
                  >
                    {backendStatus.state === 'online' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    <span>
                      {backendStatus.state === 'online'
                        ? 'Backend connected'
                        : backendStatus.state === 'offline'
                          ? 'Demo mode'
                          : 'Connecting'}
                    </span>
                  </div>
                </div>
              </header>

              {/* MOBILE DRAWER */}
              {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 md:hidden flex">
                  <div className={`w-64 h-full ${darkMode ? 'bg-slate-900' : 'bg-white'} p-4 flex flex-col justify-between`}>
                    <div>
                      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="w-6 h-6 text-blue-600" />
                          <span className="font-bold text-lg">AKTU Marks</span>
                        </div>
                        <button onClick={() => setMobileMenuOpen(false)}><X className="w-5 h-5" /></button>
                      </div>
                      <nav className="mt-4 space-y-1">
                        {[
                          { id: 'dashboard', label: 'Dashboard', icon: Layers },
                          { id: 'pyqs', label: '10-Year PYQs', icon: FileText },
                          { id: 'units', label: 'Unit-Wise PYQs', icon: BookOpen },
                          { id: 'mocks', label: 'Mock Tests', icon: Clock },
                          { id: 'subjects', label: 'Syllabus', icon: GraduationCap },
                          { id: 'bookmarks', label: 'Saved & Notes', icon: Bookmark },
                          { id: 'analytics', label: 'Analytics', icon: BarChart3 }
                        ].map(item => (
                          <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
                            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm ${
                              activeTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <item.icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </nav>
                    </div>
                    <button 
                      onClick={() => setUser(null)}
                      className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-rose-500/10 text-rose-500 font-medium text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}

              {/* MAIN TAB CONTENT CONTAINER */}
              <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                {activeTab === 'dashboard' && (
                  <DashboardView 
                    user={user} 
                    branches={branches}
                    subjects={filteredSubjects}
                    pyqs={pyqs}
                    mockTests={mockTests}
                    attempts={testAttempts}
                    onNavigate={(tab, subjId) => {
                      if (subjId) setSelectedSubject(subjId);
                      setActiveTab(tab);
                    }}
                    onStartMock={(mock) => setCurrentMock(mock)}
                  />
                )}

                {activeTab === 'pyqs' && (
                  <PyqLibraryView 
                    subjects={filteredSubjects} 
                    pyqs={pyqs}
                    bookmarks={bookmarks}
                    onBookmarkToggle={handleBookmarkToggle}
                    onOpenPdf={(pdfData) => setActivePdfView(pdfData)}
                    selectedSubjectId={selectedSubject}
                  />
                )}

                {activeTab === 'units' && (
                  <UnitWiseQuestionsView 
                    subjects={filteredSubjects} 
                    pyqs={pyqs}
                    bookmarks={bookmarks}
                    notes={notes}
                    onBookmarkToggle={handleBookmarkToggle}
                    onSaveNote={handleSaveNote}
                  />
                )}

                {activeTab === 'mocks' && (
                  <MockTestEngineView 
                    mockTests={mockTests}
                    subjects={filteredSubjects}
                    attempts={testAttempts}
                    currentMock={currentMock}
                    onStartTest={(mock) => setCurrentMock(mock)}
                    onFinishTest={(attempt) => {
                      setTestAttempts(prev => [attempt, ...prev]);
                      setCurrentMock(null);
                      showToast('Mock Test submitted successfully!');
                    }}
                    onCancelTest={() => setCurrentMock(null)}
                  />
                )}

                {activeTab === 'subjects' && (
                  <SyllabusView 
                    subjects={filteredSubjects} 
                    pyqs={pyqs}
                    onSelectSubject={(subj) => setSelectedSubject(subj.id)}
                  />
                )}

                {activeTab === 'bookmarks' && (
                  <SavedNotesView 
                    pyqs={pyqs}
                    bookmarks={bookmarks}
                    notes={notes}
                    subjects={subjects}
                    onBookmarkToggle={handleBookmarkToggle}
                    onSaveNote={handleSaveNote}
                  />
                )}

                {activeTab === 'analytics' && (
                  <AnalyticsView 
                    attempts={testAttempts}
                    pyqs={pyqs}
                    subjects={filteredSubjects}
                  />
                )}

                {activeTab === 'admin' && user.role === 'admin' && (
                  <AdminPortalView 
                    subjects={subjects}
                    pyqs={pyqs}
                    onAddPyq={(newQ) => {
                      setPyqs(prev => [newQ, ...prev]);
                      showToast('New PYQ added to official database');
                    }}
                    onAddSubject={(newSubj) => {
                      setSubjects(prev => [...prev, newSubj]);
                      showToast('New Subject syllabus registered');
                    }}
                  />
                )}
              </main>
            </div>
          </div>
        )}

        {/* PDF VIEWER MODAL */}
        {activePdfView && (
          <PdfViewerModal 
            paper={activePdfView} 
            onClose={() => setActivePdfView(null)} 
          />
        )}

        {/* GLOBAL SEARCH MODAL */}
        {isSearchModalOpen && (
          <GlobalSearchModal 
                isOpen={isSearchModalOpen} 
                onClose={() => setIsSearchModalOpen(false)}
                pyqs={pyqs}
                subjects={subjects}
                onSelectQuestion={(q) => {
                  setIsSearchModalOpen(false);
                  setActiveTab('units');
                }}
              />
            )}
            </div>
            );
  }

  // ==========================================
  // 1. AUTHENTICATION & LOGIN SCREEN
  // ==========================================
  function AuthScreen({ branches, onLogin }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      name: 'Khushi Singh',
      email: 'khushiaktu@gmail.com',
      password: 'password123',
      branch: 'cse',
      semester: 3,
      college: 'IET Lucknow',
    role: 'student'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData);
  };

  const setDemoLogin = (roleType) => {
    if (roleType === 'student') {
      const demoUser = {
        name: 'Aman Verma',
        email: 'aman.cs25@kiet.edu',
        password: 'demo',
        branch: 'cse',
        semester: 3,
        college: 'KIET Group of Institutions, Ghaziabad',
        role: 'student'
      };
      setFormData(demoUser);
      onLogin(demoUser);
    } else {
      const demoAdmin = {
        name: 'Dr. V.K. Singh (Faculty)',
        email: 'admin.aktu@aktu.ac.in',
        password: 'admin',
        branch: 'cse',
        semester: 3,
        college: 'AKTU Main Campus, Lucknow',
        role: 'admin'
      };
      setFormData(demoAdmin);
      onLogin(demoAdmin);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
      {/* BACKGROUND DECORATIVE GLOWS */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-8 rounded-3xl shadow-2xl z-10 space-y-6">
        {/* LOGO & HEADING */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white shadow-xl shadow-blue-500/20 mb-2">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
            AKTU Marks
          </h1>
          <p className="text-xs text-slate-400 font-medium">Your AKTU Exam Preparation Companion</p>
        </div>

        {/* DEMO LOGIN BUTTONS */}
        <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/50 space-y-2">
          <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider block text-center">Quick One-Click Demo Logins</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoLogin('student')}
              className="py-2 px-3 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-xs font-semibold text-blue-200 transition text-center"
            >
              👨‍🎓 Student Login
            </button>
            <button
              type="button"
              onClick={() => setDemoLogin('admin')}
              className="py-2 px-3 rounded-xl bg-teal-600/30 hover:bg-teal-600/50 border border-teal-500/40 text-xs font-semibold text-teal-200 transition text-center"
            >
              🛡️ Faculty/Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-blue-500 text-white"
                placeholder="e.g. Rahul Sharma"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email / Roll No</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-blue-500 text-white"
              placeholder="student@aktu.ac.in"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-blue-500 text-white pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                {showPassword ? <X className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* BRANCH AND SEMESTER SELECTION */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">AKTU Branch</label>
              <select
                value={formData.branch}
                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-blue-500 text-white"
              >
                {branches.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Semester</label>
              <select
                value={formData.semester}
                onChange={e => setFormData({ ...formData, semester: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:border-blue-500 text-white"
              >
                <option value={3}>3rd Semester</option>
                <option value={4}>4th Semester</option>
              </select>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">College Name</label>
              <input
                type="text"
                value={formData.college}
                onChange={e => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-blue-500 text-white"
                placeholder="e.g. JSS Academy of Technical Education"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-semibold shadow-lg shadow-blue-500/25 transition text-sm flex items-center justify-center space-x-2"
          >
            <span>{isSignUp ? 'Create Student Account' : 'Login to AKTU Marks'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-slate-400 hover:text-teal-300 font-medium transition"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'New student? Register for AKTU 2nd Year'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. STUDENT DASHBOARD VIEW
// ==========================================
function DashboardView({ user, branches, subjects, pyqs, mockTests, attempts, onNavigate, onStartMock }) {
  const branchName = branches.find(b => b.id === user.branch)?.name;

  return (
    <div className="space-y-6">
      {/* WELCOME BANNER CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 p-6 md:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
            🎓 {branchName} • Semester {user.semester}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Welcome back, {user.name}! 👋
          </h2>
          <p className="text-blue-100 text-sm leading-relaxed">
            Ready to ace your AKTU End-Sem exams? You have 5 high-frequency topics pending revision for Semester {user.semester}.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('units')}
              className="px-5 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-semibold text-xs md:text-sm shadow-md transition flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Continue Unit Practice</span>
            </button>
            <button
              onClick={() => onNavigate('mocks')}
              className="px-5 py-2.5 rounded-xl bg-blue-900/40 hover:bg-blue-900/60 border border-white/20 text-white font-semibold text-xs md:text-sm backdrop-blur-md transition flex items-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>Take a Mock Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* QUICK METRICS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Available PYQs', val: `${pyqs.length}+ Verified`, sub: '2014-2024 Papers', icon: FileText, color: 'text-blue-500' },
          { label: 'Active Subjects', val: subjects.length, sub: `Sem ${user.semester} Syllabus`, icon: GraduationCap, color: 'text-teal-500' },
          { label: 'Tests Attempted', val: attempts.length, sub: 'Avg Accuracy: 85%', icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Daily Goal', val: '4 / 5 Units', sub: '80% Completed Today', icon: Award, color: 'text-amber-500' }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">{card.label}</span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-lg font-bold">{card.val}</p>
              <p className="text-[11px] text-slate-400">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* SUBJECT PREPARATION PROGRESS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Semester {user.semester} Subject Readiness</h3>
          <button onClick={() => onNavigate('subjects')} className="text-xs text-blue-500 hover:underline font-semibold">View All Syllabus</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjects.map((sub, i) => {
            const subPyqs = pyqs.filter(p => p.subjectId === sub.id);
            const progressVal = [65, 80, 45, 90, 30][i % 5];
            return (
              <div key={sub.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      {sub.code}
                    </span>
                    <h4 className="font-bold text-sm mt-1">{sub.name}</h4>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-teal-500" title="AKTU Official Verified" />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-400">Preparation Level</span>
                    <span className="text-teal-500 font-bold">{progressVal}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-teal-400 h-full rounded-full transition-all duration-500" style={{ width: `${progressVal}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50 text-xs text-slate-400">
                  <span>{sub.units.length} Units • {subPyqs.length} PYQs</span>
                  <button 
                    onClick={() => onNavigate('units', sub.id)}
                    className="text-blue-500 hover:text-blue-600 font-semibold flex items-center space-x-1"
                  >
                    <span>Practice</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK ACCESS MOCK TESTS */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Recommended AKTU Practice Tests</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockTests.map(mock => (
            <div key={mock.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-emerald-500">⚡ Verified Mock Paper</span>
                <h4 className="font-bold text-sm">{mock.title}</h4>
                <div className="flex items-center space-x-3 text-xs text-slate-400">
                  <span>⏱️ {mock.durationMinutes} Mins</span>
                  <span>❓ {mock.questionCount} Questions</span>
                  <span>🏆 {mock.totalMarks} Marks</span>
                </div>
              </div>

              <button
                onClick={() => onStartMock(mock)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition flex items-center space-x-1"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. 10-YEAR PYQ LIBRARY VIEW
// ==========================================
function PyqLibraryView({ subjects, pyqs, bookmarks, onBookmarkToggle, onOpenPdf, selectedSubjectId }) {
  const [filterSem, setFilterSem] = useState(3);
  const [filterYear, setFilterYear] = useState('All');
  const [filterSubject, setFilterSubject] = useState(selectedSubjectId || 'All');
  const [filterExamType, setFilterExamType] = useState('All');

  const filteredPyqs = useMemo(() => {
    return pyqs.filter(q => {
      const sub = subjects.find(s => s.id === q.subjectId);
      if (filterSubject !== 'All' && q.subjectId !== filterSubject) return false;
      if (filterYear !== 'All' && q.year !== filterYear) return false;
      if (filterExamType !== 'All' && q.examType !== filterExamType) return false;
      return true;
    });
  }, [pyqs, filterSubject, filterYear, filterExamType, subjects]);

  return (
    <div className="space-y-6">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h2 className="text-xl font-bold">AKTU 10-Year Question Papers (2014 - 2024)</h2>
          <p className="text-xs text-slate-400 mt-1">Authentic semester exam papers sourced & verified for AKTU B.Tech</p>
        </div>

        {/* FILTER CONTROL CONTROLS */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterSubject}
            onChange={e => setFilterSubject(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 border-none text-xs font-semibold focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Subjects</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
          </select>

          <select
            value={filterYear}
            onChange={e => setFilterYear(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 border-none text-xs font-semibold focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Years</option>
            {['2023-24', '2022-23', '2021-22', '2020-21', '2019-20'].map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select
            value={filterExamType}
            onChange={e => setFilterExamType(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 border-none text-xs font-semibold focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Exam Types</option>
            <option value="End Sem">Regular End Sem</option>
            <option value="Carry-over">Carry-Over Paper</option>
          </select>
        </div>
      </div>

      {/* QUESTION PAPERS SIMULATED CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPyqs.map(q => {
          const sub = subjects.find(s => s.id === q.subjectId);
          const isBookmarked = bookmarks.includes(q.id);
          return (
            <div key={q.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
                      {sub?.code || 'AKTU'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold text-xs">
                      Session {q.year}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                      {q.examType}
                    </span>
                  </div>

                  <button
                    onClick={() => onBookmarkToggle(q.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-blue-500 text-blue-500' : 'text-slate-400'}`} />
                  </button>
                </div>

                <h4 className="font-semibold text-sm leading-snug">{q.text}</h4>

                <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1">
                  <span>Unit {q.unitId}</span>
                  <span>Marks: {q.marks}</span>
                  <span className="text-rose-500 font-semibold">Asked {q.repeatCount}x in AKTU</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50">
                <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Paper PDF</span>
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onOpenPdf({ title: `${sub?.code} (${q.year}) ${q.examType}`, question: q })}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-xs font-semibold transition flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View PDF</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================
// 4. UNIT-WISE QUESTION BROWSER
// ==========================================
function UnitWiseQuestionsView({ subjects, pyqs, bookmarks, notes, onBookmarkToggle, onSaveNote }) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || 'kcs301');
  const [selectedUnitId, setSelectedUnitId] = useState(1);
  const [editingNoteQId, setEditingNoteQId] = useState(null);
  const [tempNoteText, setTempNoteText] = useState('');

  const currentSubject = subjects.find(s => s.id === selectedSubjectId);
  const currentUnitQuestions = pyqs.filter(q => q.subjectId === selectedSubjectId && q.unitId === selectedUnitId);

  return (
    <div className="space-y-6">
      {/* SUBJECT SELECTOR TABS */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {subjects.map(s => (
          <button
            key={s.id}
            onClick={() => { setSelectedSubjectId(s.id); setSelectedUnitId(1); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedSubjectId === s.id 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {s.code}: {s.name}
          </button>
        ))}
      </div>

      {/* UNIT SELECTOR (UNITS 1 TO 5) */}
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map(uNum => {
          const unitData = currentSubject?.units.find(u => u.id === uNum);
          const isSelected = selectedUnitId === uNum;
          return (
            <button
              key={uNum}
              onClick={() => setSelectedUnitId(uNum)}
              className={`p-3 rounded-2xl text-left border transition ${
                isSelected 
                  ? 'bg-gradient-to-tr from-blue-600 to-teal-500 text-white border-transparent shadow-lg shadow-blue-500/20' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400'
              }`}
            >
              <span className="text-[10px] font-bold uppercase opacity-80 block">Unit {uNum}</span>
              <p className="font-semibold text-xs truncate mt-0.5">{unitData?.name.split(':')[1] || `Unit ${uNum}`}</p>
            </button>
          );
        })}
      </div>

      {/* QUESTIONS LIST */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider">
          Unit {selectedUnitId} Sourced Questions ({currentUnitQuestions.length})
        </h3>

        {currentUnitQuestions.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold">No questions uploaded yet for this specific unit.</p>
            <p className="text-xs text-slate-400">Admin faculty are constantly uploading verified AKTU papers.</p>
          </div>
        ) : (
          currentUnitQuestions.map(q => {
            const isBookmarked = bookmarks.includes(q.id);
            const userNote = notes[q.id];

            return (
              <div key={q.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
                        {q.marks} Marks
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-xs">
                        Year: {q.year} ({q.examType})
                      </span>
                      {q.repeatCount >= 4 && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs animate-pulse">
                          🔥 High Frequency ({q.repeatCount}x Repeated)
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-base pt-1">{q.text}</h4>
                  </div>

                  <button
                    onClick={() => onBookmarkToggle(q.id)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-blue-500 text-blue-500' : 'text-slate-400'}`} />
                  </button>
                </div>

                {/* SOLUTION BRIEF */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <span className="font-bold text-teal-600 dark:text-teal-400 flex items-center space-x-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Model Answer Key / Strategy Hint:</span>
                  </span>
                  <p>{q.solution}</p>
                </div>

                {/* PERSONAL NOTES SECTION */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50 flex flex-col space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-400 flex items-center space-x-1">
                      <Edit3 className="w-3 h-3" />
                      <span>My Personal Revision Note</span>
                    </span>
                    {editingNoteQId !== q.id && (
                      <button
                        onClick={() => { setEditingNoteQId(q.id); setTempNoteText(userNote || ''); }}
                        className="text-blue-500 hover:underline font-semibold"
                      >
                        {userNote ? 'Edit Note' : '+ Add Note'}
                      </button>
                    )}
                  </div>

                  {editingNoteQId === q.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={tempNoteText}
                        onChange={e => setTempNoteText(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-white"
                        placeholder="Write quick formulas, page references or key points..."
                        rows={2}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingNoteQId(null)}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => { onSaveNote(q.id, tempNoteText); setEditingNoteQId(null); }}
                          className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold"
                        >
                          Save Note
                        </button>
                      </div>
                    </div>
                  ) : userNote ? (
                    <p className="text-xs bg-amber-500/10 text-amber-800 dark:text-amber-200 p-2.5 rounded-xl border border-amber-500/20">
                      {userNote}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ==========================================
// 5. INTERACTIVE MOCK TEST ENGINE
// ==========================================
function MockTestEngineView({ mockTests, subjects, attempts, currentMock, onStartTest, onFinishTest, onCancelTest }) {
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [reviewMarked, setReviewMarked] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  // Timer countdown hook
  useEffect(() => {
    if (!currentMock) return;
    setTimeLeft(currentMock.durationMinutes * 60);
    setActiveQuestionIdx(0);
    setSelectedAnswers({});
    setReviewMarked([]);
  }, [currentMock]);

  useEffect(() => {
    if (!currentMock || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentMock, timeLeft]);

  const handleAutoSubmit = () => {
    if (!currentMock) return;
    let score = 0;
    currentMock.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score += q.marks;
      }
    });

    const attemptObj = {
      id: `att-${Date.now()}`,
      testId: currentMock.id,
      score,
      maxScore: currentMock.totalMarks,
      accuracy: Math.round((score / currentMock.totalMarks) * 100),
      date: new Date().toISOString().split('T')[0]
    };

    onFinishTest(attemptObj);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (currentMock) {
    const q = currentMock.questions[activeQuestionIdx];

    return (
      <div className="space-y-6">
        {/* TOP LIVE TIMER BAR */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-lg">
          <div>
            <h3 className="font-bold text-sm text-blue-400">{currentMock.title}</h3>
            <p className="text-xs text-slate-400">Question {activeQuestionIdx + 1} of {currentMock.questions.length}</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono text-sm font-bold">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={handleAutoSubmit}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow"
            >
              Submit Exam
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* QUESTION BOX */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50 pb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-500/10 text-blue-500">
                + {q.marks} Marks
              </span>
              <button
                onClick={() => {
                  setReviewMarked(prev => prev.includes(activeQuestionIdx) ? prev.filter(i => i !== activeQuestionIdx) : [...prev, activeQuestionIdx]);
                }}
                className={`text-xs font-semibold px-3 py-1 rounded-xl transition ${
                  reviewMarked.includes(activeQuestionIdx) ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                }`}
              >
                {reviewMarked.includes(activeQuestionIdx) ? '★ Marked for Review' : 'Mark for Review'}
              </button>
            </div>

            <h3 className="font-semibold text-base leading-relaxed">{q.text}</h3>

            <div className="space-y-3">
              {q.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[activeQuestionIdx] === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => setSelectedAnswers(prev => ({ ...prev, [activeQuestionIdx]: optIdx }))}
                    className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition flex items-center space-x-3 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-white text-blue-600' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
              <button
                disabled={activeQuestionIdx === 0}
                onClick={() => setActiveQuestionIdx(prev => prev - 1)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold disabled:opacity-40"
              >
                Previous
              </button>

              <button
                disabled={activeQuestionIdx === currentMock.questions.length - 1}
                onClick={() => setActiveQuestionIdx(prev => prev + 1)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold disabled:opacity-40"
              >
                Next Question
              </button>
            </div>
          </div>

          {/* QUESTION PALETTE */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h4 className="font-bold text-sm">Question Palette</h4>

            <div className="grid grid-cols-4 gap-2">
              {currentMock.questions.map((_, idx) => {
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isReview = reviewMarked.includes(idx);
                const isCurrent = activeQuestionIdx === idx;

                let btnBg = 'bg-slate-100 dark:bg-slate-700 text-slate-500';
                if (isAnswered) btnBg = 'bg-emerald-500 text-white';
                if (isReview) btnBg = 'bg-amber-500 text-white';
                if (isCurrent) btnBg += ' ring-2 ring-blue-500 ring-offset-2';

                return (
                  <button
                    key={idx}
                    onClick={() => setActiveQuestionIdx(idx)}
                    className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center transition ${btnBg}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded bg-slate-200 dark:bg-slate-700" />
                <span>Unanswered</span>
              </div>
            </div>

            <button
              onClick={onCancelTest}
              className="w-full mt-4 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition"
            >
              Exit Mock Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">AKTU Practice & Mock Exam Portal</h2>
          <p className="text-xs text-slate-400 mt-0.5">Simulate actual end-semester exam conditions with custom timers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockTests.map(mock => (
          <div key={mock.id} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-teal-500">Official Exam Simulation</span>
              <h3 className="text-lg font-bold">{mock.title}</h3>
              <p className="text-xs text-slate-400">Covers critical unit questions with detailed solution keys.</p>
            </div>

            <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>{mock.durationMinutes} Minutes</span>
              </span>
              <span className="flex items-center space-x-1">
                <FileText className="w-4 h-4 text-teal-500" />
                <span>{mock.questionCount} Questions</span>
              </span>
              <span className="flex items-center space-x-1">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{mock.totalMarks} Marks</span>
              </span>
            </div>

            <button
              onClick={() => onStartTest(mock)}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Test Now</span>
            </button>
          </div>
        ))}
      </div>

      {/* PAST MOCK TEST ATTEMPTS HISTORY */}
      <div className="space-y-4">
        <h3 className="font-bold text-base">Your Previous Test Performance</h3>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-400 font-bold uppercase">
              <tr>
                <th className="p-4">Test Name</th>
                <th className="p-4">Date</th>
                <th className="p-4">Score</th>
                <th className="p-4">Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 font-medium">
              {attempts.map(att => {
                const mock = mockTests.find(m => m.id === att.testId);
                return (
                  <tr key={att.id}>
                    <td className="p-4 font-bold">{mock?.title || 'AKTU Practice Test'}</td>
                    <td className="p-4 text-slate-400">{att.date}</td>
                    <td className="p-4">{att.score} / {att.maxScore}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">
                        {att.accuracy}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. SYLLABUS & SUBJECT LIBRARY
// ==========================================
function SyllabusView({ subjects, pyqs, onSelectSubject }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">AKTU Official B.Tech Syllabus</h2>
        <p className="text-xs text-slate-400 mt-0.5">Unit-wise curriculum structure according to AKTU Lucknow ordinance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map(sub => (
          <div key={sub.id} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  {sub.code}
                </span>
                <h3 className="text-lg font-bold mt-1">{sub.name}</h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold">Semester {sub.sem}</span>
            </div>

            <div className="space-y-3">
              {sub.units.map(unit => (
                <div key={unit.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <h4 className="font-bold text-slate-700 dark:text-slate-200">{unit.name}</h4>
                  <p className="text-slate-400 leading-relaxed">{unit.topics}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => onSelectSubject(sub)}
              className="w-full py-2.5 rounded-xl border border-blue-500/30 text-blue-500 hover:bg-blue-500/10 font-semibold text-xs transition"
            >
              Explore Unit Questions
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 7. SAVED BOOKMARKS & REVISION NOTES
// ==========================================
function SavedNotesView({ pyqs, bookmarks, notes, subjects, onBookmarkToggle, onSaveNote }) {
  const savedQuestions = pyqs.filter(q => bookmarks.includes(q.id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Bookmarks & Personal Revision Notes</h2>
        <p className="text-xs text-slate-400 mt-0.5">Your pinned high-priority questions and custom formula sheets</p>
      </div>

      {savedQuestions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
          <Bookmark className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-base">No saved bookmarks yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">Click the bookmark icon on any question in PYQ or Unit tabs to save it for quick revision here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedQuestions.map(q => {
            const sub = subjects.find(s => s.id === q.subjectId);
            const noteText = notes[q.id];
            return (
              <div key={q.id} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-blue-500">{sub?.code} • Unit {q.unitId}</span>
                    <h4 className="font-bold text-sm">{q.text}</h4>
                  </div>
                  <button onClick={() => onBookmarkToggle(q.id)}>
                    <Bookmark className="w-5 h-5 fill-blue-500 text-blue-500" />
                  </button>
                </div>

                {noteText && (
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-500/20 text-xs">
                    <span className="font-bold block mb-0.5">📝 Personal Note:</span>
                    {noteText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 8. PERFORMANCE ANALYTICS VIEW
// ==========================================
function AnalyticsView({ attempts, pyqs, subjects }) {
  const chartData = [
    { name: 'Mock 1', score: 65 },
    { name: 'Mock 2', score: 75 },
    { name: 'Mock 3', score: 85 },
    { name: 'Mock 4', score: 90 },
    { name: 'Mock 5', score: 95 }
  ];

  const radarData = [
    { subject: 'DS', A: 85, fullMark: 100 },
    { subject: 'COA', A: 65, fullMark: 100 },
    { subject: 'DSTL', A: 70, fullMark: 100 },
    { subject: 'OS', A: 90, fullMark: 100 },
    { subject: 'TAFL', A: 55, fullMark: 100 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Exam Readiness Analytics</h2>
        <p className="text-xs text-slate-400 mt-0.5">Real-time performance metrics derived from your mock attempts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SCORE PROGRESS LINE CHART */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-bold text-sm">Score Progression Over Time</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SUBJECT STRENGTH RADAR CHART */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-bold text-sm">Subject Strength Profile</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid opacity={0.2} />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={12} />
                <PolarRadiusAxis />
                <Radar name="Proficiency" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 9. FACULTY / ADMIN PORTAL VIEW
// ==========================================
function AdminPortalView({ subjects, pyqs, onAddPyq, onAddSubject }) {
  const [newQText, setNewQText] = useState('');
  const [newQSubject, setNewQSubject] = useState(subjects[0]?.id || 'kcs301');
  const [newQUnit, setNewQUnit] = useState(1);
  const [newQYear, setNewQYear] = useState('2023-24');
  const [newQMarks, setNewQMarks] = useState(7);
  const [newQSol, setNewQSol] = useState('');

  const handleCreateQuestion = (e) => {
    e.preventDefault();
    if (!newQText) return;
    const newObj = {
      id: `q-${Date.now()}`,
      subjectId: newQSubject,
      unitId: Number(newQUnit),
      year: newQYear,
      examType: 'End Sem',
      marks: Number(newQMarks),
      text: newQText,
      repeatCount: 1,
      difficulty: 'Medium',
      solution: newQSol || 'Solution pending verification.'
    };
    onAddPyq(newObj);
    setNewQText('');
    setNewQSol('');
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-800 dark:text-teal-200 flex items-center space-x-3">
        <ShieldCheck className="w-6 h-6 text-teal-500" />
        <div>
          <h3 className="font-bold text-sm">AKTU Verified Faculty Admin Portal</h3>
          <p className="text-xs opacity-90">Upload official PYQ papers, update syllabus codes, and verify solutions.</p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-bold text-base">Upload New Verified AKTU Question</h3>

        <form onSubmit={handleCreateQuestion} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Subject</label>
              <select
                value={newQSubject}
                onChange={e => setNewQSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 border-none text-xs font-semibold"
              >
                {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Unit Number</label>
              <select
                value={newQUnit}
                onChange={e => setNewQUnit(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 border-none text-xs font-semibold"
              >
                {[1, 2, 3, 4, 5].map(u => <option key={u} value={u}>Unit {u}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Exam Year</label>
              <input
                type="text"
                value={newQYear}
                onChange={e => setNewQYear(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-100 dark:bg-slate-700 border-none text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Marks</label>
              <select
                value={newQMarks}
                onChange={e => setNewQMarks(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 border-none text-xs font-semibold"
              >
                <option value={2}>2 Marks (Short)</option>
                <option value={7}>7 Marks (Long)</option>
                <option value={10}>10 Marks (Long)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Question Text</label>
            <textarea
              required
              rows={3}
              value={newQText}
              onChange={e => setNewQText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-700 border-none text-xs font-medium"
              placeholder="Enter exact text as printed on the official AKTU question paper..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Model Solution Key / Strategy</label>
            <textarea
              rows={2}
              value={newQSol}
              onChange={e => setNewQSol(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-700 border-none text-xs font-medium"
              placeholder="Provide model answer outline or step-by-step key..."
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition"
          >
            Publish Verified Question
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 10. PDF VIEWER MODAL SIMULATOR
// ==========================================
function PdfViewerModal({ paper, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-sm text-white">{paper.title} - Official AKTU Document</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-950 font-serif text-slate-200 space-y-6">
          <div className="text-center space-y-1 border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold tracking-wide uppercase">Dr. A.P.J. Abdul Kalam Technical University, Uttar Pradesh</h2>
            <p className="text-xs text-slate-400">B.TECH 2ND YEAR (SEM III/IV) THEORY EXAMINATION {paper.question?.year || '2023-24'}</p>
            <p className="text-xs font-bold text-teal-400">PAPER CODE: {paper.question?.subjectId?.toUpperCase()}</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-xs font-sans font-bold text-slate-400">
              <span>Time: 3 Hours</span>
              <span>Total Marks: 70</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 font-sans space-y-2">
              <span className="text-xs font-bold text-amber-400 block">SECTION A / B QUESTION EXCERPT:</span>
              <p className="text-sm">{paper.question?.text}</p>
              <p className="text-xs text-slate-400 italic">[{paper.question?.marks} Marks]</p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-between items-center">
          <span className="text-xs text-teal-400 font-medium">✓ Source Sourced & Digitally Verified</span>
          <button
            onClick={() => alert("Downloading PDF to your device...")}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Official PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 11. GLOBAL SEARCH MODAL (Cmd+K)
// ==========================================
function GlobalSearchModal({ isOpen, onClose, pyqs, subjects, onSelectQuestion }) {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query) return [];
    return pyqs.filter(q => q.text.toLowerCase().includes(query.toLowerCase()));
  }, [query, pyqs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden space-y-4 p-4">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none"
            placeholder="Type keywords like 'Page Replacement', 'BST', 'Banker'..."
          />
          <button onClick={onClose}><X className="w-4 h-4 text-slate-400" /></button>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-2">
          {searchResults.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">
              {query ? 'No matching AKTU questions found.' : 'Start typing to search past year questions...'}
            </p>
          ) : (
            searchResults.map(q => {
              const sub = subjects.find(s => s.id === q.subjectId);
              return (
                <button
                  key={q.id}
                  onClick={() => onSelectQuestion(q)}
                  className="w-full text-left p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition space-y-1 block"
                >
                  <span className="text-[10px] font-bold text-blue-400">{sub?.code} • Unit {q.unitId}</span>
                  <p className="text-xs font-semibold text-white truncate">{q.text}</p>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}