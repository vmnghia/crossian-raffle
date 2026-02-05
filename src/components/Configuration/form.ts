import { createFormContext } from '@mantine/form';

import type { ConfigurationData } from '@/contexts/Configuration';
import type { Participant } from '@/types';

interface ConfigurationFormValues extends ConfigurationData {
	participants: Participant[];
}

export const [FormProvider, useFormContext, useForm] = createFormContext<ConfigurationFormValues>();
