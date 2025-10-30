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
            example: 'MappSdk.isReady();',
            requiresInitialization: true,
            description: 'Check if MappSdK.isReady() is being called at all in the developers code and flag if it is not there since this is recommended.',
            success_message: 'isReady called',
            warning_message: 'isReady not used (Recommended)',
            error_message: null,
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
            description: 'Check if the MappSdk.setAlias() has been called or not. The argument is a string. | Check if setAliasWithResend() has been called or not. This method has 2 arguments, one a s string and another is a boolean',
            success_message: null,
            warning_message: 'SetAlias is used incorrectly',
            error_message: 'SetAlias is not used',
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
            example: 'MappSdk.setPushEnabled(true) //boolean input supported',
            requiresInitialization: true,
            description: 'Check if the code has MappSdk.setPushEnabled(true) to ensure that the user gets the push notifications as expected. If it is not present, then flag it',
            success_message: 'setPushEnabled is called',
            warning_message: 'setPushEnabled is called incorrectly',
            error_message: 'setPushEnabled is not called',
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
        },
        engage: {
            required: true,
            parameters: {
                sdkKey: {
                    type: 'string',
                    required: true,
                    description: 'this is the authentication key and identifies the user and the channel in Mapp Engage system'
                },
                googleProjectId: {
                    type: 'string',
                    required: true,
                    description: 'id from google project. Can be empty string for backward compatibility'
                },
                SERVER: {
                    type: 'enum',
                    required: true,
                    description: 'Server for engagement (L3, L3_US, EMC, EMC_US, CROC)',
                    validValues: ['L3', 'L3_US', 'EMC', 'EMC_US', 'CROC']
                },
                appID: {
                    type: 'string',
                    required: true,
                    description: 'application id, provided by Mapp Engage system'
                },
                tenantID: {
                    type: 'string',
                    required: true,
                    description: 'customer id, provided by Mapp Engage system'
                }
            },
            example: 'await MappSdk.engage(appConfig.sdkKey,"",appConfig.server,appConfig.appID,appConfig.tenantID); ',
            requiresInitialization: false,
            description: 'Engage method should always be the first method before any other Mapp functions . This is to initialise Mapp SDK | Check engage method should be setup correctly | Check if the code imports Mapp SDK to be able to use engage function | Check if the code has MappSdk.isReady() method implemented. This method can be called before the implementation of functions like setAlias(), setAliasWithResend(), or any other function except engage()',
            success_message: 'Correct usage of Engage method',
            warning_message: 'isReady not used (Recommended)',
            error_message: 'Incorrect implementation of Engage method',
        }
    },
    requiredMethods: [
        'engage'
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