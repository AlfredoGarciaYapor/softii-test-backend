import PDFDocument from 'pdfkit';
import { TipSummary } from '../types';
import Shift from '../models/shift.model';
import Tip from '../models/tip.model';
import Payment from '../models/payment.model';

export const generateReceipt = async (shiftId: string): Promise<Buffer> => {
  // 1. Obtener datos completos del turno
  const shift = await Shift.findById(shiftId).lean();
  if (!shift) {
    throw new Error('Turno no encontrado');
  }

  // 2. Obtener todas las propinas del turno con sus pagos
  const tips = await Tip.find({ shift: shiftId }).lean();
  const tipsWithPayments: TipSummary[] = await Promise.all(
    tips.map(async (tip) => {
      const payments = await Payment.find({ tip: tip._id }).lean();
      return {
        tipId: tip._id.toString(),
        totalAmount: tip.amount,
        splitCount: tip.splitCount,
        amountPerPerson: tip.amount / tip.splitCount,
        payments: payments.map(p => ({
          amount: p.amount,
          method: p.method,
          date: p.createdAt
        })),
      };
    })
  );

  // 3. Calcular totales
  const totalTips = tips.reduce((sum, tip) => sum + tip.amount, 0);
  const totalPaid = tipsWithPayments.reduce(
    (sum, tip) => sum + tip.payments.reduce((tipSum, p) => tipSum + p.amount, 0),
    0
  );

  // 4. Generar PDF
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Uint8Array[] = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      resolve(Buffer.concat(buffers));
    });

    // Encabezado
    generateHeader(doc, shift);
    
    // Resumen general
    generateSummary(doc, totalTips, totalPaid, tips.length);
    
    // Detalle por propina
    tipsWithPayments.forEach((tip, index) => {
      generateTipSection(doc, tip, index + 1);
    });

    // Pie de página
    generateFooter(doc);

    doc.end();
  });
};

// Funciones auxiliares para organizar el PDF
function generateHeader(doc: PDFKit.PDFDocument, shift: any) {
  doc
    .fontSize(18)
    .text('Sistema de Gestión de Propinas', { align: 'center' })
    .fontSize(14)
    .text(`Recibo del Turno #${shift._id.toString().slice(-8).toUpperCase()}`, { align: 'center' })
    .moveDown();

  doc
    .fontSize(10)
    .text(`Fecha de inicio: ${shift.startTime.toLocaleString()}`);

  if (shift.endTime) {
    doc.text(`Fecha de cierre: ${shift.endTime.toLocaleString()}`);
  }

  doc.moveDown();
}

function generateSummary(doc: PDFKit.PDFDocument, totalTips: number, totalPaid: number, tipCount: number) {
  doc
    .fontSize(12)
    .text('RESUMEN DEL TURNO', { underline: true })
    .moveDown(0.5);

  doc
    .text(`Total de propinas: $${totalTips.toFixed(2)}`)
    .text(`Total pagado: $${totalPaid.toFixed(2)}`)
    .text(`Número de propinas: ${tipCount}`)
    .moveDown(2);
}

function generateTipSection(doc: PDFKit.PDFDocument, tip: TipSummary, index: number) {
  doc
    .fontSize(12)
    .text(`PROPINA #${index}`, { underline: true })
    .moveDown(0.5);

  doc
    .text(`• Monto total: $${tip.totalAmount.toFixed(2)}`)
    .text(`• Dividido entre: ${tip.splitCount} personas`)
    .text(`• Monto por persona: $${tip.amountPerPerson.toFixed(2)}`)
    .moveDown();

  // Tabla de pagos
  if (tip.payments.length > 0) {
    doc.text('Pagos realizados:');
    const startY = doc.y;
    let currentY = startY;

    // Encabezados de tabla
    doc.font('Helvetica-Bold');
    doc.text('Fecha', 50, currentY);
    doc.text('Método', 200, currentY);
    doc.text('Monto', 400, currentY, { width: 100, align: 'right' });
    doc.font('Helvetica');

    currentY += 20;
    doc.moveTo(50, currentY).lineTo(550, currentY).stroke();
    currentY += 10;

    // Filas de pagos
    tip.payments.forEach(payment => {
      doc.text(payment.date.toLocaleString(), 50, currentY);
      doc.text(payment.method, 200, currentY);
      doc.text(`$${payment.amount.toFixed(2)}`, 400, currentY, { width: 100, align: 'right' });
      currentY += 25;
    });

    doc.y = currentY + 10;
  } else {
    doc.text('No se registraron pagos para esta propina');
  }

  doc.moveDown(2);
}

function generateFooter(doc: PDFKit.PDFDocument) {
  doc
    .moveDown(2)
    .fontSize(10)
    .text('Sistema de Gestión de Propinas - Softii', { align: 'center' })
    .text(`Generado el ${new Date().toLocaleString()}`, { align: 'center' });
}