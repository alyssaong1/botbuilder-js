/**
 * Copyright (c) Microsoft Corporation. All rights reserved.  
 * Licensed under the MIT License.
 */
export interface BotCredentials {
    appId?: string;
    appPassword?: string;
}

export interface BotAuthenticatorSettings extends BotCredentials {
    endpoint?: BotConnectorEndpoint;
    openIdMetadata?: string;
}

export interface BotConnectorEndpoint {
    refreshEndpoint: string;
    refreshScope: string;
    botConnectorOpenIdMetadata: string;
    botConnectorIssuer: string;
    botConnectorAudience: string;
    emulatorOpenIdMetadata: string;
    emulatorAuthV31IssuerV1: string;
    emulatorAuthV31IssuerV2: string;
    emulatorAuthV32IssuerV1: string;
    emulatorAuthV32IssuerV2: string;
    emulatorAudience: string;
}

export const AuthSettings = {
    refreshEndpoint: 'https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token',
    refreshScope: 'https://api.botframework.com/.default',
    botConnectorOpenIdMetadata: 'https://login.botframework.com/v1/.well-known/openidconfiguration',
    botConnectorIssuer: 'https://api.botframework.com',
    emulatorOpenIdMetadata: 'https://login.microsoftonline.com/botframework.com/v2.0/.well-known/openid-configuration',
    emulatorAuthV31IssuerV1: 'https://sts.windows.net/d6d49420-f39b-4df7-a1dc-d59a935871db/',
    emulatorAuthV31IssuerV2: 'https://login.microsoftonline.com/d6d49420-f39b-4df7-a1dc-d59a935871db/v2.0',
    emulatorAuthV32IssuerV1: 'https://sts.windows.net/f8cdef31-a31e-4b4a-93e4-5f571e91255a/',
    emulatorAuthV32IssuerV2: 'https://login.microsoftonline.com/f8cdef31-a31e-4b4a-93e4-5f571e91255a/v2.0'
};
