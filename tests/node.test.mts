/**
 * Spec-driven: every operation and field of specs/openapi.json must reach the BUILT node in
 * dist/ with the method, URL and request property the spec declares. Nothing here lists an
 * operation by hand, so a new endpoint is covered the day it lands in the spec.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { buildModel, type Spec } from '../scripts/model.mts';

type Property = {
	name: string;
	type: string;
	value?: string;
	required?: boolean;
	options?: Property[];
	displayOptions?: { show?: { resource?: string[]; operation?: string[] } };
	routing?: {
		request?: { method: string; url: string };
		send?: { type: string; property: string };
	};
};

const require = createRequire(import.meta.url);
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const spec: Spec = JSON.parse(readFileSync('specs/openapi.json', 'utf8'));
const model = buildModel(spec);
const { RoxyApi } = require('../dist/nodes/RoxyApi/RoxyApi.node.js');
const { RoxyApiApi } = require('../dist/credentials/RoxyApiApi.credentials.js');
const description = new RoxyApi().description;
const properties: Property[] = description.properties;

const shownFor = (resource: string, operation?: string) => (p: Property) =>
	p.displayOptions?.show?.resource?.includes(resource) &&
	(operation === undefined || p.displayOptions.show.operation?.includes(operation));

test('the package manifest points at files the build produced', () => {
	for (const file of [...pkg.n8n.nodes, ...pkg.n8n.credentials])
		assert.ok(require.resolve(`../${file}`));
});

test('every spec tag is a resource', () => {
	const selector = properties.find((p) => p.name === 'resource');
	assert.deepEqual(
		selector?.options?.map((o) => o.value).sort(),
		model.resources.map((r) => r.value).sort(),
	);
});

test('every spec operation routes to its method and path', () => {
	let count = 0;
	for (const resource of model.resources) {
		const selector = properties.find((p) => p.name === 'operation' && shownFor(resource.value)(p));
		assert.ok(selector, `no operation selector for ${resource.value}`);
		for (const op of resource.operations) {
			const option: Property | undefined = selector.options?.find((o) => o.value === op.value);
			assert.ok(option, `${op.value} is missing from ${resource.value}`);
			assert.equal(option.routing?.request?.method, op.method, op.value);
			const expected = op.path.replace(
				/\{(\w+)\}/g,
				(_, n: string) => `{{encodeURIComponent($parameter["${n}"])}}`,
			);
			assert.equal(
				option.routing?.request?.url,
				op.path.includes('{') ? `=${expected}` : op.path,
				op.value,
			);
			count++;
		}
	}
	assert.equal(count, Object.values(spec.paths).flatMap(Object.keys).length);
});

test('every spec field is a parameter that sends the spec property', () => {
	for (const resource of model.resources) {
		for (const op of resource.operations) {
			const visible = properties.filter(shownFor(resource.value, op.value));
			const optional = visible.find((p) => p.name === 'options')?.options ?? [];
			for (const f of op.fields) {
				const where = f.required ? visible : optional;
				const param = where.find((p) => p.name === f.param);
				assert.ok(param, `${op.value}: ${f.name} is missing`);
				assert.equal(Boolean(param.required), f.required, `${op.value}: ${f.name} required`);
				if (f.location === 'path') assert.equal(param.routing, undefined, `${op.value}: ${f.name}`);
				else
					assert.deepEqual(
						[param.routing?.send?.type, param.routing?.send?.property],
						[f.location, f.name],
					);
			}
		}
	}
});

test('requests go to the spec server and carry the client tag of this release', () => {
	assert.equal(description.requestDefaults.baseURL, spec.servers?.[0].url);
	assert.equal(description.requestDefaults.headers['X-SDK-Client'], `roxy-sdk-n8n/${pkg.version}`);
	assert.equal(description.usableAsTool, true);
});

test('the credential sends the key header and tests it against the spec server', () => {
	const credential = new RoxyApiApi();
	assert.equal(credential.name, description.credentials[0].name);
	assert.deepEqual(Object.keys(credential.authenticate.properties.headers), ['X-API-Key']);
	assert.equal(credential.test.request.baseURL, spec.servers?.[0].url);
	assert.ok(
		spec.paths[credential.test.request.url]?.get,
		'credential test path is not a GET in the spec',
	);
});
