// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      backgroundImage: {
        'gradient-finance': 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        'gradient-media': 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
        'gradient-hero': 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)',
      }
    }
  },
  plugins: [require("daisyui")], // Add DaisyUI plugin

}
