import * as Core from 'openai/core';
import { APIPromise } from 'openai/core';
import { APIResource } from 'openai/resource';
import * as FineTunesAPI from 'openai/resources/fine-tunes';
import * as FilesAPI from 'openai/resources/files';
import { Page } from 'openai/pagination';
import { Stream } from 'openai/streaming';
export declare class FineTunes extends APIResource {
    /**
     * Creates a job that fine-tunes a specified model from a given dataset.
     *
     * Response includes details of the enqueued job including job status and the name
     * of the fine-tuned models once complete.
     *
     * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/legacy-fine-tuning)
     */
    create(body: FineTuneCreateParams, options?: Core.RequestOptions): Core.APIPromise<FineTune>;
    /**
     * Gets info about the fine-tune job.
     *
     * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/legacy-fine-tuning)
     */
    retrieve(fineTuneId: string, options?: Core.RequestOptions): Core.APIPromise<FineTune>;
    /**
     * List your organization's fine-tuning jobs
     */
    list(options?: Core.RequestOptions): Core.PagePromise<FineTunesPage, FineTune>;
    /**
     * Immediately cancel a fine-tune job.
     */
    cancel(fineTuneId: string, options?: Core.RequestOptions): Core.APIPromise<FineTune>;
    /**
     * Get fine-grained status updates for a fine-tune job.
     */
    listEvents(fineTuneId: string, query?: FineTuneListEventsParamsNonStreaming, options?: Core.RequestOptions): APIPromise<FineTuneEventsListResponse>;
    listEvents(fineTuneId: string, query: FineTuneListEventsParamsStreaming, options?: Core.RequestOptions): APIPromise<Stream<FineTuneEvent>>;
    listEvents(fineTuneId: string, query?: FineTuneListEventsParamsBase | undefined, options?: Core.RequestOptions): APIPromise<Stream<FineTuneEvent> | FineTuneEventsListResponse>;
}
/**
 * Note: no pagination actually occurs yet, this is for forwards-compatibility.
 */
export declare class FineTunesPage extends Page<FineTune> {
}
/**
 * The `FineTune` object represents a legacy fine-tune job that has been created
 * through the API.
 */
export interface FineTune {
    /**
     * The object identifier, which can be referenced in the API endpoints.
     */
    id: string;
    /**
     * The Unix timestamp (in seconds) for when the fine-tuning job was created.
     */
    created_at: number;
    /**
     * The name of the fine-tuned model that is being created.
     */
    fine_tuned_model: string | null;
    /**
     * The hyperparameters used for the fine-tuning job. See the
     * [fine-tuning guide](https://platform.openai.com/docs/guides/legacy-fine-tuning/hyperparameters)
     * for more details.
     */
    hyperparams: FineTune.Hyperparams;
    /**
     * The base model that is being fine-tuned.
     */
    model: string;
    /**
     * The object type, which is always "fine-tune".
     */
    object: 'fine-tune';
    /**
     * The organization that owns the fine-tuning job.
     */
    organization_id: string;
    /**
     * The compiled results files for the fine-tuning job.
     */
    result_files: Array<FilesAPI.FileObject>;
    /**
     * The current status of the fine-tuning job, which can be either `created`,
     * `running`, `succeeded`, `failed`, or `cancelled`.
     */
    status: string;
    /**
     * The list of files used for training.
     */
    training_files: Array<FilesAPI.FileObject>;
    /**
     * The Unix timestamp (in seconds) for when the fine-tuning job was last updated.
     */
    updated_at: number;
    /**
     * The list of files used for validation.
     */
    validation_files: Array<FilesAPI.FileObject>;
    /**
     * The list of events that have been observed in the lifecycle of the FineTune job.
     */
    events?: Array<FineTuneEvent>;
}
export declare namespace FineTune {
    /**
     * The hyperparameters used for the fine-tuning job. See the
     * [fine-tuning guide](https://platform.openai.com/docs/guides/legacy-fine-tuning/hyperparameters)
     * for more details.
     */
    interface Hyperparams {
        /**
         * The batch size to use for training. The batch size is the number of training
         * examples used to train a single forward and backward pass.
         */
        batch_size: number;
        /**
         * The learning rate multiplier to use for training.
         */
        learning_rate_multiplier: number;
        /**
         * The number of epochs to train the model for. An epoch refers to one full cycle
         * through the training dataset.
         */
        n_epochs: number;
        /**
         * The weight to use for loss on the prompt tokens.
         */
        prompt_loss_weight: number;
        /**
         * The number of classes to use for computing classification metrics.
         */
        classification_n_classes?: number;
        /**
         * The positive class to use for computing classification metrics.
         */
        classification_positive_class?: string;
        /**
         * The classification metrics to compute using the validation dataset at the end of
         * every epoch.
         */
        compute_classification_metrics?: boolean;
    }
}
/**
 * Fine-tune event object
 */
export interface FineTuneEvent {
    created_at: number;
    level: string;
    message: string;
    object: 'fine-tune-event';
}
export interface FineTuneEventsListResponse {
    data: Array<FineTuneEvent>;
    object: 'list';
}
export interface FineTuneCreateParams {
    /**
     * The ID of an uploaded file that contains training data.
     *
     * See [upload file](https://platform.openai.com/docs/api-reference/files/upload)
     * for how to upload a file.
     *
     * Your dataset must be formatted as a JSONL file, where each training example is a
     * JSON object with the keys "prompt" and "completion". Additionally, you must
     * upload your file with the purpose `fine-tune`.
     *
     * See the
     * [fine-tuning guide](https://platform.openai.com/docs/guides/legacy-fine-tuning/creating-training-data)
     * for more details.
     */
    training_file: string;
    /**
     * The batch size to use for training. The batch size is the number of training
     * examples used to train a single forward and backward pass.
     *
     * By default, the batch size will be dynamically configured to be ~0.2% of the
     * number of examples in the training set, capped at 256 - in general, we've found
     * that larger batch sizes tend to work better for larger datasets.
     */
    batch_size?: number | null;
    /**
     * If this is provided, we calculate F-beta scores at the specified beta values.
     * The F-beta score is a generalization of F-1 score. This is only used for binary
     * classification.
     *
     * With a beta of 1 (i.e. the F-1 score), precision and recall are given the same
     * weight. A larger beta score puts more weight on recall and less on precision. A
     * smaller beta score puts more weight on precision and less on recall.
     */
    classification_betas?: Array<number> | null;
    /**
     * The number of classes in a classification task.
     *
     * This parameter is required for multiclass classification.
     */
    classification_n_classes?: number | null;
    /**
     * The positive class in binary classification.
     *
     * This parameter is needed to generate precision, recall, and F1 metrics when
     * doing binary classification.
     */
    classification_positive_class?: string | null;
    /**
     * If set, we calculate classification-specific metrics such as accuracy and F-1
     * score using the validation set at the end of every epoch. These metrics can be
     * viewed in the
     * [results file](https://platform.openai.com/docs/guides/legacy-fine-tuning/analyzing-your-fine-tuned-model).
     *
     * In order to compute classification metrics, you must provide a
     * `validation_file`. Additionally, you must specify `classification_n_classes` for
     * multiclass classification or `classification_positive_class` for binary
     * classification.
     */
    compute_classification_metrics?: boolean | null;
    /**
     * The hyperparameters used for the fine-tuning job.
     */
    hyperparameters?: FineTuneCreateParams.Hyperparameters;
    /**
     * The learning rate multiplier to use for training. The fine-tuning learning rate
     * is the original learning rate used for pretraining multiplied by this value.
     *
     * By default, the learning rate multiplier is the 0.05, 0.1, or 0.2 depending on
     * final `batch_size` (larger learning rates tend to perform better with larger
     * batch sizes). We recommend experimenting with values in the range 0.02 to 0.2 to
     * see what produces the best results.
     */
    learning_rate_multiplier?: number | null;
    /**
     * The name of the base model to fine-tune. You can select one of "ada", "babbage",
     * "curie", "davinci", or a fine-tuned model created after 2022-04-21 and before
     * 2023-08-22. To learn more about these models, see the
     * [Models](https://platform.openai.com/docs/models) documentation.
     */
    model?: (string & {}) | 'ada' | 'babbage' | 'curie' | 'davinci' | null;
    /**
     * The weight to use for loss on the prompt tokens. This controls how much the
     * model tries to learn to generate the prompt (as compared to the completion which
     * always has a weight of 1.0), and can add a stabilizing effect to training when
     * completions are short.
     *
     * If prompts are extremely long (relative to completions), it may make sense to
     * reduce this weight so as to avoid over-prioritizing learning the prompt.
     */
    prompt_loss_weight?: number | null;
    /**
     * A string of up to 40 characters that will be added to your fine-tuned model
     * name.
     *
     * For example, a `suffix` of "custom-model-name" would produce a model name like
     * `ada:ft-your-org:custom-model-name-2022-02-15-04-21-04`.
     */
    suffix?: string | null;
    /**
     * The ID of an uploaded file that contains validation data.
     *
     * If you provide this file, the data is used to generate validation metrics
     * periodically during fine-tuning. These metrics can be viewed in the
     * [fine-tuning results file](https://platform.openai.com/docs/guides/legacy-fine-tuning/analyzing-your-fine-tuned-model).
     * Your train and validation data should be mutually exclusive.
     *
     * Your dataset must be formatted as a JSONL file, where each validation example is
     * a JSON object with the keys "prompt" and "completion". Additionally, you must
     * upload your file with the purpose `fine-tune`.
     *
     * See the
     * [fine-tuning guide](https://platform.openai.com/docs/guides/legacy-fine-tuning/creating-training-data)
     * for more details.
     */
    validation_file?: string | null;
}
export declare namespace FineTuneCreateParams {
    /**
     * The hyperparameters used for the fine-tuning job.
     */
    interface Hyperparameters {
        /**
         * The number of epochs to train the model for. An epoch refers to one full cycle
         * through the training dataset.
         */
        n_epochs?: 'auto' | number;
    }
}
export type FineTuneListEventsParams = FineTuneListEventsParamsNonStreaming | FineTuneListEventsParamsStreaming;
export interface FineTuneListEventsParamsBase {
    /**
     * Whether to stream events for the fine-tune job. If set to true, events will be
     * sent as data-only
     * [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format)
     * as they become available. The stream will terminate with a `data: [DONE]`
     * message when the job is finished (succeeded, cancelled, or failed).
     *
     * If set to false, only events generated so far will be returned.
     */
    stream?: boolean;
}
export declare namespace FineTuneListEventsParams {
    type FineTuneListEventsParamsNonStreaming = FineTunesAPI.FineTuneListEventsParamsNonStreaming;
    type FineTuneListEventsParamsStreaming = FineTunesAPI.FineTuneListEventsParamsStreaming;
}
export interface FineTuneListEventsParamsNonStreaming extends FineTuneListEventsParamsBase {
    /**
     * Whether to stream events for the fine-tune job. If set to true, events will be
     * sent as data-only
     * [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format)
     * as they become available. The stream will terminate with a `data: [DONE]`
     * message when the job is finished (succeeded, cancelled, or failed).
     *
     * If set to false, only events generated so far will be returned.
     */
    stream?: false;
}
export interface FineTuneListEventsParamsStreaming extends FineTuneListEventsParamsBase {
    /**
     * Whether to stream events for the fine-tune job. If set to true, events will be
     * sent as data-only
     * [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format)
     * as they become available. The stream will terminate with a `data: [DONE]`
     * message when the job is finished (succeeded, cancelled, or failed).
     *
     * If set to false, only events generated so far will be returned.
     */
    stream: true;
}
export declare namespace FineTunes {
    export import FineTune = FineTunesAPI.FineTune;
    export import FineTuneEvent = FineTunesAPI.FineTuneEvent;
    export import FineTuneEventsListResponse = FineTunesAPI.FineTuneEventsListResponse;
    export import FineTunesPage = FineTunesAPI.FineTunesPage;
    export import FineTuneCreateParams = FineTunesAPI.FineTuneCreateParams;
    export import FineTuneListEventsParams = FineTunesAPI.FineTuneListEventsParams;
    export import FineTuneListEventsParamsNonStreaming = FineTunesAPI.FineTuneListEventsParamsNonStreaming;
    export import FineTuneListEventsParamsStreaming = FineTunesAPI.FineTuneListEventsParamsStreaming;
}
//# sourceMappingURL=fine-tunes.d.ts.map