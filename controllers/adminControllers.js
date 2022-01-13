const fs = require('fs/promises');

const { uploader } = require('../config/cloudinary');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const priceFormat = require('../utils/priceFormat');
const getPriceNumber = require('../utils/getPriceNumber');
const capitalizeFirstLetterEachWord = require('../utils/capitalizeFirstLetterEachWord');

// Index controller
const get_index = (req, res) => {
  res.render('index', { title: 'Coming Soon', userName: res.locals.user.userName });
};

// Transactions controller
const get_transactions_waiting_for_payment = async (req, res) => {
  try {
    // Find transactions
    const transactionsData = await Transaction.find()
      .sort({ dateAdded: -1 });

    // Render
    res.render('admin/transactions/view_transactions', {
      transactionsData,
      title: 'Transactions',
      userName: res.locals.user.userName,
    });
  } catch (error) {
    res.render('admin/error/view_error', {
      error,
      title: 'Error',
      userName: res.locals.user.userName,
    });
  }
};

// Products controller
const get_all_products = async (req, res) => {
  try {
    // Find transactions
    const productsData = await Product.find()
      .sort({ dateAdded: -1 });

    // Flash alert
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = { message: alertMessage, status: alertStatus };

    // Render
    res.render('admin/products/view_products', {
      productsData,
      alert,
      title: 'Products',
      userName: res.locals.user.userName,
    });
  } catch (error) {
    res.render('admin/error/view_error', {
      error,
      title: 'Error',
      userName: res.locals.user.userName,
    });
  }
};

const get_add_products = (req, res) => {
  // Flash alert
  const alertMessage = req.flash('alertMessage');
  const alertStatus = req.flash('alertStatus');
  const alert = { message: alertMessage, status: alertStatus };

  res.render('admin/add-product/view_add_product', {
    alert,
    title: 'Add Product',
    userName: res.locals.user.userName,
  });
};

const post_add_products = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    // Uploading image to Cloudinary and get the secure url
    const imageUrl = await uploader.upload(req.file.path);
    // Deleting image from server
    await fs.unlink(req.file.path);

    // Add new product to database
    await Product.create({
      name: capitalizeFirstLetterEachWord(name),
      images: imageUrl.secure_url,
      price: priceFormat(price),
      description,
    }).then((response) => {
      // Flash success alert
      req.flash('alertMessage', 'Success Add New Product');
      req.flash('alertStatus', 'success');
      res.redirect('/admin/products');
    });
  } catch (error) {
    // Flash failed alert
    req.flash('alertMessage', 'Failed Add New Product');
    req.flash('alertStatus', 'danger');
    res.redirect('/admin/products/add');
  }
};

const post_delete_products = async (req, res) => {
  try {
    const { id } = req.params;

    // Deleting product
    await Product.findByIdAndDelete(id)
      .then((response) => {
        // Flash success alert
        req.flash('alertMessage', 'Success Deleting Product');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/products');
      });
  } catch (error) {
    // Flash failed alert
    req.flash('alertMessage', 'Failed Deleting Product');
    req.flash('alertStatus', 'danger');
    res.redirect('/admin/products');
  }
};

const get_update_products = async (req, res) => {
  try {
    const { id } = req.params;

    const productData = await Product.findById(id);

    // Flash alert
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = { message: alertMessage, status: alertStatus };

    // Render
    res.render('admin/edit-product/view_edit_product', {
      productData,
      price: getPriceNumber(productData.price),
      alert,
      title: 'Edit Product',
      userName: res.locals.user.userName,
    });
  } catch (error) {
    res.render('admin/error/view_error', {
      error,
      title: 'Error',
      userName: res.locals.user.userName,
    });
  }
};

const put_update_products = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, price, description } = req.body;
    let imageUrl;

    if (req.file) {
      // Uploading image to Cloudinary and get the secure url
      imageUrl = await uploader.upload(req.file.path);
      // Deleting image from server
      await fs.unlink(req.file.path);
    } else {
      imageUrl = undefined;
    }

    await Product.findByIdAndUpdate(
      id,
      {
        name: capitalizeFirstLetterEachWord(name),
        images: imageUrl ? imageUrl.secure_url : undefined,
        price: priceFormat(price),
        description,
      },
      { new: true },
    )
      .then((response) => {
        // Flash success alert
        req.flash('alertMessage', 'Success Updating Product');
        req.flash('alertStatus', 'success');
        res.redirect('/admin/products');
      });
  } catch (error) {
    // Flash failed alert
    req.flash('alertMessage', `Failed Updating Product: ${error}`);
    req.flash('alertStatus', 'danger');
    res.redirect(`/admin/products/edit/${id}`);
  }
};

module.exports = {
  get_index,
  get_transactions_waiting_for_payment,
  get_all_products,
  get_add_products,
  post_add_products,
  post_delete_products,
  get_update_products,
  put_update_products,
};
