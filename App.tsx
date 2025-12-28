
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PropertyCard from './components/PropertyCard';
import AiAssistant from './components/AiAssistant';
import { MOCK_PROPERTIES } from './constants';

const App: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [activeAboutTab, setActiveAboutTab] = useState<'personal' | 'office'>('office');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setStatus('submitting');

    try {
      // Logic simulation: Sending SMS to 0548188436
      console.log(`Sending SMS to 0548188436: New Lead - Name: ${formData.name}, Phone: ${formData.phone}`);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus('success');
      setFormData({ name: '', phone: '' });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error("Failed to send contact info:", error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <Hero />

        {/* Properties & AI Section */}
        <section id="properties" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-12">
              
              {/* Listings */}
              <div className="lg:w-2/3">
                <div className="mb-12 flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 mb-4">נכסים נבחרים</h2>
                    <p className="text-slate-600 max-w-lg">גלו את מבחר הדירות והבתים היוקרתיים ביותר באזורי הביקוש בישראל.</p>
                  </div>
                  <div className="hidden sm:block">
                    <button className="text-amber-600 font-bold flex items-center hover:underline">
                      לכל הנכסים
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {MOCK_PROPERTIES.map(prop => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
              </div>

              {/* AI Assistant Sidebar */}
              <div className="lg:w-1/3">
                <div className="sticky top-24">
                  <AiAssistant />
                  
                  <div className="mt-8 bg-amber-50 rounded-3xl p-8 border border-amber-100">
                    <h4 className="text-amber-900 font-bold mb-3">צריכים עזרה אישית?</h4>
                    <p className="text-amber-800 text-sm mb-6 leading-relaxed">שגית פלק זמינה לייעוץ טלפוני אישי לכל שאלה בנושא השקעות נדל"ן או מציאת נכס.</p>
                    <a href="tel:0548188436" className="flex items-center text-amber-900 font-bold">
                      <div className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center ml-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      054-818-8436
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center mb-12">
              <span className="text-amber-600 font-bold tracking-widest uppercase text-sm mb-4 block">אודות המותג</span>
              <div className="inline-flex p-1 bg-gray-100 rounded-full mb-8">
                <button 
                  onClick={() => setActiveAboutTab('office')}
                  className={`px-8 py-2 rounded-full font-bold transition-all ${activeAboutTab === 'office' ? 'bg-white shadow-md text-amber-600' : 'text-slate-500'}`}
                >
                  המשרד שלנו
                </button>
                <button 
                  onClick={() => setActiveAboutTab('personal')}
                  className={`px-8 py-2 rounded-full font-bold transition-all ${activeAboutTab === 'personal' ? 'bg-white shadow-md text-amber-600' : 'text-slate-500'}`}
                >
                  שגית פלק
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src={activeAboutTab === 'personal' 
                      ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
                      : "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                    } 
                    alt={activeAboutTab === 'personal' ? "Sagit Falk" : "The Office"}
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                </div>
                <div className="absolute -bottom-10 -left-10 bg-slate-900 text-white p-10 rounded-3xl hidden md:block">
                  <div className="text-4xl font-black text-amber-600 mb-2">
                    {activeAboutTab === 'personal' ? '15+' : '100%'}
                  </div>
                  <div className="text-lg font-medium opacity-80">
                    {activeAboutTab === 'personal' ? 'שנות ניסיון בנדל"ן' : 'מקצועיות ושירות'}
                  </div>
                </div>
              </div>
              
              <div className="min-h-[400px]">
                {activeAboutTab === 'personal' ? (
                  <div className="animate-fadeIn">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">שגית פלק - מצוינות בשירות נדל"ן</h2>
                    <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                      <p>שגית פלק היא מיועצות הנדל"ן המובילות בישראל, המתמחה בשוק היוקרה ובנכסים להשקעה באזור המרכז והשרון.</p>
                      <p>עם ראייה רחבה של השוק וניסיון עשיר בליווי עסקאות מורכבות, שגית מעניקה ללקוחותיה שקט נפשי וביטחון מלא לאורך כל הדרך.</p>
                      <p>הגישה שלנו מבוססת על אמון, שקיפות ויחס אישי לכל לקוח, תוך שימוש בכלים הטכנולוגיים המתקדמים ביותר לצד קשרים ענפים בקהילת הנדל"ן.</p>
                    </div>
                  </div>
                ) : (
                  <div className="animate-fadeIn">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">הסטנדרט החדש של קריית גת</h2>
                    <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                      <p>משרד הנדל"ן בניהולה של שגית פלק מציג סטנדרט חדש של מקצועיות ושירות בקריית גת. אנו מביאים לשוק גישה רעננה המשלבת ידע מקצועי מעמיק, אסטרטגיה שיווקית חכמה ויחס אישי לכל לקוח.</p>
                      
                      <div className="bg-slate-50 p-6 rounded-2xl border-r-4 border-amber-600">
                        <h4 className="font-bold text-slate-900 text-xl mb-3">One Stop Shop – חווית שירות מושלמת</h4>
                        <p className="text-base text-slate-600">אנו מאמינים שלקוחותינו ראויים לשקט נפשי ולביטחון מלא בכל שלב בעסקה. המשרד שלנו מספק פתרונות מקיפים הכוללים ליווי משפטי, ייעוץ פיננסי ומשכנתאות, שמאות מקרקעין, ואף שירותי עיצוב פנים וניהול פרויקטים.</p>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-2xl border-r-4 border-slate-900">
                        <h4 className="font-bold text-slate-900 text-xl mb-3">דיוק הוא שם המשחק</h4>
                        <p className="text-base text-slate-600">שוק הנדל"ן בקריית גת דינמי ומגוון. היכולת שלנו לנתח את השוק בזמן אמת ולהבין את האופי הייחודי של כל אזור בעיר, היא היתרון שלכם. אנחנו מאתרים הזדמנויות ומחברים בינן לבין האנשים הנכונים.</p>
                      </div>

                      <div className="bg-slate-50 p-6 rounded-2xl border-r-4 border-amber-600">
                        <h4 className="font-bold text-slate-900 text-xl mb-3">מחויבות להצלחה שלכם</h4>
                        <p className="text-base text-slate-600">עסקה נחשבת להצלחה רק כאשר שני הצדדים – המוכר והקונה – מרגישים בטוחים ומרוצים. אנחנו כאן כדי להוביל אתכם בבטחה אל היעד.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-black mb-8">מוכנים למצוא את הבית הבא שלכם?</h2>
            <p className="text-xl opacity-70 mb-12">השאירו פרטים ונחזור אליכם בהקדם לתיאום פגישת הכירות ללא התחייבות.</p>
            
            {status === 'success' ? (
              <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 p-8 rounded-3xl animate-pulse">
                <h3 className="text-2xl font-bold mb-2">ההודעה נשלחה בהצלחה!</h3>
                <p>SMS נשלח לשגית פלק (0548188436), היא תחזור אליך בהקדם.</p>
              </div>
            ) : (
              <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleSubmit}>
                <input 
                  type="text" 
                  required
                  placeholder="שם מלא"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white/10 border border-white/20 rounded-full px-6 py-4 focus:bg-white focus:text-slate-900 focus:outline-none transition-all disabled:opacity-50"
                  disabled={status === 'submitting'}
                />
                <input 
                  type="tel" 
                  required
                  placeholder="טלפון"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="bg-white/10 border border-white/20 rounded-full px-6 py-4 focus:bg-white focus:text-slate-900 focus:outline-none transition-all disabled:opacity-50"
                  disabled={status === 'submitting'}
                />
                <button 
                  type="submit"
                  disabled={status === 'submitting'}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-full px-8 py-4 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {status === 'submitting' ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      שולח...
                    </span>
                  ) : 'שלח פניה'}
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="text-red-400 mt-4">אירעה שגיאה בשליחת הפרטים. אנא נסו שוב או התקשרו ישירות.</p>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <span className="text-xl font-black tracking-tighter text-slate-900">
              שגית פלק <span className="text-amber-600">|</span> נדל"ן
            </span>
          </div>
          <div className="flex space-x-reverse space-x-8 text-slate-500 text-sm">
            <a href="#" className="hover:text-amber-600 transition-colors">מדיניות פרטיות</a>
            <a href="#" className="hover:text-amber-600 transition-colors">תקנון האתר</a>
            <span>© 2024 שגית פלק - כל הזכויות שמורות.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
