import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { jiggleSwitchConfigs, JiggleSwitchType } from './configs';

const initialCirclePath = `m 46,24
  c 0,-6.1 -2.5,-11.6 -6.4,-15.6
  C 35.6,4.5 30.1,2 24,2 17.9,2 12.4,4.5 8.4,8.4 4.5,12.4 2,17.9 2,24
  c 0,6.1 2.5,11.6 6.4,15.6 4,4 9.5,6.4 15.6,6.4 6.1,0 11.6,-2.5 15.6,-6.4 4,-4 6.4,-9.5 6.4,-15.6
  z`;

gsap.registerPlugin(MorphSVGPlugin);

export const JiggleSwitch = ({
  type = 'droop',
  value,
  onValue,
  toggledColor = '#34c759',
  handleColors = { main: '#F9FAFB', shadow: '#acacae' },
  // handleColors = { main: '#F9FAFB', shadow: '#000000' },
  ...props
}: {
  type: JiggleSwitchType;
  value?: boolean;
  onValue?: (e: boolean) => void;
  toggledColor?: string;
  handleColors?: { main: string; shadow: string };
  // how hardcore it shakes them for? [the elastic offset of the handle]
  aggro?: number;
  // the more hot, the more jiggly! [self-explanatory]
  temperature?: number;
  // the more eros, the more force [multiplier to rotation degree]
  eros?: number;
  // the more mass, the more drag! [some jelly scaling simulation multiplier]
  mass?: number;
}) => {
  const selfRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef(null);
  const stopColorRef = useRef(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef(null);
  const gRef = useRef(null);
  const animation = useRef<gsap.core.Timeline | null>(null);
  const prevState = useRef<any>({});

  const initialBgColor = useRef<string>('');

  const getDistanceX = () => {
    const wrapperEl = selfRef.current!.firstChild! as HTMLDivElement;
    return wrapperEl.clientWidth - wrapperEl.clientHeight;
  };

  useEffect(() => {
    if (!selfRef.current) return;

    const initStyles = getComputedStyle(selfRef.current);
    initialBgColor.current = initStyles.backgroundColor ?? initStyles.background;
    // TODO: Initial state causes visual flash/jump
    gsap.set(svgRef.current, { x: value ? getDistanceX() : 0 });
    console.log(value ? toggledColor : initialBgColor.current);
    // I'm using setTimeout cause getComputedStyle has delay.
    setTimeout(() => {
      gsap.set(selfRef.current, { backgroundColor: value ? toggledColor : initialBgColor.current });
    }, 1);
  }, []);

  const createAnimation = (state: boolean, interrupted?: boolean) => {
    // gsap.set(gRef.current, prevState.current);

    // TODO: idk why I did this, would benefits a refactor!
    let overrides = {};
    if (props.eros) overrides = { ...overrides, eros: props.eros };
    if (props.aggro) overrides = { ...overrides, aggro: props.aggro };
    if (props.temperature) overrides = { ...overrides, temperature: props.temperature };
    if (props.mass) overrides = { ...overrides, mass: props.mass };

    const timeline = gsap.timeline({ paused: true });

    const isTurningOn = state;

    const targetX = isTurningOn ? getDistanceX() : 0;
    const {
      dangle,
      turn,
      speed,
      switch: switchSpeed,
      end,
      eros,
      temperature,
      aggro,
      mass,
      svgL,
      svgR,
    } = { ...jiggleSwitchConfigs[type], ...overrides };
    const bgColor = isTurningOn ? toggledColor : initialBgColor.current;
    const [initialPath, reversePath] = isTurningOn ? [svgL, svgR] : [svgR, svgL];

    const multiplier = isTurningOn ? 1 : -1;

    // TODO: the animations are all over the place, the timelines need a cleanup and refactor.

    timeline
      .set(gRef.current, { y: 0, svgOrigin: '24 24' }, 0)
      .to(selfRef.current, { backgroundColor: bgColor, duration: 0.5, ease: 'power3.inOut' }, 0);

    const simulation = gsap.timeline();
    simulation.timeScale(speed);
    timeline.add(simulation, 0);

    simulation
      .to(
        svgRef.current,
        {
          x: targetX + 12 * multiplier * aggro,
          duration: switchSpeed,
          ease: 'power2.inOut',
        },
        0,
      )
      .to(
        svgRef.current,
        {
          y: 7 * temperature,
          duration: 0.3,
          ease: 'power2.inOut',
        },
        '<0.2',
      )

      .to(
        svgRef.current,
        {
          y: -4 * temperature,
          duration: 0.3,
          ease: 'power2.inOut',
        },
        '>-0.2',
      )
      .to(
        svgRef.current,
        {
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        },
        '>',
      )
      // .to(
      //   svgRef.current,
      //   {
      //     y: 5,
      //     duration: 0.5,
      //     ease: 'power2.inOut',
      //   },
      //   '>-0.5',
      // )
      .to(
        svgRef.current,
        {
          x: targetX,
          // y: 0,
          duration: 0.5,
          ease: 'power2.inOut',
        },
        '<',
      );

    simulation
      .to(
        pathRef.current,
        { duration: 0.3, scaleX: 1 - 0.04 * mass, scaleY: 1 + 0.045 * mass, ease: 'power2.inOut' },
        0,
      )
      .to(pathRef.current, { duration: 0.15, scaleX: 1, scaleY: 1, ease: 'power1.inOut' }, '<0.2')
      .to(
        pathRef.current,
        { duration: 0.2, scaleX: 1 + 0.05 * mass, scaleY: 1 - 0.05 * mass, ease: 'power2.inOut' },
        '<0.2',
      )
      .to(pathRef.current, { duration: 0.3, scaleX: 1, scaleY: 1, ease: 'power1.inOut' }, '<0.2');

    simulation.to(
      svgRef.current,
      {
        duration: 0.21,
        scaleY: 1.04,
        scaleX: 0.96,
        repeat: 5,
        delay: 0.04,
        yoyo: true,
        ease: 'circ.inOut',
      },
      0,
    );

    timeline.to(
      gradientRef.current,
      {
        duration: switchSpeed,
        ease: 'power1.inOut',
        attr: {
          cx: isTurningOn ? 20 : 8,
          // fx: isTurningOn ? 0 : 36,
        },
      },
      0,
    );

    timeline.to(
      stopColorRef.current,
      {
        duration: 0.5,
        ease: 'power1.out',
        stopColor: handleColors.shadow,
      },
      0,
    );

    const morph = gsap.timeline();
    morph.timeScale(speed);
    timeline.add(morph, 0);

    morph.set(pathRef.current, { svgOrigin: '24 0' });
    // morph.set(gRef.current, { transformOrigin: 'center center' });

    if (!interrupted) {
      morph.to(pathRef.current, {
        duration: 0.3,
        ease: 'power1.out',
        morphSVG: initialPath,
      });
    }

    morph.to(gRef.current, { duration: 0.3, rotate: dangle[0] * multiplier * eros, ease: 'power2.out' }, '<');

    morph.addLabel('morphed');

    morph.to(pathRef.current, {
      duration: turn,
      ease: 'power1.out',
      morphSVG: reversePath,
    });

    morph.to(
      gRef.current,
      {
        duration: 0.45,
        rotate: dangle[1] * multiplier * eros,
        ease: 'power2.out',
      },
      '<',
    );

    morph.to(
      gRef.current,
      {
        duration: 0.5,
        delay: 0.12,
        rotate: dangle[2] * multiplier * eros,
        ease: 'power2.out',
      },
      '=-0.1',
    );

    // morph.to(gRef.current, {
    //   duration: 0.9,
    //   rotate: 0 * multiplier,
    //   y: 0,
    //   ease: 'bounce.out',
    // });
    morph.to(gRef.current, {
      duration: 0.9,
      rotate: (dangle[1] / 2) * multiplier * eros,
      ease: 'power1.out',
    });

    morph.to(pathRef.current, { duration: end ?? 0.8, ease: 'power1.out', morphSVG: initialCirclePath }, '<-0.5');

    morph.to(
      stopColorRef.current,
      {
        duration: 0.3,
        ease: 'power1.out',
        stopColor: handleColors.main,
      },
      '<',
    );

    return timeline;
  };

  const handleClick = () => {
    if (!onValue) return;

    const newState = !value;
    onValue(newState);

    const isInterrupted =
      (animation.current && animation.current.isActive() && animation.current.progress() < 0.3) ?? false;

    if (animation.current) {
      prevState.current = {
        rotate: gsap.getProperty(gRef.current, 'rotate'),
        x: gsap.getProperty(gRef.current, 'x'),
        y: gsap.getProperty(gRef.current, 'y'),
      };
      animation.current.kill();
    }

    animation.current = createAnimation(newState, isInterrupted);
    animation.current.play();
  };

  return (
    <div
      className={'jiggle-switch'}
      ref={selfRef}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') handleClick();
      }}
      tabIndex={0}
      style={{
        position: 'relative',
        width: '120px',
        height: '56px',
        padding: '4px',
        borderRadius: '28px',
        cursor: 'pointer',
        backgroundColor: '#374151',
        boxShadow: 'inset 0 3px 8px rgba(0, 0, 0, 0.5)',
        outline: 0,
      }}
    >
      <div
        className={'jiggle-switch-track'}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <div
          className={'jiggle-switch-handle'}
          ref={handleRef}
          style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
            aspectRatio: 'square',
            height: '100%',
          }}
        >
          <svg
            ref={svgRef}
            style={{
              width: '100%',
              height: '100%',
              overflow: 'visible',
              filter: 'drop-shadow(0 5px 10px rgba(0, 0, 0, 0.6))',
            }}
            viewBox="0 0 48 48"
          >
            <defs>
              <radialGradient
                ref={gradientRef}
                gradientUnits="userSpaceOnUse"
                cx={8}
                cy={30}
                // fx={24}
                // fy={48}
                r={35}
                id="gradient-0"
                gradientTransform="matrix(1.9956547,0.78867229,-0.84933151,2.1491466,35.584364,-45.877413)"
              >
                <stop offset="0" style={{ stopColor: handleColors.main }}></stop>
                <stop ref={stopColorRef} offset="1" style={{ stopColor: handleColors.main }}></stop>
              </radialGradient>
            </defs>
            <g ref={gRef}>
              <path ref={pathRef} d={initialCirclePath} fill="url(#gradient-0)" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
