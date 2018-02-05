/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 *
 * Code generated by Microsoft (R) AutoRest Code Generator.
 * Changes may cause incorrect behavior and will be lost if the code is
 * regenerated.
 */

'use strict';

/**
 * Set of key-value pairs. Advantage of this section is that key and value
 * properties will be
 * rendered with default style information with some delimiter between them. So
 * there is no need for developer to specify style information.
 *
 */
class Fact {
  /**
   * Create a Fact.
   * @member {string} [key] The key for this Fact
   * @member {string} [value] The value for this Fact
   */
  constructor() {
  }

  /**
   * Defines the metadata of Fact
   *
   * @returns {object} metadata of Fact
   *
   */
  mapper() {
    return {
      required: false,
      serializedName: 'Fact',
      type: {
        name: 'Composite',
        className: 'Fact',
        modelProperties: {
          key: {
            required: false,
            serializedName: 'key',
            type: {
              name: 'String'
            }
          },
          value: {
            required: false,
            serializedName: 'value',
            type: {
              name: 'String'
            }
          }
        }
      }
    };
  }
}

module.exports = Fact;