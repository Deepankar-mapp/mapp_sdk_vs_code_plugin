import { TechnologyRules } from '../../models/technology';

export const androidJavaRules: TechnologyRules = {
    name: 'Android (Java)',
    fileExtensions: ['.java'],
    documentation: {
        initialization: {
            required: true,
            method: 'engage',
            parameters: {
                context: {
                    type: 'Context',
                    required: true,
                    description: 'Android application context'
                }
            },
            example: `MappSdk.engage(getApplicationContext(), config);`
        },
        methods: {
            engage: {
                required: true,
                parameters: {},
                example: `MappSdk.engage(context, config);`,
                requiresInitialization: false,
                description: 'Initialize the Mapp SDK'
            }
        },
        bestPractices: [
            'Initialize SDK in Application class',
            'Handle initialization errors properly'
        ],
        errorHandling: {
            recommendations: [
                'Use try-catch blocks around SDK calls',
                'Log initialization failures'
            ],
            example: `try {
    MappSdk.engage(context, config);
} catch (Exception e) {
    Log.e("MappSDK", "Failed to initialize: " + e.getMessage());
}`
        },
        requiredMethods: ['engage', 'isPushEnabled', 'setPushEnabled']
    },
    methodPatterns: {
        engage: /MappSdk\.engage\s*\(/,
        isPushEnabled: /MappSdk\.isPushEnabled\s*\(/,
        setPushEnabled: /MappSdk\.setPushEnabled\s*\(/
    },
    codeExamples: {
        basicSetup: `public class MainApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        initializeMappSdk();
    }

    private void initializeMappSdk() {
        try {
            MappConfig config = new MappConfig.Builder()
                .sdkKey("your-sdk-key")
                .server(Server.L3)
                .appId("your-app-id")
                .tenantId("your-tenant-id")
                .build();
            
            MappSdk.engage(getApplicationContext(), config);
        } catch (Exception e) {
            Log.e("MappSDK", "Failed to initialize: " + e.getMessage());
        }
    }
}`
    }
};