"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const cardFactory_1 = require("./cardFactory");
const botbuilder_core_1 = require("botbuilder-core");
/**
  * :package: **botbuilder-core-extensions**
 *
* A set of utility functions to assist with the formatting of the various message types a bot can
 * return.
 *
 * **Usage Example**
 *
 * ```JavaScript
 * // init message object
 * const message = MessageFactory.attachment(
 *     CardFactory.heroCard(
 *         'White T-Shirt',
 *         ['https://example.com/whiteShirt.jpg'],
 *         ['buy']
 *      )
 * );
 *
 * context.sendActivity(message); // send message
 * ```
 */
class MessageFactory {
    /**
     * Returns a simple text message.
     *
     * **Usage Example**
     *
     * ```JavaScript
     * // init message object
     * const basicMessage = MessageFactory.text('Greetings from example message');
     *
     * context.reply(basicMessage); // send message
     * ```
     *
     * @param text Text to include in the message.
     * @param speak (Optional) SSML to include in the message.
     * @param inputHint (Optional) input hint for the message.
     */
    static text(text, speak, inputHint) {
        const msg = {
            type: botbuilder_core_1.ActivityTypes.Message,
            text: text
        };
        if (speak) {
            msg.speak = speak;
        }
        if (inputHint) {
            msg.inputHint = inputHint;
        }
        return msg;
    }
    /**
     * Returns a message that includes a set of suggested actions and optional text.
     *
     * @param actions Array of card actions or strings to include. Strings will be converted to `messageBack` actions.
     * @param text (Optional) text of the message.
     * @param speak (Optional) SSML to include with the message.
     * @param inputHint (Optional) input hint for the message.
     */
    static suggestedActions(actions, text, speak, inputHint) {
        const msg = {
            type: botbuilder_core_1.ActivityTypes.Message,
            suggestedActions: {
                actions: cardFactory_1.CardFactory.actions(actions)
            }
        };
        if (text) {
            msg.text = text;
        }
        if (speak) {
            msg.speak = speak;
        }
        if (inputHint) {
            msg.inputHint = inputHint;
        }
        return msg;
    }
    /**
     * Returns a single message activity containing an attachment.
     *
     * @param attachment Adaptive card to include in the message.
     * @param text (Optional) text of the message.
     * @param speak (Optional) SSML to include with the message.
     * @param inputHint (Optional) input hint for the message.
     */
    static attachment(attachment, text, speak, inputHint) {
        return attachmentActivity(botbuilder_core_1.AttachmentLayoutTypes.List, [attachment], text, speak, inputHint);
    }
    /**
     * Returns a message that will display a set of attachments in list form.
     *
     * @param attachments Array of attachments to include in the message.
     * @param text (Optional) text of the message.
     * @param speak (Optional) SSML to include with the message.
     * @param inputHint (Optional) input hint for the message.
     */
    static list(attachments, text, speak, inputHint) {
        return attachmentActivity(botbuilder_core_1.AttachmentLayoutTypes.List, attachments, text, speak, inputHint);
    }
    /**
     * Returns a message that will display a set of attachments using a carousel layout.
     *
     * **Usage Example**
     *
     * ```JavaScript
     * // init message object
     * let messageWithCarouselOfCards = MessageFactory.carousel([
     *   CardFactory.heroCard('title1', ['imageUrl1'], ['button1']),
     *   CardFactory.heroCard('title2', ['imageUrl2'], ['button2']),
     *   CardFactory.heroCard('title3', ['imageUrl3'], ['button3'])
     * ]);
     *
     * context.reply(messageWithCarouselOfCards); // send the message
     * ```
     *
     * @param attachments Array of attachments to include in the message.
     * @param text (Optional) text of the message.
     * @param speak (Optional) SSML to include with the message.
     * @param inputHint (Optional) input hint for the message.
     */
    static carousel(attachments, text, speak, inputHint) {
        return attachmentActivity(botbuilder_core_1.AttachmentLayoutTypes.Carousel, attachments, text, speak, inputHint);
    }
    /**
     * Returns a message that will display a single image or video to a user.
     *
     * **Usage Example**
     *
     * ```JavaScript
     * // init message object
     * let imageOrVideoMessage = MessageFactory.contentUrl('url', 'content-type', 'optional-name', 'optional-text', 'optional-speak');
     *
     * context.reply(imageOrVideoMessage); // send the message
     * ```
     *
     * @param url Url of the image/video to send.
     * @param contentType The MIME type of the image/video.
     * @param name (Optional) Name of the image/video file.
     * @param text (Optional) text of the message.
     * @param speak (Optional) SSML to include with the message.
     * @param inputHint (Optional) input hint for the message.
     */
    static contentUrl(url, contentType, name, text, speak, inputHint) {
        const a = { contentType: contentType, contentUrl: url };
        if (name) {
            a.name = name;
        }
        return attachmentActivity(botbuilder_core_1.AttachmentLayoutTypes.List, [a], text, speak, inputHint);
    }
}
exports.MessageFactory = MessageFactory;
function attachmentActivity(attachmentLayout, attachments, text, speak, inputHint) {
    const msg = {
        type: botbuilder_core_1.ActivityTypes.Message,
        attachmentLayout: attachmentLayout,
        attachments: attachments
    };
    if (text) {
        msg.text = text;
    }
    if (speak) {
        msg.speak = speak;
    }
    if (inputHint) {
        msg.inputHint = inputHint;
    }
    return msg;
}
//# sourceMappingURL=messageFactory.js.map