import { TechnologyRules } from '../../models/technology';

export const reactNativeRules: TechnologyRules = {
    name: 'React Native',
    fileExtensions: ['.jsx', '.tsx', '.js', '.ts'],
    documentation: {
        initialization: {
            required: true,
            method: 'initialize',
            parameters: {
                sdkKey: {
                    type: 'string',
                    required: true,
                    description: 'The SDK ID for your account'
                },
                options: {
                    type: 'object',
                    required: true,
                    description: 'Configuration options for the SDK',
                    validValues: undefined
                }
            },
            example: `import MappSdk from '@mapp/react-native-sdk';

await MappSdk.initialize({
  sdkKey: "your-sdk-key",
  server: "L3",
  appId: "your-app-id",
  tenantId: "your-tenant-id"
});`
        },
        methods: {
            initialize: {
                required: true,
                parameters: {
                    config: {
                        type: 'object',
                        required: true,
                        description: 'SDK configuration object'
                    }
                },
                example: 'await MappSdk.initialize(config)',
                requiresInitialization: false,
                description: 'Initialize the Mapp SDK'
            }
        },
        bestPractices: [
            'Initialize SDK in app root component',
            'Handle initialization errors properly',
            'Check initialization status before using other methods'
        ],
        errorHandling: {
            recommendations: [
                'Wrap SDK calls in try-catch blocks',
                'Handle initialization failures gracefully'
            ],
            example: `try {
  await MappSdk.initialize(config);
} catch (error) {
  console.error('Mapp SDK initialization failed:', error);
}`
        },
        requiredMethods: ['initialize', 'isPushEnabled', 'setPushEnabled']
    },
    methodPatterns: {
        initialize: /MappSdk\.initialize\s*\(/,
        isPushEnabled: /MappSdk\.isPushEnabled\s*\(/,
        setPushEnabled: /MappSdk\.setPushEnabled\s*\(/
    },
    codeExamples: {
        basicSetup: `import MappSdk from '@mapp/react-native-sdk';

export async function setupMappSdk() {
  try {
    await MappSdk.initialize({
      sdkKey: "your-sdk-key",
      server: "L3",
      appId: "your-app-id",
      tenantId: "your-tenant-id"
    });
  } catch (error) {
    console.error('Failed to initialize Mapp SDK:', error);
  }
}`,
        pushNotifications: `// Check push notification status
const enabled = await MappSdk.isPushEnabled();

// Enable/disable push notifications
await MappSdk.setPushEnabled(true);`,
    }
};