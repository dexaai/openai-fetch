import { APIResource } from '../../resource.js';
import * as JobsAPI from '../../resources/fine-tuning/jobs.js';
export declare class FineTuning extends APIResource {
    jobs: JobsAPI.Jobs;
}
export declare namespace FineTuning {
    export import Jobs = JobsAPI.Jobs;
    export import FineTuningJob = JobsAPI.FineTuningJob;
    export import FineTuningJobEvent = JobsAPI.FineTuningJobEvent;
    export import FineTuningJobsPage = JobsAPI.FineTuningJobsPage;
    export import FineTuningJobEventsPage = JobsAPI.FineTuningJobEventsPage;
    export import JobCreateParams = JobsAPI.JobCreateParams;
    export import JobListParams = JobsAPI.JobListParams;
    export import JobListEventsParams = JobsAPI.JobListEventsParams;
}
//# sourceMappingURL=fine-tuning.d.ts.map