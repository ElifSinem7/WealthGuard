import axios from 'axios';
import AuthService from './auth.service';
import API_CONFIG from './api.config';

const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAYMENTS}`; // PAYMENTS endpoint'ini kullan

class PaymentService {
  // Tüm ödemeleri getir
  async getAllPayments() {
    try {
      console.log("Payments API URL:", API_URL);
      console.log("Auth Headers:", AuthService.authHeader());
      
      const response = await axios.get(API_URL, {
        headers: AuthService.authHeader()
      });
      
      console.log("Payments Response:", response.data);
      
      // Gelen veriyi işle ve doğru formata dönüştür
      if (response.data && response.data.data) {
        // API yanıtını doğru formata dönüştür
        const formattedPayments = response.data.data.map(payment => ({
          id: payment.id,
          name: payment.description || payment.title || "Ödeme",
          category: payment.category || "Ödeme",
          amount: payment.type === 'expense' ? -Math.abs(Number(payment.amount)) : Math.abs(Number(payment.amount)),
          date: payment.date || payment.paymentDate || payment.created_at,
          type: payment.type || 'expense',
          icon: this.getIconForPaymentType(payment.paymentMethod || payment.category || 'default')
        }));
        
        return formattedPayments;
      }
      
      return response.data?.data || [];
    } catch (error) {
      console.error('Payment fetch error:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Eğer endpoint bulunamazsa veya hala oluşturulmadıysa, boş dizi dön
      if (error.response?.status === 404) {
        console.log("Payment endpoint bulunamadı, muhtemelen henüz oluşturulmamış");
        return [];
      }
      
      throw error.response?.data || { message: 'Failed to fetch payments' };
    }
  }
  
  // Ödeme yöntemi veya kategorisine göre ikon belirle
  getIconForPaymentType(type) {
    if (!type) return 'credit-card';
    
    type = type.toLowerCase();
    
    if (type.includes('credit') || type.includes('kredi')) {
      return 'credit-card';
    } else if (type.includes('debit') || type.includes('banka')) {
      return 'credit-card';
    } else if (type.includes('cash') || type.includes('nakit')) {
      return 'money';
    } else if (type.includes('transfer') || type.includes('havale')) {
      return 'exchange';
    } else if (type.includes('bill') || type.includes('fatura')) {
      return 'home';
    }
    
    return 'credit-card';
  }
  
  // Yeni ödeme ekle
  async addPayment(payment) {
    try {
      const response = await axios.post(API_URL, payment, {
        headers: AuthService.authHeader()
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Payment add error:', error);
      throw error.response?.data || { message: 'Failed to add payment' };
    }
  }
  
  // Diğer ödeme işlemi metodları buraya eklenebilir...


  async updatePaymentStatus(id, paid) {
    try {
      console.log(`Ödeme durumu güncelleniyor: ID=${id}, durum=${paid}`);
      const response = await axios.patch(`${API_URL}/${id}/status`, { paid }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('API yanıtı (durum güncelleme):', response.data);
      return response.data;
    } catch (error) {
      console.error('Update payment status error:', error.response?.data || error.message || error);
      throw error;
    }
  }

  async deletePayment(id) {
    try {
      console.log(`Ödeme siliniyor: ID=${id}`);
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('API yanıtı (ödeme silme):', response.data);
      return response.data;
    } catch (error) {
      console.error('Delete payment error:', error.response?.data || error.message || error);
      throw error;
    }
  }
}

export default new PaymentService();