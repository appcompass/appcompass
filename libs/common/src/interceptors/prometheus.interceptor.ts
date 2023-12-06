import { Request, Response } from 'express';
import { Counter, Gauge, Histogram, Summary } from 'prom-client';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';

@Injectable()
export class PrometheusInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('request_total') private readonly counter: Counter<string>,
    @InjectMetric('request_duration_seconds')
    private readonly gauge: Gauge<string>,
    @InjectMetric('request_duration_histogram')
    private readonly histogram: Histogram<string>,
    @InjectMetric('request_duration_summary')
    private readonly summary: Summary<string>
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') return this.interceptHttp(context, next);
  }

  interceptHttp(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, path } = request;
    const labels = { method: method.toLowerCase(), path };
    const gaugeEnd = this.gauge.startTimer();
    const histogramEnd = this.histogram.startTimer();
    const summaryEnd = this.summary.startTimer();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>();
        this.handleResponse(response, labels, gaugeEnd, histogramEnd, summaryEnd);
      }),
      catchError((err) => {
        this.handleResponse(err.response, labels, gaugeEnd, histogramEnd, summaryEnd);
        return throwError(() => err);
      })
    );
  }

  handleResponse(
    response: Response,
    labels: Record<string, string | number>,
    gaugeEnd: (labels?: Partial<Record<string, string | number>>) => number,
    histogramEnd: (labels?: Partial<Record<string, string | number>>) => number,
    summaryEnd: (labels?: Partial<Record<string, string | number>>) => number
  ): void {
    labels.code = response?.statusCode;
    this.counter.inc(labels);
    gaugeEnd(labels);
    histogramEnd(labels);
    summaryEnd(labels);
  }
}
