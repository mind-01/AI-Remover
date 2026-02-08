import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const require = createRequire(import.meta.url);

async function testResolve() {
    console.log('Testing resolution...');

    try {
        // Test native ESM resolution
        const resolvedUrl = await import.meta.resolve('upscaler');
        console.log('SUCCESS: import.meta.resolve("upscaler") ->', resolvedUrl);
        console.log('Path:', fileURLToPath(resolvedUrl));
    } catch (e) {
        console.log('FAIL: import.meta.resolve("upscaler")', e.message);
    }

    try {
        // Test require resolution (likely to fail)
        const resolvedRequest = require.resolve('upscaler');
        console.log('SUCCESS: require.resolve("upscaler") ->', resolvedRequest);
    } catch (e) {
        console.log('FAIL: require.resolve("upscaler")', e.message);
    }
}

testResolve();
