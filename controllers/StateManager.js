// File: controllers/StateManager.js
/**
 * StateManager - Handles saving and loading graph state
 * Manages persistence using localStorage and future backend integrations
 */
class StateManager {
  constructor(model) {
    this.model = model;
    this.storageKey = 'dagger_graph_state';
  }
  
  saveToLocalStorage() {
    try {
      const data = this.model.exportData();
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to save state:', error);
      return false;
    }
  }
  
  loadFromLocalStorage() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        return this.model.importData(JSON.parse(data));
      }
      return false;
    } catch (error) {
      console.error('Failed to load state:', error);
      return false;
    }
  }
  
  // Could be implemented later for backend integration
  async saveToServer() {
    // To be implemented
  }
  
  async loadFromServer() {
    // To be implemented
  }
}