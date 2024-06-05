import { Injectable } from '@nestjs/common';
import * as appInsights from 'applicationinsights';
import { log_Interface } from '../interface/log-create-dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class LogService {
  private client: appInsights.TelemetryClient;
  constructor(
    private readonly configService:ConfigService
  ) {
    appInsights
      .setup(
        this.configService.get<string>("setup_insign"),
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
