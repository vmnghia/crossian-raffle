import { Input } from '@mantine/core';

const InputExtend = Input.extend({
	defaultProps: {
		variant: 'filled',
	},
});

export { InputExtend as Input };
