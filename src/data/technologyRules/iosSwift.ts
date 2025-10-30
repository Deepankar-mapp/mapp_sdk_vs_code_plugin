import { TechnologyRules } from '../../models/technology';

export const iosSwiftRules: TechnologyRules = {
    name: 'iOS (Swift)',
    fileExtensions: ['.swift'],
    documentation: {
        initialization: {
            required: true,
            method: 'engage',
            parameters: {
                configuration: {
                    type: 'MappConfiguration',
                    required: true,
                    description: 'SDK configuration object'
                }
            },
            example: `MappSdk.shared.engage(with: config)`
        },
        methods: {
            engage: {
                required: true,
                parameters: {},
                example: 'MappSdk.shared.engage(with: config)',
                requiresInitialization: false,
                description: 'Initialize the Mapp SDK'
            }
        },
        bestPractices: [
            'Initialize SDK in AppDelegate',
            'Handle initialization errors properly'
        ],
        errorHandling: {
            recommendations: [
                'Use do-catch blocks around SDK calls',
                'Log initialization failures'
            ],
            example: `do {
    try MappSdk.shared.engage(with: config)
} catch {
    print("Mapp SDK initialization failed: \(error)")
}`
        },
        requiredMethods: ['engage', 'isPushEnabled', 'setPushEnabled']
    },
    methodPatterns: {
        engage: /MappSdk\.shared\.engage\s*\(/,
        isPushEnabled: /MappSdk\.shared\.isPushEnabled/,
        setPushEnabled: /MappSdk\.shared\.setPushEnabled/
    },
    codeExamples: {
        basicSetup: `func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    let config = MappConfiguration(
        sdkKey: "your-sdk-key",
        server: .L3,
        appId: "your-app-id",
        tenantId: "your-tenant-id"
    )
    
    do {
        try MappSdk.shared.engage(with: config)
    } catch {
        print("Mapp SDK initialization failed: \(error)")
    }
    
    return true
}`
    }
};