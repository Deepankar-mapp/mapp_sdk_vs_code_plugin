import { TechnologyRules, SupportedTechnology } from '../../models/technology';
import { flutterRules } from './flutter';
import { reactNativeRules } from './reactNative';
import { androidKotlinRules } from './androidKotlin';
import { androidJavaRules } from './androidJava';
import { iosObjcRules } from './iosObjc';
import { iosSwiftRules } from './iosSwift';

export const TechnologyRulesRegistry: Record<SupportedTechnology, TechnologyRules> = {
    'flutter': flutterRules,
    'react-native': reactNativeRules,
    'android-kotlin': androidKotlinRules,
    'android-java': androidJavaRules,
    'ios-objc': iosObjcRules,
    'ios-swift': iosSwiftRules
};