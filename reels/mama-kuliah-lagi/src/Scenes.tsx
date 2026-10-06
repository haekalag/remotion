import {loadFont} from '@remotion/fonts';
import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Person} from './Person';

export const fontFamily = 'Poppins';

// Bundled locally (from @fontsource/poppins) so rendering works offline.
for (const [weight, style] of [
	['400', 'normal'],
	['600', 'normal'],
	['700', 'normal'],
	['800', 'normal'],
	['400', 'italic'],
	['700', 'italic'],
] as const) {
	loadFont({
		family: fontFamily,
		url: staticFile(`fonts/poppins-latin-${weight}-${style}.woff2`),
		weight,
		style,
	});
}

const MAMA = {hair: '#3b2a2a', shirt: '#7a5cc4', bun: true, glasses: true};
const CHILD = {hair: '#1f1a1a', shirt: '#3fa58f', bun: false, glasses: false};
const NIGHT = 'linear-gradient(180deg, #141226 0%, #2a2140 60%, #3a2a3a 100%)';
const MORNING = 'linear-gradient(180deg, #fff6ea 0%, #ffe3c7 70%, #ffd2b0 100%)';
const ACCENT = 'linear-gradient(90deg, #4f7cff, #a66cff, #ff7eb3)';

const Fade: React.FC<{children: React.ReactNode; background: string}> = ({
	children,
	background,
}) => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const opacity = interpolate(
		frame,
		[0, 10, durationInFrames - 10, durationInFrames],
		[0, 1, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
	);
	return <AbsoluteFill style={{opacity, background}}>{children}</AbsoluteFill>;
};

const Headline: React.FC<{
	text: string;
	from: number;
	to: number;
	dark: boolean;
	italic: boolean;
}> = ({text, from, to, dark, italic}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const enter = spring({frame: frame - from, fps, config: {damping: 200}});
	const exit = interpolate(frame, [to - 8, to], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return (
		<div
			style={{
				position: 'absolute',
				top: 210,
				left: 70,
				right: 70,
				textAlign: 'center',
				fontFamily,
				fontSize: 66,
				lineHeight: 1.2,
				fontWeight: 700,
				textWrap: 'balance',
				fontStyle: italic ? 'italic' : 'normal',
				color: dark ? '#fff4e0' : '#2b2140',
				textShadow: dark ? '0 4px 30px rgba(255, 190, 110, 0.35)' : 'none',
				opacity: enter * exit,
				transform: `translateY(${(1 - enter) * 40}px)`,
			}}
		>
			{text}
		</div>
	);
};

const Table: React.FC<{top: number; color: string}> = ({top, color}) => (
	<div
		style={{
			position: 'absolute',
			top,
			left: 0,
			right: 0,
			bottom: 0,
			background: color,
			borderTop: '14px solid rgba(255,255,255,0.12)',
		}}
	/>
);

const Glow: React.FC<{x: number; y: number; size: number; color: string; opacity: number}> = ({
	x,
	y,
	size,
	color,
	opacity,
}) => (
	<div
		style={{
			position: 'absolute',
			left: x - size / 2,
			top: y - size / 2,
			width: size,
			height: size,
			borderRadius: '50%',
			background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
			opacity,
		}}
	/>
);

// 0 to 3s: Mama from behind, late at night, papers everywhere.
export const SceneNight: React.FC = () => {
	const frame = useCurrentFrame();
	const breathe = 1 + Math.sin(frame / 10) * 0.008;
	return (
		<Fade background={NIGHT}>
			<AbsoluteFill style={{transform: `scale(${interpolate(frame, [0, 90], [1, 1.06])})`}}>
				<Glow x={190} y={1050} size={1100} color="rgba(255, 196, 110, 0.55)" opacity={0.9 + Math.sin(frame / 7) * 0.05} />
				<div
					style={{
						position: 'absolute',
						top: 560,
						right: 110,
						padding: '14px 26px',
						borderRadius: 16,
						background: '#0d0b18',
						color: '#ff8f6b',
						fontFamily,
						fontWeight: 600,
						fontSize: 44,
						letterSpacing: 4,
					}}
				>
					23.47
				</div>
				<div style={{position: 'absolute', left: 260, top: 760, transform: `scaleY(${breathe})`, transformOrigin: 'bottom'}}>
					<Person facing="back" {...MAMA} smile={0} armRotate={null} headTilt={-6} width={560} />
				</div>
				<div style={{position: 'absolute', left: 120, top: 1000, width: 12, height: 260, background: '#c9a46b'}} />
				<div
					style={{
						position: 'absolute',
						left: 40,
						top: 900,
						width: 180,
						height: 120,
						background: '#ffd27a',
						clipPath: 'polygon(25% 0, 75% 0, 100% 100%, 0 100%)',
					}}
				/>
				<Table top={1250} color="#4a3226" />
				{[
					{x: 140, y: 1225, r: -12},
					{x: 330, y: 1240, r: 6},
					{x: 560, y: 1218, r: -4},
					{x: 740, y: 1235, r: 14},
					{x: 450, y: 1290, r: -18},
				].map((p, i) => (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: p.x,
							top: p.y,
							width: 230,
							height: 150,
							background: '#f4efe6',
							transform: `rotate(${p.r}deg)`,
							boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
							backgroundImage:
								'repeating-linear-gradient(180deg, transparent 0 22px, rgba(60,60,80,0.25) 22px 26px)',
						}}
					/>
				))}
				<div style={{position: 'absolute', left: 820, top: 1300, width: 160, height: 30, borderRadius: 10, background: '#ffe84a', transform: 'rotate(-25deg)'}} />
			</AbsoluteFill>
			<Headline text="Mama takut. Tapi nggak pernah bilang." from={12} to={1000} dark italic={false} />
		</Fade>
	);
};

// 3 to 10s: same page, read over and over, then the laptop closes.
export const SceneLaptop: React.FC = () => {
	const frame = useCurrentFrame();
	const reads = Math.min(3, Math.floor(frame / 55) + 1);
	const line = Math.floor(((frame % 55) / 55) * 9);
	const close = interpolate(frame, [170, 195], [1, 0.02], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return (
		<Fade background={NIGHT}>
			<Glow x={540} y={900} size={1300} color="rgba(170, 200, 255, 0.35)" opacity={close} />
			<Glow x={100} y={1100} size={900} color="rgba(255, 196, 110, 0.4)" opacity={1} />
			<div
				style={{
					position: 'absolute',
					left: 150,
					top: 640,
					width: 780,
					height: 500,
					borderRadius: 26,
					background: '#22202c',
					padding: 22,
					transform: `scaleY(${close})`,
					transformOrigin: 'bottom',
				}}
			>
				<div style={{width: '100%', height: '100%', borderRadius: 12, background: '#fbfaf7', padding: '30px 40px', boxSizing: 'border-box', fontFamily}}>
					<div style={{display: 'flex', justifyContent: 'space-between', fontSize: 30, fontWeight: 700, color: '#2b2140'}}>
						<span>Bab 2: Kajian Pustaka</span>
						<span style={{color: '#d9534f'}}>Dibaca {reads}x</span>
					</div>
					{new Array(9).fill(true).map((_, i) => (
						<div
							key={i}
							style={{
								marginTop: 20,
								height: 18,
								width: `${[96, 88, 92, 70, 95, 84, 90, 78, 60][i]}%`,
								borderRadius: 9,
								background: i === line && frame < 165 ? '#ffe066' : '#d8d6e0',
							}}
						/>
					))}
				</div>
			</div>
			<div style={{position: 'absolute', left: 90, top: 1140, width: 900, height: 40, borderRadius: '0 0 30px 30px', background: '#3a3747'}} />
			<Table top={1180} color="#4a3226" />
			<Headline text="Halaman yang sama. Lagi." from={8} to={140} dark italic={false} />
			<Headline text="“Mungkin Mama udah telat, ya...”" from={150} to={1000} dark italic />
		</Fade>
	);
};

const Sparkle: React.FC<{size: number}> = ({size}) => (
	<svg viewBox="0 0 100 100" width={size} height={size}>
		<defs>
			<linearGradient id="spark" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" stopColor="#4f7cff" />
				<stop offset="0.6" stopColor="#a66cff" />
				<stop offset="1" stopColor="#ff7eb3" />
			</linearGradient>
		</defs>
		<path d="M50 0 Q55 45 100 50 Q55 55 50 100 Q45 55 0 50 Q45 45 50 0 Z" fill="url(#spark)" />
	</svg>
);

// 10 to 18s: mother and child try Gemini Notebook together.
export const SceneNotebook: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const question = 'Maksud “paradigma” di bacaan ini apa, ya? Jelaskan pelan-pelan.';
	const answer = 'Sederhananya, paradigma itu seperti kacamata yang dipakai peneliti untuk melihat masalah...';
	const typedQuestion = question.slice(0, Math.max(0, Math.floor((frame - 75) * 1.1)));
	const typedAnswer = answer.slice(0, Math.max(0, Math.floor((frame - 175) * 1.8)));
	const card = spring({frame, fps, config: {damping: 200}});
	return (
		<Fade background={MORNING}>
			<Glow x={950} y={300} size={1000} color="rgba(255, 220, 140, 0.8)" opacity={1} />
			<div
				style={{
					position: 'absolute',
					left: 70,
					top: 470,
					width: 940,
					height: 700,
					borderRadius: 40,
					background: 'white',
					boxShadow: '0 30px 80px rgba(120, 80, 60, 0.25)',
					padding: 44,
					boxSizing: 'border-box',
					fontFamily,
					opacity: card,
					transform: `translateY(${(1 - card) * 80}px)`,
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: 18}}>
					<Sparkle size={54} />
					<div>
						<div style={{fontSize: 40, fontWeight: 700, color: '#2b2140'}}>Gemini Notebook</div>
						<div style={{fontSize: 26, color: '#8a8299'}}>Catatan Kuliah Mama</div>
					</div>
				</div>
				<div style={{marginTop: 30, fontSize: 24, fontWeight: 600, color: '#8a8299', letterSpacing: 2}}>SUMBER</div>
				<div style={{display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 14}}>
					{['Bacaan Minggu 1.pdf', 'Jurnal Pendidikan.pdf', 'Slide Dosen.pdf'].map((s, i) => {
						const s1 = spring({frame: frame - 15 - i * 10, fps, config: {damping: 14}});
						return (
							<div
								key={s}
								style={{
									padding: '12px 22px',
									borderRadius: 999,
									background: '#f1edff',
									color: '#5b47b3',
									fontSize: 26,
									fontWeight: 600,
									transform: `scale(${s1})`,
								}}
							>
								{s}
							</div>
						);
					})}
				</div>
				{frame > 70 ? (
					<div
						style={{
							marginTop: 36,
							marginLeft: 'auto',
							maxWidth: 640,
							padding: '20px 26px',
							borderRadius: '28px 28px 6px 28px',
							background: '#7a5cc4',
							color: 'white',
							fontSize: 30,
							lineHeight: 1.35,
							minHeight: 40,
						}}
					>
						{typedQuestion}
					</div>
				) : null}
				{frame > 160 ? (
					<div
						style={{
							marginTop: 22,
							maxWidth: 680,
							padding: '20px 26px',
							borderRadius: '28px 28px 28px 6px',
							background: '#f4f2f8',
							color: '#2b2140',
							fontSize: 30,
							lineHeight: 1.35,
						}}
					>
						{frame < 175 ? '• • •' : typedAnswer}
					</div>
				) : null}
			</div>
			<div style={{position: 'absolute', left: 200, top: 1130}}>
				<Person facing="front" {...MAMA} smile={interpolate(frame, [180, 230], [0.1, 0.8], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} armRotate={null} headTilt={4} width={320} />
			</div>
			<div style={{position: 'absolute', left: 560, top: 1180}}>
				<Person facing="front" {...CHILD} smile={0.7} armRotate={null} headTilt={-6} width={290} />
			</div>
			<Table top={1380} color="#c98f62" />
			<Headline text="Nggak ada pertanyaan yang terlalu sederhana." from={20} to={1000} dark={false} italic={false} />
		</Fade>
	);
};

// 18 to 28s: the moment it clicks. Mama explains it back to her child.
export const SceneClick: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const clicked = frame >= 160;
	const strike = interpolate(frame, [110, 140], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const bulb = spring({frame: frame - 160, fps, config: {damping: 9}});
	const draw = interpolate(frame, [190, 250], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<Fade background={MORNING}>
			<Glow x={820} y={600} size={900} color="rgba(255, 230, 120, 0.9)" opacity={bulb * (0.8 + Math.sin(frame / 6) * 0.2)} />
			<div
				style={{
					position: 'absolute',
					left: 80,
					top: 500,
					width: 600,
					padding: '28px 34px',
					borderRadius: 34,
					background: 'white',
					boxShadow: '0 20px 50px rgba(120, 80, 60, 0.2)',
					fontFamily,
					fontSize: 44,
					fontWeight: 700,
					color: '#2b2140',
				}}
			>
				{clicked ? (
					<>
						<div>Jadi gini, Nak...</div>
						<svg viewBox="0 0 520 140" width={520} height={140} style={{marginTop: 10}}>
							<path d="M60 70 L260 70 L460 70" stroke="#a66cff" strokeWidth={8} fill="none" strokeDasharray={400} strokeDashoffset={400 * (1 - draw)} />
							{[60, 260, 460].map((x, i) => (
								<circle key={x} cx={x} cy={70} r={34} fill={['#4f7cff', '#a66cff', '#ff7eb3'][i]} transform={`translate(${x} 70) scale(${Math.min(1, draw * 3 - i)}) translate(${-x} -70)`} />
							))}
						</svg>
					</>
				) : (
					<div style={{position: 'relative', display: 'inline-block', color: '#8a8299'}}>
						Mama nggak ngerti...
						<div style={{position: 'absolute', left: 0, top: '52%', height: 6, width: `${strike}%`, background: '#d9534f', borderRadius: 3}} />
					</div>
				)}
				<div style={{position: 'absolute', left: 120, bottom: -30, width: 60, height: 60, background: 'white', transform: 'rotate(45deg)'}} />
			</div>
			<div style={{position: 'absolute', left: 760, top: 480, transform: `scale(${bulb})`}}>
				<svg viewBox="0 0 100 140" width={170} height={240}>
					<circle cx={50} cy={50} r={42} fill="#ffd84a" />
					<rect x={32} y={88} width={36} height={30} rx={6} fill="#b9b3c6" />
					<rect x={36} y={120} width={28} height={10} rx={5} fill="#8a8299" />
				</svg>
			</div>
			{clicked
				? [
						{x: 700, y: 470, d: 0},
						{x: 960, y: 520, d: 6},
						{x: 980, y: 760, d: 12},
						{x: 690, y: 760, d: 18},
					].map((s) => (
						<div key={s.x} style={{position: 'absolute', left: s.x, top: s.y, transform: `scale(${spring({frame: frame - 165 - s.d, fps, config: {damping: 8}})}) rotate(${frame * 2}deg)`}}>
							<Sparkle size={60} />
						</div>
					))
				: null}
			<div style={{position: 'absolute', left: 90, top: 860}}>
				<Person
					facing="front"
					{...MAMA}
					smile={interpolate(frame, [140, 200], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
					armRotate={clicked ? 25 + Math.sin(frame / 6) * 12 : null}
					headTilt={clicked ? Math.sin(frame / 9) * 4 : -4}
					width={520}
				/>
			</div>
			<div style={{position: 'absolute', left: 690, top: 1130}}>
				<Person facing="front" {...CHILD} smile={clicked ? 1 : 0.4} armRotate={null} headTilt={clicked ? Math.sin(frame / 5) * 6 : 0} width={300} />
			</div>
			<Table top={1440} color="#c98f62" />
			<Headline text="Momen ketika semuanya masuk akal." from={165} to={1000} dark={false} italic={false} />
		</Fade>
	);
};

// 28 to 36s: Mama presents in class with confidence.
export const ScenePresent: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<Fade background="linear-gradient(180deg, #f3eeff 0%, #e6dcff 100%)">
			<div
				style={{
					position: 'absolute',
					left: 90,
					top: 430,
					width: 900,
					height: 500,
					borderRadius: 20,
					background: 'white',
					border: '10px solid #2b2140',
					padding: 40,
					boxSizing: 'border-box',
					fontFamily,
				}}
			>
				<div style={{fontSize: 40, fontWeight: 800, color: '#2b2140'}}>Paradigma dalam Pendidikan</div>
				<div style={{height: 8, width: 220, marginTop: 12, borderRadius: 4, background: ACCENT}} />
				<div style={{display: 'flex', alignItems: 'flex-end', gap: 40, height: 260, marginTop: 40, paddingLeft: 30}}>
					{[0.45, 0.7, 0.55, 0.95].map((h, i) => (
						<div
							key={i}
							style={{
								width: 120,
								height: `${h * 100 * spring({frame: frame - 20 - i * 8, fps, config: {damping: 200}})}%`,
								borderRadius: '14px 14px 0 0',
								background: ['#4f7cff', '#7a6cff', '#a66cff', '#ff7eb3'][i],
							}}
						/>
					))}
				</div>
			</div>
			<div style={{position: 'absolute', left: 30, top: 880}}>
				<Person facing="front" {...MAMA} smile={1} armRotate={30 + Math.sin(frame / 12) * 4} headTilt={2} width={400} />
			</div>
			{new Array(6).fill(true).map((_, i) => {
				const x = -40 + i * 200;
				const nod = Math.max(0, Math.sin(frame / 8 + i * 1.3)) * 10;
				return (
					<div key={i} style={{position: 'absolute', left: x, top: 1290 + (i % 2) * 30 + nod}}>
						<Person facing="back" hair={['#2a1d1d', '#4a3426', '#1d1d2a', '#5c3a2e', '#222', '#3b2a2a'][i]} shirt={['#3fa58f', '#e07a5f', '#4f7cff', '#f2b134', '#7a5cc4', '#e56b9a'][i]} bun={i === 2} glasses={false} smile={0} armRotate={null} headTilt={0} width={260} />
					</div>
				);
			})}
			<Headline text="Mama nggak pernah terlambat." from={95} to={1000} dark={false} italic={false} />
		</Fade>
	);
};

// 36 to 45s: freeze on Mama's smile, then the workshop card.
export const SceneEndCard: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const portrait = spring({frame, fps, config: {damping: 14}});
	const title = spring({frame: frame - 25, fps, config: {damping: 200}});
	const tagline = spring({frame: frame - 50, fps, config: {damping: 200}});
	const cta = spring({frame: frame - 80, fps, config: {damping: 10}});
	return (
		<Fade background="linear-gradient(180deg, #fff1e6 0%, #f3e6ff 100%)">
			<div
				style={{
					position: 'absolute',
					left: 330,
					top: 230,
					width: 420,
					height: 420,
					borderRadius: '50%',
					overflow: 'hidden',
					background: '#ffd9b8',
					border: '12px solid white',
					boxShadow: '0 30px 70px rgba(120, 80, 160, 0.3)',
					transform: `scale(${portrait})`,
				}}
			>
				<div style={{position: 'absolute', left: 10, top: 40}}>
					<Person facing="front" {...MAMA} smile={1} armRotate={null} headTilt={4} width={400} />
				</div>
			</div>
			<div style={{position: 'absolute', top: 720, left: 60, right: 60, textAlign: 'center', fontFamily, opacity: title, transform: `translateY(${(1 - title) * 40}px)`}}>
				<div
					style={{
						fontSize: 104,
						fontWeight: 800,
						lineHeight: 1.05,
						backgroundImage: ACCENT,
						WebkitBackgroundClip: 'text',
						backgroundClip: 'text',
						color: 'transparent',
					}}
				>
					Gemini Notebook
				</div>
				<div style={{fontSize: 88, fontWeight: 800, color: '#2b2140', lineHeight: 1.1}}>Workshop</div>
			</div>
			<div style={{position: 'absolute', top: 1000, left: 100, right: 100, textAlign: 'center', fontFamily, fontSize: 46, fontWeight: 400, fontStyle: 'italic', color: '#5b4f6e', opacity: tagline}}>
				Belajar bersama sumbermu, bukan melawannya.
			</div>
			<div style={{position: 'absolute', top: 1190, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
				<div
					style={{
						padding: '22px 56px',
						borderRadius: 999,
						background: '#2b2140',
						color: 'white',
						fontFamily,
						fontSize: 44,
						fontWeight: 700,
						transform: `scale(${cta * (1 + Math.sin(frame / 8) * 0.025)})`,
					}}
				>
					Link di bio
				</div>
			</div>
		</Fade>
	);
};
