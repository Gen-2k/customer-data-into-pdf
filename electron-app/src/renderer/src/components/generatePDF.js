import jsPDF from 'jspdf'
import 'jspdf-autotable'

const generatePDF = (selectedCustomers) => {
  const doc = new jsPDF()

  // Add a title
  doc.setFontSize(18)
  doc.text('Selected Customer Details', 14, 22)

  // Define the columns for the table
  const columns = [
    { header: 'ID', dataKey: 'id' },
    { header: 'Name', dataKey: 'name' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Phone', dataKey: 'phone' },
    { header: 'Address', dataKey: 'address' }
  ]

  // Define the rows (data) for only selected customers
  const rows = selectedCustomers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address
  }))

  // Add the table to the PDF
  doc.autoTable({
    columns,
    body: rows,
    startY: 30, // Adjusts the starting position of the table
    styles: {
      fontSize: 10,
      cellPadding: 4,
      valign: 'middle',
      halign: 'center' // Alignment of text within each cell
    },
    headStyles: {
      fillColor: [22, 160, 133] // Custom background color for headers
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240] // Custom color for alternate rows
    },
    margin: { top: 20 }
  })

  // Save the PDF
  doc.save('selected_customers.pdf')
}

export default generatePDF
