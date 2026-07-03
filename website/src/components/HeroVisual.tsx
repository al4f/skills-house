/** Abstract network illustration for the homepage hero. */
export function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <svg
        className="hero-visual-svg"
        viewBox="0 0 480 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="hero-glow-a" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5b8def" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#5b8def" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hero-glow-b" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hero-line" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5b8def" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.4" />
          </linearGradient>
          <filter id="hero-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="24" />
          </filter>
        </defs>

        <circle cx="240" cy="240" r="160" fill="url(#hero-glow-a)" filter="url(#hero-blur)" className="hero-orb hero-orb-a" />
        <circle cx="300" cy="180" r="100" fill="url(#hero-glow-b)" filter="url(#hero-blur)" className="hero-orb hero-orb-b" />

        <g className="hero-grid" stroke="rgba(255,255,255,0.04)" strokeWidth="1">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <line key={`h${i}`} x1="40" y1={60 + i * 52} x2="440" y2={60 + i * 52} />
          ))}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <line key={`v${i}`} x1={60 + i * 52} y1="40" x2={60 + i * 52} y2="440" />
          ))}
        </g>

        <g className="hero-edges" stroke="url(#hero-line)" strokeWidth="1.5" strokeLinecap="round">
          <path d="M120 320 L200 240 L280 280 L360 160" className="hero-edge" />
          <path d="M160 120 L240 200 L320 140 L400 220" className="hero-edge hero-edge-delay" />
          <path d="M200 240 L320 140" className="hero-edge hero-edge-delay-2" />
          <path d="M120 320 L160 120" className="hero-edge hero-edge-delay-3" />
          <path d="M280 280 L400 220" className="hero-edge hero-edge-delay-2" />
        </g>

        <g className="hero-nodes">
          <circle cx="120" cy="320" r="10" className="hero-node hero-node-script" />
          <circle cx="160" cy="120" r="8" className="hero-node hero-node-skill" />
          <circle cx="200" cy="240" r="12" className="hero-node hero-node-skill hero-node-primary" />
          <circle cx="280" cy="280" r="9" className="hero-node hero-node-script" />
          <circle cx="320" cy="140" r="11" className="hero-node hero-node-skill" />
          <circle cx="360" cy="160" r="7" className="hero-node hero-node-skill" />
          <circle cx="400" cy="220" r="8" className="hero-node hero-node-script" />
        </g>

        <g className="hero-rings" stroke="rgba(91,141,239,0.15)" strokeWidth="1" fill="none">
          <circle cx="240" cy="220" r="90" className="hero-ring" />
          <circle cx="240" cy="220" r="130" className="hero-ring hero-ring-delay" />
        </g>

        <rect
          x="168"
          y="352"
          width="144"
          height="56"
          rx="10"
          className="hero-card"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
        <rect x="184" y="368" width="48" height="6" rx="3" fill="rgba(91,141,239,0.5)" />
        <rect x="184" y="382" width="80" height="4" rx="2" fill="rgba(255,255,255,0.12)" />
        <rect x="184" y="392" width="64" height="4" rx="2" fill="rgba(255,255,255,0.08)" />
      </svg>
    </div>
  );
}
