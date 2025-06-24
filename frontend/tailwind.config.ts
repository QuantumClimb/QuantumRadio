import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				quantum: {
					// Brand Colors from CSS Variables
					primary: 'var(--quantum-primary)',           // Radiant Gold #F4B843
					secondary: 'var(--quantum-secondary)',       // Neon Sky Blue #2DB6FF
					accent: 'var(--quantum-accent)',             // Electric Blue Glow #00CFFF
					dark: 'var(--quantum-dark)',                 // Midnight Navy #0C0F1E
					light: 'var(--quantum-light)',               // Light Champagne #FFEAC3
					muted: 'var(--quantum-muted)',               // Cool Gray #B5B8C2
					shadow: 'var(--quantum-shadow)',             // Bronze Shadow #924C14
					
					// Direct Color Values (for cases where CSS vars don't work)
					gold: '#F4B843',        // Radiant Gold
					'sky-blue': '#2DB6FF',  // Neon Sky Blue
					'electric': '#00CFFF',  // Electric Blue Glow
					navy: '#0C0F1E',        // Midnight Navy
					bronze: '#924C14',      // Bronze Shadow
					champagne: '#FFEAC3',   // Light Champagne
					gray: '#B5B8C2'         // Cool Gray
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'quantum-glow': 'var(--quantum-glow-soft)',
				'quantum-primary': 'var(--quantum-glow-primary)',
				'quantum-secondary': 'var(--quantum-glow-secondary)',
				'quantum-accent': 'var(--quantum-glow-accent)'
			},
			backgroundImage: {
				'quantum-gradient': 'var(--quantum-gradient-primary)',
				'quantum-accent-gradient': 'var(--quantum-gradient-accent)',
				'quantum-dark-gradient': 'var(--quantum-gradient-dark)',
				'quantum-glass': 'var(--quantum-gradient-glass)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-subtle': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'quantum-glow': {
					'0%, 100%': { 
						filter: 'drop-shadow(var(--quantum-glow-soft))' 
					},
					'50%': { 
						filter: 'drop-shadow(var(--quantum-glow-primary))' 
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
				'quantum-glow': 'quantum-glow 3s ease-in-out infinite'
			}
		}
	},
	plugins: [tailwindAnimate],
} satisfies Config;
