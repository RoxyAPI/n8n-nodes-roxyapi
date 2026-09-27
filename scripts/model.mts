/**
 * The one reading of `specs/openapi.json`. The generator (node files and README) and the tests
 * both derive the node from here, so a new domain or endpoint in the spec needs no edit anywhere
 * in this repo. Fails loudly on a spec shape it cannot map instead of guessing.
 */

type Schema = {
	$ref?: string;
	type?: string | string[];
	enum?: unknown[];
	items?: Schema;
	anyOf?: Schema[];
	oneOf?: Schema[];
	properties?: Record<string, Schema>;
	required?: string[];
	minimum?: number;
	maximum?: number;
	default?: unknown;
	example?: unknown;
	description?: string;
};

type Parameter = {
	name: string;
	in: string;
	required?: boolean;
	description?: string;
	example?: unknown;
	schema?: Schema;
};

type Operation = {
	operationId?: string;
	summary?: string;
	tags?: string[];
	parameters?: Parameter[];
	requestBody?: { content?: Record<string, { schema?: Schema }> };
};

export type Spec = {
	servers?: { url: string }[];
	tags?: { name: string; description?: string }[];
	paths: Record<string, Record<string, Operation>>;
	components?: { schemas?: Record<string, Schema> };
};

/** How a spec field is presented in n8n and serialized back into the request. */
type FieldKind = 'string' | 'number' | 'boolean' | 'options' | 'multiOptions' | 'json' | 'timezone';

export type Field = {
	/** The property sent to the API, exactly as the spec names it. */
	name: string;
	/** The n8n parameter key; equals `name` unless n8n reserves that name (see RENAMED). */
	param: string;
	displayName: string;
	location: 'path' | 'query' | 'body';
	required: boolean;
	kind: FieldKind;
	description: string;
	/** What the n8n field starts with: the spec default, else its example. */
	initial: unknown;
	example: unknown;
	values?: string[];
	integer?: boolean;
	minimum?: number;
	maximum?: number;
};

export type NodeOperation = {
	value: string;
	name: string;
	action: string;
	description: string;
	method: 'GET' | 'POST';
	path: string;
	fields: Field[];
};

export type NodeResource = {
	value: string;
	name: string;
	description: string;
	operations: NodeOperation[];
};

export type NodeModel = {
	baseUrl: string;
	resources: NodeResource[];
};

/** Names the node itself owns; a spec field with one of them would shadow the selector. */
const RESERVED = new Set(['resource', 'operation', 'options']);

/**
 * n8n lint gives two parameter names a fixed meaning: `limit` is list pagination with a
 * default of 50, and any name matching /colou?r/ is a colour picker. Ours are a bounded
 * page size (as low as 3 on some routes) and a crystal colour name, so the n8n key moves
 * while the request still sends the spec name.
 */
const RENAMED: Record<string, string> = { limit: 'maxResults', color: 'shade' };

/** Display-only words n8n style requires in a given casing. Never touches a request. */
const WORDS: Record<string, string> = { id: 'ID', iso2: 'ISO2', lang: 'Language', utc: 'UTC' };

/**
 * Small words kept lower case mid-title. The node files are then corrected by the n8n fixer
 * itself; this list only keeps the README operation names close to what the node shows.
 */
const SMALL = new Set([
	'a',
	'an',
	'and',
	'as',
	'at',
	'by',
	'for',
	'from',
	'in',
	'of',
	'on',
	'or',
	'the',
	'to',
	'vs',
	'with',
]);

function fail(message: string): never {
	throw new Error(`model: ${message}`);
}

/** The first URL path segment in camelCase, the same namespace every RoxyAPI SDK derives. */
function pathNamespace(path: string): string {
	const segment = path.split('/').filter(Boolean)[0];
	if (!segment) fail(`cannot derive a resource from path "${path}"`);
	return segment.replace(/-([a-z0-9])/g, (_, c: string) => c.toUpperCase());
}

/** `getDailyHoroscope` or `birthDate` split into lower-case words. */
function words(identifier: string): string[] {
	return identifier
		.replace(/[_-]+/g, ' ')
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
		.toLowerCase()
		.split(/\s+/)
		.filter(Boolean);
}

export function titleCase(identifier: string): string {
	return words(identifier)
		.map((w, i) => WORDS[w] ?? (i > 0 && SMALL.has(w) ? w : w[0].toUpperCase() + w.slice(1)))
		.join(' ');
}

function sentenceCase(identifier: string): string {
	const text = words(identifier)
		.map((w) => WORDS[w] ?? w)
		.join(' ');
	return text[0].toUpperCase() + text.slice(1);
}

/**
 * Tooltip text: plain, one line, at most two sentences and 300 characters. n8n renders it
 * as HTML, so backticks and angle brackets are dropped rather than escaped, and a spaced
 * hyphen used as a dash becomes a colon. A sentence ends at punctuation followed by a
 * capital, so "e.g., aries" never splits.
 */
function plain(text: string | undefined, maxSentences = 2): string {
	const flat = (text ?? '')
		.replace(/[`<>]/g, '')
		.replace(/\s+/g, ' ')
		.replace(/ (?:-|--|\u2013|\u2014) /g, ': ')
		.trim();
	if (!flat) return '';
	let out = flat
		.split(/(?<=[.!?])\s+(?=[A-Z])/)
		.slice(0, maxSentences)
		.join(' ');
	if (out.length > 300) out = `${out.slice(0, 297).replace(/\s+\S*$/, '')}...`;
	return out;
}

/** n8n style: a boolean tooltip opens with "Whether". The spec phrases them "Set true to ...". */
function whether(text: string, name: string): string {
	if (text.startsWith('Whether')) return text;
	const rewritten = text.replace(/^Set (?:this )?true (to|when|if) /, (_, word: string) =>
		word === 'to' ? 'Whether to ' : 'Whether ',
	);
	return rewritten === text
		? `Whether ${sentenceCase(name).toLowerCase()} is on. ${text}`.trim()
		: rewritten;
}

function resolve(spec: Spec, schema: Schema | undefined): Schema {
	if (!schema?.$ref) return schema ?? {};
	const name = schema.$ref.replace('#/components/schemas/', '');
	const target = spec.components?.schemas?.[name];
	if (!target) fail(`unresolved $ref ${schema.$ref}`);
	return resolve(spec, target);
}

/** The declared example, else one assembled from the examples of its properties or items. */
function exampleOf(spec: Spec, raw: Schema | undefined): unknown {
	const schema = resolve(spec, raw);
	if (schema.example !== undefined) return schema.example;
	if (schema.properties) {
		const entries = Object.entries(schema.properties)
			.map(([k, v]) => [k, exampleOf(spec, v)] as const)
			.filter(([, v]) => v !== undefined);
		return entries.length ? Object.fromEntries(entries) : undefined;
	}
	if (schema.items) {
		const item = exampleOf(spec, schema.items);
		return item === undefined ? undefined : [item];
	}
	return undefined;
}

function types(schema: Schema): string[] {
	const t = schema.type;
	return (Array.isArray(t) ? t : t ? [t] : []).filter((x) => x !== 'null');
}

function classify(
	spec: Spec,
	raw: Schema,
): Pick<Field, 'kind' | 'values' | 'integer' | 'minimum' | 'maximum'> {
	const schema = resolve(spec, raw);
	const union = (schema.anyOf ?? schema.oneOf)
		?.map((s) => resolve(spec, s))
		.filter((s) => types(s).length);
	if (union?.length) {
		const kinds = new Set(union.flatMap(types));
		if (kinds.size === 1 && kinds.has('string')) return { kind: 'string' };
		if (kinds.size === 2 && kinds.has('string') && kinds.has('number')) return { kind: 'timezone' };
		fail(`unmapped union ${JSON.stringify([...kinds])}`);
	}
	const [type] = types(schema);
	if (schema.enum?.length)
		return { kind: 'options', values: schema.enum.filter((v) => v !== null).map(String) };
	if (type === 'integer' || type === 'number')
		return {
			kind: 'number',
			integer: type === 'integer',
			minimum: schema.minimum,
			maximum: schema.maximum,
		};
	if (type === 'boolean') return { kind: 'boolean' };
	if (type === 'array') {
		const items = resolve(spec, schema.items);
		if (items.enum?.length) return { kind: 'multiOptions', values: items.enum.map(String) };
		return { kind: 'json' };
	}
	if (type === 'object') return { kind: 'json' };
	if (type === 'string' || type === undefined) return { kind: 'string' };
	fail(`unmapped type ${type}`);
}

function field(
	spec: Spec,
	name: string,
	location: Field['location'],
	required: boolean,
	schema: Schema,
	/** A path or query parameter may describe itself outside its schema; that text wins. */
	description?: string,
	example?: unknown,
): Field {
	const param = RENAMED[name] ?? name;
	if (RESERVED.has(param)) fail(`field "${name}" collides with a node selector`);
	if (location === 'path' && param !== name) fail(`path parameter "${name}" cannot be renamed`);
	const resolved = resolve(spec, schema);
	const shape = classify(spec, schema);
	const sample = example ?? exampleOf(spec, schema);
	let text = plain(description ?? resolved.description);
	if (shape.kind === 'boolean') text = whether(text, name);
	return {
		name,
		param,
		displayName: titleCase(name),
		location,
		required,
		description: text,
		initial: resolved.default ?? sample,
		example: sample,
		...shape,
	};
}

export function buildModel(spec: Spec): NodeModel {
	const baseUrl = spec.servers?.[0]?.url;
	if (!baseUrl?.startsWith('https://')) fail('servers[0].url must be an absolute https URL');

	const tagOrder = (spec.tags ?? []).map((t) => t.name);
	if (tagOrder.length === 0) fail('spec has no tags');
	const byTag = new Map<string, NodeResource>();

	for (const [path, methods] of Object.entries(spec.paths)) {
		for (const [method, op] of Object.entries(methods)) {
			const upper = method.toUpperCase();
			if (upper !== 'GET' && upper !== 'POST')
				fail(`${method} ${path}: only GET and POST are mapped`);
			if (!op.operationId) fail(`${upper} ${path} has no operationId`);
			const tag = op.tags?.[0];
			if (!tag || !tagOrder.includes(tag)) fail(`${op.operationId} has no declared tag`);

			const value = pathNamespace(path);
			const resource = byTag.get(tag) ?? {
				value,
				name: tag,
				description: plain(spec.tags?.find((t) => t.name === tag)?.description, 1),
				operations: [],
			};
			if (resource.value !== value)
				fail(`tag "${tag}" spans two path segments (${resource.value}, ${value})`);
			byTag.set(tag, resource);

			const fields: Field[] = [];
			for (const p of op.parameters ?? []) {
				if (p.in !== 'path' && p.in !== 'query') continue;
				fields.push(
					field(
						spec,
						p.name,
						p.in,
						p.in === 'path' || Boolean(p.required),
						p.schema ?? {},
						p.description,
						p.example,
					),
				);
			}
			const body = resolve(spec, op.requestBody?.content?.['application/json']?.schema);
			for (const [name, schema] of Object.entries(body.properties ?? {})) {
				fields.push(field(spec, name, 'body', body.required?.includes(name) ?? false, schema));
			}
			const seen = new Set<string>();
			for (const f of fields) {
				if (seen.has(f.param)) fail(`${op.operationId}: n8n key "${f.param}" appears twice`);
				seen.add(f.param);
			}

			resource.operations.push({
				value: op.operationId,
				name: titleCase(op.operationId),
				action: sentenceCase(op.operationId),
				description: plain(op.summary, 1),
				method: upper,
				path,
				fields,
			});
		}
	}

	const resources = tagOrder.map((t) => byTag.get(t)).filter((r): r is NodeResource => Boolean(r));
	const values = new Set(resources.map((r) => r.value));
	if (values.size !== resources.length) fail('two tags map to the same path segment');
	return { baseUrl, resources };
}

export function operationCount(model: NodeModel): number {
	return model.resources.reduce((n, r) => n + r.operations.length, 0);
}
