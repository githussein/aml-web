/**
 * generatePdf.ts
 *
 * Client-side PDF generation for AML screening reports.
 * Built with jsPDF — no backend required.
 *
 * To replace with server-side generation later, swap out this module:
 * accept the same `PdfReportData` input and POST it to an endpoint.
 */

import type { SearchResult } from '@/shared/types/sanctions';

// ---------------------------------------------------------------------------
// Report data shape — normalised before passing to the renderer
// ---------------------------------------------------------------------------

export interface PdfReportData {
  query: string;
  generatedAt: string;        // human-readable timestamp
  name: string;
  entityType?: string;
  sourceList: string;
  matchScore: number;          // 0–100 integer
  matchType: string;
  nationality?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  program?: string;
  aliases: string[];
  identifiers: { type: string; value: string; note?: string }[];
  remarks?: string;
  recordId: string;
}

/** Build a PdfReportData from a raw SearchResult + the search query. */
export function buildReportData(result: SearchResult, query: string): PdfReportData {
  const { record, score, matchType } = result;
  return {
    query,
    generatedAt: new Date().toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZoneName: 'short',
    }),
    name: record.name,
    entityType: record.type,
    sourceList: record.source === 'UN'
      ? 'UN Security Council Consolidated List'
      : 'UAE Terrorist List',
    matchScore: Math.round(score * 100),
    matchType,
    nationality: record.nationality,
    dateOfBirth: record.dateOfBirth,
    placeOfBirth: record.placeOfBirth,
    program: record.program,
    aliases: record.aliases,
    identifiers: record.identifiers,
    remarks: record.remarks,
    recordId: record.id,
  };
}

// ---------------------------------------------------------------------------
// PDF renderer
// ---------------------------------------------------------------------------

/** Generate and trigger a browser download of the screening PDF. */
export async function generateAndDownloadPdf(data: PdfReportData): Promise<void> {
  // Dynamic import keeps jsPDF out of the initial bundle
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN = 20;
  const CONTENT_W = PAGE_W - MARGIN * 2;

  let y = MARGIN; // current vertical cursor

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------

  function checkPageBreak(neededHeight: number) {
    if (y + neededHeight > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  }

  function drawHRule(color: [number, number, number] = [220, 220, 228]) {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 4;
  }

  /** Wraps text and returns rendered height. Advances y by that height. */
  function drawWrappedText(
    text: string,
    x: number,
    fontSize: number,
    fontStyle: 'normal' | 'bold' = 'normal',
    color: [number, number, number] = [30, 30, 46],
    maxWidth: number = CONTENT_W,
  ): number {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxWidth);
    const lineH = fontSize * 0.4; // mm per line (approx)
    const totalH = lines.length * lineH;
    checkPageBreak(totalH + 2);
    doc.text(lines, x, y);
    y += totalH + 2;
    return totalH + 2;
  }

  function drawSectionHeading(title: string) {
    checkPageBreak(12);
    y += 4;
    doc.setFillColor(245, 246, 250);
    doc.roundedRect(MARGIN, y - 3, CONTENT_W, 8, 1, 1, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 90, 130);
    doc.text(title.toUpperCase(), MARGIN + 3, y + 2.5);
    y += 9;
  }

  /** Two-column label / value row. */
  function drawFieldRow(label: string, value: string) {
    const LABEL_W = 45;
    const VALUE_X = MARGIN + LABEL_W + 2;
    const VALUE_W = CONTENT_W - LABEL_W - 2;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 110, 140);
    const labelLines = doc.splitTextToSize(label, LABEL_W);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 46);
    const valueLines = doc.splitTextToSize(value, VALUE_W);

    const lineH = 9 * 0.4;
    const rowH = Math.max(labelLines.length, valueLines.length) * lineH + 3;
    checkPageBreak(rowH);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 110, 140);
    doc.text(labelLines, MARGIN, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 30, 46);
    doc.text(valueLines, VALUE_X, y);

    y += rowH;

    // Subtle row divider
    doc.setDrawColor(235, 236, 242);
    doc.setLineWidth(0.2);
    doc.line(MARGIN, y - 1, PAGE_W - MARGIN, y - 1);
  }

  // ------------------------------------------------------------------
  // 1. Header band
  // ------------------------------------------------------------------
  doc.setFillColor(24, 48, 96);
  doc.rect(0, 0, PAGE_W, 28, 'F');

  // Logo-like mark
  doc.setFillColor(255, 255, 255, 0.15);
  doc.setFillColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('ComplianceOS', MARGIN, 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160, 185, 230);
  doc.text('AML Sanctions Screening Report', MARGIN, 18);

  // Status pill (top-right)
  doc.setFillColor(34, 197, 94);
  doc.roundedRect(PAGE_W - MARGIN - 28, 8, 28, 10, 2, 2, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('MATCH FOUND', PAGE_W - MARGIN - 27, 14.5);

  y = 36;

  // ------------------------------------------------------------------
  // 2. Search summary
  // ------------------------------------------------------------------
  drawSectionHeading('Search Summary');
  drawFieldRow('Search Query', `"${data.query}"`);
  drawFieldRow('Generated', data.generatedAt);
  drawFieldRow('Source List', data.sourceList);

  // ------------------------------------------------------------------
  // 3. Matched entity summary
  // ------------------------------------------------------------------
  drawSectionHeading('Matched Entity');

  // Name — larger
  checkPageBreak(14);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(24, 48, 96);
  const nameLines = doc.splitTextToSize(data.name, CONTENT_W);
  doc.text(nameLines, MARGIN, y);
  y += nameLines.length * 6 + 3;

  // Score + match type pills (drawn manually)
  checkPageBreak(10);
  const scoreColor: [number, number, number] =
    data.matchScore >= 80 ? [99, 102, 241] :
    data.matchScore >= 60 ? [59, 130, 246] :
    data.matchScore >= 40 ? [245, 158, 11] : [148, 163, 184];

  doc.setFillColor(...scoreColor);
  doc.roundedRect(MARGIN, y - 4, 36, 7, 1.5, 1.5, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`${data.matchScore}% Match`, MARGIN + 2, y + 0.5);

  doc.setFillColor(80, 90, 130);
  doc.roundedRect(MARGIN + 39, y - 4, 28, 7, 1.5, 1.5, 'F');
  doc.text(data.matchType, MARGIN + 41, y + 0.5);

  if (data.entityType) {
    doc.setFillColor(148, 163, 184);
    doc.roundedRect(MARGIN + 70, y - 4, 28, 7, 1.5, 1.5, 'F');
    doc.text(data.entityType, MARGIN + 72, y + 0.5);
  }
  y += 10;

  // ------------------------------------------------------------------
  // 4. Screening details
  // ------------------------------------------------------------------
  drawSectionHeading('Screening Details');
  drawFieldRow('Match Status', `${data.matchType} (${data.matchScore}%)`);
  if (data.entityType) drawFieldRow('Entity Type', data.entityType);
  if (data.nationality) drawFieldRow('Nationality', data.nationality);
  if (data.dateOfBirth) drawFieldRow('Date of Birth', data.dateOfBirth);
  if (data.placeOfBirth) drawFieldRow('Place of Birth', data.placeOfBirth);
  if (data.program) drawFieldRow('Programme / Category', data.program);

  // ------------------------------------------------------------------
  // 5. Additional details
  // ------------------------------------------------------------------

  // Aliases
  if (data.aliases.length > 0) {
    drawSectionHeading('Also Known As (Aliases)');
    const aliasText = data.aliases.join('  •  ');
    drawWrappedText(aliasText, MARGIN, 9, 'normal', [30, 30, 46]);
    y += 2;
  }

  // Identifiers
  if (data.identifiers.length > 0) {
    drawSectionHeading('Recorded Identifiers');
    for (const id of data.identifiers) {
      const display = id.note ? `${id.value}  (${id.note})` : id.value;
      drawFieldRow(id.type, display);
    }
  }

  // Remarks
  if (data.remarks) {
    drawSectionHeading('Remarks & Context');
    checkPageBreak(20);
    // Light blue background box
    const remarkLines = doc.splitTextToSize(data.remarks, CONTENT_W - 8);
    const remarkH = remarkLines.length * (9 * 0.4) + 8;
    checkPageBreak(remarkH);
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(MARGIN, y - 2, CONTENT_W, remarkH, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 58, 138);
    doc.text(remarkLines, MARGIN + 4, y + 3);
    y += remarkH + 4;
  }

  // ------------------------------------------------------------------
  // 6. Disclaimer
  // ------------------------------------------------------------------
  checkPageBreak(40);
  y += 4;
  drawHRule([200, 210, 230]);

  doc.setFillColor(255, 251, 235);
  doc.roundedRect(MARGIN, y, CONTENT_W, 28, 2, 2, 'F');
  doc.setDrawColor(251, 191, 36);
  doc.setLineWidth(0.5);
  doc.roundedRect(MARGIN, y, CONTENT_W, 28, 2, 2, 'S');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(146, 64, 14);
  doc.text('⚠  DISCLAIMER', MARGIN + 4, y + 6);

  const disclaimerText =
    'This report is generated for preliminary compliance screening purposes only and does not constitute a ' +
    'definitive legal determination. Results should be independently verified against the official source lists ' +
    'before any adverse action is taken. ComplianceOS is a prototype tool; organisations must apply their own ' +
    'due-diligence procedures in accordance with applicable AML/CFT regulations.';

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 60, 20);
  const disclaimerLines = doc.splitTextToSize(disclaimerText, CONTENT_W - 8);
  doc.text(disclaimerLines, MARGIN + 4, y + 12);
  y += 32;

  // ------------------------------------------------------------------
  // Footer on every page
  // ------------------------------------------------------------------
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(160, 170, 190);
    doc.text(
      `ComplianceOS · Sanctions Screening Report · Page ${p} of ${pageCount}`,
      MARGIN,
      PAGE_H - 8,
    );
    doc.text(`Record ID: ${data.recordId}`, PAGE_W - MARGIN, PAGE_H - 8, { align: 'right' });
  }

  // ------------------------------------------------------------------
  // Save
  // ------------------------------------------------------------------
  const safeName = data.name.replace(/[^a-z0-9]/gi, '_').slice(0, 40);
  doc.save(`screening_report_${safeName}.pdf`);
}
