/**
 * @module botbuilder-stylers
 */
/** second comment block */
import { Activity } from 'botbuilder';
declare global  {
    interface BotContextExtensions {
        /**
         * Queues a new "message" or activity to the [responses](#responses) array.
         *
         * **Usage Example**
         *
         * ```js
         * context.reply(`Let's flip a coin. Would you like heads or tails?`, `heads or tails?`);
         * ```
         *
         * @param textOrActivity Text of a message or an activity object to send to the user.
         * @param speak (Optional) SSML that should be spoken to the user on channels that support speech.
         * @param additional (Optional) other activities fields, like attachments, that should be sent with the activity.
         */
        reply(textOrActivity: string, speak: string, additional?: Partial<Activity>): this;
        reply(textOrActivity: string, additional?: Partial<Activity>): this;
        reply(textOrActivity: Partial<Activity>): this;
        /**
         * Queues a new "delay" activity to the [responses](#responses) array. This will
         * cause a pause to occur before delivering additional queued responses to the user.
         *
         * If your bot send a message with images and then immediately sends a message without
         * images, you run the risk of the client displaying your messages out of order. The
         * reason being that most clients want to copy the images you sent to a CDN for faster
         * rendering in the future.
         *
         * You can often avoid out of order messages by inserting a delay between the message
         * with images and the one without.
         *
         * **Usage Example**
         *
         * ```js
         * context.reply(hotelsFound)
         *        .delay(2000)
         *        .reply(`Would you like to see more results?`);
         * ```
         *
         * @param duration Number of milliseconds to pause.
         */
        delay(duration: number): this;
        /**
         * Queues a new "endOfConversation" activity that will be sent to the channel. This
         * is often used by skill based channels to signal that the skill is finished.
         *
         * **Usage Example**
         *
         * ```js
         * context.reply(weatherForecast)
         *        .endOfConversation();
         * ```
         *
         * @param duration Number of milliseconds to pause.
         * @param code (Optional) code indicating the reason why the conversation is being ended.
         * The default value is `EndOfConversationCodes.completedSuccessfully`.
         */
        endOfConversation(code?: string): this;
        /**
         * Queues a new "typing" activity to the [responses](#responses) array. On supported
         * channels this will display a typing indicator which can be used to convey to the
         * user that activity is occurring within the bot. This indicator is typically only
         * displayed to the user for 3 - 5 seconds so the bot should periodically send additional
         * "typing" activities for longer running operations.
         *
         * **Usage Example**
         *
         * ```js
         * context.showTyping(1000)
         *        .reply(`It was a dark and stormy night.`);
         * ```
         */
        showTyping(): this;
    }
}