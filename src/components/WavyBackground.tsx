import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const WavyBackground = () => {
  const wave1Ref = useRef<SVGPathElement>(null);
  const wave2Ref = useRef<SVGPathElement>(null);
  const wave3Ref = useRef<SVGPathElement>(null);
  const wave4Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    const waves = [wave1Ref, wave2Ref, wave3Ref, wave4Ref];
    
    waves.forEach((waveRef, index) => {
      if (waveRef.current) {
        gsap.to(waveRef.current, {
          attr: { d: generateWavePath(index, 10) },
          duration: 3 + index,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });
  }, []);

  const generateWavePath = (offset: number, amplitude: number) => {
    const width = 800;
    const height = 600;
    const frequency = 0.02;
    
    let path = `M -100,${100 + offset * 80} `;
    
    for (let x = -100; x <= width + 100; x += 20) {
      const y = 100 + offset * 80 + Math.sin(x * frequency + offset) * amplitude;
      path += `Q ${x + 10},${y} ${x + 20},${y} `;
    }
    
    return path;
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={wave1Ref}
          d={generateWavePath(0, 8)}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-wave"
        />
        <path
          ref={wave2Ref}
          d={generateWavePath(1, 8)}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-wave"
        />
        <path
          ref={wave3Ref}
          d={generateWavePath(2, 8)}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-wave"
        />
        <path
          ref={wave4Ref}
          d={generateWavePath(3, 8)}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-wave"
        />
      </svg>
      
      {/* Bottom right wavy decoration */}
      <svg
        className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 400,600 Q 350,500 400,400 Q 450,300 400,200 Q 350,100 400,0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-wave"
        />
        <path
          d="M 500,600 Q 450,500 500,400 Q 550,300 500,200 Q 450,100 500,0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-wave"
        />
        <path
          d="M 600,600 Q 550,500 600,400 Q 650,300 600,200 Q 550,100 600,0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-wave"
        />
      </svg>
    </div>
  );
};
