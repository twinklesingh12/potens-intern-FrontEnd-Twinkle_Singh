import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage.jsx'

const translations = {
  en: {
    logo: 'Cockpit',
    languageLabel: 'Language',
    darkMode: 'Dark mode',
    updatedNow: 'Updated just now',
    dashboardTitle: 'Cockpit Dashboard',
    overviewTitle: 'Operations Overview',
    kpiCards: [
      { label: 'Open Actions', value: '24', detail: '+6 since 09:00' },
      { label: 'Anomalies', value: '7', detail: '2 critical' },
      { label: 'Approvals Pending', value: '13', detail: '4 due in 2 hours' },
      { label: 'System Health', value: '98.4%', detail: 'All regions stable' },
    ],
    todayAtGlance: 'Today at a glance',
    todayAtGlanceCopy:
      'Routing is now in place and this index dashboard acts as the foundation for action queues, anomaly tracking, and live metrics.',
    quickActions: 'Quick actions',
    approve: 'Approve',
    hold: 'Hold',
    languageOptions: {
      en: 'English',
      hi: 'Hindi',
    },
    mockQuickActions: [
      { id: 1, text: 'Review high-priority incidents for Plant 3' },
      { id: 2, text: 'Sign off pending operations shift handover' },
      { id: 3, text: 'Validate overnight monitoring summary report' },
      { id: 4, text: 'Approve scheduled maintenance override request' },
      { id: 5, text: 'Hold outbound lot until QA sample is cleared' },
    ],
  },
  hi: {
    logo: 'कॉकपिट',
    languageLabel: 'भाषा',
    darkMode: 'डार्क मोड',
    updatedNow: 'अभी अपडेट किया गया',
    dashboardTitle: 'कॉकपिट डैशबोर्ड',
    overviewTitle: 'ऑपरेशन्स अवलोकन',
    kpiCards: [
      { label: 'खुले एक्शन', value: '24', detail: '09:00 के बाद +6' },
      { label: 'विसंगतियाँ', value: '7', detail: '2 गंभीर' },
      { label: 'लंबित स्वीकृतियाँ', value: '13', detail: '4 अगले 2 घंटे में' },
      { label: 'सिस्टम स्वास्थ्य', value: '98.4%', detail: 'सभी क्षेत्र स्थिर' },
    ],
    todayAtGlance: 'आज की झलक',
    todayAtGlanceCopy:
      'रूटिंग अब सेट है और यह इंडेक्स डैशबोर्ड एक्शन कतार, विसंगति ट्रैकिंग और लाइव मेट्रिक्स की नींव बनाता है।',
    quickActions: 'त्वरित एक्शन',
    approve: 'स्वीकृत करें',
    hold: 'रोकें',
    languageOptions: {
      en: 'अंग्रेज़ी',
      hi: 'हिंदी',
    },
    mockQuickActions: [
      { id: 1, text: 'प्लांट 3 की उच्च-प्राथमिकता घटनाओं की समीक्षा करें' },
      { id: 2, text: 'लंबित ऑपरेशन्स शिफ्ट हैंडओवर पर हस्ताक्षर करें' },
      { id: 3, text: 'रात की मॉनिटरिंग सारांश रिपोर्ट सत्यापित करें' },
      { id: 4, text: 'निर्धारित मेंटेनेंस ओवरराइड अनुरोध को स्वीकृत करें' },
      { id: 5, text: 'QA सैंपल क्लियर होने तक आउटबाउंड लॉट रोकें' },
    ],
  },
}

export default function App() {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('cockpit-language')
    return savedLanguage === 'hi' ? 'hi' : 'en'
  })
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('cockpit-theme')
    if (savedTheme === 'light') {
      return false
    }
    return true
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('cockpit-theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  useEffect(() => {
    localStorage.setItem('cockpit-language', language)
  }, [language])

  const t = useMemo(() => translations[language], [language])

  return (
    <Routes>
      <Route
        path="/"
        element={
          <DashboardPage
            t={t}
            language={language}
            setLanguage={setLanguage}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
