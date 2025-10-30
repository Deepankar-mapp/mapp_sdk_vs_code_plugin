import { TechnologyRules } from '../../models/technology';

export const flutterRules: TechnologyRules = {
    name: 'Flutter',
    fileExtensions: ['.dart'],
    documentation: {
        initialization: {
            required: true,
            method: 'engage',
            parameters: {
                sdkKey: {
                    type: 'string',
                    required: true,
                    description: 'The SDK ID for your account'
                },
                googleProjectId: {
                    type: 'string',
                    required: false,
                    description: 'Can be empty String. Only for backward compatibility'
                },
                server: {
                    type: 'SERVER',
                    required: true,
                    description: 'Server for engagement (L3, L3_US, EMC, EMC_US, CROC)',
                    validValues: ['L3', 'L3_US', 'EMC', 'EMC_US', 'CROC']
                },
                appId: {
                    type: 'string',
                    required: true,
                    description: 'Application ID'
                },
                tenantId: {
                    type: 'string',
                    required: true,
                    description: 'ID which recognizes you at the Mapp Engage system'
                }
            },
            example: `await MappSdk.engage(
    "sdkKey",
    "googleProjectId",
    SERVER.L3,
    "appId",
    "tenantId"
)`
        },
        methods: {
            logOut: {
                required: false,
                parameters: {
                    pushEnabled: {
                        type: 'boolean',
                        required: true,
                        description: 'Sets the state of receiving push messages while logging out'
                    }
                },
                example: 'await MappSdk.logOut(true)',
                requiresInitialization: true,
                description: 'Logs out the current user, with option to control push message state'
            },
            isReady: {
                required: false,
                parameters: {},
                example: 'await MappSdk.isReady()',
                requiresInitialization: true,
                description: 'Check if SDK is ready to use'
            },
            getAlias: {
                required: false,
                parameters: {},
                example: 'String alias = await MappSdk.getAlias()',
                requiresInitialization: true,
                description: 'Get device alias'
            },
            setAlias: {
                required: false,
                parameters: {},
                example: 'MappSdk.setAlias("your_alias"); ',
                requiresInitialization: true,
                description: 'Check if the MappSdk.setAlias() has been called or not. The argument is a string. | Check if setAliasWithResend() has been called or not. This method has 2 arguments, one a string and another is a boolean'
            },
            isPushEnabled: {
                required: true,
                parameters: {},
                example: 'bool enabled = await MappSdk.isPushEnabled()',
                requiresInitialization: true,
                description: 'Check if push notifications are enabled'
            },
            setPushEnabled: {
                required: true,
                parameters: {},
                example: 'await MappSdk.setPushEnabled(true)',
                requiresInitialization: true,
                description: 'Enable or disable push notifications'
            },
            handledPushOpen: {
                required: true,
                parameters: {},
                example: 'await MappSdk.handledPushOpen()',
                requiresInitialization: true,
                description: 'Must be called when a push notification is opened'
            },
            startGeoFencing: {
                required: false,
                parameters: {},
                example: 'await MappSdk.startGeoFencing()',
                requiresInitialization: true,
                description: 'Start geofencing services if location permissions are granted'
            },
            stopGeoFencing: {
                required: false,
                parameters: {},
                example: 'await MappSdk.stopGeoFencing()',
                requiresInitialization: true,
                description: 'Stop geofencing services'
            }
        },
        bestPractices: [
            'Initialize SDK at application startup using engage method',
            'Handle iOS specific configuration in AppoxeeCofig.plist',
            'Always check if plugin is initialized with isReady()',
            'Implement proper error handling with try-catch blocks',
            'Use appropriate server constant from the SERVER enum',
            'Handle push notification permissions appropriately',
            'Implement all required event handlers for push notifications'
        ],
        errorHandling: {
            recommendations: [
                'Wrap SDK calls in try-catch blocks',
                'Handle initialization failures gracefully',
                'Check isReady() before making other SDK calls',
                'Handle platform-specific differences (iOS vs Android)'
            ],
            example: `try {
    await MappSdk.engage(...);
} catch (error) {
    print('Mapp SDK error: $error');
}`
        },
        requiredMethods: ['engage', 'isPushEnabled', 'setPushEnabled', 'handledPushOpen']
    },
    methodPatterns: {
        engage: /MappSdk\.engage\s*\(/,
        isPushEnabled: /MappSdk\.isPushEnabled\s*\(/,
        setPushEnabled: /MappSdk\.setPushEnabled\s*\(/,
        handledPushOpen: /MappSdk\.handledPushOpen\s*\(/,
        isReady: /MappSdk\.isReady\s*\(/
    },
    codeExamples: {
        initialization: `
import 'package:mapp_sdk/mapp_sdk.dart';

Future<void> initializeMappSdk() async {
  try {
    await MappSdk.engage(
      "your-sdk-key",
      "your-google-project-id",
      SERVER.L3,
      "your-app-id",
      "your-tenant-id"
    );
  } catch (error) {
    print('Failed to initialize Mapp SDK: $error');
  }
}`,
        pushNotifications: `
// Check push notification status
bool isPushEnabled = await MappSdk.isPushEnabled();

// Enable/disable push notifications
await MappSdk.setPushEnabled(true);

// Handle push notification open
await MappSdk.handledPushOpen(message);`,
        errorHandling: `
try {
  final isReady = await MappSdk.isReady();
  if (isReady) {
    await MappSdk.setPushEnabled(true);
  }
} catch (error) {
  print('Mapp SDK error: $error');
}`,
        basicImplementation: `
class _MyAppState extends State<MyApp> {
  @override
  void initState() {
    super.initState();
    _initializeMappSdk();
  }

  Future<void> _initializeMappSdk() async {
    try {
      await MappSdk.engage(
        "sdk-key",
        "google-project-id",
        SERVER.L3,
        "app-id",
        "tenant-id"
      );
      await MappSdk.setPushEnabled(true);
    } catch (error) {
      print('Mapp SDK initialization failed: $error');
    }
  }
}`
    }
};