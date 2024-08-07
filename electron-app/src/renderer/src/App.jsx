import React, { useState } from 'react'
import CustomerForm from './components/CustomerForm'
import CustomerList from './components/CustomerList'

import './assets/main.css'

const App = () => {
  const [customerToEdit, setCustomerToEdit] = useState(null)

  const handleEdit = (customer) => {
    setCustomerToEdit(customer)
  }

  const handleFormSubmit = () => {
    setCustomerToEdit(null)
  }

  return (
    <div className="app-container">
      <CustomerForm customerToEdit={customerToEdit} onFormSubmit={handleFormSubmit} />
      <CustomerList onEdit={handleEdit} />
    </div>
  )
}

export default App
