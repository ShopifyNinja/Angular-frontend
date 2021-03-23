import { Injectable } from '@angular/core';

import { AppMonitoringService } from './app-monitoring.service';

@Injectable()
export class ErrorHandlerService extends ErrorHandler {

    constructor(private appMonitoringService: AppMonitoringService) {
        super();
    }

    handleError(error: Error) {
        this.loggingService.logException(error); // Manually log exception
    }
}
