import { TechnologyRules } from '../../models/technology';

export const iosObjcRules: TechnologyRules = {
    name: 'iOS (Objective-C)',
    fileExtensions: ['.m', '.h'],
    documentation: {
        initialization: {
            required: true,
            method: 'engage',
            parameters: {
                config: {
                    type: 'MappConfig',
                    required: true,
                    description: 'SDK configuration'
                }
            },
            example: `[MappSdk engageWithConfig:config];`
        },
        methods: {
            engage: {
                required: true,
                parameters: {},
                example: `[MappSdk engageWithConfig:config];`,
                requiresInitialization: false,
                description: 'Initialize the Mapp SDK'
            }
        },
        bestPractices: [
            'Initialize SDK in AppDelegate',
            'Handle initialization errors'
        ],
        errorHandling: {
            recommendations: [
                'Use @try/@catch blocks',
                'Log errors appropriately'
            ],
            example: `@try {
    [MappSdk engageWithConfig:config];
} @catch (NSException *exception) {
    NSLog(@"Mapp SDK initialization failed: %@", exception);
}`
        },
        requiredMethods: ['engage', 'isPushEnabled', 'setPushEnabled']
    },
    methodPatterns: {
        engage: /\[MappSdk engageWithConfig:/,
        isPushEnabled: /\[MappSdk isPushEnabled\]/,
        setPushEnabled: /\[MappSdk setPushEnabled:/
    },
    codeExamples: {
        basicSetup: `@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    MappConfig *config = [[MappConfig alloc] initWithSdkKey:@"your-sdk-key"
                                                    server:MappServerL3
                                                     appId:@"your-app-id"
                                                 tenantId:@"your-tenant-id"];
    
    @try {
        [MappSdk engageWithConfig:config];
    } @catch (NSException *exception) {
        NSLog(@"Mapp SDK initialization failed: %@", exception);
    }
    
    return YES;
}

@end`
    }
};