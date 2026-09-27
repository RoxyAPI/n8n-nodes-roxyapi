import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { resourceProperties } from './resources/index.gen';
import { BASE_URL } from './spec.gen';
import { VERSION } from './version';

export class RoxyApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'RoxyAPI',
		name: 'roxyApi',
		icon: { light: 'file:../../icons/roxyapi.svg', dark: 'file:../../icons/roxyapi.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description:
			'Astrology, horoscopes, tarot, numerology and more insight domains on one API key, verified against NASA JPL Horizons',
		defaults: {
			name: 'RoxyAPI',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'roxyApiApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: BASE_URL,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-SDK-Client': `roxy-sdk-n8n/${VERSION}`,
			},
		},
		properties: resourceProperties,
	};
}
