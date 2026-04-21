import { generateInvoice } from "../services/invoice.service";

const handleDownload = async (payment: any) => {
  const pdfBytes = await generateInvoice(payment);

  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `invoice-${payment.id}.pdf`;
  a.click();
};