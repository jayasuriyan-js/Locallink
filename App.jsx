import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Camera,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Star,
  ShieldCheck,
  Calendar,
  MapPin,
  Phone,
  Moon,
  Sun,
  ChevronRight,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  CheckSquare,
  Square,
  Search,
  Filter,
  Users,
  Briefcase,
  Play,
  RotateCcw
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_ISSUES = [
  {
    id: 'pipe-leak',
    title: 'Under-Sink P-Trap Joint Separation',
    category: 'Emergency Plumbing',
    urgency: 'Critical / Active Leak',
    rootCause: 'Damaged slip-joint compression ring & cross-threaded PVC coupling causing active water pooling under head pressure.',
    estimatedTime: '45 - 60 min',
    priceRange: '₹950 - ₹1,450',
    confidence: 98,
    image: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
    suggestedTools: [
      '1-1/2 in. PVC P-Trap Assembly Kit',
      'Slip-joint rubber friction washers (2-pack)',
      'Teflon PTFE High-Density thread seal tape',
      '12 in. Adjustable tongue & groove pliers'
    ]
  },
  {
    id: 'gfci-spark',
    title: 'Arcing 120V GFCI Outlet Spark',
    category: 'Electrical Safety',
    urgency: 'High Urgency (< 24h)',
    rootCause: 'Loose terminal screw connection creating micro-arcing and thermal scorch marks on faceplate, tripping upstream breaker.',
    estimatedTime: '30 - 45 min',
    priceRange: '₹850 - ₹1,250',
    confidence: 96,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    suggestedTools: [
      '20A Tamper-resistant self-test GFCI receptacle',
      'Dual-range non-contact voltage tester',
      'Commercial grade wire strippers & wire nuts',
      'Deep gang box grounding pigtail'
    ]
  },
  {
    id: 'hvac-drip',
    title: 'AC Condensate Line Clog & Overflow',
    category: 'HVAC & Cooling',
    urgency: 'Medium Urgency',
    rootCause: 'Biocidal algae blockage in 3/4\" gravity drain line triggering secondary float switch cutoff.',
    estimatedTime: '60 - 75 min',
    priceRange: '₹1,200 - ₹1,850',
    confidence: 94,
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=600&q=80',
    suggestedTools: [
      'HVAC Line wet-vac suction adapter fitting',
      'Pan-Treat drain pan enzyme tablets',
      '3/4 in. PVC cleanout tee & cap',
      'Replacement condensate float switch'
    ]
  }
];

const INITIAL_PROVIDERS = [
  {
    id: 'pro-1',
    name: 'Marcus Vance',
    business: 'Vance Precision Plumbing',
    specialty: 'Master Licensed Plumber (#PL-8821)',
    rating: 4.98,
    reviews: 184,
    distance: '1.2 mi',
    hourlyRate: 499,
    badge: 'LocalLink Certified Master',
    completedJobs: 342,
    avatar: 'MV',
    phone: '+91 98450 11023'
  },
  {
    id: 'pro-2',
    name: 'Elena Rostova',
    business: 'VoltCraft Electrical Labs',
    specialty: 'Certified Master Electrician',
    rating: 4.96,
    reviews: 142,
    distance: '2.1 mi',
    hourlyRate: 599,
    badge: 'Verified Top Pro',
    completedJobs: 286,
    avatar: 'ER',
    phone: '+91 98210 99341'
  },
  {
    id: 'pro-3',
    name: 'David Chen',
    business: 'Apex Thermal Solutions',
    specialty: 'EPA Universal HVAC Tech',
    rating: 4.94,
    reviews: 98,
    distance: '3.4 mi',
    hourlyRate: 549,
    badge: 'Rapid Response Pro',
    completedJobs: 195,
    avatar: 'DC',
    phone: '+91 97120 44125'
  }
];

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(true);
  // View mode: 'customer' | 'provider'
  const [viewMode, setViewMode] = useState('customer');

  // Customer State
  const cameraInputRef = React.useRef(null);
  const [activeIssue, setActiveIssue] = useState(INITIAL_ISSUES[0]);
  const [isScanningModalOpen, setIsScanningModalOpen] = useState(false);
  const [scanStep, setScanStep] = useState('idle'); // 'idle' | 'scanning' | 'diagnosed'
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(INITIAL_PROVIDERS[0]);
  const [selectedDate, setSelectedDate] = useState('Today');
  const [selectedSlot, setSelectedSlot] = useState('2:30 PM - 3:30 PM');
  const [bookingAddress, setBookingAddress] = useState('742 Evergreen Terrace, Flat 4B');
  const [bookingNotes, setBookingNotes] = useState('Under-sink access is behind the left cabinet door.');
  const [customerBookings, setCustomerBookings] = useState([
    {
      id: 'bk-101',
      issue: INITIAL_ISSUES[0],
      provider: INITIAL_PROVIDERS[0],
      date: 'Today',
      slot: '2:30 PM - 3:30 PM',
      status: 'Pro En Route',
      price: '₹1,250'
    }
  ]);

  // Provider State
  const [isAvailable, setIsAvailable] = useState(true);
  const [providerRequests, setProviderRequests] = useState([
    {
      id: 'req-201',
      customerName: 'Sophia Reynolds',
      address: '824 Willow Creek Way, Suite 12',
      issue: INITIAL_ISSUES[0],
      slot: 'Urgent / Immediate',
      price: '₹1,450',
      parts: INITIAL_ISSUES[0].suggestedTools.map((tool, idx) => ({
        id: `tool-${idx}`,
        name: tool,
        checked: idx < 2
      }))
    }
  ]);
  const [schedule, setSchedule] = useState([
    {
      id: 'sch-1',
      time: '09:30 AM - 10:30 AM',
      client: 'Robert Davis',
      address: '512 Oak Ridge Rd',
      service: 'Pressure Relief Valve Replacement',
      status: 'Completed',
      earnings: '₹1,600'
    },
    {
      id: 'sch-2',
      time: '01:15 PM - 02:15 PM',
      client: 'Sophia Reynolds',
      address: '824 Willow Creek Way',
      service: 'Kitchen Sink P-Trap Assembly',
      status: 'En Route',
      earnings: '₹1,450'
    },
    {
      id: 'sch-3',
      time: '04:30 PM - 05:30 PM',
      client: 'Greg Anderson',
      address: '1209 Cedar Lane',
      service: 'Main Line Regulator Check',
      status: 'Scheduled',
      earnings: '₹950'
    }
  ]);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Run AI Scanning Sequence
  const handleStartScan = (issueToScan) => {
    if (issueToScan) setActiveIssue(issueToScan);
    setIsScanningModalOpen(true);
    setScanStep('scanning');
    setScanProgress(10);
    setScanStatusText('Initializing neural vision pipeline...');

    setTimeout(() => {
      setScanProgress(38);
      setScanStatusText('Analyzing pipe geometry & moisture reflection...');
    }, 600);

    setTimeout(() => {
      setScanProgress(72);
      setScanStatusText('Isolating thread fatigue & slip-joint deterioration...');
    }, 1300);

    setTimeout(() => {
      setScanProgress(96);
      setScanStatusText('Synthesizing parts catalogue & labor estimate in INR...');
    }, 2000);

    setTimeout(() => {
      setScanProgress(100);
      setScanStep('diagnosed');
      setScanStatusText('Diagnostic complete! High confidence match (98%).');
    }, 2600);
  };

  // Confirm Progressive Booking
  const handleConfirmBooking = () => {
    const newBooking = {
      id: `bk-${Date.now().toString().slice(-4)}`,
      issue: activeIssue,
      provider: selectedProvider,
      date: selectedDate,
      slot: selectedSlot,
      status: 'Confirmed',
      price: activeIssue.priceRange.split('-')[1]?.trim() || '₹1,450'
    };

    setCustomerBookings([newBooking, ...customerBookings]);
    setSchedule([
      {
        id: `sch-${Date.now().toString().slice(-4)}`,
        time: selectedSlot,
        client: 'Alex Morgan',
        address: bookingAddress,
        service: activeIssue.title,
        status: 'Confirmed',
        earnings: newBooking.price
      },
      ...schedule
    ]);

    setIsBookingOpen(false);
    showToast(`Booking confirmed! ${selectedProvider.name} scheduled for ${selectedDate} (${selectedSlot})`);
  };

  // Provider Checklist Toggle
  const toggleToolCheck = (requestId, toolId) => {
    setProviderRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            parts: req.parts.map(p => (p.id === toolId ? { ...p, checked: !p.checked } : p))
          };
        }
        return req;
      })
    );
  };

  // Provider Accept Request
  const handleAcceptRequest = (reqId) => {
    const req = providerRequests.find(r => r.id === reqId);
    if (!req) return;
    setProviderRequests(prev => prev.filter(r => r.id !== reqId));
    setSchedule([
      {
        id: `sch-${Date.now().toString().slice(-4)}`,
        time: req.slot,
        client: req.customerName,
        address: req.address,
        service: req.issue.title,
        status: 'En Route',
        earnings: req.price
      },
      ...schedule
    ]);
    showToast(`Request accepted! En route to ${req.customerName}`);
  };

  const handleDeclineRequest = (reqId) => {
    setProviderRequests(prev => prev.filter(r => r.id !== reqId));
    showToast('Request declined and reassigned to next available pro.');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#08090D] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
        
        {/* TOAST NOTIFICATION */}
        {toastMsg && (
          <div className="fixed bottom-5 right-5 z-50 bg-indigo-600 dark:bg-indigo-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 animate-bounce">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-sm font-semibold">{toastMsg}</span>
          </div>
        )}

        {/* STICKY TOP NAVIGATION BAR */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0D0E17]/80 backdrop-blur-md border-b border-slate-200 dark:border-[#222438] px-4 lg:px-8 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Logo & Brand */}
            <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">LocalLink</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">AI-PRO • INR</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Smart Local Service Marketplace</p>
                </div>
              </div>

              {/* Mobile theme toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="sm:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {/* MASTER DUAL-VIEW TOGGLE */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-[#151726] rounded-xl border border-slate-200 dark:border-[#262A45] shadow-inner w-full sm:w-auto">
              <button
                onClick={() => setViewMode('customer')}
                className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  viewMode === 'customer'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Customer Portal</span>
              </button>

              <button
                onClick={() => setViewMode('provider')}
                className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  viewMode === 'provider'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Provider Dashboard</span>
                {providerRequests.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </button>
            </div>

            {/* Dark Mode & Profile */}
            <div className="hidden sm:flex items-center space-x-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-[#161828] border border-slate-200 dark:border-[#292D4A] text-slate-600 dark:text-slate-300 hover:scale-105 transition-transform"
                title="Toggle Theme"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              <div className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="relative">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
                    {viewMode === 'customer' ? 'AM' : 'MV'}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-[#08090D] ${isAvailable ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                </div>
              </div>
            </div>

          </div>
        </header>

        {/* MAIN BODY CONTAINER */}
        <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          
          {/* ================= CUSTOMER PORTAL ================= */}
          {viewMode === 'customer' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* HERO AI DIAGNOSTICS BANNER */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900/50 dark:from-indigo-950/80 dark:via-[#111224] dark:to-black border border-indigo-500/30 dark:border-indigo-500/20 p-8 shadow-2xl backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10 max-w-2xl space-y-4">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI-Powered Job Diagnostics</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Diagnose Home Repairs in Seconds. Book Verified Pros Instantly.
                  </h1>

                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                    Upload a photo of your leak, electrical spark, or HVAC breakdown. Our vision AI identifies failure causes, calculates real-time price ranges in Indian Rupees (₹), and equips local pros with required parts before they arrive.
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={cameraInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        const liveIssue = {
                          id: `live-${Date.now()}`,
                          title: 'Live Camera Detected Defect',
                          category: 'Emergency Plumbing',
                          urgency: 'Critical / Active Leak',
                          rootCause: 'Active fluid discharge and mechanical joint displacement identified from camera feed.',
                          estimatedTime: '45 - 60 min',
                          priceRange: '₹950 - ₹1,450',
                          confidence: 98,
                          image: url,
                          suggestedTools: [
                            '1-1/2 in. PVC P-Trap Assembly Kit',
                            'Slip-joint rubber friction washers (2-pack)',
                            'Teflon PTFE High-Density thread seal tape',
                            '12 in. Adjustable tongue & groove pliers'
                          ]
                        };
                        setActiveIssue(liveIssue);
                        handleStartScan(liveIssue);
                      }
                    }}
                  />
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        if (cameraInputRef.current) {
                          cameraInputRef.current.click();
                        } else {
                          handleStartScan(null);
                        }
                      }}
                      className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-transform hover:scale-[1.02]"
                    >
                      <Camera className="w-5 h-5" />
                      <span>Open Camera to Scan Your Issue</span>
                    </button>
                  </div>

                  {/* Sample Quick Testers */}
                  <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/80">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-2">Or test with sample failure:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {INITIAL_ISSUES.map(issue => (
                        <button
                          key={issue.id}
                          onClick={() => handleStartScan(issue)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/70 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-slate-700 dark:text-slate-200 flex items-center space-x-1.5 transition-all"
                        >
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                          <span>{issue.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIVE BOOKINGS TRACKER */}
              {customerBookings.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-indigo-500" />
                      <span>Your Scheduled Appointments</span>
                    </h2>
                    <span className="text-xs text-indigo-500 font-semibold">{customerBookings.length} Active</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customerBookings.map(b => (
                      <div
                        key={b.id}
                        className="p-5 rounded-2xl bg-white dark:bg-[#121422] border border-slate-200 dark:border-[#242842] shadow-sm flex flex-col justify-between space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{b.status}</span>
                            </div>
                            <h3 className="font-bold text-base mt-2 text-slate-900 dark:text-white">{b.issue.title}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Pro: <span className="font-semibold text-slate-700 dark:text-slate-200">{b.provider.name}</span> ({b.provider.business})
                            </p>
                          </div>
                          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">{b.price}</span>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                          <span className="text-slate-500 dark:text-slate-400">{b.date} • {b.slot}</span>
                          <button
                            onClick={() => showToast(`Calling ${b.provider.name} at ${b.provider.phone}...`)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold flex items-center space-x-1 hover:bg-indigo-100"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Contact Pro</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VERIFIED LOCAL PROVIDERS LIST */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">LocalLink Certified Professionals</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Background-checked, insured, and verified response times</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {INITIAL_PROVIDERS.map(pro => (
                    <div
                      key={pro.id}
                      className="p-6 rounded-2xl bg-white dark:bg-[#121422] border border-slate-200 dark:border-[#242842] shadow-sm hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                            {pro.avatar}
                          </div>
                          <div>
                            <div className="flex items-center space-x-1">
                              <h3 className="font-bold text-slate-900 dark:text-white text-base">{pro.name}</h3>
                              <ShieldCheck className="w-4 h-4 text-indigo-500" />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{pro.specialty}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-slate-50 dark:bg-[#181A2D]">
                          <div className="flex items-center space-x-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{pro.rating}</span>
                            <span className="text-slate-400 font-normal">({pro.reviews})</span>
                          </div>
                          <span className="text-slate-500 dark:text-slate-400">{pro.distance} away</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">₹{pro.hourlyRate}/hr</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedProvider(pro);
                          setIsBookingOpen(true);
                        }}
                        className="w-full py-2.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600 text-indigo-600 hover:text-white font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <span>Book Appointment</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ================= PROVIDER DASHBOARD ================= */}
          {viewMode === 'provider' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* MASTER AVAILABILITY TOGGLE & STATUS BANNER */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#121422] border border-slate-200 dark:border-[#242842] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className={`w-3.5 h-3.5 rounded-full ${isAvailable ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50 animate-pulse' : 'bg-amber-500'}`}></div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">
                      {isAvailable ? 'Accepting Instant Local Requests' : 'Bookings Currently Paused'}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isAvailable ? 'Dispatch radius active (15 km) • Instant alerts on' : 'You are offline. Tap toggle to receive AI-diagnosed repair jobs'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {isAvailable ? 'Online' : 'Paused'}
                  </span>
                  <button
                    onClick={() => {
                      setIsAvailable(!isAvailable);
                      showToast(isAvailable ? 'Availability paused' : 'Online! Receiving customer requests');
                    }}
                    className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 flex items-center ${isAvailable ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                  >
                    <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${isAvailable ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              </div>

              {/* REAL-TIME METRICS & ANALYTICS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#121422] border border-slate-200 dark:border-[#242842] shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span>Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">₹48,500</div>
                  <div className="text-[11px] font-bold text-emerald-500 flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+18.4% this month</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#121422] border border-slate-200 dark:border-[#242842] shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span>Upcoming Payout</span>
                    <Activity className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">₹8,900</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Direct deposit this Thursday</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#121422] border border-slate-200 dark:border-[#242842] shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span>Jobs Completed</span>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">42</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">100% on-time arrival</div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#121422] border border-slate-200 dark:border-[#242842] shadow-sm space-y-1">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span>Pro Rating</span>
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">4.98 ★</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Based on 184 reviews</div>
                </div>
              </div>

              {/* AI PRE-ARRIVAL BRIEFS (INCOMING REQUESTS WITH CHECKLIST) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-indigo-500" />
                    <h2 className="text-lg font-bold">AI Pre-Arrival Briefs (Incoming Dispatches)</h2>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold">
                    {providerRequests.length} Pending
                  </span>
                </div>

                {providerRequests.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white dark:bg-[#121422] border border-slate-200 dark:border-[#242842] text-center space-y-2">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
                    <h3 className="font-bold text-slate-800 dark:text-slate-200">All Incoming Briefs Addressed</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">You're up to date! New AI visual requests will notify here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {providerRequests.map(req => (
                      <div
                        key={req.id}
                        className="p-6 rounded-2xl bg-white dark:bg-[#121422] border border-indigo-500/30 dark:border-indigo-500/20 shadow-md space-y-6"
                      >
                        {/* Header: Urgency & Guaranteed Payout */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center space-x-2">
                            <span className="px-2.5 py-1 rounded bg-rose-500/10 text-rose-500 text-xs font-bold border border-rose-500/20">
                              {req.issue.urgency}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">• Request from {req.customerName}</span>
                          </div>
                          <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                            {req.price} Guaranteed Payout
                          </span>
                        </div>

                        {/* Customer Photo + AI Defect Analysis */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          <div className="relative rounded-xl overflow-hidden bg-black aspect-video md:aspect-auto h-44">
                            <img
                              src={req.issue.image}
                              alt="Customer defect photo"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-white font-bold">
                              Customer Photo
                            </div>
                          </div>

                          <div className="md:col-span-2 space-y-3">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">{req.issue.title}</h3>
                            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181A2E] border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
                              <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>AI Pre-Arrival Diagnosis:</span>
                              </span>
                              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{req.issue.rootCause}</p>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-4">
                              <span>Location: <strong className="text-slate-700 dark:text-slate-300">{req.address}</strong></span>
                              <span>Est. Job Time: <strong className="text-slate-700 dark:text-slate-300">{req.issue.estimatedTime}</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* AUTO-GENERATED SUGGESTED TOOLS/PARTS LIST WITH INTERACTIVE CHECKBOXES */}
                        <div className="space-y-2 pt-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Auto-Generated Parts & Tools (Pack before dispatch):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {req.parts.map(tool => (
                              <div
                                key={tool.id}
                                onClick={() => toggleToolCheck(req.id, tool.id)}
                                className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center space-x-2.5 transition-all ${
                                  tool.checked
                                    ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-400/40 text-indigo-900 dark:text-indigo-200'
                                    : 'bg-slate-50 dark:bg-[#181A2E] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {tool.checked ? (
                                  <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-400" />
                                )}
                                <span className={tool.checked ? 'font-semibold line-through opacity-80' : ''}>{tool.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Accept / Decline actions */}
                        <div className="pt-2 flex items-center justify-end space-x-3">
                          <button
                            onClick={() => handleDeclineRequest(req.id)}
                            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleAcceptRequest(req.id)}
                            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Accept Job & Dispatch</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TODAY'S SCHEDULE TIMELINE */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold">Today's Appointment Schedule</h2>
                <div className="space-y-3">
                  {schedule.map(item => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-white dark:bg-[#121422] border border-slate-200 dark:border-[#242842] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start sm:items-center space-x-3">
                        <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-xs text-indigo-600 dark:text-indigo-400">
                          {item.time}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.service}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{item.client} • {item.address}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end space-x-4">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{item.earnings}</span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.status === 'Completed'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
                            : item.status === 'En Route'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
                            : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>

        {/* ================= AI SCANNING MODAL ================= */}
        {isScanningModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white dark:bg-[#121422] border border-slate-200 dark:border-[#282C48] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">AI Diagnostic Vision</h3>
                </div>
                <button
                  onClick={() => setIsScanningModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Image Preview with Animated Scanning Beam */}
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border border-indigo-500/40">
                <img
                  src={activeIssue.image}
                  alt="Defect Preview"
                  className="w-full h-full object-cover"
                />
                
                {scanStep === 'scanning' && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Laser line */}
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-indigo-400 to-rose-400 shadow-[0_0_15px_#6366F1] animate-pulse"></div>
                    <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/80 text-[10px] text-white font-mono flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      <span>CV NEURAL DETECTOR ACTIVE</span>
                    </div>
                  </div>
                )}

                {scanStep === 'diagnosed' && (
                  <div className="absolute bottom-3 left-3 right-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-white text-xs font-bold flex items-center justify-between">
                    <span>{activeIssue.category}</span>
                    <span className="text-emerald-400">98% Match Confidence</span>
                  </div>
                )}
              </div>

              {/* Progress and status */}
              {scanStep === 'scanning' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span>{scanStatusText}</span>
                    <span>{scanProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Diagnosis Complete Details */}
              {scanStep === 'diagnosed' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                        Issue Identified
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-500">
                        {activeIssue.urgency}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{activeIssue.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{activeIssue.rootCause}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181A2D] text-xs">
                      <span className="text-slate-400 block mb-1">Estimated Repair Time</span>
                      <strong className="text-slate-800 dark:text-slate-100 font-bold">{activeIssue.estimatedTime}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181A2D] text-xs">
                      <span className="text-slate-400 block mb-1">Estimated Price Range</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{activeIssue.priceRange}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsScanningModalOpen(false);
                      setIsBookingOpen(true);
                    }}
                    className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2"
                  >
                    <span>Proceed to Booking with Verified Pro</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ================= PROGRESSIVE BOOKING MODAL ================= */}
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white dark:bg-[#121422] border border-slate-200 dark:border-[#282C48] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Schedule Service</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Matched to certified pros in your area</p>
                </div>
                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Service Brief */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181A2D] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{activeIssue.title}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{activeIssue.priceRange} est.</span>
                </div>
                <span className="px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                  {activeIssue.category}
                </span>
              </div>

              {/* Select Provider */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select Verified Provider:
                </label>
                <div className="space-y-2">
                  {INITIAL_PROVIDERS.map(pro => (
                    <div
                      key={pro.id}
                      onClick={() => setSelectedProvider(pro)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                        selectedProvider.id === pro.id
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 text-indigo-950 dark:text-indigo-100 shadow-sm'
                          : 'bg-white dark:bg-[#121422] border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                          {pro.avatar}
                        </div>
                        <div>
                          <strong className="block font-bold">{pro.name}</strong>
                          <span className="text-slate-500 dark:text-slate-400">{pro.specialty} • {pro.distance}</span>
                        </div>
                      </div>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">₹{pro.hourlyRate}/hr</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Select Date & Time Slot */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select Date:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Today', 'Tomorrow', 'Thursday'].map(d => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedDate === d
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-50 dark:bg-[#181A2D] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select Time Window:
                </label>
                <div className="space-y-1.5">
                  {['Immediate / Urgent (Next available)', '9:00 AM - 10:00 AM', '2:30 PM - 3:30 PM', '5:00 PM - 6:00 PM'].map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold text-left border transition-all flex items-center justify-between ${
                        selectedSlot === slot
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <span>{slot}</span>
                      {selectedSlot === slot && <CheckCircle className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Service Address:
                </label>
                <input
                  type="text"
                  value={bookingAddress}
                  onChange={e => setBookingAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#181A2E] text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmBooking}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Confirm Booking with {selectedProvider.name}</span>
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
