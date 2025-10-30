import { TechnologyRules } from '../../models/technology';

export const androidKotlinRules: TechnologyRules = {
    name: 'Android (Kotlin)',
    fileExtensions: ['.kt'],
    documentation: {
        initialization: {
            required: true,
            method: 'engage',
            parameters: {
                context: {
                    type: 'Context',
                    required: true,
                    description: 'Android application context'
                },
                config: {
                    type: 'MappConfig',
                    required: true,
                    description: 'SDK configuration'
                }
            },
            example: `MappSdk.engage(context, config)`
        },
        methods: {
            engage: {
                required: true,
                parameters: {},
                example: 'MappSdk.engage(context, config)',
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
    MappSdk.engage(context, config)
} catch (exception: Exception) {
    Log.e("MappSDK", "Failed to initialize: \${exception.message}")
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
        basicSetup: `class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        initializeMappSdk()
    }

    private fun initializeMappSdk() {
        try {
            val config = MappConfig.Builder()
                .sdkKey("your-sdk-key")
                .server(Server.L3)
                .appId("your-app-id")
                .tenantId("your-tenant-id")
                .build()
            
            MappSdk.engage(applicationContext, config)
        } catch (exception: Exception) {
            Log.e("MappSDK", "Failed to initialize: \${exception.message}")
        }
    }
}`
    }
};