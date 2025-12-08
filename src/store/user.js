import { reactive } from 'vue';

export const userStore = reactive({
  user: null,
  token: null,

  // Save login info
  login(userData, token) {
    this.user = userData;
    this.token = token;
  },

  // Clear login info 
  clearUser() {
    this.user = null;
    this.token = null;
  }
});