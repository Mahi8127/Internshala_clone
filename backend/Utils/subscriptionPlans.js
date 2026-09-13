const subscriptionPlans = {
  free: {
    name: "Free Plan",
    price: 0,
    monthlyApplicationLimit: 1,
  },

  bronze: {
    name: "Bronze Plan",
    price: 100,
    monthlyApplicationLimit: 3,
  },

  silver: {
    name: "Silver Plan",
    price: 300,
    monthlyApplicationLimit: 5,
  },

  gold: {
    name: "Gold Plan",
    price: 1000,
    monthlyApplicationLimit: null, // null = unlimited
  },
};

module.exports = subscriptionPlans;