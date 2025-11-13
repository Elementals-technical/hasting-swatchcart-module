module.exports = {
  content: ['./lib/**/*.{ts,tsx}'],
  corePlugins: { preflight: false },
  prefix: 'tw-',
  theme: {
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        fade: 'fade 0.3s ease-in-out',
      },
      screens: {
        xxs: '360px',
        xs: '480px',
      },
    },
  },
};
