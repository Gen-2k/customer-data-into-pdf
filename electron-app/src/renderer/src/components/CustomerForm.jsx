import React, { useState, useEffect } from 'react'
import './CustomerForm.css'

const CustomerForm = ({ customerToEdit, onFormSubmit }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (customerToEdit) {
      setName(customerToEdit.name)
      setEmail(customerToEdit.email)
      setPhone(customerToEdit.phone)
      setAddress(customerToEdit.address)
    }
  }, [customerToEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!name) newErrors.name = 'Name is required'
    if (!email) newErrors.email = 'Email is required'
    if (!phone) newErrors.phone = 'Phone number is required'
    if (!address) newErrors.address = 'Address is required'

    if (Object.keys(newErrors).length === 0) {
      const data = {
        id: customerToEdit ? customerToEdit.id : null,
        name,
        email,
        phone,
        address
      }

      const response = await fetch('http://localhost/backend/save_customer.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data)
      })

      const result = await response.json()
      if (result.status === 'success') {
        alert('Data saved successfully!')
        onFormSubmit()
      } else {
        alert('Failed to save data.')
      }
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <div className="form-container">
      <h2>{customerToEdit ? 'Edit Customer' : 'Add New Customer'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={errors.address ? 'error' : ''}
          ></textarea>
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        <button type="submit" className="submit-button">
          {customerToEdit ? 'Update' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default CustomerForm
