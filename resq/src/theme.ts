export const colors = {
  background: '#050508',
  surface: '#0D0D14',
  border: 'rgba(255, 255, 255, 0.06)', // #FFFFFF0F is ~6% opacity
  primary: '#FF2D2D',
  safe: '#00E676',
  waterFill: 'rgba(0, 102, 255, 0.25)', 
  waterBorder: 'rgba(0, 102, 255, 0.8)',
  dangerFill: 'rgba(255, 45, 45, 0.15)',
  safeFill: 'rgba(0, 230, 118, 0.12)',
  warning: '#FF8C00',
  textPrimary: '#F5F5F0',
  textMuted: 'rgba(245, 245, 240, 0.5)',
  textData: '#00E676',
  accent: '#FF2D2D',
  divider: 'rgba(255, 255, 255, 0.08)', // #FFFFFF14
};

export const fonts = {
  bebas: 'BebasNeue_400Regular',
  mono: 'ShareTechMono_400Regular',
  body: 'BarlowCondensed_500Medium',
};

export const shadows = {
  activeGlowRed: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
  activeGlowGreen: {
    shadowColor: colors.safe,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  }
};
