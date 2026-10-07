const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const products = [
  {id:1,name_bn:'টমেটো',price:60,unit:'কেজি',category:'ফল জাতীয়',emoji:'🍅',stock:100},
  {id:2,name_bn:'আলু',price:50,unit:'কেজি',category:'মূল জাতীয়',emoji:'🥔',stock:150},
  {id:3,name_bn:'পেঁয়াজ',price:80,unit:'কেজি',category:'মূল জাতীয়',emoji:'🧅',stock:80},
  {id:4,name_bn:'গাজর',price:70,unit:'কেজি',category:'মূল জাতীয়',emoji:'🥕',stock:90},
  {id:5,name_bn:'শসা',price:60,unit:'কেজি',category:'অন্যান্য',emoji:'🥒',stock:70},
  {id:6,name_bn:'পালং শাক',price:40,unit:'আঁটি',category:'শাকসবজি',emoji:'🥬',stock:120}
];

let orders = [];

app.get('/api/health', (_, res) => res.json({ok:true, app:'তরি তরকারি বেচা কেনা করুন'}));
app.get('/api/products', (_, res) => res.json(products));
app.get('/api/categories', (_, res) => res.json(['সব','শাকসবজি','মূল জাতীয়','ফল জাতীয়','অন্যান্য']));

app.post('/api/orders', (req,res) => {
  const {customer, items, paymentMethod='cod'} = req.body;
  if (!customer || !customer.name || !customer.phone || !customer.address || !Array.isArray(items) || !items.length)
    return res.status(400).json({error:'Required order information is missing'});
  const subtotal = items.reduce((sum, item) => {
    const p = products.find(x => x.id === item.productId);
    return sum + (p ? p.price * Number(item.quantity) : 0);
  }, 0);
  const order = {
    id: 'TT-' + String(100001 + orders.length),
    customer, items, paymentMethod, subtotal,
    deliveryFee: subtotal >= 500 ? 0 : 40,
    total: subtotal + (subtotal >= 500 ? 0 : 40),
    status: 'pending'
  };
  orders.push(order);
  res.status(201).json(order);
});

app.get('/api/orders', (_, res) => res.json(orders));

const PORT = process.env.PORT || 4000;
app.listen(PORT,'0.0.0.0', () => console.log(`API running on http://localhost:${PORT}`));
