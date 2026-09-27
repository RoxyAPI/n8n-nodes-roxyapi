import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';
import { BASE_URL } from '../nodes/RoxyApi/spec.gen';

export class RoxyApiApi implements ICredentialType {
	name = 'roxyApiApi';

	displayName = 'RoxyAPI API';

	icon: Icon = { light: 'file:../icons/roxyapi.svg', dark: 'file:../icons/roxyapi.dark.svg' };

	documentationUrl = 'https://roxyapi.com/docs/integrations/n8n';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			description: 'Your RoxyAPI secret key, from the account page at roxyapi.com',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: BASE_URL,
			url: '/usage',
		},
	};
}
