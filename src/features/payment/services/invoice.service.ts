import { PDFDocument, rgb, StandardFonts, PageSizes, PDFFont } from "pdf-lib";

export const generateInvoice = async (payment: {
  id: string;
  amount: number;
  installment_number: number;
  paid_at: string | null;
}) => {
  const pdfDoc = await PDFDocument.create();
  
  // Menggunakan ukuran standar A4 (595.28 x 841.89)
  const page = pdfDoc.addPage(PageSizes.A4);
  const { width, height } = page.getSize();

  // Embed font
  const fontReg = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique); // Untuk signature

  // Helper untuk format
  const formatRp = (num: number) => num.toLocaleString("id-ID");
  
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  // Helper: Bikin tanggal jatuh tempo (misal 7 hari dari sekarang jika belum lunas)
  const dueDate = payment.paid_at 
    ? formatDate(payment.paid_at) 
    : formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

  // --- PALET WARNA ---
  const cBlack = rgb(0.1, 0.1, 0.1);
  const cGray = rgb(0.3, 0.3, 0.3);
  const cLightGray = rgb(0.92, 0.93, 0.94); // Box "Bayar via"
  const cBeige = rgb(0.98, 0.94, 0.88);     // Highlight "Jatuh tempo"
  const cBorder = rgb(0.7, 0.7, 0.75);
  const cBlueLogo = rgb(0.05, 0.35, 0.65);

  const marginX = 50;
  const rightX = width - marginX;

  // Helper function untuk Text rata kanan
  const drawTextRight = (text: string, yPos: number, font: PDFFont, size: number, color = cBlack) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: rightX - textWidth, y: yPos, font, size, color });
  };

  // ==================== 1. LOGO & HEADER INVOICE ====================
  let currentY = height - 70;

  // Gambar inisial "K" biru seolah-olah logo
  page.drawText("K", { x: marginX, y: currentY, size: 36, font: fontBold, color: cBlueLogo });
  // (Anda bisa ubah ini menjadi `page.drawImage` jika punya file PNG logonya)

  // Judul INVOICE (Kanan)
  drawTextRight("INVOICE", currentY + 10, fontBold, 18, cBlack);
  drawTextRight(`Nomor invoice: ${payment.id.toUpperCase()}`, currentY - 5, fontReg, 10, cGray);
  drawTextRight(`Tanggal invoice: ${formatDate(payment.paid_at || new Date().toISOString())}`, currentY - 20, fontReg, 10, cGray);

  currentY -= 60;

  // ==================== 2. HIGHLIGHT JATUH TEMPO ====================
  const jatuhTempoText = `Jatuh tempo: ${dueDate}`;
  const jtWidth = fontBold.widthOfTextAtSize(jatuhTempoText, 14);
  
  // Background Pill Krem
  page.drawRectangle({
    x: marginX, y: currentY - 5,
    width: jtWidth + 20, height: 24,
    color: cBeige,
  });

  page.drawText(jatuhTempoText, {
    x: marginX + 10, y: currentY + 2,
    size: 14, font: fontBold, color: cBlack,
  });

  currentY -= 40;

  // ==================== 3. DARI, KEPADA, BAYAR VIA ====================
  // Kolom 1: DARI
  page.drawText("Dari:", { x: marginX, y: currentY, size: 10, font: fontBold, color: cBlack });
  
  const addressText = "Kredit Motor Online\nJl. Raya Cikampak Cicadas, RT.1/\nRW.1, Cicadas, Kec. Ciampea, Ka\nbupaten Bogor, Jawa Barat 16620\n+62 895 14557246\nhttps://kredit-motor-app.vercel.app\nberkejaisyurrohman95@gmail.com\nNPWP: 100000000000001";
  page.drawText(addressText, {
    x: marginX, y: currentY - 15,
    size: 9, font: fontReg, color: cGray, lineHeight: 12,
  });

  // Kolom 2: KEPADA
  page.drawText("Kepada:", { x: 230, y: currentY, size: 10, font: fontBold, color: cBlack });
  page.drawText("[Nama pelanggan di sini]", {
    x: 230, y: currentY - 15, size: 9, font: fontReg, color: cGray
  });

  // Kolom 3: BAYAR VIA (Kotak Abu-abu)
  page.drawRectangle({
    x: 390, y: currentY - 60,
    width: 155, height: 75,
    color: cLightGray,
  });
  
  page.drawText("Bayar via:", { x: 405, y: currentY - 5, size: 10, font: fontBold, color: cBlack });
  page.drawText("Link Pembayaran/\nVirtual Account di sini", {
    x: 405, y: currentY - 20, size: 9, font: fontReg, color: cGray, lineHeight: 14
  });

  currentY -= 140;

  // ==================== 4. TOTAL TAGIHAN & ORDER ID ====================
  page.drawText(`Total tagihan: Rp ${formatRp(payment.amount)}`, { x: marginX, y: currentY, size: 14, font: fontBold, color: cBlack });
  page.drawText(`Order ID: ${payment.id.toUpperCase()}`, { x: marginX, y: currentY - 20, size: 10, font: fontBold, color: cBlack });

  currentY -= 60;

  // ==================== 5. TABEL ITEM ====================
  // Header Tabel
  page.drawText("Deskripsi", { x: marginX, y: currentY, size: 10, font: fontBold });
  page.drawText("Jumlah", { x: 260, y: currentY, size: 10, font: fontBold });
  page.drawText("Harga (Rp)", { x: 330, y: currentY, size: 10, font: fontBold });
  page.drawText("Diskon (%)", { x: 410, y: currentY, size: 10, font: fontBold });
  drawTextRight("Total (Rp)", currentY, fontBold, 10);

  // Garis atas tabel
  currentY -= 10;
  page.drawLine({ start: { x: marginX, y: currentY }, end: { x: rightX, y: currentY }, thickness: 1, color: cBorder });

  // Baris Data
  currentY -= 20;
  page.drawText(`Cicilan ke-${payment.installment_number}`, { x: marginX, y: currentY, size: 10, font: fontReg });
  page.drawText("1", { x: 275, y: currentY, size: 10, font: fontReg });
  page.drawText(formatRp(payment.amount), { x: 330, y: currentY, size: 10, font: fontReg });
  page.drawText("-", { x: 435, y: currentY, size: 10, font: fontReg });
  drawTextRight(formatRp(payment.amount), currentY, fontReg, 10);

  // Garis bawah data
  currentY -= 15;
  page.drawLine({ start: { x: marginX, y: currentY }, end: { x: rightX, y: currentY }, thickness: 1, color: cBorder });

  // ==================== 6. SUBTOTAL & GRAND TOTAL ====================
  currentY -= 20;
  page.drawText("Subtotal", { x: 380, y: currentY, size: 10, font: fontBold });
  drawTextRight(formatRp(payment.amount), currentY, fontReg, 10);

  currentY -= 15;
  page.drawLine({ start: { x: marginX, y: currentY }, end: { x: rightX, y: currentY }, thickness: 1, color: cBorder });

  currentY -= 20;
  page.drawText("Total tagihan", { x: 380, y: currentY, size: 10, font: fontBold });
  drawTextRight(formatRp(payment.amount), currentY, fontBold, 10);

  currentY -= 15;
  page.drawLine({ start: { x: marginX, y: currentY }, end: { x: rightX, y: currentY }, thickness: 1, color: cBorder });


  // ==================== 7. TANDA TANGAN (SIGNATURE AREA) ====================
  currentY -= 60;
  page.drawText("Kredit Motor Online,\nFinance Team", {
    x: 350, y: currentY, size: 10, font: fontBold, lineHeight: 14
  });

  // Garis vertikal pembatas tanda tangan
  page.drawLine({
    start: { x: 480, y: currentY + 10 }, end: { x: 480, y: currentY - 30 },
    thickness: 1, color: cBorder
  });

  // Simulasi tulisan coretan tanda tangan
  page.drawText("Finance", {
    x: 495, y: currentY - 15, size: 16, font: fontItalic, color: cBlack
  });

  // ==================== 8. FOOTER / CATATAN ====================
  // Posisi di paling bawah
  let footerY = 120;
  
  page.drawText("Catatan", { x: marginX, y: footerY, size: 9, font: fontBold });
  page.drawText("Harap lakukan pembayaran sebelum jatuh tempo agar pengajuan kredit tetap aktif.\nHubungi customer service jika mengalami kendala pembayaran.", {
    x: 140, y: footerY, size: 9, font: fontReg, color: cGray, lineHeight: 12
  });

  footerY -= 35;
  page.drawText("Syarat &\nketentuan", { x: marginX, y: footerY, size: 9, font: fontBold, lineHeight: 12 });
  page.drawText("Dengan melakukan pembayaran, pelanggan menyetujui bahwa cicilan bersifat mengikat sesuai\nperjanjian kredit.", {
    x: 140, y: footerY, size: 9, font: fontReg, color: cGray, lineHeight: 12
  });

  // ==============================================================
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};