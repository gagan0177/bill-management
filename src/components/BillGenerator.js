import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCustomer } from "../redux/customerSlice";
import SuccessModal from "./SuccessModal";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
const BillGenerator = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();
  const billRef = useRef(); // Reference to the bill for PDF capture

  // Customer details state
  const [customer, setCustomer] = useState({
    clientName: "",
    contactDetails: "",
    address: "",
    billingDate: "",
    products: [{ name: "", quantity: 1, price: 0, total: 0 }],
  });

  // Handle input changes
  const handleCustomerChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  // Handle product input changes
  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...customer.products];

    // Allow empty input for typing flexibility
    updatedProducts[index][name] =
      value === ""
        ? ""
        : name === "quantity" || name === "price"
        ? Number(value)
        : value;

    // Auto-calculate total price only when price & quantity are valid numbers
    const quantity = updatedProducts[index].quantity || 0;
    const price = updatedProducts[index].price || 0;
    updatedProducts[index].total = quantity * price;

    setCustomer({ ...customer, products: updatedProducts });
  };

  // Add new product field
  const addProductField = () => {
    setCustomer({
      ...customer,
      products: [
        ...customer.products,
        { name: "", quantity: 1, price: 0, total: 0 },
      ],
    });
  };

  // Handle bill generation
  const handleGenerateBill = () => {
    if (
      !customer.clientName ||
      !customer.contactDetails ||
      !customer.address ||
      !customer.billingDate
    ) {
      alert("Please fill in all required fields!");
      return;
    }

    dispatch(addCustomer(customer));
    setIsSuccess(true); // Show modal on success
  };
  const closeModal = () => {
    setIsSuccess(false);
    // Reset form after submission
    setCustomer({
      clientName: "",
      contactDetails: "",
      address: "",
      billingDate: "",
      products: [{ name: "", quantity: 1, price: 0, total: 0 }],
    });
  };
  const downloadInvoice = async () => {
    if (!billRef.current) {
      alert("Error: Invoice content not found!");
      return;
    }

    try {
      // Make the invoice visible temporarily
      billRef.current.style.display = "block";
      await new Promise((resolve) => setTimeout(resolve, 500));
      const element = billRef.current;
      console.log("Captured HTML:", element.innerHTML); // Debugging

      const canvas = await html2canvas(element, {
        scale: 2, // Increase resolution
        useCORS: true, // Ensure external assets are loaded
        backgroundColor: "#fff", // Set background color
      });
      // Hide the invoice again
      billRef.current.style.display = "none";

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save("TestInvoice.pdf");
    } catch (error) {
      alert("Failed to generate invoice. Please try again.");
      console.error("Download Error:", error);
    }
    // Small delay to allow rendering
  };
  // Handle product deletion
  const handleDeleteProduct = (index) => {
    if (customer.products.length > 1) {
      const updatedProducts = [...customer.products];
      updatedProducts.splice(index, 1); // Remove the selected product
      setCustomer({ ...customer, products: updatedProducts });
    }
  };
  return (
    <div>
      <h2 className=" text-center py-5 pb-12  relative z-10 font-bold text-transparent text-4xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-800 bg-clip-text">
        Bill Generator
      </h2>

      {/* Customer Details */}
      <div className="grid gap-6 mb-6 xl:grid-cols-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="customerName"
            className="block mb-2 text-base font-medium text-gray-900 "
          >
            Customer Name
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            name="clientName"
            placeholder="Customer Name"
            value={customer.clientName}
            onChange={handleCustomerChange}
          />
        </div>
        <div>
          <label
            htmlFor="customermobilenumber"
            className="block mb-2 text-base font-medium text-gray-900 "
          >
            Customer Mobile Number
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5   dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            name="contactDetails"
            placeholder="Customer Mobile Number"
            value={customer.contactDetails}
            onChange={handleCustomerChange}
          />
        </div>
        <div>
          <label
            htmlFor="customeraddress"
            className="block mb-2 text-base font-medium text-gray-900 "
          >
            Customer Address
          </label>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5   dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text"
            name="address"
            placeholder="Customer Address"
            value={customer.address}
            onChange={handleCustomerChange}
          />
        </div>
        <div>
          <label
            htmlFor="billdate"
            className="block mb-2 text-base font-medium text-gray-900 "
          >
            Billing Date
          </label>
          <input
            className="block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm"
            type="date"
            name="billingDate"
            value={customer.billingDate}
            onChange={handleCustomerChange}
          />
        </div>
      </div>

      {/* Product Fields */}
      {/* <h3>Products</h3> */}
      {customer.products.map((product, index) => (
        <div
          key={index}
          className="grid gap-6 mb-6 xl:grid-cols-4 md:grid-cols-2"
          // style={{ display: "flex", gap: "10px", marginBottom: "10px" }}
        >
          <div>
            <label
              htmlFor="pdname"
              className="block mb-2 text-base font-medium text-gray-900 "
            >
              Product Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => handleProductChange(index, e)}
              className="block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="quantity"
              className="block mb-2 text-base font-medium text-gray-900 "
            >
              Product Quantity
            </label>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={product.quantity}
              min="1"
              onChange={(e) => handleProductChange(index, e)}
              className="block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block mb-2 text-base font-medium text-gray-900 "
            >
              Product Price (₹)
            </label>
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={product.price}
              min="0"
              onChange={(e) => handleProductChange(index, e)}
              className="block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="tprice"
              className="block mb-2 text-base font-medium text-gray-900 "
            >
              Total Price (₹)
            </label>
            <input
              type="number"
              name="total"
              placeholder="Total Price"
              value={product.total}
              className="block w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 text-sm"
              readOnly
            />
          </div>
          {/* Show Delete Button only if there are at least 2 rows AND it's NOT the first row */}
          {customer.products.length > 1 && index > 0 && (
            <div className="flex items-end">
              <button
                onClick={() => handleDeleteProduct(index)}
                className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="pt-10">
        <button
          className="border border-gray-300 py-2 w-full"
          onClick={addProductField}
        >
          + Add Field
        </button>
      </div>
      {/* Generate Bill Button */}
      <div className="pt-5">
        <button
          className="border border-blue-300 bg-blue-500 text-white px-6 py-2"
          onClick={handleGenerateBill}
        >
          + Generate Bill
        </button>
      </div>
      {/* Bill Preview Section */}
      <div
        ref={billRef}
        id="invoiceContent"
        className="p-4 bg-white shadow-md rounded-lg mt-4 w-full "
      >
        <h2 className="text-2xl pb-4 text-center font-bold">INVOICE</h2>
        <p>
          <strong>Customer:</strong> {customer.clientName}
        </p>
        <p>
          <strong>Mobile:</strong> {customer.contactDetails}
        </p>
        <p>
          <strong>Address:</strong> {customer.address}
        </p>
        <p>
          <strong>Billing Date:</strong> {customer.billingDate}
        </p>
        {/* Product Table */}
        <table className="w-full mt-4 border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Product</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {customer.products.map((product, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.quantity}</td>
                <td className="border p-2">${product.price}</td>
                <td className="border p-2">${product.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Success Modal */}

      <SuccessModal
        isOpen={isSuccess}
        onClose={closeModal}
        onDownload={downloadInvoice}
      />
    </div>
  );
};

export default BillGenerator;
