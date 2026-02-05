import type { SVGProps } from 'react';

import Crossian from './crossian-logo.svg';

export const Logo = (props: SVGProps<SVGSVGElement>) => {
	return (
		<Crossian
			height='3rem'
			width='3rem'
			{...props}
		/>
	);
};
