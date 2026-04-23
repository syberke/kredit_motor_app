import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export const generateInvoice = async (payment: {
  id: string;
  amount: number;
  installment_number: number;
  paid_at: string | null;
}) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([400, 600]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { height } = page.getSize();

  page.drawText("INVOICE PEMBAYARAN", {
    x: 50,
    y: height - 50,
    size: 18,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`ID: ${payment.id}`, {
    x: 50,
    y: height - 100,
    size: 12,
    font,
  });

  page.drawText(`Cicilan ke: ${payment.installment_number}`, {
    x: 50,
    y: height - 130,
    size: 12,
    font,
  });

  page.drawText(`Jumlah: Rp ${payment.amount}`, {
    x: 50,
    y: height - 160,
    size: 12,
    font,
  });

  page.drawText(`Tanggal: ${payment.paid_at}`, {
    x: 50,
    y: height - 190,
    size: 12,
    font,
  });

  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
};