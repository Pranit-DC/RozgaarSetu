export type SupportedLang = 'en' | 'hi' | 'mr';

type Dict = Record<string, string>;

interface Dictionaries {
  common: Dict;
  landing: Dict;
}

type AllDictionaries = Record<SupportedLang, Dictionaries>;

export const dictionaries: AllDictionaries = {
  en: {
    common: {
      earlyAccess: 'Early Access',
      login: 'Login',
      getStarted: 'Get Started',
      continue: 'Continue',
      chooseLanguage: 'Choose language',
      canChangeLater: 'You can switch later in settings',
      terms: 'By continuing you agree to our Terms & Privacy Policy'
    },
    landing: {
      heroLine: 'Bridge skilled local workers with real community demand.',
      heroLead: 'Pick your language to personalise the experience. We support multiple regional scripts and are expanding fast.',
      feat1: 'Local scripts',
      feat2: 'Multi-role onboarding',
      feat3: 'Unified profile',
      feat4: 'Adaptive UI texts'
    }
  },
  hi: {
    common: {
      earlyAccess: 'आरंभिक प्रवेश',
      login: 'लॉगिन',
      getStarted: 'आरंभ करें',
      continue: 'जारी रखें',
      chooseLanguage: 'भाषा चुनें',
      canChangeLater: 'आप बाद में सेटिंग्स में बदल सकते हैं',
      terms: 'आगे बढ़ने पर आप हमारी शर्तों व गोपनीयता नीति से सहमत हैं'
    },
    landing: {
      heroLine: 'कुशल स्थानीय कामगारों को वास्तविक सामुदायिक मांग से जोड़ें।',
      heroLead: 'अनुभव को वैयक्तिकृत करने के लिए अपनी भाषा चुनें। हम कई क्षेत्रीय लिपियों का समर्थन करते हैं।',
      feat1: 'स्थानीय लिपियाँ',
      feat2: 'बहु-भूमिका ऑनबोर्डिंग',
      feat3: 'एकीकृत प्रोफ़ाइल',
      feat4: 'अनुकूल UI पाठ'
    }
  },
  mr: {
    common: {
      earlyAccess: 'लवकर प्रवेश',
      login: 'लॉगिन',
      getStarted: 'सुरू करा',
      continue: 'पुढे चला',
      chooseLanguage: 'भाषा निवडा',
      canChangeLater: 'तुम्ही नंतर सेटिंग्जमध्ये बदलू शकता',
      terms: 'पुढे गेल्यावर तुम्ही आमच्या अटी व गोपनीयता धोरणास सहमती देता'
    },
    landing: {
      heroLine: 'कुशल स्थानिक कामगारांना खऱ्या समुदायाच्या मागणीशी जोडा.',
      heroLead: 'अनुभव वैयक्तिकृत करण्यासाठी भाषा निवडा. आम्ही अनेक प्रादेशिक लिपी समर्थित करतो.',
      feat1: 'स्थानिक लिपी',
      feat2: 'अनेक भूमिका ऑनबोर्डिंग',
      feat3: 'एकत्रित प्रोफाइल',
      feat4: 'अनुकूली UI मजकूर'
    }
  }
};

export function getDictionary(lang: SupportedLang): Dictionaries {
  return dictionaries[lang] ?? dictionaries.en;
}
