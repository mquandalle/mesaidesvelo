import yaml from 'js-yaml';
import fs from 'fs';
import { execSync } from 'child_process';

// Create an empty output directory
const outputDir = './build/';
if (fs.existsSync(outputDir)) {
	fs.rmSync(outputDir, { recursive: true });
}
fs.mkdirSync(outputDir);

// Convert Yaml into JS importable format
const aides = yaml.load(fs.readFileSync('../src/aides.yaml', 'utf8'));
fs.writeFileSync(outputDir + 'aides.js', `export default ` + JSON.stringify(aides, null, 2));

// Run typescript to generate a .js file and a .d.ts type definition file
const { stdout } = execSync(`tsc --outDir ${outputDir}`);
if (stdout) {
	console.log(stdout);
}

// HACK: rewrite import
const indexSource = fs.readFileSync(outputDir + 'index.js', 'utf8');
fs.writeFileSync(outputDir + 'index.js', indexSource.replace('./build/aides.js', './aides.js'));
