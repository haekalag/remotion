import React from 'react';
import {
	AbsoluteFill,
	Easing,
	Img,
	interpolate,
	random,
	Sequence,
	staticFile,
	useCurrentFrame,
} from 'remotion';

// 1080x1920, 30fps, 900 frames. Source cover is 1086x1448.
const COVER = staticFile('zeff-raiden/cover.png');
const IMG_W = 1086;
const IMG_H = 1448;
const PAPER = '#e8e4da';
const INK = '#141414';
const RED = '#b3121b';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Shared SVG filters: "boil" re-seeds every 3 frames so edges jitter like hand-drawn animation.
const Filters: React.FC = () => {
	const frame = useCurrentFrame();
	const seed = Math.floor(frame / 3);
	return (
		<svg width={0} height={0} style={{position: 'absolute'}}>
			<defs>
				<filter id="boil">
					<feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={seed} />
					<feDisplacementMap in="SourceGraphic" scale={6} />
				</filter>
				<filter id="boil-strong">
					<feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves={3} seed={seed} />
					<feDisplacementMap in="SourceGraphic" scale={40} />
				</filter>
				<filter id="grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={seed % 4} />
					<feColorMatrix type="saturate" values="0" />
				</filter>
			</defs>
		</svg>
	);
};

// Places the cover so that image point (cx, cy) sits at screen point (sx, sy) with the given scale.
const Cover: React.FC<{
	cx: number;
	cy: number;
	scale: number;
	sx: number;
	sy: number;
	rotate: number;
	style: React.CSSProperties | null;
}> = ({cx, cy, scale, sx, sy, rotate, style}) => (
	<Img
		src={COVER}
		style={{
			position: 'absolute',
			width: IMG_W,
			height: IMG_H,
			left: 0,
			top: 0,
			transformOrigin: '0 0',
			transform: `translate(${sx}px, ${sy}px) rotate(${rotate}deg) scale(${scale}) translate(${-cx}px, ${-cy}px)`,
			filter: 'grayscale(1) contrast(1.15)',
			...(style ?? {}),
		}}
	/>
);

const Grain: React.FC<{opacity: number}> = ({opacity}) => (
	<AbsoluteFill style={{pointerEvents: 'none'}}>
		<svg width="100%" height="100%" style={{opacity, mixBlendMode: 'multiply'}}>
			<rect width="100%" height="100%" filter="url(#grain)" />
		</svg>
		<AbsoluteFill
			style={{
				background:
					'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)',
			}}
		/>
	</AbsoluteFill>
);

// Brush-wipe caption. Words reveal left to right with a skewed manga feel.
const Caption: React.FC<{
	text: string;
	from: number;
	to: number;
	y: number;
	size: number;
	color: string;
	shake: number;
	serif: boolean;
}> = ({text, from, to, y, size, color, shake, serif}) => {
	const frame = useCurrentFrame();
	if (frame < from || frame > to) return null;
	const wipe = interpolate(frame, [from, from + 10], [0, 100], clamp);
	const out = interpolate(frame, [to - 6, to], [1, 0], clamp);
	const pop = interpolate(frame, [from, from + 6], [1.25, 1], {
		...clamp,
		easing: Easing.out(Easing.cubic),
	});
	const dx = shake * (random(`x${frame}`) - 0.5);
	const dy = shake * (random(`y${frame}`) - 0.5);
	return (
		<div
			style={{
				position: 'absolute',
				left: 60,
				right: 60,
				top: y,
				textAlign: 'center',
				opacity: out,
				transform: `translate(${dx}px, ${dy}px) scale(${pop}) skewX(${serif ? 0 : -6}deg)`,
				clipPath: `inset(0 ${100 - wipe}% 0 0)`,
				fontFamily: serif ? 'Caladea, DejaVu Serif, serif' : 'Inter Display, Inter, sans-serif',
				fontStyle: serif ? 'italic' : 'normal',
				fontWeight: serif ? 400 : 900,
				fontSize: size,
				lineHeight: 1.1,
				letterSpacing: serif ? 2 : 1,
				color,
				textShadow:
					color === INK
						? '0 0 18px rgba(232,228,218,0.95), 0 0 4px rgba(232,228,218,1)'
						: '0 0 20px rgba(0,0,0,0.9), 0 0 4px rgba(0,0,0,1)',
				filter: 'url(#boil)',
			}}
		>
			{text}
		</div>
	);
};

// A wispy ancestral spirit drawn in pencil strokes.
const Spirit: React.FC<{x: number; y: number; s: number; t: number; dark: boolean}> = ({
	x,
	y,
	s,
	t,
	dark,
}) => {
	const sway = Math.sin(t / 12 + x) * 10;
	return (
		<g transform={`translate(${x + sway} ${y}) scale(${s})`} filter="url(#boil)">
			<path
				d={`M0,-120 C40,-120 55,-80 50,-40 C80,0 70,80 ${40 + sway},180 C20,140 0,200 -10,160 C-30,210 -50,150 ${-60 - sway},190 C-70,90 -80,0 -50,-40 C-55,-80 -40,-120 0,-120 Z`}
				fill={dark ? INK : 'rgba(255,255,255,0.35)'}
				stroke={INK}
				strokeWidth={3}
				strokeDasharray={dark ? undefined : '14 6'}
			/>
			<circle cx={-16} cy={-70} r={7} fill={dark ? RED : INK} />
			<circle cx={18} cy={-70} r={7} fill={dark ? RED : INK} />
		</g>
	);
};

const Villager: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#boil)" fill={INK}>
		<circle cx={0} cy={-150} r={26} />
		<path d="M-40,-120 L40,-120 L55,40 L25,40 L15,140 L-15,140 L-25,40 L-55,40 Z" />
	</g>
);

const House: React.FC<{x: number; w: number; h: number; burn: number; seed: number}> = ({
	x,
	w,
	h,
	burn,
	seed,
}) => {
	const frame = useCurrentFrame();
	const flames = new Array(5).fill(0).map((_, i) => {
		const fx = x + (w / 5) * i + w / 10;
		const fh = burn * (80 + 120 * random(`f${seed}${i}${Math.floor(frame / 2)}`));
		return `M${fx - 25},${1500 - h} Q${fx - 10},${1500 - h - fh * 0.6} ${fx},${1500 - h - fh} Q${fx + 10},${1500 - h - fh * 0.6} ${fx + 25},${1500 - h} Z`;
	});
	return (
		<g filter="url(#boil)">
			<path
				d={`M${x},1500 L${x},${1500 - h} L${x + w / 2},${1500 - h - 90} L${x + w},${1500 - h} L${x + w},1500 Z`}
				fill={burn > 0.5 ? INK : PAPER}
				stroke={INK}
				strokeWidth={5}
			/>
			{flames.map((d, i) => (
				<path key={i} d={d} fill={i % 2 ? '#fff' : RED} stroke={INK} strokeWidth={3} />
			))}
		</g>
	);
};

const SpeedLines: React.FC<{opacity: number; cx: number; cy: number}> = ({opacity, cx, cy}) => {
	const frame = useCurrentFrame();
	return (
		<svg width={1080} height={1920} style={{position: 'absolute', opacity}}>
			{new Array(90).fill(0).map((_, i) => {
				const a = (i / 90) * Math.PI * 2 + random(`a${i}${Math.floor(frame / 2)}`) * 0.05;
				const r1 = 380 + random(`r${i}${Math.floor(frame / 2)}`) * 260;
				return (
					<line
						key={i}
						x1={cx + Math.cos(a) * r1}
						y1={cy + Math.sin(a) * r1}
						x2={cx + Math.cos(a) * 2000}
						y2={cy + Math.sin(a) * 2000}
						stroke={INK}
						strokeWidth={1 + random(`w${i}`) * 5}
					/>
				);
			})}
		</svg>
	);
};

const Flash: React.FC<{at: number[]; color: string}> = ({at, color}) => {
	const frame = useCurrentFrame();
	const o = Math.max(...at.map((a) => interpolate(frame, [a, a + 1, a + 6], [0, 1, 0], clamp)));
	return <AbsoluteFill style={{backgroundColor: color, opacity: o}} />;
};

// Black ink growing from points, displaced to look like spreading ink.
const InkSpread: React.FC<{progress: number; seeds: [number, number][]; color: string}> = ({
	progress,
	seeds,
	color,
}) => (
	<svg width={1080} height={1920} style={{position: 'absolute'}}>
		<g filter="url(#boil-strong)">
			{seeds.map(([x, y], i) => (
				<circle key={i} cx={x} cy={y} r={progress * (900 + i * 120)} fill={color} />
			))}
		</g>
	</svg>
);

// ---------- SCENE 1: THE CURSE (0-150) ----------
const SceneCurse: React.FC = () => {
	const frame = useCurrentFrame();
	const scale = interpolate(frame, [0, 150], [1.35, 2.3], {easing: Easing.inOut(Easing.quad)});
	const spiritsIn = interpolate(frame, [15, 60], [0, 1], clamp);
	const silence = interpolate(frame, [96, 102, 108, 112], [0, 0.85, 0.85, 0.3], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: PAPER}}>
			<Cover cx={570} cy={480} scale={scale} sx={540} sy={860} rotate={0} style={null} />
			<svg width={1080} height={1920} style={{position: 'absolute', opacity: spiritsIn * 0.95}}>
				{[
					[110, 1350, 0.9],
					[300, 1500, 0.75],
					[790, 1500, 0.75],
					[980, 1350, 0.9],
				].map(([x, y, s], i) => (
					<g key={i}>
						<Spirit x={x} y={y - 330 * s - 40 * (1 - spiritsIn)} s={s * 1.2} t={frame + i * 7} dark={false} />
						<Villager x={x} y={y + 160} s={s} />
					</g>
				))}
				{/* empty space beside Zeff, marked by a dashed outline that never fills */}
				<g opacity={interpolate(frame, [60, 80], [0, 0.6], clamp)} filter="url(#boil)">
					<circle cx={540} cy={1560} r={70} fill="none" stroke={RED} strokeWidth={4} strokeDasharray="10 12" />
				</g>
			</svg>
			<AbsoluteFill style={{backgroundColor: '#000', opacity: silence}} />
			<Caption text="Di dunia di mana setiap manusia dilindungi ruh leluhurnya..." from={8} to={96} y={1580} size={56} color={INK} shake={0} serif />
			<Caption text="ZEFF LAHIR TANPA PENJAGA." from={110} to={150} y={820} size={104} color="#fff" shake={6} serif={false} />
			<div
				style={{
					position: 'absolute',
					left: 140,
					top: 1060,
					height: 10,
					width: interpolate(frame, [114, 124], [0, 800], clamp),
					backgroundColor: RED,
					filter: 'url(#boil)',
				}}
			/>
		</AbsoluteFill>
	);
};

// ---------- SCENE 2: THE MASSACRE (150-330 → local 0-180) ----------
const SceneMassacre: React.FC = () => {
	const frame = useCurrentFrame();
	const shake = frame % 30 < 8 ? 18 : 5;
	const sx = shake * (random(`sx${frame}`) - 0.5);
	const sy = shake * (random(`sy${frame}`) - 0.5);
	const burn = interpolate(frame, [10, 60], [0, 1], clamp);
	const descend = interpolate(frame, [0, 70], [-500, 0], {...clamp, easing: Easing.out(Easing.cubic)});
	const panelIn = (start: number) =>
		interpolate(frame, [start, start + 8], [1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
	const shadow = interpolate(frame, [90, 170], [0, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: INK, transform: `translate(${sx}px, ${sy}px)`}}>
			{/* Panel A: village + descending dark spirits */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					clipPath: 'polygon(0 0, 100% 0, 100% 32%, 0 44%)',
					transform: `translateX(${panelIn(0) * -1100}px)`,
					backgroundColor: PAPER,
				}}
			>
				<svg width={1080} height={1920} style={{position: 'absolute', top: -620}}>
					{[0, 1, 2, 3, 4].map((i) => (
						<House key={i} x={20 + i * 210} w={180} h={160 + (i % 2) * 90} burn={burn} seed={i} />
					))}
					{[0, 1, 2, 3].map((i) => (
						<Spirit key={i} x={150 + i * 260} y={850 + descend + (i % 2) * 60} s={0.9} t={frame + i * 9} dark />
					))}
				</svg>
				<SpeedLines opacity={0.35} cx={540} cy={250} />
			</div>
			{/* Panel B: Zeff standing helpless */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					clipPath: 'polygon(0 46%, 100% 34%, 100% 70%, 0 78%)',
					transform: `translateX(${panelIn(40) * 1100}px)`,
					backgroundColor: PAPER,
				}}
			>
				<Cover cx={560} cy={700} scale={1.25 + frame * 0.002} sx={540} sy={1020} rotate={-3} style={{filter: 'grayscale(1) contrast(1.4) brightness(0.85)'}} />
				<AbsoluteFill style={{background: `linear-gradient(0deg, rgba(20,20,20,${0.4 + shadow * 0.5}) 0%, transparent 60%)`}} />
			</div>
			{/* Panel C: shadows consume the streets */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					clipPath: 'polygon(0 80%, 100% 72%, 100% 100%, 0 100%)',
					transform: `translateX(${panelIn(70) * -1100}px)`,
					backgroundColor: PAPER,
				}}
			>
				<svg width={1080} height={1920} style={{position: 'absolute'}}>
					<g filter="url(#boil)" stroke={INK} strokeWidth={4}>
						{new Array(12).fill(0).map((_, i) => (
							<line key={i} x1={i * 100} y1={1920} x2={540} y2={1450} />
						))}
					</g>
				</svg>
				<InkSpread progress={shadow * 0.55} seeds={[[100, 1920], [980, 1900], [540, 1920]]} color={INK} />
			</div>
			<svg width={1080} height={1920} style={{position: 'absolute'}}>
				<g filter="url(#boil)" stroke={PAPER} strokeWidth={14} fill="none">
					<path d="M0,845 L1080,614" />
					<path d="M0,1498 L1080,1382" />
				</g>
			</svg>
			<Flash at={[0, 40, 70, 95]} color="#fff" />
			<Caption text="MEREKA YANG MELINDUNGI..." from={10} to={92} y={120} size={84} color={INK} shake={4} serif={false} />
			<Caption text="JUSTRU MEMBANTAI SEMUANYA." from={96} to={180} y={760} size={100} color={RED} shake={10} serif={false} />
		</AbsoluteFill>
	);
};

// ---------- SCENE 3: THE OATH (330-510 → local 0-180) ----------
const SceneOath: React.FC = () => {
	const frame = useCurrentFrame();
	// extreme close-up on the human eye, slow low-angle push
	const scale = interpolate(frame, [0, 180], [5.5, 7.2]);
	const rot = interpolate(frame, [0, 180], [6, -4]);
	const sy = interpolate(frame, [0, 180], [1050, 880]);
	const tear = interpolate(frame, [20, 120], [0, 1], clamp);
	const ink = interpolate(frame, [70, 175], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
	const beat = [40, 70, 95, 115, 130, 142, 152, 160];
	const pulse = Math.max(...beat.map((b) => interpolate(frame, [b, b + 2, b + 6], [0, 1, 0], clamp)));
	return (
		<AbsoluteFill style={{backgroundColor: PAPER, transform: `scale(${1 + pulse * 0.04})`}}>
			<Cover cx={625} cy={482} scale={scale} sx={540} sy={sy} rotate={rot} style={{filter: 'grayscale(1) contrast(1.5)'}} />
			<svg width={1080} height={1920} style={{position: 'absolute'}}>
				<g filter="url(#boil)">
					{/* red glint in the pupil */}
					<circle cx={540} cy={sy} r={interpolate(frame, [10, 40], [0, 26], clamp)} fill={RED} opacity={0.75} style={{mixBlendMode: 'multiply'}} />
					{/* tear streak */}
					<path
						d={`M600,${sy + 160} Q590,${sy + 160 + 300 * tear} 610,${sy + 160 + 620 * tear}`}
						stroke={INK}
						strokeWidth={10}
						fill="none"
						strokeLinecap="round"
					/>
					<ellipse cx={610} cy={sy + 170 + 620 * tear} rx={22} ry={34} fill="#fff" stroke={INK} strokeWidth={6} opacity={tear > 0.02 ? 1 : 0} />
				</g>
			</svg>
			{/* gripped weapon: a blade cutting up into frame from below */}
			<svg width={1080} height={1920} style={{position: 'absolute'}}>
				<g
					filter="url(#boil)"
					transform={`translate(0 ${interpolate(frame, [50, 70], [900, 0], {...clamp, easing: Easing.out(Easing.back(1.4))})}) rotate(-18 540 1920)`}
				>
					<path d="M500,1920 L520,1150 L540,1080 L560,1150 L580,1920 Z" fill="#f4f2ec" stroke={INK} strokeWidth={6} />
					<line x1={540} y1={1100} x2={540} y2={1920} stroke={INK} strokeWidth={2} />
					<rect x={400} y={1600} width={280} height={40} fill={INK} />
				</g>
			</svg>
			<SpeedLines opacity={pulse * 0.8} cx={540} cy={900} />
			<InkSpread progress={ink * 0.9} seeds={[[0, 1920], [1080, 1920], [0, 0], [1080, 0]]} color={INK} />
			<Caption text="AKU AKAN MEMBUNUH SEMUA RUH." from={95} to={180} y={1450} size={108} color="#fff" shake={12} serif={false} />
		</AbsoluteFill>
	);
};

// ---------- SCENE 4: MOTHER'S VOICE (510-720 → local 0-210) ----------
const SceneMother: React.FC = () => {
	const frame = useCurrentFrame();
	const slash = interpolate(frame, [8, 14], [0, 1], clamp);
	const shatter = interpolate(frame, [16, 80], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const darkness = interpolate(frame, [75, 95], [0, 1], clamp);
	const widen = interpolate(frame, [150, 156], [1, 1.35], {...clamp, easing: Easing.out(Easing.back(3))});
	const eyeIn = interpolate(frame, [138, 146], [0, 1], clamp);
	return (
		<AbsoluteFill style={{backgroundColor: PAPER}}>
			<AbsoluteFill style={{opacity: 1 - darkness}}>
				<svg width={1080} height={1920} style={{position: 'absolute'}}>
					{frame < 16 ? (
						<Spirit x={540} y={900} s={2.6} t={frame} dark />
					) : (
						new Array(260).fill(0).map((_, i) => {
							const a = random(`pa${i}`) * Math.PI * 2;
							const d = random(`pd${i}`) * 900 * shatter + 40;
							const ox = (random(`ox${i}`) - 0.5) * 260;
							const oy = (random(`oy${i}`) - 0.5) * 600;
							const sz = 4 + random(`ps${i}`) * 16;
							return (
								<rect
									key={i}
									x={540 + ox + Math.cos(a) * d}
									y={900 + oy + Math.sin(a) * d - shatter * 200}
									width={sz}
									height={sz * 0.6}
									transform={`rotate(${random(`pr${i}`) * 360 + frame * 4} ${540 + ox + Math.cos(a) * d} ${900 + oy + Math.sin(a) * d - shatter * 200})`}
									fill={i % 9 === 0 ? RED : i % 2 ? INK : '#fff'}
									stroke={INK}
									strokeWidth={1}
									opacity={1 - shatter * 0.7}
								/>
							);
						})
					)}
					{/* sword slash */}
					<path
						d="M-100,1500 L1180,300"
						stroke="#fff"
						strokeWidth={30 * (1 - Math.abs(slash - 0.5) * 2) + 2}
						strokeDasharray={1800}
						strokeDashoffset={1800 * (1 - slash)}
						style={{filter: 'drop-shadow(0 0 20px #fff)'}}
					/>
					<path d="M-100,1500 L1180,300" stroke={INK} strokeWidth={3} strokeDasharray={1800} strokeDashoffset={1800 * (1 - slash)} />
				</svg>
				<Flash at={[12]} color="#fff" />
			</AbsoluteFill>
			<AbsoluteFill style={{backgroundColor: '#050505', opacity: darkness}} />
			<Caption text="Zeff... anakku..." from={98} to={146} y={900} size={78} color="#d8d4ca" shake={0} serif />
			{/* frozen, eyes widen in horror */}
			<AbsoluteFill style={{opacity: eyeIn}}>
				<div style={{position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: '#050505'}}>
					<div style={{position: 'absolute', left: 0, right: 0, top: 560, height: 520, overflow: 'hidden', transform: `scaleY(${widen})`}}>
						<Cover cx={568} cy={492} scale={4.2} sx={540} sy={260} rotate={0} style={{filter: 'grayscale(1) contrast(1.6) brightness(0.9)'}} />
					</div>
				</div>
			</AbsoluteFill>
			<Caption text="KENAPA... SUARAMU SEPERTI IBU?" from={158} to={210} y={1240} size={90} color="#fff" shake={3} serif={false} />
		</AbsoluteFill>
	);
};

// ---------- SCENE 5: THE TRUTH (720-810 → local 0-90) ----------
const SceneTruth: React.FC = () => {
	const frame = useCurrentFrame();
	const flashIdx = Math.floor(frame / 5);
	const strobe = frame < 40;
	const rise = interpolate(frame, [30, 85], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
	return (
		<AbsoluteFill style={{backgroundColor: strobe && flashIdx % 2 ? PAPER : '#0a0a0a'}}>
			{strobe ? (
				<svg width={1080} height={1920} style={{position: 'absolute'}}>
					<Spirit x={300 + (flashIdx % 3) * 240} y={900} s={3} t={frame} dark={flashIdx % 2 === 0} />
					{/* a human trapped inside the spirit */}
					<g filter="url(#boil)" fill={flashIdx % 2 ? INK : '#e8e4da'}>
						<circle cx={300 + (flashIdx % 3) * 240} cy={720} r={44} />
						<path d={`M${300 + (flashIdx % 3) * 240 - 60},780 l120,0 l30,280 l-180,0 Z`} />
					</g>
				</svg>
			) : null}
			{/* enormous shadow beyond the sky */}
			<svg width={1080} height={1920} style={{position: 'absolute', opacity: rise}}>
				<g filter="url(#boil-strong)" transform={`translate(0 ${(1 - rise) * 500})`}>
					<path d="M-200,1100 C0,200 300,-100 540,-80 C780,-100 1080,200 1280,1100 Z" fill="#000" />
					<path d="M200,300 L120,-200 L330,180 Z M880,300 L960,-200 L750,180 Z" fill="#000" />
					<ellipse cx={380} cy={560} rx={70} ry={18} fill={RED} />
					<ellipse cx={700} cy={560} rx={70} ry={18} fill={RED} />
				</g>
			</svg>
			<Caption text="RUH BUKANLAH MUSUH SEBENARNYA." from={36} to={84} y={1400} size={92} color="#fff" shake={5} serif={false} />
			<AbsoluteFill style={{backgroundColor: '#000', opacity: frame >= 84 ? 1 : 0}} />
		</AbsoluteFill>
	);
};

// ---------- FINAL TITLE REVEAL (810-900 → local 0-90) ----------
const SceneTitle: React.FC = () => {
	const frame = useCurrentFrame();
	const blast = interpolate(frame, [4, 26], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
	const settle = interpolate(frame, [4, 60], [1.12, 1], {...clamp, easing: Easing.out(Easing.quad)});
	const s = (1080 / IMG_W) * settle;
	return (
		<AbsoluteFill style={{backgroundColor: PAPER}}>
			<Cover cx={IMG_W / 2} cy={IMG_H / 2} scale={s} sx={540} sy={170 + (IMG_H * 1080) / IMG_W / 2} rotate={0} style={null} />
			{/* ink explosion: black field with a hole that blasts open */}
			<svg width={1080} height={1920} style={{position: 'absolute'}}>
				<defs>
					<mask id="hole">
						<rect width={1080} height={1920} fill="#fff" />
						<g filter="url(#boil-strong)">
							<circle cx={540} cy={700} r={blast * 1500} fill="#000" />
						</g>
					</mask>
				</defs>
				<rect width={1080} height={1920} fill={INK} mask="url(#hole)" />
				{new Array(40).fill(0).map((_, i) => {
					const a = random(`sp${i}`) * Math.PI * 2;
					const d = 200 + blast * (600 + random(`sd${i}`) * 900);
					return (
						<circle
							key={i}
							cx={540 + Math.cos(a) * d}
							cy={700 + Math.sin(a) * d}
							r={(6 + random(`sr${i}`) * 26) * (1 - blast * 0.6)}
							fill={i % 7 === 0 ? RED : INK}
							filter="url(#boil)"
							opacity={interpolate(frame, [20, 50], [1, 0], clamp)}
						/>
					);
				})}
			</svg>
			<Caption text="Bagaimana jika musuhmu adalah satu-satunya yang melindungimu?" from={34} to={95} y={1655} size={50} color={INK} shake={0} serif />
		</AbsoluteFill>
	);
};

export const ZeffRaidenTrailer: React.FC = () => {
	const frame = useCurrentFrame();
	// paper-rip style hard cuts: a jagged white tear sweeps across at each scene boundary
	const cuts = [150, 330, 510, 720];
	const tear = cuts
		.map((c) => interpolate(frame, [c - 4, c + 4], [-0.2, 1.2], clamp))
		.find((v) => v > -0.2 && v < 1.2);
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<Filters />
			<Sequence durationInFrames={150}>
				<SceneCurse />
			</Sequence>
			<Sequence from={150} durationInFrames={180}>
				<SceneMassacre />
			</Sequence>
			<Sequence from={330} durationInFrames={180}>
				<SceneOath />
			</Sequence>
			<Sequence from={510} durationInFrames={210}>
				<SceneMother />
			</Sequence>
			<Sequence from={720} durationInFrames={90}>
				<SceneTruth />
			</Sequence>
			<Sequence from={810} durationInFrames={90}>
				<SceneTitle />
			</Sequence>
			{tear !== undefined ? (
				<svg width={1080} height={1920} style={{position: 'absolute'}}>
					<path
						filter="url(#boil-strong)"
						d={`M${tear * 1400 - 400},0 L${tear * 1400 - 200},0 L${tear * 1400 - 500},1920 L${tear * 1400 - 700},1920 Z`}
						fill={PAPER}
						stroke={INK}
						strokeWidth={6}
					/>
				</svg>
			) : null}
			<Grain opacity={0.18} />
		</AbsoluteFill>
	);
};
