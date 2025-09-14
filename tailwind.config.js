/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    // Cores hexadecimais para background (bg-[])
    'bg-[#BE1D1E]', 'bg-[#DC2626]', 'bg-[#EF4444]', 'bg-[#F87171]',
    'bg-[#1E40AF]', 'bg-[#2563EB]', 'bg-[#3B82F6]', 'bg-[#60A5FA]',
    'bg-[#059669]', 'bg-[#10B981]', 'bg-[#34D399]', 'bg-[#6EE7B7]',
    'bg-[#7C2D12]', 'bg-[#EA580C]', 'bg-[#F97316]', 'bg-[#FB923C]',
    'bg-[#7C3AED]', 'bg-[#8B5CF6]', 'bg-[#A78BFA]', 'bg-[#C4B5FD]',
    'bg-[#DB2777]', 'bg-[#EC4899]', 'bg-[#F472B6]', 'bg-[#F9A8D4]',
    'bg-[#374151]', 'bg-[#4B5563]', 'bg-[#6B7280]', 'bg-[#9CA3AF]',
    'bg-[#000000]', 'bg-[#1F2937]', 'bg-[#FFFFFF]', 'bg-[#F3F4F6]',
    // Cores hexadecimais para texto (text-[])
    'text-[#BE1D1E]', 'text-[#DC2626]', 'text-[#EF4444]', 'text-[#F87171]',
    'text-[#1E40AF]', 'text-[#2563EB]', 'text-[#3B82F6]', 'text-[#60A5FA]',
    'text-[#059669]', 'text-[#10B981]', 'text-[#34D399]', 'text-[#6EE7B7]',
    'text-[#7C2D12]', 'text-[#EA580C]', 'text-[#F97316]', 'text-[#FB923C]',
    'text-[#7C3AED]', 'text-[#8B5CF6]', 'text-[#A78BFA]', 'text-[#C4B5FD]',
    'text-[#DB2777]', 'text-[#EC4899]', 'text-[#F472B6]', 'text-[#F9A8D4]',
    'text-[#374151]', 'text-[#4B5563]', 'text-[#6B7280]', 'text-[#9CA3AF]',
    'text-[#000000]', 'text-[#1F2937]', 'text-[#FFFFFF]', 'text-[#F3F4F6]',
    // Gradientes com cores hexadecimais
    'from-[#BE1D1E]', 'to-[#BE1D1E]', 'from-orange-500', 'to-[#BE1D1E]',
    'from-[#BE1D1E]', 'to-pink-500', 'bg-clip-text', 'text-transparent',
    // Gradientes pré-definidos
    'bg-gradient-to-r',
    'from-orange-400', 'to-red-500',
    'from-blue-400', 'to-blue-600',
    'from-green-400', 'to-green-600',
    'from-purple-400', 'to-purple-600',
    'from-pink-400', 'to-pink-600',
    'from-teal-400', 'to-teal-600',
    'from-indigo-400', 'to-indigo-600',
    'from-gray-400', 'to-gray-600',
    'from-red-500', 'via-orange-500', 'to-yellow-500',
    'from-cyan-400', 'via-blue-500', 'to-purple-600',
    'from-emerald-400', 'to-cyan-400',
    'from-rose-400', 'to-pink-400'
  ]
};
