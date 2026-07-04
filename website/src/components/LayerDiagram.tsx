/** Pipeline diagram: source → framework layer → agents */
export function LayerDiagram() {
  return (
    <div className="layer-diagram" aria-hidden="true">
      <svg viewBox="0 0 720 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="layer-diagram-svg">
        <defs>
          <linearGradient id="layer-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5b8def" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="layer-fill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(91,141,239,0.12)" />
            <stop offset="100%" stopColor="rgba(91,141,239,0.02)" />
          </linearGradient>
          <filter id="layer-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Source layer */}
        <rect x="24" y="40" width="200" height="300" rx="12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="rgba(24,24,29,0.6)" />
        <text x="124" y="72" textAnchor="middle" fill="#9b9ba4" fontSize="11" fontFamily="JetBrains Mono, monospace" letterSpacing="0.08em">
          SOURCE
        </text>
        <rect x="44" y="88" width="160" height="36" rx="6" fill="rgba(96,165,250,0.1)" stroke="rgba(96,165,250,0.3)" strokeWidth="1" />
        <text x="56" y="110" fill="#60a5fa" fontSize="12" fontFamily="JetBrains Mono, monospace">
          skills/
        </text>
        <rect x="44" y="136" width="160" height="36" rx="6" fill="rgba(167,139,250,0.1)" stroke="rgba(167,139,250,0.3)" strokeWidth="1" />
        <text x="56" y="158" fill="#a78bfa" fontSize="12" fontFamily="JetBrains Mono, monospace">
          scripts/
        </text>
        <text x="124" y="200" textAnchor="middle" fill="#6b6b76" fontSize="10" fontFamily="Inter, sans-serif">
          Freeform authoring
        </text>
        <text x="124" y="218" textAnchor="middle" fill="#6b6b76" fontSize="10" fontFamily="Inter, sans-serif">
          @include · markdown links
        </text>

        {/* Arrow 1 */}
        <path d="M236 190 L276 190" stroke="url(#layer-grad)" strokeWidth="2" strokeLinecap="round" className="layer-arrow" />
        <polygon points="276,190 268,186 268,194" fill="#818cf8" />

        {/* Framework layer — highlighted */}
        <rect
          x="284"
          y="24"
          width="152"
          height="332"
          rx="14"
          stroke="url(#layer-grad)"
          strokeWidth="1.5"
          fill="url(#layer-fill)"
          filter="url(#layer-glow)"
          className="layer-core"
        />
        <text x="360" y="56" textAnchor="middle" fill="#5b8def" fontSize="11" fontFamily="JetBrains Mono, monospace" letterSpacing="0.08em" fontWeight="600">
          FRAMEWORK
        </text>
        <text x="360" y="76" textAnchor="middle" fill="#ececef" fontSize="13" fontFamily="Inter, sans-serif" fontWeight="600">
          skills-house
        </text>
        <rect x="304" y="96" width="112" height="28" rx="5" fill="rgba(91,141,239,0.15)" stroke="rgba(91,141,239,0.25)" strokeWidth="1" />
        <text x="360" y="115" textAnchor="middle" fill="#7aa3f5" fontSize="10" fontFamily="JetBrains Mono, monospace">
          @skills-house/build
        </text>
        <rect x="304" y="136" width="112" height="28" rx="5" fill="rgba(91,141,239,0.08)" stroke="rgba(91,141,239,0.15)" strokeWidth="1" />
        <text x="360" y="155" textAnchor="middle" fill="#9b9ba4" fontSize="10" fontFamily="JetBrains Mono, monospace">
          validate
        </text>
        <rect x="304" y="176" width="112" height="28" rx="5" fill="rgba(91,141,239,0.08)" stroke="rgba(91,141,239,0.15)" strokeWidth="1" />
        <text x="360" y="195" textAnchor="middle" fill="#9b9ba4" fontSize="10" fontFamily="JetBrains Mono, monospace">
          generate
        </text>
        <rect x="304" y="216" width="112" height="28" rx="5" fill="rgba(91,141,239,0.08)" stroke="rgba(91,141,239,0.15)" strokeWidth="1" />
        <text x="360" y="235" textAnchor="middle" fill="#9b9ba4" fontSize="10" fontFamily="JetBrains Mono, monospace">
          ship
        </text>
        <text x="360" y="280" textAnchor="middle" fill="#6b6b76" fontSize="10" fontFamily="Inter, sans-serif">
          The missing layer
        </text>
        <text x="360" y="298" textAnchor="middle" fill="#6b6b76" fontSize="10" fontFamily="Inter, sans-serif">
          between dev &amp; agents
        </text>

        {/* Arrow 2 */}
        <path d="M444 190 L484 190" stroke="url(#layer-grad)" strokeWidth="2" strokeLinecap="round" className="layer-arrow layer-arrow-delay" />
        <polygon points="484,190 476,186 476,194" fill="#a78bfa" />

        {/* Dist + Agents */}
        <rect x="492" y="40" width="204" height="140" rx="12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="rgba(24,24,29,0.6)" />
        <text x="594" y="72" textAnchor="middle" fill="#9b9ba4" fontSize="11" fontFamily="JetBrains Mono, monospace" letterSpacing="0.08em">
          DIST
        </text>
        <rect x="512" y="88" width="164" height="36" rx="6" fill="rgba(52,211,153,0.08)" stroke="rgba(52,211,153,0.25)" strokeWidth="1" />
        <text x="524" y="110" fill="#34d399" fontSize="12" fontFamily="JetBrains Mono, monospace">
          skills-dist/
        </text>
        <text x="594" y="155" textAnchor="middle" fill="#6b6b76" fontSize="10" fontFamily="Inter, sans-serif">
          Spec-compliant output
        </text>

        <rect x="492" y="200" width="204" height="140" rx="12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="rgba(24,24,29,0.6)" />
        <text x="594" y="232" textAnchor="middle" fill="#9b9ba4" fontSize="11" fontFamily="JetBrains Mono, monospace" letterSpacing="0.08em">
          AGENTS
        </text>
        <g className="layer-agents">
          {["Cursor", "Claude", "Codex", "Mobile"].map((agent, i) => (
            <g key={agent}>
              <rect x={512 + (i % 2) * 84} y={244 + Math.floor(i / 2) * 36} width="76" height="24" rx="5" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <text x={550 + (i % 2) * 84} y={260 + Math.floor(i / 2) * 36} textAnchor="middle" fill="#9b9ba4" fontSize="9" fontFamily="Inter, sans-serif">
                {agent}
              </text>
            </g>
          ))}
        </g>

        {/* Vertical connector dist → agents */}
        <path d="M594 180 L594 200" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 3" />
      </svg>
    </div>
  );
}
