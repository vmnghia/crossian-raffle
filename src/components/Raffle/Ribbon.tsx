import type { CSSProperties, ReactNode } from 'react';
import { clsx } from 'clsx';

import classes from './Ribbon.module.css';

export const Ribbon = ({
	className,
	children,
	style,
}: {
	className?: string;
	children: ReactNode;
	style?: CSSProperties;
}) => {
	return (
		<div
			className={clsx(className, classes.ribbon)}
			style={style}
		>
			{children}
		</div>
	);
};
