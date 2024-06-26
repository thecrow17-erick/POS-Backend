import { Injectable } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { billReport } from './documents';
import { fetchImageBase64 } from 'src/helpers';

@Injectable()
export class ReportsService {

  constructor(private readonly printer: PrinterService) {}
  
  async getBillReport(body: any): Promise<PDFKit.PDFDocument> {
    if (body.logoUrl) {
      try {
        body.logoBase64 = await fetchImageBase64(body.logoUrl);
      } catch (error) {
        body.logoBase64 = null;
      }
    }
    const docDefinition = billReport(body);
    return this.printer.createPdf(docDefinition);
  }


}
