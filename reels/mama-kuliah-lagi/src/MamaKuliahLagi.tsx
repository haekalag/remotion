import React from 'react';
import {
	AbsoluteFill,
	Html5Audio,
	Sequence,
	interpolate,
	staticFile,
	useCurrentFrame,
} from 'remotion';
import {
	SceneClick,
	SceneEndCard,
	SceneLaptop,
	SceneNight,
	SceneNotebook,
	ScenePresent,
	fontFamily,
} from './Scenes';

export const FPS = 30;
export const DURATION = 45 * FPS;

const SCENES = [
	{from: 0, to: 90, Scene: SceneNight},
	{from: 90, to: 300, Scene: SceneLaptop},
	{from: 300, to: 540, Scene: SceneNotebook},
	{from: 540, to: 840, Scene: SceneClick},
	{from: 840, to: 1080, Scene: ScenePresent},
	{from: 1080, to: DURATION, Scene: SceneEndCard},
];

// Timed to the Indonesian voiceover script.
const SUBTITLES = [
	{from: 0, to: 88, text: 'Mama aku kuliah lagi di usia 47 tahun.'},
	{from: 92, to: 150, text: 'Tiap malam, setelah semua orang tidur,'},
	{from: 150, to: 192, text: 'Mama masih duduk di situ.'},
	{from: 192, to: 240, text: 'Baca halaman yang sama berkali-kali.'},
	{from: 240, to: 298, text: 'Diam-diam, Mama merasa sudah terlalu tua untuk semua ini.'},
	{from: 302, to: 375, text: 'Akhirnya satu akhir pekan, kami coba sesuatu bareng.'},
	{from: 375, to: 450, text: 'Mama masukkan semua bacaannya, lalu mulai bertanya.'},
	{from: 450, to: 538, text: 'Rasanya seperti ngobrol dengan tutor yang sabar sekali.'},
	{from: 542, to: 600, text: 'Aku lihat sendiri.'},
	{from: 600, to: 700, text: 'Mama yang tadinya bilang “Mama nggak ngerti”,'},
	{from: 700, to: 838, text: 'sekarang malah menjelaskan materinya ke aku.'},
	{from: 842, to: 920, text: 'Bukan alatnya yang membuat Mama pintar.'},
	{from: 920, to: 990, text: 'Mama memang sudah pintar dari dulu.'},
	{from: 990, to: 1078, text: 'Alat itu cuma memberi Mama ruang untuk membuktikannya.'},
	{from: 1082, to: 1200, text: 'Kalau kamu, atau orang yang kamu sayang, sedang belajar lagi...'},
	{from: 1200, to: 1320, text: 'workshop ini untuk kalian.'},
];

export const MamaKuliahLagi: React.FC<{
	voiceoverSrc: string | null;
	musicSrc: string | null;
}> = ({voiceoverSrc, musicSrc}) => {
	const frame = useCurrentFrame();
	const subtitle = SUBTITLES.find((s) => frame >= s.from && frame < s.to);
	return (
		<AbsoluteFill style={{backgroundColor: frame < 300 ? '#141226' : '#fff3e4'}}>
			{SCENES.map(({from, to, Scene}) => (
				<Sequence key={from} from={from} durationInFrames={to - from}>
					<Scene />
				</Sequence>
			))}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse at center, transparent 55%, rgba(20, 10, 30, 0.35) 100%)',
				}}
			/>
			{subtitle ? (
				<div
					style={{
						position: 'absolute',
						left: 70,
						right: 70,
						bottom: 330,
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					<div
						style={{
							maxWidth: 900,
							padding: '18px 30px',
							borderRadius: 22,
							background: 'rgba(20, 16, 30, 0.75)',
							color: 'white',
							fontFamily,
							fontSize: 46,
							fontWeight: 600,
							lineHeight: 1.3,
							textAlign: 'center',
							textWrap: 'balance',
							opacity: interpolate(frame, [subtitle.from, subtitle.from + 6], [0, 1], {
								extrapolateRight: 'clamp',
							}),
						}}
					>
						{subtitle.text}
					</div>
				</div>
			) : null}
			{voiceoverSrc ? <Html5Audio src={staticFile(voiceoverSrc)} /> : null}
			{musicSrc ? <Html5Audio src={staticFile(musicSrc)} volume={0.25} /> : null}
		</AbsoluteFill>
	);
};
