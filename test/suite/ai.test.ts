import * as assert from 'assert';
import { MappAIAssistant } from '../../src/ai/assistant';

suite('AI Assistant Test Suite', () => {
    let aiAssistant: MappAIAssistant;

    setup(() => {
        aiAssistant = new MappAIAssistant();
    });

    test('Should provide code suggestions', async () => {
        const code = `
            MappSdk.setAlias("test");
        `;

        const result = await aiAssistant.analyzeCode(code);
        assert.ok(result);
    });

    test('Should generate quick fixes', async () => {
        const code = `
            engage("key");
        `;

        const fixes = await aiAssistant.getQuickFix(code, 'Missing required parameters');
        assert.ok(fixes.length > 0);
        assert.ok(fixes[0].includes('engage("key",'));
    });
});