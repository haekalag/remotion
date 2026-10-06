import React from 'react';
import {Composition} from 'remotion';
import {DURATION, FPS, MamaKuliahLagi} from './MamaKuliahLagi';

export const Root: React.FC = () => {
	return (
		<Composition
			id="MamaKuliahLagi"
			component={MamaKuliahLagi}
			durationInFrames={DURATION}
			fps={FPS}
			width={1080}
			height={1920}
			defaultProps={{voiceoverSrc: null, musicSrc: null}}
		/>
	);
};
