import React, { useState, useEffect } from 'react'
import './CustomerList.css'
import generatePDF from './generatePDF' // Import the PDF generation function

const CustomerList = ({ onEdit }) => {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCustomers, setSelectedCustomers] = useState([]) // New state for selected customers

  const fetchCustomers = async (page) => {
    try {
      const response = await fetch(`http://localhost/backend/get_customer.php?page=${page}`)
      const data = await response.json()
      setCustomers(data.customers)
      setFilteredCustomers(data.customers)
      setTotalPages(data.total_pages)
      setCurrentPage(data.current_page)
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  useEffect(() => {
    fetchCustomers(currentPage)
  }, [currentPage])

  useEffect(() => {
    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase()
      const results = customers.filter((customer) =>
        customer.name.toLowerCase().includes(lowercasedSearchTerm)
      )
      setFilteredCustomers(results)
    } else {
      setFilteredCustomers(customers)
    }
  }, [searchTerm, customers])

  const handleDelete = async (id) => {
    try {
      const response = await fetch('http://localhost/backend/delete_customer.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({ id })
      })
      const result = await response.json()
      if (result.status === 'success') {
        fetchCustomers(currentPage)
      } else {
        alert('Failed to delete customer.')
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
    }
  }

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers((prevSelected) => {
      if (prevSelected.includes(customerId)) {
        return prevSelected.filter((id) => id !== customerId)
      } else {
        return [...prevSelected, customerId]
      }
    })
  }

  const getSelectedCustomersData = () => {
    return customers.filter((customer) => selectedCustomers.includes(customer.id))
  }

  return (
    <div className="container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="customer-table">
        <thead>
          <tr>
            <th>Select</th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr key={customer.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedCustomers.includes(customer.id)}
                  onChange={() => handleSelectCustomer(customer.id)}
                />
              </td>
              <td>{customer.id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
              <td>
                <button className="edit" onClick={() => onEdit(customer)}>
                  Edit
                </button>
                <button className="delete" onClick={() => handleDelete(customer.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          {' '}
          Page {currentPage} of {totalPages}{' '}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <button
        className="pdf-button"
        onClick={() => generatePDF(getSelectedCustomersData())}
        disabled={selectedCustomers.length === 0} // Disable button if no customers selected
      >
        Download PDF for Selected
      </button>
    </div>
  )
}

export default CustomerList
