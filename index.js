/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

import configureAmplify from './src/services/servicesCongig';

// Call services configuration
configureAmplify();

AppRegistry.registerComponent(appName, () => App);
