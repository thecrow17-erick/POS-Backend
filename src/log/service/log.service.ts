import { Injectable } from '@nestjs/common';
import * as appInsights from 'applicationinsights';
import { log_Interface } from '../interface/log-create-dto';
@Injectable()
export class LogService {
  private client: appInsights.TelemetryClient;
  private appId: string;
  private apiKey: string;
  constructor() {
    appInsights
      .setup(
        'InstrumentationKey=a4b935f8-b2d1-4649-a8cc-d87cc29615dc;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus.livediagnostics.monitor.azure.com/;ApplicationId=39c073a4-c6b6-49bb-aa3d-60ce5bcbeb46',
      )
      .setAutoDependencyCorrelation(true)
      .setAutoCollectRequests(true)
      .setAutoCollectPerformance(true, true)
      .setAutoCollectExceptions(true)
      .setAutoCollectDependencies(true)
      .setAutoCollectConsole(true)
      .setUseDiskRetryCaching(true)
      .setSendLiveMetrics(false)
      .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
      .start(); // Reemplaza con tu clave de instrumentación de Application Insights
    this.client = appInsights.defaultClient;
  }

  log({
    idTenant,
    idUsuario,
    accion,
    fechaHora,
    ipAddress,
    message,
    username,
  }: log_Interface) {
    this.client.trackTrace({
      message,
      properties: {
        ID_TENANT: idTenant,
        ID_USUARIO: idUsuario,
        USERNAME: username,
        ACCION: accion,
        FECHA_HORA: fechaHora,
        IP_ADDRESS: ipAddress,
      },
    });
  }
}
