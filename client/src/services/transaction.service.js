import axios from 'axios';
import AuthService from './auth.service';
import API_CONFIG from './api.config';

const API_URL = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}`; // TRANSACTIONS endpoint'ini kullanın

class TransactionService {
  // Tüm işlemleri al
  async getAllTransactions() {
    try {
      console.log("Transactions API URL:", API_URL); // URL'yi kontrol etmek için log
      console.log("Auth Headers:", AuthService.authHeader()); // Auth header'larını kontrol etmek için log
      
      const response = await axios.get(API_URL, {
        headers: AuthService.authHeader()
      });
      
      console.log("Transactions Response:", response.data); // API yanıtını incelemek için
      
      // Gelen veriyi işle ve doğru formata dönüştür
      if (response.data && response.data.data) {
        // API yanıtını doğru formata dönüştür
        const formattedTransactions = response.data.data.map(transaction => ({
          id: transaction.id,
          name: transaction.description || transaction.name,
          category: transaction.category,
          amount: transaction.type === 'expense' ? -Math.abs(Number(transaction.amount)) : Math.abs(Number(transaction.amount)),
          date: transaction.date,
          type: transaction.type,
          icon: this.getIconForCategory(transaction.category)
        }));
        
        return formattedTransactions;
      }
      
      return response.data?.data || [];
    } catch (error) {
      console.error('Transaction fetch error:', error);
      console.error('Error details:', error.response?.data || error.message);
      throw error.response?.data || { message: 'Failed to fetch transactions' };
    }
  }
  
  // Kategori tipine göre ikon belirle
  getIconForCategory(category) {
    if (!category) return 'default';
    
    category = category.toLowerCase();
    
    if (category.includes('entertainment') || category.includes('eğlence')) {
      return 'video';
    } else if (category.includes('food') || category.includes('grocery') || category.includes('yemek') || category.includes('market')) {
      return 'food';
    } else if (category.includes('shopping') || category.includes('alışveriş')) {
      return 'shopping';
    } else if (category.includes('transport') || category.includes('ulaşım')) {
      return 'transport';
    } else if (category.includes('income') || category.includes('salary') || category.includes('gelir') || category.includes('maaş')) {
      return 'income';
    } else if (category.includes('utility') || category.includes('bill') || category.includes('fatura')) {
      return 'home';
    } else if (category.includes('music') || category.includes('müzik')) {
      return 'music';
    }
    
    return 'default';
  }

  async addTransaction(transactionData) {
    try {
      // Veriyi düzgün şekilde göndermek için JSON.stringify kullanmayın - Axios bunu otomatik yapar
      const response = await axios.post(API_URL, transactionData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Add transaction error:', error);
      throw error;
    }
  }

  async deleteTransaction(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Delete transaction error:', error);
      throw error;
    }
  }
}

export default new TransactionService();