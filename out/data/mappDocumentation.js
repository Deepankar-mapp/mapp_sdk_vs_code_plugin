"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAPP_SDK_DOCUMENTATION = void 0;
exports.MAPP_SDK_DOCUMENTATION = {
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
    "googleProjectId", // can be empty string
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
            example: 'bool isRegistered = await MappSdk.isReady()',
            requiresInitialization: true,
            description: 'Check if the device is registered in Mapp'
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
            parameters: {
                alias: {
                    type: 'string',
                    required: true,
                    description: 'User alias identifier'
                }
            },
            example: 'await MappSdk.setAlias("userAlias")',
            requiresInitialization: true,
            description: 'Set device alias'
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
            parameters: {
                enabled: {
                    type: 'boolean',
                    required: true,
                    description: 'Enable or disable push notifications'
                }
            },
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
    requiredMethods: [
        'isReady',
        'getAlias',
        'setAlias',
        'isPushEnabled',
        'setPushEnabled',
        'handledPushOpen'
    ],
    geofencingMethods: [
        'startGeoFencing',
        'stopGeoFencing'
    ],
    conflictingVendors: {
        pushNotifications: [
            'OneSignal',
            'Firebase Cloud Messaging (direct implementation)',
            'Pushwoosh',
            'Urban Airship'
        ],
        warning: 'Using multiple push notification providers can cause conflicts. Please use Mapp SDK exclusively for push notifications or contact Mapp Support for integration guidance.'
    },
    bestPractices: [
        'Initialize SDK at application startup using engage method',
        'Handle iOS specific configuration in AppoxeeCofig.plist',
        'Always check device registration with isReady()',
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
    implementationSteps: [
        'Add SDK dependency to pubspec.yaml',
        'Initialize SDK in main.dart',
        'Setup error handling',
        'Implement user identification',
        'Configure push notifications',
        'Setup iOS specific configuration in AppoxeeCofig.plist',
        'Configure push notification handlers',
        'Implement deep linking if required'
    ]
};
//# sourceMappingURL=mappDocumentation.js.map