// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

console.log("API Base URL:", API_BASE_URL);

// Auth API calls
export const authAPI = {
  signup: async (email, password, confirmPassword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return errorData;
      }

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        message: error.message || "Network error - unable to reach server",
      };
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return errorData;
      }

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.message || "Network error - unable to reach server",
      };
    }
  },

  getProfile: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return errorData;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Get profile error:", error);
      return {
        success: false,
        message: error.message || "Network error - unable to reach server",
      };
    }
  },

  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return errorData;
      }

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error("Update profile error:", error);
      return {
        success: false,
        message: error.message || "Network error - unable to reach server",
      };
    }
  },

  updateLocation: async (locationData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/auth/location`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(locationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return errorData;
      }

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error("Update location error:", error);
      return {
        success: false,
        message: error.message || "Network error - unable to reach server",
      };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  deleteAccount: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/auth/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return errorData;
      }

      const data = await response.json();
      if (data.success) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      return data;
    } catch (error) {
      console.error("Delete account error:", error);
      return {
        success: false,
        message: error.message || "Network error - unable to reach server",
      };
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return errorData;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Change password error:", error);
      return {
        success: false,
        message: error.message || "Network error - unable to reach server",
      };
    }
  },
};

// Community API calls
export const communityAPI = {
  createCommunity: async (communityData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/communities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(communityData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return errorData;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Create community error:", error);
      return {
        success: false,
        message: error.message || "Network error - unable to reach server",
      };
    }
  },

  getCommunity: async (communityId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/communities/${communityId}`);

      if (!response.ok) {
        const errorData = await response.json();
        return errorData;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Get community error:", error);
      return {
        success: false,
        message: error.message || "Network error - unable to reach server",
      };
    }
  },

  getAllCommunities: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.search) params.append("search", filters.search);

      const response = await fetch(
        `${API_BASE_URL}/communities?${params.toString()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        return errorData;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Get all communities error:", error);
      return {
        success: false,
        message: error.message || "Network error - unable to reach server",
      };
    }
  },

  getSimilarCommunities: async (communityId, limit = 3) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/communities/${communityId}/similar?limit=${limit}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        return errorData;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Get similar communities error:", error);
      return {
        success: false,
        message: error.message || "Network error - unable to reach server",
      };
    }
  },

  updateCommunity: async (communityId, communityData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/communities/${communityId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(communityData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return errorData;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Update community error:", error);
      return {
        success: false,
        message: error.message || "Network error - unable to reach server",
      };
    }
  },

  deleteCommunity: async (communityId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/communities/${communityId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return errorData;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Delete community error:", error);
      return {
        success: false,
        message: error.message || "Network error - unable to reach server",
      };
    }
  },

  joinCommunity: async (communityId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/communities/${communityId}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Join community error response:", data);
        return data;
      }

      return data;
    } catch (error) {
      console.error("Join community error:", error);
      return {
        success: false,
        message: error.message || "Network error - unable to reach server",
      };
    }
  },

  leaveCommunity: async (communityId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/communities/${communityId}/leave`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Leave community error response:", data);
        return data;
      }

      return data;
    } catch (error) {
      console.error("Leave community error:", error);
      return {
        success: false,
        message: error.message || "Network error - unable to reach server",
      };
    }
  },

  addReview: async (communityId, rating, comment) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/communities/${communityId}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Add review error response:", data);
        return data;
      }

      return data;
    } catch (error) {
      console.error("Add review error:", error);
      return {
        success: false,
        message: error.message || "Network error - unable to reach server",
      };
    }
  },
};

export default authAPI;


