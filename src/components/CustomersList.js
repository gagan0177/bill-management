import React from "react";
import { useSelector } from "react-redux";
import "../styles/customersList.css"; // Import styles

const CustomersList = () => {
  const customers = useSelector((state) => state.customers.customers); // Get customers from Redux

  return (
    <div className="customer-list-container">
      <h2 className=" text-center py-5  relative z-10 font-bold text-transparent text-4xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-800 bg-clip-text">
        Customers List
      </h2>

      {customers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div className="table-responsive">
          <table className="customer-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Client Name</th>
                <th>Product Quantity</th>
                <th>Billing Date</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Billing Price</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => {
                // Calculate total quantity and total price
                const totalQuantity = customer.products.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );
                const totalPrice = customer.products.reduce(
                  (sum, item) => sum + item.total,
                  0
                );

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{customer.clientName}</td>
                    <td>{totalQuantity}</td> {/* Fix for Product Quantity */}
                    <td>{customer.billingDate}</td>
                    <td>{customer.contactDetails}</td>
                    <td>{customer.address}</td>
                    <td>₹{totalPrice.toFixed(2)}</td>{" "}
                    {/* Fix for Billing Price */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomersList;
