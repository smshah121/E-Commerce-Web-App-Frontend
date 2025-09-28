
import { Route, Routes } from 'react-router-dom'


import Signup from './pages/Signup'

import AdminDashboard from './component/admin/AdminDashboard'
import CustomerDashboard from './component/customer/CustomerDashboard'
import MyOrders from './component/customer/MyOrders'
import MyProfile from './component/admin/MyProfile'
import HomePage from './component/customer/HomePage'
import Login from './pages/Login'
import MyCart from './component/customer/AddtoCart'
import AddToCart from './component/customer/AddtoCart'
import ProductDetail from './component/customer/ProductDetail'
import CheckoutPage from './component/customer/CheckOut'
import OrderDetail from './component/customer/OrderDetail'

function App() {
  

  return (
   <Routes>
    <Route path='/' element={<HomePage/>}/>
    <Route path='/login' element={<Login/>}/>
    <Route path='/signup' element={<Signup/>}/>
    <Route path='/admin-dashboard'element={<AdminDashboard/>}/>
    <Route path='customer-dashboard' element={<CustomerDashboard/>}/>
    <Route path='my-orders' element={<MyOrders/>}/>
    <Route path='my-profile' element={<MyProfile/>}/>
    <Route path='my-cart' element={<AddToCart cart={[]} updateQuantity={() => {}} />} />
    <Route path="/product/:productId" element={<ProductDetail/>} />
    <Route path="/checkout" element={<CheckoutPage/>} />
    <Route path="/my-orders/:orderId" element={<OrderDetail/>} />
   </Routes>
  )
}

export default App
