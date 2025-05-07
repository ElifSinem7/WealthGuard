/**
 * API hatalarını ele almak için merkezi fonksiyon
 * @param {Error} error - Axios hata nesnesi
 * @param {Function} fallbackAction - Hata durumunda yedek bir eylem
 * @returns {string} Kullanıcı dostu hata mesajı
 */
export const handleApiError = (error, fallbackAction) => {
    let errorMessage = 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
    
    if (error.response) {
      // Sunucu yanıtı ile dönen hata
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data.message || 'Geçersiz istek.';
          break;
        case 401:
          errorMessage = 'Oturum süresi dolmuş. Lütfen tekrar giriş yapın.';
          // Oturumu sonlandır
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Giriş sayfasına yönlendir
          setTimeout(() => {
            window.location.href = '/signin';
          }, 1500);
          break;
        case 403:
          errorMessage = 'Bu işlem için yetkiniz yok.';
          break;
        case 404:
          errorMessage = 'İstenen kaynak bulunamadı.';
          break;
        case 500:
          errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
          break;
        default:
          errorMessage = data.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
      }
    } else if (error.request) {
      // İstek yapıldı ancak yanıt alınamadı
      errorMessage = 'Sunucuya ulaşılamıyor. İnternet bağlantınızı kontrol edin.';
    }
    
    // Konsola ayrıntılı hata bilgisini yazdır
    console.error('API Hatası:', error);
    
    // Yedek eylem varsa çalıştır
    if (typeof fallbackAction === 'function') {
      fallbackAction();
    }
    
    return errorMessage;
  };