import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'hi' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // App Title
    'app.title': 'Farm AMU Portal',
    'app.subtitle': 'Digital Agriculture Management',
    'app.description': 'Antimicrobial Usage Management',
    
    // Login
    'login.title': 'Login',
    'login.description': 'Select your role and login with mobile OTP',
    'login.selectRole': 'Select Your Role',
    'login.mobileNumber': 'Mobile Number',
    'login.enterOtp': 'Enter OTP',
    'login.sendOtp': 'Send OTP',
    'login.verifyLogin': 'Verify & Login',
    'login.changeNumber': 'Change Number',
    'login.selectedRole': 'Selected Role:',
    'login.changeRole': 'Change Role',
    'login.demoCredentials': 'Demo Credentials:',
    'login.anyMobile': 'Any mobile number + OTP: 1234',
    
    // Roles
    'role.farmer': 'Farmer',
    'role.veterinarian': 'Veterinarian', 
    'role.regulator': 'Regulator',
    'role.farmer.description': 'Record medicine usage',
    'role.veterinarian.description': 'Validate treatments',
    'role.regulator.description': 'Monitor compliance',
    
    // Layout
    'layout.alerts': 'Alerts',
    'layout.logout': 'Logout',
    
    // Dashboard Common
    'dashboard.overview': 'Overview',
    'dashboard.recentActivity': 'Recent Activity',
    'dashboard.quickActions': 'Quick Actions',
    
    // Farmer Dashboard
    'farmer.dashboard': 'Farmer Dashboard',
    'farmer.totalAnimals': 'Total Animals',
    'farmer.activeTreatments': 'Active Treatments',
    'farmer.pendingAlerts': 'Pending Alerts',
    'farmer.complianceScore': 'Compliance Score',
    'farmer.addTreatment': 'Add Treatment',
    'farmer.viewReports': 'View Reports',
    'farmer.manageAnimals': 'Manage Animals',
    
    // Treatment
    'treatment.add': 'Add New Treatment',
    'treatment.animal': 'Animal',
    'treatment.drug': 'Drug/Medicine',
    'treatment.dosage': 'Dosage',
    'treatment.frequency': 'Frequency',
    'treatment.duration': 'Duration (days)',
    'treatment.purpose': 'Treatment Purpose',
    'treatment.save': 'Save Treatment',
    'treatment.cancel': 'Cancel',
    'treatment.status': 'Status',
    'treatment.withdrawalPeriod': 'Withdrawal Period',
    'treatment.daysRemaining': 'days remaining',
    'treatment.completed': 'Completed',
    'treatment.active': 'Active',
    'treatment.pending': 'Pending Approval',
    
    // Veterinarian
    'vet.dashboard': 'Veterinarian Dashboard',
    'vet.pendingApprovals': 'Pending Approvals',
    'vet.totalFarms': 'Total Farms',
    'vet.treatmentsApproved': 'Treatments Approved',
    'vet.reviewTreatments': 'Review Treatments',
    'vet.manageFarms': 'Manage Farms',
    'vet.uploadPrescription': 'Upload Prescription',
    
    // Regulator
    'regulator.dashboard': 'Regulator Dashboard',
    'regulator.totalFarms': 'Total Farms Monitored',
    'regulator.complianceIssues': 'Compliance Issues',
    'regulator.monthlyReports': 'Monthly Reports',
    'regulator.generateReport': 'Generate Report',
    'regulator.viewTrends': 'View Trends',
    'regulator.inspectFarms': 'Inspect Farms'
  },
  hi: {
    // App Title
    'app.title': 'फार्म AMU पोर्टल',
    'app.subtitle': 'डिजिटल कृषि प्रबंधन',
    'app.description': 'रोगाणुरोधी उपयोग प्रबंधन',
    
    // Login
    'login.title': 'लॉगिन करें',
    'login.description': 'अपनी भूमिका चुनें और मोबाइल OTP से लॉगिन करें',
    'login.selectRole': 'अपनी भूमिका चुनें',
    'login.mobileNumber': 'मोबाइल नंबर',
    'login.enterOtp': 'OTP दर्ज करें',
    'login.sendOtp': 'OTP भेजें',
    'login.verifyLogin': 'सत्यापित करें और लॉगिन करें',
    'login.changeNumber': 'नंबर बदलें',
    'login.selectedRole': 'चयनित भूमिका:',
    'login.changeRole': 'भूमिका बदलें',
    'login.demoCredentials': 'डेमो क्रेडेंशियल:',
    'login.anyMobile': 'कोई भी मोबाइल नंबर + OTP: 1234',
    
    // Roles
    'role.farmer': 'किसान',
    'role.veterinarian': 'पशु चिकित्सक',
    'role.regulator': 'नियामक',
    'role.farmer.description': 'दवा का रिकॉर्ड रखें',
    'role.veterinarian.description': 'उपचार की पुष्टि करें',
    'role.regulator.description': 'अनुपालन की निगरानी करें',
    
    // Layout
    'layout.alerts': 'अलर्ट',
    'layout.logout': 'लॉगआउट',
    
    // Dashboard Common
    'dashboard.overview': 'सारांश',
    'dashboard.recentActivity': 'हाल की गतिविधि',
    'dashboard.quickActions': 'त्वरित कार्य',
    
    // Farmer Dashboard
    'farmer.dashboard': 'किसान डैशबोर्ड',
    'farmer.totalAnimals': 'कुल पशु',
    'farmer.activeTreatments': 'सक्रिय उपचार',
    'farmer.pendingAlerts': 'लंबित अलर्ट',
    'farmer.complianceScore': 'अनुपालन स्कोर',
    'farmer.addTreatment': 'उपचार जोड़ें',
    'farmer.viewReports': 'रिपोर्ट देखें',
    'farmer.manageAnimals': 'पशुओं का प्रबंधन',
    
    // Treatment
    'treatment.add': 'नया उपचार जोड़ें',
    'treatment.animal': 'पशु',
    'treatment.drug': 'दवा',
    'treatment.dosage': 'खुराक',
    'treatment.frequency': 'आवृत्ति',
    'treatment.duration': 'अवधि (दिन)',
    'treatment.purpose': 'उपचार का उद्देश्य',
    'treatment.save': 'उपचार सेव करें',
    'treatment.cancel': 'रद्द करें',
    'treatment.status': 'स्थिति',
    'treatment.withdrawalPeriod': 'निकासी अवधि',
    'treatment.daysRemaining': 'दिन शेष',
    'treatment.completed': 'पूर्ण',
    'treatment.active': 'सक्रिय',
    'treatment.pending': 'अनुमोदन लंबित',
    
    // Veterinarian
    'vet.dashboard': 'पशु चिकित्सक डैशबोर्ड',
    'vet.pendingApprovals': 'लंबित अनुमोदन',
    'vet.totalFarms': 'कुल फार्म',
    'vet.treatmentsApproved': 'स्वीकृत उपचार',
    'vet.reviewTreatments': 'उपचार समीक्षा',
    'vet.manageFarms': 'फार्म प्रबंधन',
    'vet.uploadPrescription': 'प्रिस्क्रिप्शन अपलोड',
    
    // Regulator
    'regulator.dashboard': 'नियामक डैशबोर्ड',
    'regulator.totalFarms': 'कुल निगरानी फार्म',
    'regulator.complianceIssues': 'अनुपालन मुद्दे',
    'regulator.monthlyReports': 'मासिक रिपोर्ट',
    'regulator.generateReport': 'रिपोर्ट बनाएं',
    'regulator.viewTrends': 'रुझान देखें',
    'regulator.inspectFarms': 'फार्म निरीक्षण'
  },
  te: {
    // App Title
    'app.title': 'వ్యవసాయ AMU పోర్టల్',
    'app.subtitle': 'డిజిటల్ వ్యవసాయ నిర్వహణ',
    'app.description': 'యాంటీమైక్రోబియల్ వాడుక నిర్వహణ',
    
    // Login
    'login.title': 'లాగిన్',
    'login.description': 'మీ పాత్రను ఎంచుకోండి మరియు మొబైల్ OTP తో లాగిన్ అవండి',
    'login.selectRole': 'మీ పాత్రను ఎంచుకోండి',
    'login.mobileNumber': 'మొబైల్ నంబర్',
    'login.enterOtp': 'OTP ఎంటర్ చేయండి',
    'login.sendOtp': 'OTP పంపండి',
    'login.verifyLogin': 'ధృవీకరించి లాగిన్ అవండి',
    'login.changeNumber': 'నంబర్ మార్చండి',
    'login.selectedRole': 'ఎంచుకున్న పాత్র:',
    'login.changeRole': 'పాత్రను మార్చండి',
    'login.demoCredentials': 'డెమో క్రెడెన్షియల్స్:',
    'login.anyMobile': 'ఏదైనా మొబైల్ నంబర్ + OTP: 1234',
    
    // Roles
    'role.farmer': 'రైతు',
    'role.veterinarian': 'పశు వైద్యుడు',
    'role.regulator': 'నియంత్రకుడు',
    'role.farmer.description': 'మందుల రికార్డ్ ఉంచండి',
    'role.veterinarian.description': 'చికిత్సలను ధృవీకరించండి',
    'role.regulator.description': 'అనుపాలనను పర్యవేక్షించండి',
    
    // Layout
    'layout.alerts': 'హెచ్చరికలు',
    'layout.logout': 'లాగ్అవుట్',
    
    // Dashboard Common
    'dashboard.overview': 'సమీక్ష',
    'dashboard.recentActivity': 'ఇటీవలి కార్యకలాపాలు',
    'dashboard.quickActions': 'త్వరిత చర్యలు',
    
    // Farmer Dashboard
    'farmer.dashboard': 'రైతు డ్యాష్‌బోర్డ్',
    'farmer.totalAnimals': 'మొత్తం జంతువులు',
    'farmer.activeTreatments': 'క్రియాశీల చికిత్సలు',
    'farmer.pendingAlerts': 'పెండింగ్ హెచ్చరికలు',
    'farmer.complianceScore': 'అనుపాలన స్కోర్',
    'farmer.addTreatment': 'చికిత్స జోడించండి',
    'farmer.viewReports': 'నివేదికలను చూడండి',
    'farmer.manageAnimals': 'జంతువులను నిర్వహించండి',
    
    // Treatment
    'treatment.add': 'కొత్త చికిత్స జోడించండి',
    'treatment.animal': 'జంతువు',
    'treatment.drug': 'మందు',
    'treatment.dosage': 'మోతాదు',
    'treatment.frequency': 'ఫ్రీక్వెన్సీ',
    'treatment.duration': 'వ్యవధి (రోజులు)',
    'treatment.purpose': 'చికిత్స ప్రయోజనం',
    'treatment.save': 'చికిత్స సేవ్ చేయండి',
    'treatment.cancel': 'రద్దు చేయండి',
    'treatment.status': 'స్థితి',
    'treatment.withdrawalPeriod': 'ఉపసంహరణ కాలం',
    'treatment.daysRemaining': 'రోజులు మిగిలి ఉన్నాయి',
    'treatment.completed': 'పూర్తయింది',
    'treatment.active': 'క్రియాశీలం',
    'treatment.pending': 'ఆమోదం పెండింగ్',
    
    // Veterinarian
    'vet.dashboard': 'పశు వైద్య డ్యాష్‌బోర్డ్',
    'vet.pendingApprovals': 'పెండింగ్ ఆమోదాలు',
    'vet.totalFarms': 'మొత్తం పొలాలు',
    'vet.treatmentsApproved': 'ఆమోదించిన చికిత్సలు',
    'vet.reviewTreatments': 'చికిత్సల సమీక్ష',
    'vet.manageFarms': 'పొలాల నిర్వహణ',
    'vet.uploadPrescription': 'ప్రిస్క్రిప్షన్ అప్‌లోడ్',
    
    // Regulator
    'regulator.dashboard': 'నియంత్రక డ్యాష్‌బోర్డ్',
    'regulator.totalFarms': 'మొత్తం పర్యవేక్షణ పొలాలు',
    'regulator.complianceIssues': 'అనుపాలన సమస్యలు',
    'regulator.monthlyReports': 'నెలవారీ నివేదికలు',
    'regulator.generateReport': 'నివేదిక రూపొందించండి',
    'regulator.viewTrends': 'ట్రెండ్‌లను చూడండి',
    'regulator.inspectFarms': 'పొలాల తనిఖీ'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};