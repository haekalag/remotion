import React from 'react';

const SKIN = '#e8b48f';

// Flat illustrated character. `facing: 'back'` hides the face (used for the night scenes).
export const Person: React.FC<{
	facing: 'front' | 'back';
	hair: string;
	shirt: string;
	bun: boolean;
	glasses: boolean;
	smile: number;
	armRotate: number | null;
	headTilt: number;
	width: number;
}> = ({facing, hair, shirt, bun, glasses, smile, armRotate, headTilt, width}) => {
	return (
		<svg viewBox="0 0 300 420" width={width} height={(width * 420) / 300} style={{overflow: 'visible'}}>
			<path d="M30 420 Q30 255 150 245 Q270 255 270 420 Z" fill={shirt} />
			{armRotate === null ? null : (
				<g transform={`rotate(${armRotate} 235 290)`}>
					<rect x={222} y={170} width={30} height={130} rx={15} fill={shirt} />
					<circle cx={237} cy={168} r={20} fill={SKIN} />
				</g>
			)}
			<rect x={130} y={195} width={40} height={60} rx={10} fill={SKIN} />
			<g transform={`rotate(${headTilt} 150 220)`}>
				{bun ? <circle cx={150} cy={72} r={32} fill={hair} /> : null}
				{facing === 'back' ? (
					<circle cx={150} cy={150} r={72} fill={hair} />
				) : (
					<>
						<circle cx={150} cy={150} r={70} fill={SKIN} />
						<path
							d={
								bun
									? 'M78 158 Q74 72 150 76 Q226 72 222 158 Q210 108 150 104 Q90 108 78 158 Z'
									: 'M78 150 Q72 70 150 72 Q228 70 222 150 Q200 98 120 112 Q92 120 78 150 Z'
							}
							fill={hair}
						/>
						<circle cx={124} cy={155} r={6} fill="#2b2024" />
						<circle cx={176} cy={155} r={6} fill="#2b2024" />
						{glasses ? (
							<g fill="none" stroke="#2b2024" strokeWidth={4}>
								<circle cx={124} cy={155} r={20} />
								<circle cx={176} cy={155} r={20} />
								<line x1={144} y1={155} x2={156} y2={155} />
							</g>
						) : null}
						<path
							d={`M128 ${192 - smile * 2} Q150 ${192 + smile * 16} 172 ${192 - smile * 2}`}
							stroke="#8a3b3b"
							strokeWidth={5}
							strokeLinecap="round"
							fill="none"
						/>
						<circle cx={108} cy={182} r={10} fill="#f08f8f" opacity={0.35 * smile} />
						<circle cx={192} cy={182} r={10} fill="#f08f8f" opacity={0.35 * smile} />
					</>
				)}
			</g>
		</svg>
	);
};
