import React, { createContext, useContext, useState, useEffect } from "react";

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// API URL - Yerel proxylamak için kendi backend'inizi veya CORS sorunlarını aşan bir API kullanabilirsiniz
const TRANSLATION_API_URL = "https://libretranslate.com/translate";

// Create context
export const TranslationContext = createContext();

const translationCache = {
  ENG: {},
  TR: {}
};

// Daha kapsamlı manuel çeviri sözlüğü
const manualTranslations = {
  ENG_TO_TR: {
    // Mevcut çeviriler
    "Submit": "Gönder",
    "Home": "Ana Sayfa",
    "Welcome": "Hoş Geldiniz",
    "Settings": "Ayarlar",
    "Profile": "Profil",
    "Dashboard": "Kontrol Paneli",
    "Logout": "Çıkış",
    "Login": "Giriş",
    "Register": "Kayıt Ol",
    "Search": "Ara",
    "Save": "Kaydet",
    "Cancel": "İptal",
    "Delete": "Sil",
    "Edit": "Düzenle",
    "Update": "Güncelle",
    "Name": "İsim",
    "Email": "E-posta",
    "Password": "Şifre",
    "Confirm Password": "Şifreyi Onayla",
    
    // Spending Summary metinleri
    "Spending Summary": "Harcama Özeti",
    "Last Day": "Son Gün",
    "Last Week": "Son Hafta",
    "Last Month": "Son Ay",
    "Last Year": "Son Yıl",
    "Total Spending": "Toplam Harcama",
    
    // Budget Overview metinleri
    "Budget Overview": "Bütçe Genel Bakışı",
    "Day": "Gün",
    "Week": "Hafta",
    "Month": "Ay",
    "Year": "Yıl",
    "Income": "Gelir",
    "Expenses": "Giderler",
    "INCOME": "GELİR",
    "EXPENSES": "GİDERLER",
    
    // FAQ/Support sayfası metinleri
    "MAIN": "ANA",
    "OTHERS": "DİĞERLERİ",
    "Support": "Destek",
    "Transactions": "İşlemler",
    "Payments": "Ödemeler",
    "Exchange": "Döviz",
    "Support Center": "Destek Merkezi",
    "Contact Us": "Bize Ulaşın",
    "FAQ": "SSS",
    "Email Address": "E-posta Adresi",
    "Subject": "Konu",
    "Message": "Mesaj",
    "Submit Request": "İstek Gönder",
    "Frequently Asked Questions": "Sık Sorulan Sorular",
    "How do I add a new savings goal?": "Yeni bir tasarruf hedefi nasıl eklerim?",
    "You can add a new savings goal by clicking the '+' button in the Savings section of your dashboard, then enter the name of your goal when prompted.": "Kontrol panelinizdeki Tasarruf bölümündeki '+' düğmesine tıklayarak ve istendiğinde hedef adını girerek yeni bir tasarruf hedefi ekleyebilirsiniz.",
    "How do I set up recurring payments?": "Tekrarlanan ödemeleri nasıl ayarlarım?",
    "To set up recurring payments, navigate to the Payments section from the sidebar menu, then click on 'Add Payment' and follow the instructions.": "Tekrarlanan ödemeleri ayarlamak için kenar çubuğu menüsünden Ödemeler bölümüne gidin, ardından 'Ödeme Ekle'ye tıklayın ve talimatları izleyin.",
    "How do I change my account settings?": "Hesap ayarlarımı nasıl değiştiririm?",
    "To change your account settings, click on the 'Settings' option in the sidebar menu. From there, you can update your profile, notification preferences, and website settings.": "Hesap ayarlarınızı değiştirmek için kenar çubuğu menüsündeki 'Ayarlar' seçeneğine tıklayın. Oradan, profilinizi, bildirim tercihlerinizi ve web sitesi ayarlarınızı güncelleyebilirsiniz.",
    "Didn't find what you were looking for?": "Aradığınızı bulamadınız mı?",
    "Contact Us!": "Bize Ulaşın!",
    "© 2025 WealthGuard. All rights reserved.": "© 2025 WealthGuard. Tüm hakları saklıdır.",
    
    // Yeni Genel Çeviriler
    "Sign In": "Giriş Yap",
    "Sign Up": "Kayıt Ol",
    "Create your account": "Hesabınızı Oluşturun",
    "Welcome back! Please sign in to continue.": "Tekrar Hoşgeldiniz! Devam etmek için lütfen giriş yapın.",
    "Welcome! Please fill in the details to get started.": "Hoşgeldiniz! Başlamak için lütfen bilgileri doldurun.",
    "Don't have an account?": "Hesabınız yok mu?",
    "Already have an account?": "Zaten bir hesabınız var mı?",
    "Submit": "Gönder",
    "Need Help? Contact Support": "Yardıma mı İhtiyacınız Var? Destek İle İletişime Geçin",
    "Please fill in the form below.": "Lütfen aşağıdaki formu doldurun.",
    "We will get back to you as soon as possible.": "En kısa sürede size geri döneceğiz.",
    "Full Name": "Tam Ad",
    "Display Name": "Görünen Ad",
    "Reset Password": "Şifreyi Sıfırla",
    "Save Changes": "Değişiklikleri Kaydet",
    "Color Theme": "Renk Teması",
    "Text Size": "Metin Boyutu",
    "Current text size:": "Mevcut metin boyutu:",
    "Small": "Küçük",
    "Medium": "Orta",
    "Large": "Büyük",
    "Purple": "Mor",
    "Blue": "Mavi",
    
    // About sayfası
    "About": "Hakkında",
    "This personal finance and budget tracking application is designed to help individuals gain better control over their finances. Users can easily track their income, manage recurring expenses, and categorize their daily spending to stay within their budget. The app offers insightful tools that analyze spending patterns and provide recommendations for saving money. Additionally, the application supports multi-currency transactions and financial goal tracking with reminders and alerts. With its user-friendly interface, the web app aims to promote financial wellness for everyone.": "Bu kişisel finans ve bütçe takip uygulaması, bireylerin finansları üzerinde daha iyi kontrol sahibi olmalarına yardımcı olmak için tasarlanmıştır. Kullanıcılar gelirlerini kolayca takip edebilir, tekrarlanan harcamalarını yönetebilir ve bütçelerinde kalmak için günlük harcamalarını kategorize edebilirler. Uygulama, harcama modellerini analiz eden ve para biriktirmek için öneriler sunan kapsamlı araçlar sunar. Ayrıca, uygulama çoklu para birimi işlemlerini ve hatırlatıcılar ve uyarılarla finansal hedef takibini destekler. Kullanıcı dostu arayüzü ile web uygulaması, herkes için finansal refahı teşvik etmeyi amaçlamaktadır.",
    "WealthGuard helps you manage your budget, track expenses, and achieve your financial goals with smart insights and automation.": "WealthGuard, akıllı içgörüler ve otomasyon ile bütçenizi yönetmenize, harcamalarınızı takip etmenize ve finansal hedeflerinize ulaşmanıza yardımcı olur.",
    "Quick Links": "Hızlı Bağlantılar",
    
    // Homepage
    "Protection with precision, every decision.": "Her kararda hassas koruma.",
    
    // Exchange sayfası
    "Exchange Rates": "Döviz Kurları",
    "Base Currency:": "Temel Para Birimi:",
    "Refresh": "Yenile",
    "Loading exchange rates...": "Döviz kurları yükleniyor...",
    "Popular Currencies": "Popüler Para Birimleri",
    "All Currencies": "Tüm Para Birimleri",
    "Currency": "Para Birimi",
    "Code": "Kod",
    "Rate (1": "Kur (1",
    "Inverse Rate (1 Currency to": "Ters Kur (1 Para Birimi",
    "Last updated:": "Son güncelleme:",
    "Currency Exchange": "Para Birimi Dönüştürme",
    "From": "Kaynak",
    "Amount": "Miktar",
    "To": "Hedef",
    "Converted Amount": "Dönüştürülen Miktar",
    "Exchange Rate": "Döviz Kuru",
    "Updating...": "Güncelleniyor...",
    
    // Transaction sayfası
    "Transaction": "İşlem",
    "Total Income": "Toplam Gelir",
    "Total Expense": "Toplam Gider",
    "Net Amount": "Net Miktar",
    "All": "Tümü",
    "All Time": "Tüm Zamanlar",
    "Today": "Bugün",
    "This Week": "Bu Hafta",
    "Last Month": "Geçen Ay",
    "Last 3 Months": "Son 3 Ay",
    "Last Year": "Geçen Yıl",
    "Sort by Date": "Tarihe Göre Sırala",
    "Sort by Amount": "Tutara Göre Sırala",
    "Sort by Name": "İsme Göre Sırala",
    "Sort by Category": "Kategoriye Göre Sırala",
    "↑ Ascending": "↑ Artan",
    "↓ Descending": "↓ Azalan",
    "Add Transaction": "İşlem Ekle",
    "No transactions found matching your filters.": "Filtrelerinizle eşleşen işlem bulunamadı.",
    
    // Payment sayfası
    "Monthly Payments": "Aylık Ödemeler",
    "Total Monthly": "Aylık Toplam",
    "Paid": "Ödenmiş",
    "Remaining": "Kalan",
    "Upcoming Payments": "Yaklaşan Ödemeler",
    "Due today": "Bugün ödenmesi gereken",
    "Due in": "Ödeme tarihi",
    "day": "gün",
    "days": "gün",
    "Sort by Due Date": "Vade Tarihine Göre Sırala",
    "Add Payment": "Ödeme Ekle",
    "Monthly Recurring Payments": "Aylık Tekrarlanan Ödemeler",
    "Mark Paid": "Ödendi Olarak İşaretle",
    "No payments found matching your filters.": "Filtrelerinizle eşleşen ödeme bulunamadı.",
    
    // AddTransaction Modali
    "Add Transaction": "İşlem Ekle",
    "Transaction Type": "İşlem Türü",
    "Expense": "Gider",
    "Income": "Gelir",
    "Transaction Name": "İşlem Adı",
    "e.g. Grocery Shopping, Salary": "örn. Market Alışverişi, Maaş",
    "Category": "Kategori",
    "Select a category": "Kategori seçin",
    "Food": "Yiyecek",
    "Transport": "Ulaşım",
    "Shopping": "Alışveriş",
    "Entertainment": "Eğlence",
    "Utilities": "Faturalar",
    "Health": "Sağlık",
    "Education": "Eğitim",
    "Housing": "Konut",
    "Other": "Diğer",
    "Salary": "Maaş",
    "Freelance": "Serbest Çalışma",
    "Investment": "Yatırım",
    "Gift": "Hediye",
    "Rental": "Kira Geliri",
    "Date": "Tarih",
    "Note (Optional)": "Not (İsteğe Bağlı)",
    "Add additional details...": "Ek detaylar ekleyin...",
    "Save Transaction": "İşlemi Kaydet",
    
    // Payment Modali
    "Add Monthly Payment": "Aylık Ödeme Ekle",
    "Payment Name *": "Ödeme Adı *",
    "e.g. Rent, Netflix, Electric Bill": "örn. Kira, Netflix, Elektrik Faturası",
    "Amount ($) *": "Tutar ($) *",
    "Due Date *": "Vade Tarihi *",
    "Insurance": "Sigorta",
    "Subscription": "Abonelik",
    "Loan": "Kredi",
    "Transportation": "Ulaşım",
    
    // Dashboard sayfası
    "Recent Transactions": "Son İşlemler",
    "See All Transactions": "Tüm İşlemleri Gör",
    "Track Goals": "Hedefleri Takip Et",
    "Edit Goal": "Hedefi Düzenle",
    "Add Money": "Para Ekle",
    "Enter amount": "Miktar girin",
    "Add": "Ekle",
    "Enter goal name": "Hedef adı girin",
    "Enter target amount ($)": "Hedef tutar girin ($)",
    "Month":"Ay",
    "Day":"Gün",
    "Year":"Yıl",
    "Week":"Hafta",

    // Faq sayfası
    "New Feature": "Yeni Özellik",
    "Try our new goal tracking feature!": "Yeni hedef takip özelliğimizi deneyin!",
    "Budget Alert": "Bütçe Uyarısı",
    "You've spent 80% of your Entertainment budget this month": "Bu ay Eğlence bütçenizin %80'ini harcadınız",
    "Payment Reminder": "Ödeme Hatırlatıcısı",
    "Your subscription payment is due in 3 days": "Abonelik ödemeniz 3 gün içinde yapılmalı",
    
    // Settings sayfası
    "Appearance": "Görünüm",
    "Balance": "Bakiye",
    "Save": "Kaydet",
    "Add": "Ekle",

    // Auth pages
    "Signing In...": "Giriş Yapılıyor...",
    "Signing Up...": "Kayıt Olunuyor...",
    "E-mail address": "E-posta adresi"
  },
  TR_TO_ENG: {
    // Mevcut çeviriler
    "Gönder": "Submit",
    "Ana Sayfa": "Home",
    "Hoş Geldiniz": "Welcome",
    "Ayarlar": "Settings",
    "Profil": "Profile",
    "Kontrol Paneli": "Dashboard",
    "Çıkış": "Logout",
    "Giriş": "Login",
    "Kayıt Ol": "Register",
    "Ara": "Search",
    "Kaydet": "Save",
    "İptal": "Cancel",
    "Sil": "Delete",
    "Düzenle": "Edit",
    "Güncelle": "Update",
    "İsim": "Name",
    "E-posta": "Email",
    "Şifre": "Password",
    "Şifreyi Onayla": "Confirm Password",
    
    // Spending Summary metinleri
    "Harcama Özeti": "Spending Summary",
    "Son Gün": "Last Day",
    "Son Hafta": "Last Week",
    "Son Ay": "Last Month",
    "Son Yıl": "Last Year",
    "Toplam Harcama": "Total Spending",
    
    // Budget Overview metinleri
    "Bütçe Genel Bakışı": "Budget Overview",
    "Gün": "Day",
    "Hafta": "Week",
    "Ay": "Month",
    "Yıl": "Year",
    "Gelir": "Income",
    "Giderler": "Expenses",
    "GELİR": "INCOME",
    "GİDERLER": "EXPENSES",
    
    // FAQ/Support sayfası metinleri
    "ANA": "MAIN",
    "DİĞERLERİ": "OTHERS",
    "Destek": "Support",
    "İşlemler": "Transactions",
    "Ödemeler": "Payments",
    "Döviz": "Exchange",
    "Destek Merkezi": "Support Center",
    "Bize Ulaşın": "Contact Us",
    "SSS": "FAQ",
    "E-posta Adresi": "Email Address",
    "Konu": "Subject",
    "Mesaj": "Message",
    "İstek Gönder": "Submit Request",
    "Sık Sorulan Sorular": "Frequently Asked Questions",
    "Yeni bir tasarruf hedefi nasıl eklerim?": "How do I add a new savings goal?",
    "Kontrol panelinizdeki Tasarruf bölümündeki '+' düğmesine tıklayarak ve istendiğinde hedef adını girerek yeni bir tasarruf hedefi ekleyebilirsiniz.": "You can add a new savings goal by clicking the '+' button in the Savings section of your dashboard, then enter the name of your goal when prompted.",
    "Tekrarlanan ödemeleri nasıl ayarlarım?": "How do I set up recurring payments?",
    "Tekrarlanan ödemeleri ayarlamak için kenar çubuğu menüsünden Ödemeler bölümüne gidin, ardından 'Ödeme Ekle'ye tıklayın ve talimatları izleyin.": "To set up recurring payments, navigate to the Payments section from the sidebar menu, then click on 'Add Payment' and follow the instructions.",
    "Hesap ayarlarımı nasıl değiştiririm?": "How do I change my account settings?",
    "Hesap ayarlarınızı değiştirmek için kenar çubuğu menüsündeki 'Ayarlar' seçeneğine tıklayın. Oradan, profilinizi, bildirim tercihlerinizi ve web sitesi ayarlarınızı güncelleyebilirsiniz.": "To change your account settings, click on the 'Settings' option in the sidebar menu. From there, you can update your profile, notification preferences, and website settings.",
    "Aradığınızı bulamadınız mı?": "Didn't find what you were looking for?",
    "Bize Ulaşın!": "Contact Us!",
    "© 2025 WealthGuard. Tüm hakları saklıdır.": "© 2025 WealthGuard. All rights reserved.",
    
    // Yeni Genel Çeviriler
    "Giriş Yap": "Sign In",
    "Kayıt Ol": "Sign Up",
    "Hesabınızı Oluşturun": "Create your account",
    "Tekrar Hoşgeldiniz! Devam etmek için lütfen giriş yapın.": "Welcome back! Please sign in to continue.",
    "Hoşgeldiniz! Başlamak için lütfen bilgileri doldurun.": "Welcome! Please fill in the details to get started.",
    "Hesabınız yok mu?": "Don't have an account?",
    "Zaten bir hesabınız var mı?": "Already have an account?",
    "Gönder": "Submit",
    "Yardıma mı İhtiyacınız Var? Destek İle İletişime Geçin": "Need Help? Contact Support",
    "Lütfen aşağıdaki formu doldurun.": "Please fill in the form below.",
    "En kısa sürede size geri döneceğiz.": "We will get back to you as soon as possible.",
    "Tam Ad": "Full Name",
    "Görünen Ad": "Display Name",
    "Şifreyi Sıfırla": "Reset Password",
    "Değişiklikleri Kaydet": "Save Changes",
    "Renk Teması": "Color Theme",
    "Metin Boyutu": "Text Size",
    "Mevcut metin boyutu:": "Current text size:",
    "Küçük": "Small",
    "Orta": "Medium",
    "Büyük": "Large",
    "Mor": "Purple",
    "Mavi": "Blue",
    
    // About sayfası
    "Hakkında": "About",
    "Bu kişisel finans ve bütçe takip uygulaması, bireylerin finansları üzerinde daha iyi kontrol sahibi olmalarına yardımcı olmak için tasarlanmıştır. Kullanıcılar gelirlerini kolayca takip edebilir, tekrarlanan harcamalarını yönetebilir ve bütçelerinde kalmak için günlük harcamalarını kategorize edebilirler. Uygulama, harcama modellerini analiz eden ve para biriktirmek için öneriler sunan kapsamlı araçlar sunar. Ayrıca, uygulama çoklu para birimi işlemlerini ve hatırlatıcılar ve uyarılarla finansal hedef takibini destekler. Kullanıcı dostu arayüzü ile web uygulaması, herkes için finansal refahı teşvik etmeyi amaçlamaktadır.": "This personal finance and budget tracking application is designed to help individuals gain better control over their finances. Users can easily track their income, manage recurring expenses, and categorize their daily spending to stay within their budget. The app offers insightful tools that analyze spending patterns and provide recommendations for saving money. Additionally, the application supports multi-currency transactions and financial goal tracking with reminders and alerts. With its user-friendly interface, the web app aims to promote financial wellness for everyone.",
    "WealthGuard, akıllı içgörüler ve otomasyon ile bütçenizi yönetmenize, harcamalarınızı takip etmenize ve finansal hedeflerinize ulaşmanıza yardımcı olur.": "WealthGuard helps you manage your budget, track expenses, and achieve your financial goals with smart insights and automation.",
    "Hızlı Bağlantılar": "Quick Links",
    
    // Homepage
    "Her kararda hassas koruma.": "Protection with precision, every decision.",
    
    // Exchange sayfası
    "Döviz Kurları": "Exchange Rates",
    "Temel Para Birimi:": "Base Currency:",
    "Yenile": "Refresh",
    "Döviz kurları yükleniyor...": "Loading exchange rates...",
    "Popüler Para Birimleri": "Popular Currencies",
    "Tüm Para Birimleri": "All Currencies",
    "Para Birimi": "Currency",
    "Kod": "Code",
    "Kur (1": "Rate (1",
    "Ters Kur (1 Para Birimi": "Inverse Rate (1 Currency to",
    "Son güncelleme:": "Last updated:",
    "Para Birimi Dönüştürme": "Currency Exchange",
    "Kaynak": "From",
    "Miktar": "Amount",
    "Hedef": "To",
    "Dönüştürülen Miktar": "Converted Amount",
    "Döviz Kuru": "Exchange Rate",
    "Güncelleniyor...": "Updating...",
    
    // Transaction sayfası
    "İşlem": "Transaction",
    "Toplam Gelir": "Total Income",
    "Toplam Gider": "Total Expense",
    "Net Miktar": "Net Amount",
    "Tümü": "All",
    "Tüm Zamanlar": "All Time",
    "Bugün": "Today",
    "Bu Hafta": "This Week",
    "Geçen Ay": "Last Month",
    "Son 3 Ay": "Last 3 Months",
    "Geçen Yıl": "Last Year",
    "Tarihe Göre Sırala": "Sort by Date",
    "Tutara Göre Sırala": "Sort by Amount",
    "İsme Göre Sırala": "Sort by Name",
    "Kategoriye Göre Sırala": "Sort by Category",
    "↑ Artan": "↑ Ascending",
    "↓ Azalan": "↓ Descending",
    "İşlem Ekle": "Add Transaction",
    "Filtrelerinizle eşleşen işlem bulunamadı.": "No transactions found matching your filters.",
    
    // Payment sayfası
    "Aylık Ödemeler": "Monthly Payments",
    "Aylık Toplam": "Total Monthly",
    "Ödenmiş": "Paid",
    "Kalan": "Remaining",
    "Yaklaşan Ödemeler": "Upcoming Payments",
    "Bugün ödenmesi gereken": "Due today",
    "Ödeme tarihi": "Due in",
    "gün": "days",
    "Vade Tarihine Göre Sırala": "Sort by Due Date",
    "Ödeme Ekle": "Add Payment",
    "Aylık Tekrarlanan Ödemeler": "Monthly Recurring Payments",
    "Ödendi Olarak İşaretle": "Mark Paid",
    "Filtrelerinizle eşleşen ödeme bulunamadı.": "No payments found matching your filters.",
    
    // AddTransaction Modali
    "İşlem Ekle": "Add Transaction",
    "İşlem Türü": "Transaction Type",
    "Gider": "Expense",
    "Gelir": "Income",
    "İşlem Adı": "Transaction Name",
    "örn. Market Alışverişi, Maaş": "e.g. Grocery Shopping, Salary",
    "Kategori": "Category",
    "Kategori seçin": "Select. a category",
    "Yiyecek": "Food",
    "Ulaşım": "Transport",
    "Alışveriş": "Shopping",
    "Eğlence": "Entertainment",
    "Faturalar": "Utilities",
    "Sağlık": "Health",
    "Eğitim": "Education",
    "Konut": "Housing",
    "Diğer": "Other",
    "Maaş": "Salary",
    "Serbest Çalışma": "Freelance",
    "Yatırım": "Investment",
    "Hediye": "Gift",
    "Kira Geliri": "Rental",
    "Tarih": "Date",
    "Not (İsteğe Bağlı)": "Note (Optional)",
    "Ek detaylar ekleyin...": "Add additional details...",
    "İşlemi Kaydet": "Save Transaction",
    
    // Payment Modali
    "Aylık Ödeme Ekle": "Add Monthly Payment",
    "Ödeme Adı *": "Payment Name *",
    "örn. Kira, Netflix, Elektrik Faturası": "e.g. Rent, Netflix, Electric Bill",
    "Tutar ($) *": "Amount ($) *",
    "Vade Tarihi *": "Due Date *",
    "Sigorta": "Insurance",
    "Abonelik": "Subscription",
    "Kredi": "Loan",
    
    // Dashboard sayfası
    "Son İşlemler": "Recent Transactions",
    "Tüm İşlemleri Gör": "See All Transactions",
    "Hedefleri Takip Et": "Track Goals",
    "Hedefi Düzenle": "Edit Goal",
    "Para Ekle": "Add Money",
    "Miktar girin": "Enter amount",
    "Ekle": "Add",
    "Hedef adı girin": "Enter goal name",
    "Hedef tutar girin ($)": "Enter target amount ($)",
    
    // Faq sayfası
    "Yeni Özellik": "New Feature",
    "Yeni hedef takip özelliğimizi deneyin!": "Try our new goal tracking feature!",
    "Bütçe Uyarısı": "Budget Alert",
    "Bu ay Eğlence bütçenizin %80'ini harcadınız": "You've spent 80% of your Entertainment budget this month",
    "Ödeme Hatırlatıcısı": "Payment Reminder",
    "Abonelik ödemeniz 3 gün içinde yapılmalı": "Your subscription payment is due in 3 days",
    
    // Settings sayfası
    "Görünüm": "Appearance",
    "Bakiye": "Balance",
    
    // Auth pages
    "Giriş Yapılıyor...": "Signing In...",
    "Kayıt Olunuyor...": "Signing Up...",
    "E-posta adresi": "E-mail address",
    
    // Ek çeviriler
    "Ay":"Month",
    "Gün":"Day",
    "Yıl":"Year",
    "Hafta":"Week",
    "Gider": "Expense",
    "Kaynaklar": "Resources",
    "Yardım": "Help",
    "Kılavuz": "Guide",
    "Kullanım": "Usage",
    "Başarılı": "Success",
    "Uyarı": "Warning",
    "Sonraki": "Next",
    "Önceki": "Previous",
    "Tamamla": "Complete",
    "Devam Et": "Continue",
    "Tamamlandı": "Completed",
    "Başarısız": "Failed",
    "Onay": "Confirmation",
    "Harcama": "Expense",
    "Kazanç": "Earning",
    "Birim": "Unit",
    "Sıralama": "Sorting",
    "Günlük": "Daily",
    "Aylık": "Monthly",
    "Yıllık": "Yearly",
    "Tarih Aralığı": "Date Range",
    "Başlangıç Tarihi": "Start Date",
    "Bitiş Tarihi": "End Date",
    "Önce": "Before",
    "Sonra": "After",
    "Rapor": "Report",
    "Rapor Oluştur": "Generate Report",
    "Grafik": "Chart",
    "Tablo": "Table",
    "Liste": "List",
    "Detay": "Detail",
    "Özet": "Summary",
    "Toplam": "Total",
    "Onayla": "Confirm",
    "Reddet": "Reject",
    "Artan": "Ascending",
    "Azalan": "Descending",
    "Kategori Ekle": "Add Category",
    "Kategori Düzenle": "Edit Category",
    "Kategori Sil": "Delete Category",
    "Para Birimi": "Currency",
    "Bütçe": "Budget",
    "Bütçe Ekle": "Add Budget",
    "Bütçe Düzenle": "Edit Budget",
    "Bütçe Sil": "Delete Budget",
    "Hedef": "Goal",
    "Hedef Ekle": "Add Goal",
    "Hedef Sil": "Delete Goal",
    "Kalan": "Remaining",
    "Güncel Durum": "Current Status",
    "Hatırlatıcı": "Reminder",
    "Hatırlatıcı Ekle": "Add Reminder",
    "Bildirim": "Notification",
    "Bildirimler": "Notifications",
    "Bildirim Ayarları": "Notification Settings",
    "Dil": "Language",
    "Dil Değiştir": "Change Language",
    "Koyu Tema": "Dark Theme",
    "Açık Tema": "Light Theme",
    "Tema Değiştir": "Change Theme",
    "Hesap": "Account",
    "Hesap Bilgileri": "Account Information",
    "Hesap Düzenle": "Edit Account",
    "Hesap Sil": "Delete Account",
    "Güvenlik": "Security",
    "Güvenlik Ayarları": "Security Settings",
    "Şifre Değiştir": "Change Password",
    "Oturumu Kapat": "Sign Out",
    "Profil Resmi": "Profile Picture",
    "Profil Resmi Değiştir": "Change Profile Picture",
    "Koruma": "Protection",
    "Hassasiyet": "Precision",
    "Her Karar": "Every Decision",
    "Her kararda hassas koruma.": "Protection with precision, every decision.",
    "Lütfen aşağıdaki formu doldurun.": "Please fill in the form below.",
    "En kısa sürede size geri döneceğiz.": "We will get back to you as soon as possible.",
    "E-posta adresinizi girin": "Enter your email address",
    "Mesajınızı girin": "Enter your message",
    "Yardıma mı İhtiyacınız Var?": "Need Help?",
    "Destek İle İletişime Geçin": "Contact Support",
    
    // Diğer eksik çeviriler
    "Kaydediliyor...": "Saving...",
    "Hata": "Error",
    "Tamamlandı": "Completed",
    "Başarılı": "Success",
    "Başarısız": "Failed",
    "Onay": "Confirmation",
    "Harcama": "Expense",
    "Kazanç": "Earning",
    "Birim": "Unit",
    "Sıralama": "Sorting",
    "Günlük": "Daily",
    "Aylık": "Monthly",
    "Yıllık": "Yearly",
    "Tarih Aralığı": "Date Range",
    "Başlangıç Tarihi": "Start Date",
    "Bitiş Tarihi": "End Date",
    "Önce": "Before",
    "Sonra": "After",
    "Rapor": "Report",
    "Rapor Oluştur": "Generate Report",
    "Grafik": "Chart",
    "Tablo": "Table",
    "Liste": "List",
    "Detay": "Detail",
    "Özet": "Summary",
    "Toplam": "Total",
    "Onayla": "Confirm",
    "Reddet": "Reject",
    "Artan": "Ascending",
    "Azalan": "Descending",
    "Kategori Ekle": "Add Category",
    "Kategori Düzenle": "Edit Category",
    "Kategori Sil": "Delete Category",
    "Para Birimi": "Currency",
    "Bütçe": "Budget",
    "Bütçe Ekle": "Add Budget",
    "Bütçe Düzenle": "Edit Budget",
    "Bütçe Sil": "Delete Budget",
    "Hedef": "Goal",
    "Hedef Ekle": "Add Goal",
    "Hedef Sil": "Delete Goal",
    "Kalan": "Remaining",
    "Güncel Durum": "Current Status",
    "Hatırlatıcı": "Reminder",
    "Hatırlatıcı Ekle": "Add Reminder",
    "Bildirim": "Notification",
    "Bildirimler": "Notifications",
    "Bildirim Ayarları": "Notification Settings",
    "Dil": "Language",
    "Dil Değiştir": "Change Language",
    "Koyu Tema": "Dark Theme",
    "Açık Tema": "Light Theme",
    "Tema Değiştir": "Change Theme",
    "Hesap": "Account",
    "Hesap Bilgileri": "Account Information",
    "Hesap Düzenle": "Edit Account",
    "Hesap Sil": "Delete Account",
    "Güvenlik": "Security",
    "Güvenlik Ayarları": "Security Settings",
    "Şifre Değiştir": "Change Password",
    "Oturumu Kapat": "Sign Out",
    "Profil Resmi": "Profile Picture",
    "Profil Resmi Değiştir": "Change Profile Picture",
    "Koruma": "Protection",
    "Hassasiyet": "Precision",
    "Her Karar": "Every Decision"
}
};

// DOM çevirisi için DOM içindeki tüm metin nodlarını bulan yardımcı fonksiyon
const getTextNodes = (node, textNodes = []) => {
  // Atlanması gereken elementler (script, style, input, textarea gibi)
  const skipTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION'];
  
  if (node && node.nodeName && skipTags.includes(node.nodeName)) {
    return textNodes;
  }

  // Text node'u ise ve boş değilse listeye ekle
  if (node && node.nodeType === Node.TEXT_NODE && node.nodeValue && node.nodeValue.trim() !== "") {
    textNodes.push(node);
  } else if (node && node.childNodes && node.childNodes.length > 0) {
    // Çocuk node'ları kontrol et
    for (let i = 0; i < node.childNodes.length; i++) {
      getTextNodes(node.childNodes[i], textNodes);
    }
  }
  return textNodes;
};

const findTranslatableWords = (text, language) => {
  if (!text || typeof text !== 'string') return null;
  
  // TR parametresi verildiğinde, İngilizce'den Türkçe'ye çevrilecek
  // ENG parametresi verildiğinde, Türkçe'den İngilizce'ye çevrilecek
  const source = language === "TR" ? manualTranslations.ENG_TO_TR : manualTranslations.TR_TO_ENG;
  let result = text;
  let hasChanges = false;
  
  // Tüm sözlük anahtarlarını kontrol et - özel regex karakterler için güvenli şekilde
  Object.keys(source).forEach(key => {
    try {
      // Özel karakterleri escape et
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Regex ile tam kelime eşleşmesi yapıyoruz (sözcük sınırları \b kullanarak)
      const regex = new RegExp(`\\b${escapedKey}\\b`, 'gi');
      
      if (regex.test(result)) {
        result = result.replace(regex, source[key]);
        hasChanges = true;
      }
    } catch (error) {
      console.error(`Regex hatası oluştu, anahtar: "${key}"`, error);
      // Düz metin karşılaştırma ile yedek çözüm
      if (result.toLowerCase().includes(key.toLowerCase())) {
        result = result.replace(new RegExp(key, 'gi'), source[key]);
        hasChanges = true;
      }
    }
  });
  
  return hasChanges ? result : null;
};

export const TranslationProvider = ({ children }) => {
  // Get language from localStorage
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("wealthguard-language") || "ENG";
  });

  // Previous language to track changes
  const [prevLanguage, setPrevLanguage] = useState("");
  
  // Active translations cache
  const [translations, setTranslations] = useState({});
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // DOM çevirisi için fonksiyon - debug için güncellenmiş
  const translateDOM = async () => {
    console.log("translateDOM çağrıldı, geçerli dil:", language);
    
    setIsLoading(true);
    try {
      console.log("DOM çevirisi başlatılıyor...");
      
      // Çevrilmemesi gereken bileşenler
      const excludeSelectors = '.LanguageThemeSwitcher, script, style, noscript, [data-no-translate]';
      const excludeElements = document.querySelectorAll(excludeSelectors);
      const excludeNodes = [];
      
      // Çevrilmemesi gereken bileşenlerin tüm alt elemanlarını ekle
      excludeElements.forEach(el => {
        const nodes = getTextNodes(el);
        excludeNodes.push(...nodes);
      });
      
      console.log("Hariç tutulan düğüm sayısı:", excludeNodes.length);
      
      // DOM'daki tüm metin nodlarını bul
      const allTextNodes = getTextNodes(document.body);
      console.log("Toplam bulunan metin düğümü sayısı:", allTextNodes.length);
      
      // Çevrilmesi gereken nodları belirle (excludeNodes dışındakiler)
      const nodesToTranslate = allTextNodes.filter(node => 
        !excludeNodes.includes(node) && 
        node.nodeValue && 
        node.nodeValue.trim().length > 1 && 
        !/^\d+$/.test(node.nodeValue.trim()) // Sadece sayı içerenleri çevirme
      );
      
      console.log("Çevrilecek düğüm sayısı:", nodesToTranslate.length);
      
      // Örnek olarak ilk 5 düğümü ve değerlerini göster
      console.log("Örnek düğümler:", nodesToTranslate.slice(0, 5).map(n => n.nodeValue.trim()));
      
      let processedCount = 0;
      let skippedCount = 0;
      
      // Manuel çeviri - daha kapsamlı kelime arama ve değiştirme
      for (let node of nodesToTranslate) {
        const originalText = node.nodeValue;
        
        if (originalText && originalText.trim()) {
          // Dil TR ise İngilizce'den Türkçe'ye, ENG ise Türkçe'den İngilizce'ye çevir
          const translatedText = language === "TR" ? 
            findTranslatableWords(originalText, "TR") : 
            findTranslatableWords(originalText, "ENG");
          
          if (translatedText) {
            node.nodeValue = translatedText;
            processedCount++;
          } else {
            skippedCount++;
          }
        }
      }
      
      console.log(`Çeviri tamamlandı - İşlenen: ${processedCount}, Atlanan: ${skippedCount}`);
      
    } catch (error) {
      console.error("DOM translation error:", error);
    } finally {
      setIsLoading(false);
      setPrevLanguage(language);
      console.log("DOM çevirisi tamamlandı");
    }
  };

  // Function to translate a single text
  const translate = async (text) => {
    // If we already have a translation for this text in cache
    if (translationCache[language][text]) {
      return translationCache[language][text];
    }
    
    console.log("Tek metin çevirisi istendi:", text);
    
    try {
      setIsLoading(true);
      
      // Manuel çeviri sözlüğünden kelimeyi ara - düzeltilmiş dil mantığı
      if (language === "TR") {
        // TR seçiliyse İngilizce'den Türkçe'ye çevir
        const translation = manualTranslations.ENG_TO_TR[text];
        if (translation) {
          // Update cache
          translationCache[language][text] = translation;
          return translation;
        }
      } else {
        // ENG seçiliyse Türkçe'den İngilizce'ye çevir
        const translation = manualTranslations.TR_TO_ENG[text];
        if (translation) {
          // Update cache
          translationCache[language][text] = translation;
          return translation;
        }
      }
      
      // Metindeki çevrilebilecek kelimeleri kontrol et
      const translatedText = language === "TR" ? 
        findTranslatableWords(text, "TR") : 
        findTranslatableWords(text, "ENG");
      
      if (translatedText) {
        // Update cache
        translationCache[language][text] = translatedText;
        return translatedText;
      }
      
      /*
      // API entegrasyonu etkinleştirildiğinde burası kullanılacak
      const response = await fetch(TRANSLATION_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: language === "TR" ? "en" : "tr",
          target: language === "TR" ? "tr" : "en",
          format: "text"
        }),
      });
      
      const data = await response.json();
      
      if (data && data.translatedText) {
        // Update cache
        translationCache[language][text] = data.translatedText;
        
        // Update active translations
        setTranslations(prev => ({
          ...prev,
          [text]: data.translatedText
        }));
        
        return data.translatedText;
      }
      */
      
      return text; // Fallback to original text
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Fallback to original text
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper component to translate text directly in JSX
  const T = ({ children, ...props }) => {
    const [translatedText, setTranslatedText] = useState(children);
    
    useEffect(() => {
      if (typeof children === 'string') {
        if (language === "ENG" && translationCache.ENG[children]) {
          setTranslatedText(translationCache.ENG[children]);
        } else if (language === "TR" && translationCache.TR[children]) {
          setTranslatedText(translationCache.TR[children]);
        } else {
          translate(children).then(result => {
            setTranslatedText(result);
          });
        }
      }
    }, [children, language]);
    
    if (typeof children !== 'string') {
      return children;
    }
    
    return <span {...props}>{translatedText}</span>;
  };

  // Change language and update translations
  const changeLanguage = (newLanguage) => {
    console.log("Dil değiştiriliyor:", newLanguage);
    if (newLanguage === language) return; // Dil zaten aynıysa işlem yapma
    
    setLanguage(newLanguage);
    localStorage.setItem("wealthguard-language", newLanguage);
    
    // Dil değiştiğinde hemen çeviri başlat
    setTimeout(() => {
      translateDOM();
    }, 100);
  };

  // İlk yükleme ve dil değişikliklerinde DOM çevirisini başlat
  useEffect(() => {
    console.log("TranslationProvider mounted, current language:", language);
    
    // İlk yükleme sonrası çeviriyi başlat
    const timer = setTimeout(() => {
      translateDOM();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);


  return (
    <TranslationContext.Provider
      value={{
        language,
        changeLanguage,
        translate,
        translations,
        isLoading,
        T,
        translateDOM
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

// Custom hook for easier usage
export const useTranslation = () => useContext(TranslationContext);