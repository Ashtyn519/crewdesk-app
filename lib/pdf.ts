"use client"

export interface InvoiceData {
  invoice_number: string
  client_name: string
  issued_date: string
  due_date?: string
  status: string
  amount: number
  notes?: string
  line_items?: Array<{ description: string; qty: number; rate: number }>
}

export async function downloadInvoicePDF(invoice: InvoiceData) {
  const { jsPDF } = await import("jspdf")
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20

  // Background
  doc.setFillColor(4, 8, 15) // #04080F
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), "F")

  // Header bar
  doc.setFillColor(251, 191, 36) // amber-400
  doc.rect(0, 0, pageWidth, 2, "F")

  // Company name
  doc.setTextColor(251, 191, 36)
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.text("CrewDesk", margin, 25)

  // Invoice label
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text("The operating system for freelance teams", margin, 32)

  // Invoice number (right)
  doc.setTextColor(251, 191, 36)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text("INVOICE", pageWidth - margin, 25, { align: "right" })
  doc.setTextColor(200, 200, 200)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(invoice.invoice_number || "INV-0001", pageWidth - margin, 32, { align: "right" })

  // Divider
  doc.setDrawColor(251, 191, 36)
  doc.setLineWidth(0.3)
  doc.line(margin, 40, pageWidth - margin, 40)

  // Bill To
  doc.setTextColor(150, 150, 150)
  doc.setFontSize(8)
  doc.text("BILL TO", margin, 50)
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.text(invoice.client_name || "Client Name", margin, 58)

  // Dates (right side)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text("ISSUE DATE", pageWidth - margin - 40, 50, { align: "left" })
  doc.text("STATUS", pageWidth - margin, 50, { align: "right" })
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  const issuedFmt = invoice.issued_date ? new Date(invoice.issued_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"
  doc.text(issuedFmt, pageWidth - margin - 40, 58)
  const statusColor = invoice.status === "paid" ? [52, 211, 153] : invoice.status === "overdue" ? [239, 68, 68] : [251, 191, 36]
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2])
  doc.setFont("helvetica", "bold")
  doc.text(invoice.status.toUpperCase(), pageWidth - margin, 58, { align: "right" })

  // Line items table header
  let y = 75
  doc.setFillColor(10, 16, 32)
  doc.rect(margin, y - 5, pageWidth - margin * 2, 10, "F")
  doc.setTextColor(150, 150, 150)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.text("DESCRIPTION", margin + 3, y + 1)
  doc.text("QTY", pageWidth - margin - 60, y + 1)
  doc.text("RATE", pageWidth - margin - 35, y + 1)
  doc.text("AMOUNT", pageWidth - margin, y + 1, { align: "right" })

  y += 12
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)

  const items = invoice.line_items && invoice.line_items.length > 0
    ? invoice.line_items
    : [{ description: invoice.client_name ? "Professional Services" : "Services Rendered", qty: 1, rate: invoice.amount }]

  let subtotal = 0
  items.forEach((item, i) => {
    const lineTotal = (item.qty || 1) * (item.rate || 0)
    subtotal += lineTotal
    if (i % 2 === 0) {
      doc.setFillColor(255, 255, 255, 0.02)
      doc.rect(margin, y - 4, pageWidth - margin * 2, 8, "F")
    }
    doc.setFont("helvetica", "normal")
    doc.text(String(item.description || ""), margin + 3, y + 1)
    doc.text(String(item.qty || 1), pageWidth - margin - 60, y + 1)
    doc.text("£" + Number(item.rate || 0).toFixed(2), pageWidth - margin - 35, y + 1)
    doc.text("£" + lineTotal.toFixed(2), pageWidth - margin, y + 1, { align: "right" })
    y += 10
  })

  // Totals
  y += 5
  doc.setDrawColor(30, 40, 60)
  doc.setLineWidth(0.2)
  doc.line(pageWidth - margin - 70, y, pageWidth - margin, y)
  y += 8

  doc.setTextColor(150, 150, 150)
  doc.setFontSize(9)
  doc.text("Subtotal", pageWidth - margin - 45, y)
  doc.setTextColor(255, 255, 255)
  doc.text("£" + subtotal.toFixed(2), pageWidth - margin, y, { align: "right" })

  y += 7
  doc.setTextColor(150, 150, 150)
  doc.text("Tax (0%)", pageWidth - margin - 45, y)
  doc.setTextColor(255, 255, 255)
  doc.text("£0.00", pageWidth - margin, y, { align: "right" })

  y += 5
  doc.setDrawColor(251, 191, 36)
  doc.setLineWidth(0.3)
  doc.line(pageWidth - margin - 70, y, pageWidth - margin, y)
  y += 8

  doc.setTextColor(251, 191, 36)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("TOTAL", pageWidth - margin - 45, y)
  doc.text("£" + (invoice.amount || subtotal).toFixed(2), pageWidth - margin, y, { align: "right" })

  // Notes
  if (invoice.notes) {
    y += 20
    doc.setDrawColor(30, 40, 60)
    doc.setLineWidth(0.2)
    doc.line(margin, y - 5, pageWidth - margin, y - 5)
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.text("NOTES", margin, y)
    y += 6
    doc.setTextColor(200, 200, 200)
    doc.setFontSize(9)
    const lines = doc.splitTextToSize(invoice.notes, pageWidth - margin * 2)
    doc.text(lines, margin, y)
  }

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight()
  doc.setFillColor(251, 191, 36)
  doc.rect(0, pageHeight - 1.5, pageWidth, 1.5, "F")
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(7)
  doc.text("Generated by CrewDesk · crewdeskapp.vercel.app", pageWidth / 2, pageHeight - 6, { align: "center" })

  doc.save((invoice.invoice_number || "invoice") + ".pdf")
}
