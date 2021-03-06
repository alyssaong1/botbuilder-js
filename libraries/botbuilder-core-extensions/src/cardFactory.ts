/**
 * @module botbuilder
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { 
    Attachment, MediaUrl, CardAction, AnimationCard, CardImage, HeroCard, 
    ReceiptCard, SigninCard, ThumbnailCard, VideoCard, ActionTypes 
} from "botbuilder-core";

/**
 * :package: **botbuilder-core-extensions**
 * 
 * A set of utility functions designed to assist with the formatting of the various card types a
 * bot can return. All of these functions return an `Attachment` which can be added to an `Activity`
 * directly or passed as input to a `MessageStyler` function.
 *
 * **Usage Example**
 *
 * ```javascript
 * const card = CardFactory.heroCard(
 *      'White T-Shirt',
 *      ['https://example.com/whiteShirt.jpg'],
 *      ['buy']
 * );
 * ```
 */
export class CardFactory {
    /** List of content types for each card style. */
    static contentTypes = {
        adaptiveCard: 'application/vnd.microsoft.card.adaptive',
        animationCard: 'application/vnd.microsoft.card.animation',
        audioCard: 'application/vnd.microsoft.card.audio',
        heroCard: 'application/vnd.microsoft.card.hero',
        receiptCard: 'application/vnd.microsoft.card.receipt',
        signinCard: 'application/vnd.microsoft.card.signin',
        thumbnailCard: 'application/vnd.microsoft.card.thumbnail',
        videoCard: 'application/vnd.microsoft.card.video'
    };

    /**
     * Returns an attachment for an adaptive card. The attachment will contain the card and the
     * appropriate `contentType`.
     *
     * Adaptive Cards are a new way for bots to send interactive and immersive card content to
     * users. For channels that don't yet support Adaptive Cards natively, the Bot Framework will
     * down render the card to an image that's been styled to look good on the target channel. For
     * channels that support [hero cards](#herocards) you can continue to include Adaptive Card
     * actions and they will be sent as buttons along with the rendered version of the card.
     *
     * For more information about Adaptive Cards and to download the latest SDK, visit
     * [adaptivecards.io](http://adaptivecards.io/).
     *
     * @param card The adaptive card to return as an attachment.
     */
    static adaptiveCard(card: any): Attachment
    {
        return { contentType: CardFactory.contentTypes.adaptiveCard, content: card };
    }

    /**
     * Returns an attachment for an animation card.
     *
     * @param title The cards title.
     * @param media Media URL's for the card.
     * @param buttons (Optional) set of buttons to include on the card.
     * @param other (Optional) additional properties to include on the card.
     */
    static animationCard(title: string,
                         media: (MediaUrl|string)[],
                         buttons?: (CardAction|string)[],
                         other?: Partial<AnimationCard>): Attachment
    {
        return mediaCard(CardFactory.contentTypes.animationCard, title, media, buttons, other);
    }

    /**
     * Returns an attachment for an audio card.
     *
     * @param title The cards title.
     * @param media Media URL's for the card.
     * @param buttons (Optional) set of buttons to include on the card.
     * @param other (Optional) additional properties to include on the card.
     */
    static audioCard(title: string,
                     media: (MediaUrl|string)[],
                     buttons?: (CardAction|string)[],
                     other?: Partial<AnimationCard>): Attachment
    {
        return mediaCard(CardFactory.contentTypes.audioCard, title, media, buttons, other);
    }

    /**
     * Returns an attachment for a hero card. Hero cards tend to have one dominant full width image
     * and the cards text & buttons can usually be found below the image.
     *
     * @param title The cards title.
     * @param text (Optional) text field for the card.
     * @param images (Optional) set of images to include on the card.
     * @param buttons (Optional) set of buttons to include on the card.
     * @param other (Optional) additional properties to include on the card.
     */
    static heroCard(title: string, images?: (CardImage|string)[], buttons?: (CardAction|string)[], other?: Partial<HeroCard>): Attachment;
    static heroCard(title: string, text: string, images?: (CardImage|string)[], buttons?: (CardAction|string)[], other?: Partial<HeroCard>): Attachment;
    static heroCard(title: string, text?: any, images?: any, buttons?: any, other?: Partial<HeroCard>): Attachment {
        const a = CardFactory.thumbnailCard(title, text, images, buttons, other);
        a.contentType = CardFactory.contentTypes.heroCard;
        return a;
    }

    /**
     * Returns an attachment for a receipt card. The attachment will contain the card and the
     * appropriate `contentType`.
     *
     * @param card The adaptive card to return as an attachment.
     */
    static receiptCard(card: ReceiptCard): Attachment
    {
        return { contentType: CardFactory.contentTypes.receiptCard, content: card };
    }

    /**
     * Returns an attachment for a signin card. For channels that don't natively support signin
     * cards an alternative message will be rendered.
     *
     * @param title The cards title.
     * @param url The link to the signin page the user needs to visit.
     * @param text (Optional) additional text to include on the card.
     */
    static signinCard(title: string, url: string, text?: string): Attachment {
        const card: SigninCard = { buttons: [{ type: ActionTypes.Signin, title: title, value: url }] };
        if (text) { card.text = text; }
        return { contentType: CardFactory.contentTypes.signinCard, content: card };
    }

    /**
     * Returns an attachment for a thumbnail card. Thumbnail cards are similar to [hero cards](#herocard)
     * but instead of a full width image, they're typically rendered with a smaller thumbnail version of
     * the image on either side and the text will be rendered in column next to the image. Any buttons
     * will typically show up under the card.
     *
     * @param title The cards title.
     * @param text (Optional) text field for the card.
     * @param images (Optional) set of images to include on the card.
     * @param buttons (Optional) set of buttons to include on the card.
     * @param other (Optional) additional properties to include on the card.
     */
    static thumbnailCard(title: string, images?: (CardImage|string)[], buttons?: (CardAction|string)[], other?: Partial<ThumbnailCard>): Attachment;
    static thumbnailCard(title: string, text: string, images?: (CardImage|string)[], buttons?: (CardAction|string)[], other?: Partial<ThumbnailCard>): Attachment;
    static thumbnailCard(title: string, text?: any, images?: any, buttons?: any, other?: Partial<ThumbnailCard>): Attachment {
        if (typeof text !== 'string') {
            other = buttons;
            buttons = images;
            images = text;
            text = undefined;
        }
        const card: Partial<ThumbnailCard> = Object.assign({}, other);
        if (title) { card.title = title; }
        if (text) { card.text = text; }
        if (images) { card.images = CardFactory.images(images); }
        if (buttons) { card.buttons = CardFactory.actions(buttons); }
        return { contentType: CardFactory.contentTypes.thumbnailCard, content: card };
    }

    /**
     * Returns an attachment for a video card.
     *
     * @param title The cards title.
     * @param media Media URL's for the card.
     * @param buttons (Optional) set of buttons to include on the card.
     * @param other (Optional) additional properties to include on the card.
     */
    static videoCard(title: string,
                     media: (MediaUrl|string)[],
                     buttons?: (CardAction|string)[],
                     other?: Partial<AnimationCard>): Attachment
    {
        return mediaCard(CardFactory.contentTypes.videoCard, title, media, buttons, other);
    }

    /**
     * Returns a properly formatted array of actions. Supports converting strings to `messageBack`
     * actions (note: using 'imBack' for now as 'messageBack' doesn't work properly in emulator.)
     *
     * @param actions Array of card actions or strings. Strings will be converted to `messageBack` actions.
     */
    static actions(actions: (CardAction|string)[]|undefined): CardAction[] {
        const list: CardAction[] = [];
        (actions || []).forEach((a) => {
            if (typeof a === 'object') {
                list.push(a);
            } else {
                list.push({ type: ActionTypes.ImBack, value: a.toString(), title: a.toString() });
            }
        });
        return list;
    }

    /**
     * Returns a properly formatted array of card images.
     *
     * @param images Array of card images or strings. Strings will be converted to card images.
     */
    static images(images: (CardImage|string)[]|undefined): CardImage[] {
        const list: CardImage[] = [];
        (images || []).forEach((img) => {
            if (typeof img === 'object') {
                list.push(img);
            } else {
                list.push({ url: img });
            }
        });
        return list;
    }

    /**
     * Returns a properly formatted array of media url objects.
     *
     * @param links Array of media url objects or strings. Strings will be converted to a media url object.
     */
    static media(links: (MediaUrl|string)[]|undefined): MediaUrl[] {
        const list: MediaUrl[] = [];
        (links || []).forEach((lnk) => {
            if (typeof lnk === 'object') {
                list.push(lnk);
            } else {
                list.push({ url: lnk });
            }
        });
        return list;
    }
}

function mediaCard(contentType: string,
                   title: string,
                   media: (MediaUrl|string)[],
                   buttons?: (CardAction|string)[],
                   other?: any): Attachment
{
    const card: VideoCard = Object.assign({}, other);
    if (title) { card.title = title; }
    card.media = CardFactory.media(media);
    if (buttons) { card.buttons = CardFactory.actions(buttons); }
    return { contentType: contentType, content: card };
}
