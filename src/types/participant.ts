export interface Participant {
	name?: string;
	coe?: COE;
	id: string;
}

export type COE = 'TECH.PMI' | 'BEVA' | 'CEE' | 'SCE' | 'CPM' | 'RFS' | 'POE';
