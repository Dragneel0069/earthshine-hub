/**
 * Utility functions for exporting data as CSV or Excel-compatible formats.
 */

export interface ExportColumn {
  header: string;
  key: string;
}

/**
 * Convert data array to CSV string
 */
export function toCSV(data: Record<string, any>[], columns: ExportColumn[]): string {
  const header = columns.map((c) => `"${c.header}"`).join(',');
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = row[c.key] ?? '';
        // Escape double quotes and wrap in quotes
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(',')
  );
  return [header, ...rows].join('\r\n');
}

/**
 * Convert data to Excel-compatible XML (opens natively in Excel)
 */
export function toExcelXML(data: Record<string, any>[], columns: ExportColumn[], sheetName = 'Sheet1'): string {
  const escapeXML = (val: any) =>
    String(val ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const headerCells = columns
    .map((c) => `<Cell ss:StyleID="header"><Data ss:Type="String">${escapeXML(c.header)}</Data></Cell>`)
    .join('');

  const dataRows = data
    .map((row) => {
      const cells = columns
        .map((c) => {
          const val = row[c.key] ?? '';
          const type = typeof val === 'number' ? 'Number' : 'String';
          return `<Cell><Data ss:Type="${type}">${escapeXML(val)}</Data></Cell>`;
        })
        .join('');
      return `<Row>${cells}</Row>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="header">
   <Font ss:Bold="1"/>
   <Interior ss:Color="#059669" ss:Pattern="Solid"/>
   <Font ss:Color="#FFFFFF" ss:Bold="1"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="${escapeXML(sheetName)}">
  <Table>
   <Row>${headerCells}</Row>
   ${dataRows}
  </Table>
 </Worksheet>
</Workbook>`;
}

/**
 * Trigger a file download in the browser
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data as CSV file
 */
export function exportCSV(data: Record<string, any>[], columns: ExportColumn[], filename: string) {
  const csv = toCSV(data, columns);
  downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export data as Excel file (.xls)
 */
export function exportExcel(data: Record<string, any>[], columns: ExportColumn[], filename: string, sheetName?: string) {
  const xml = toExcelXML(data, columns, sheetName);
  downloadFile(xml, `${filename}.xls`, 'application/vnd.ms-excel');
}
