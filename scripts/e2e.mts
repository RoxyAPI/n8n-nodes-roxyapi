/**
 * End to end in a real n8n: the packed release tarball, installed the way n8n installs a
 * community node, running workflows against the live API.
 *
 * Run:    ROXY_API_KEY=... npm run e2e      (needs Docker; N8N_IMAGE overrides the image)
 * Does:   builds and packs the node, starts a throwaway n8n container, installs the tarball,
 *         imports one credential and one workflow per case, executes each, asserts the result.
 * Writes: a temp directory and a container, both removed on exit.
 * Pairs:  tests/node.test.mts proves the node matches the spec; this proves n8n runs it.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

type Json = Record<string, any>;
type Case = {
	parameters: Json;
	/** Returns a failure message, or nothing when the result is right. */
	check: (json: Json | undefined, error: Json | undefined) => string | undefined;
};

const IMAGE = process.env.N8N_IMAGE ?? 'docker.n8n.io/n8nio/n8n:latest';
const NODE_TYPE = '@roxyapi/n8n-nodes-roxyapi.roxyApi';
const BIRTH = { date: '1990-01-15', time: '14:30:00', latitude: 40.7128, longitude: -74.006 };

const ok = (json: Json | undefined, error: Json | undefined) =>
	error ? `unexpected error: ${error.message}` : json ? undefined : 'no output';

const CASES: Record<string, Case> = {
	horoscopeInHindi: {
		parameters: {
			resource: 'astrology',
			operation: 'getDailyHoroscope',
			sign: 'leo',
			options: { lang: 'hi' },
		},
		check: (j, e) => ok(j, e) ?? (/[ऀ-ॿ]/.test(j?.overview) ? undefined : 'not Hindi'),
	},
	natalChartIanaTimezone: {
		parameters: {
			resource: 'astrology',
			operation: 'generateNatalChart',
			...BIRTH,
			timezone: 'America/New_York',
		},
		check: (j, e) => ok(j, e) ?? (j?.planets?.length ? undefined : 'no planets'),
	},
	natalChartNumericTimezone: {
		parameters: {
			resource: 'astrology',
			operation: 'generateNatalChart',
			...BIRTH,
			timezone: '-5',
		},
		check: (j, e) =>
			ok(j, e) ?? (j?.birthDetails?.timezone === -5 ? undefined : 'timezone not sent as a number'),
	},
	synastryWithDefaultJson: {
		parameters: { resource: 'astrology', operation: 'calculateSynastry' },
		check: (j, e) => ok(j, e) ?? (j?.person1 && j?.person2 ? undefined : 'missing people'),
	},
	renamedLimit: {
		parameters: { resource: 'iching', operation: 'listHexagrams', options: { maxResults: 64 } },
		check: (j, e) => ok(j, e) ?? (j?.hexagrams?.length === 64 ? undefined : 'limit not applied'),
	},
	renamedColor: {
		parameters: { resource: 'crystals', operation: 'listCrystals', options: { shade: 'purple' } },
		check: (j, e) =>
			ok(j, e) ??
			(j?.crystals?.length &&
			j.crystals.every((c: Json) => c.colors.some((x: string) => x.includes('purple')))
				? undefined
				: 'color filter not applied'),
	},
	citySearch: {
		parameters: { resource: 'location', operation: 'searchCities', q: 'London' },
		check: (j, e) => ok(j, e) ?? (j?.cities?.[0]?.timezone ? undefined : 'no cities'),
	},
	usage: {
		parameters: { resource: 'usage', operation: 'getUsageStats' },
		check: (j, e) => ok(j, e) ?? (j?.plan ? undefined : 'no plan'),
	},
	invalidDateIsA400: {
		parameters: {
			resource: 'astrology',
			operation: 'generateNatalChart',
			...BIRTH,
			date: 'not-a-date',
			timezone: 'America/New_York',
		},
		check: (_, e) =>
			String(e?.httpCode) === '400' ? undefined : `expected a 400, got ${JSON.stringify(e)}`,
	},
};

const run = (cmd: string, args: string[], input?: string) =>
	execFileSync(cmd, args, { encoding: 'utf8', input, stdio: ['pipe', 'pipe', 'pipe'] });

if (!process.env.ROXY_API_KEY) throw new Error('e2e: set ROXY_API_KEY');
const dir = mkdtempSync(join(tmpdir(), 'roxy-n8n-e2e-'));
const container = `roxy-n8n-e2e-${process.pid}`;
const exec = (script: string) => run('docker', ['exec', container, 'sh', '-c', script]);

try {
	run('npm', ['run', 'build']);
	run('npm', ['pack', '--pack-destination', dir], undefined);
	const tarball = readdirSync(dir).find((f) => f.endsWith('.tgz'));
	const ids: string[] = [];
	for (const [name, c] of Object.entries(CASES)) {
		const id = `e2e${name.toLowerCase()}`.slice(0, 16).padEnd(16, '0');
		ids.push(`${id} ${name}`);
		const workflow = {
			id,
			name,
			active: false,
			settings: {},
			connections: { Trigger: { main: [[{ node: 'RoxyAPI', type: 'main', index: 0 }]] } },
			nodes: [
				{
					id: 'trigger',
					name: 'Trigger',
					type: 'n8n-nodes-base.manualTrigger',
					typeVersion: 1,
					position: [0, 0],
					parameters: {},
				},
				{
					id: 'roxy',
					name: 'RoxyAPI',
					type: NODE_TYPE,
					typeVersion: 1,
					position: [200, 0],
					parameters: c.parameters,
					credentials: { roxyApiApi: { id: 'e2eroxycredential', name: 'RoxyAPI' } },
				},
			],
		};
		writeFileSync(join(dir, `${name}.workflow.json`), JSON.stringify(workflow));
	}

	run('docker', [
		'run',
		'-d',
		'--name',
		container,
		'-e',
		'ROXY_API_KEY',
		'-v',
		`${dir}:/e2e:ro`,
		'--entrypoint',
		'sh',
		IMAGE,
		'-c',
		'sleep 1800',
	]);
	// n8n installs community nodes without their peer; installing n8n-workflow fails a native build.
	exec(
		`mkdir -p ~/.n8n/nodes && cd ~/.n8n/nodes && npm init -y >/dev/null && npm install /e2e/${tarball} --legacy-peer-deps --omit=dev --silent`,
	);
	// The key lives only in the container environment and a file deleted right after import.
	exec(
		`node -e 'require("fs").writeFileSync("/tmp/c.json", JSON.stringify([{ id: "e2eroxycredential", name: "RoxyAPI", type: "roxyApiApi", data: { apiKey: process.env.ROXY_API_KEY } }]))' && n8n import:credentials --input=/tmp/c.json >/dev/null 2>&1; rm /tmp/c.json`,
	);
	exec('for f in /e2e/*.workflow.json; do n8n import:workflow --input=$f >/dev/null 2>&1; done');

	let failures = 0;
	for (const line of ids) {
		const [id, name] = line.split(' ');
		// The n8n CLI never exits after a failed run, so every execution is killed on a deadline.
		const out = exec(
			`timeout -s KILL 90 n8n execute --id=${id} > /tmp/out.txt 2>&1; cat /tmp/out.txt`,
		);
		const body = out.split(/={20,}\n/)[1];
		let json: Json | undefined;
		let error: Json | undefined;
		if (body) {
			// A failed run prints its execution JSON, then an error line; the JSON closes at column 0.
			const result = JSON.parse(body.slice(0, body.lastIndexOf('\n}') + 2)).data.resultData;
			const node = result.runData.RoxyAPI?.[0];
			json = node?.data?.main?.[0]?.[0]?.json;
			error = result.error ?? node?.error;
		} else {
			const code = out.match(/"httpCode":\s*"(\d+)"/)?.[1];
			error = { message: out.match(/"message":\s*"([^"]+)"/)?.[1] ?? 'no result', httpCode: code };
		}
		const problem = CASES[name].check(json, error);
		if (problem) failures++;
		console.log(`${problem ? 'FAIL' : 'ok  '} ${name}${problem ? `: ${problem}` : ''}`);
	}
	if (failures) {
		console.error(`e2e: ${failures} of ${ids.length} cases failed`);
		process.exitCode = 1;
	} else console.log(`e2e: all ${ids.length} cases passed in ${IMAGE}`);
} finally {
	try {
		run('docker', ['rm', '-f', container]);
	} catch {
		// the container was never started
	}
	rmSync(dir, { recursive: true, force: true });
}
