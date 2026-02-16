require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken") 
const axios = require("axios")

const JWT_SECRET = process.env.JWT_SECRET;

function generateToken(user) {
  const data = {
    user: {
      id: user.id,
      email: user.email,
    },
  };

  return jwt.sign(data, JWT_SECRET);
}



const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",                  
    "https://ecommerrcee.netlify.app/" 
  ],
  credentials: true
}));


const uploadDir = path.join(__dirname, "upload", "images");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage });


app.use("/images", express.static(uploadDir));


app.get("/", (req, res) => {
  res.send("Minimal upload server running");
});


app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: 0,
      message: "No file sent. Field name must be 'product'.",
    });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;

  return res.json({
    success: 1,
    image_url: imageUrl,
  });
});

// API to add products

app.post("/api/product", upload.single("product"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { name, new_price, old_price, category } = req.body;

    if (!name || !new_price) {
      return res
        .status(400)
        .json({ success: 0, message: "Name and new_price are required" });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`;
    }

    const [result] = await pool.query(
      "INSERT INTO products (name, new_price, old_price, category, image_url) VALUES (?, ?, ?, ?, ?)",
      [name, new_price, old_price || null, category || "", imageUrl]
    );

    res.status(201).json({
      success: 1,
      message: "Product added",
      product: {
        id: result.insertId,
        name,
        new_price,
        old_price,
        category,
        image_url: imageUrl,
      },
    });
  } catch (err) {
    console.error("DB insert error:", err);
    res.status(500).json({ success: 0, message: "Database error" });
  }
});

// creating api for remove products

app.delete("/api/product/:id", async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ success: 0, message: "Invalid product id" });
  }
  try {
      const [rows] = await pool.query(
      "SELECT image_url FROM products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: 0, message: "Product not found" });
    }

    const imageUrl = rows[0].image_url;

    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: 0, message: "Product not found or already deleted" });
    }

   
    if (imageUrl) {
      try {
        
        const fileName = imageUrl.split("/").pop(); 
        const filePath = path.join(uploadDir, fileName);

        fs.unlink(filePath, (err) => {
          if (err) {
            console.warn("Failed to delete image file:", err.message);
          } else {
            console.log("Deleted image file:", filePath);
          }
        });
      } catch (err) {
        console.warn("Error while handling image delete:", err.message);
      }
    }

    return res.json({
      success: 1,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("DB delete error:", err);
    return res.status(500).json({ success: 0, message: "Database error" });
  }
});

// GET ALL PRODUCTS

app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY id DESC");

    return res.json({
      success: 1,
      products: rows,
    });
  } catch (err) {
    console.error("DB fetch error:", err);
    return res.status(500).json({
      success: 0,
      message: "Database error",
    });
  }
});

// Creating endpoint for the registering the user

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: 0, message: "Name, email and password are required" });
    }

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res
        .status(409)
        .json({ success: 0, message: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, password_hash]
    );

    const user = { id: result.insertId, name, email };

    const token = generateToken(user); 

    return res.status(201).json({
      success: 1,
      message: "User registered",
      user,
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({
      success: 0,
      message: "Server error",
    });
  }
});



// Creating endpoint for user Login

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: 0, message: "Email and password are required" });
    }

    const [rows] = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ success: 0, message: "Invalid email or password" });
    }

    const user = rows[0];

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res
        .status(401)
        .json({ success: 0, message: "Invalid email or password" });
    }

    const token = generateToken(user);  

    res.json({
      success: 1,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: 0, message: "Server error" });
  }
});



// Creating endpoint for newCollection data

app.get("/api/newcollections", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;

    const [rows] = await pool.query(
      "SELECT * FROM products ORDER BY id DESC LIMIT ?",
      [limit]
    );

    return res.json({
      success: 1,
      products: rows,
    });
  } catch (err) {
    console.error("New collection fetch error:", err);
    return res.status(500).json({
      success: 0,
      message: "Database error",
    });
  }
});

// Creating endpoint for Popular in Womwns

app.get("/api/popularinwomen",async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;

    const [rows] = await pool.query(
      "SELECT * FROM products WHERE category = 'women' ORDER BY id DESC LIMIT ?",
      [limit]
    )

    return res.json({
      success: 1,
      products: rows,

    })
  } catch (error) {
    console.error("Popular in women fetch error:",error)
    return res.status(500).json({
      success: 0,
      message: "Database error",
    })
  }
})

// creating midddleware to fetch user

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  console.log("Received token:", token);

  if (!token) {
    return res
      .status(401)
      .send({ success: 0, errors: "Please authenticate using valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", data); 
    req.user = data.user;
    next();
  } catch (error) {
    console.error("Token verify error:", error);
    return res
      .status(401)
      .send({ success: 0, errors: "Please authenticate using a valid token" });
  }
};




// creating endpoint for adding products to the cart

app.post("/api/addtocart", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;        
    const { product_id, quantity } = req.body;

    console.log("Add to cart body:", req.body, "User:", req.user);

    if (!product_id || !quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ success: 0, message: "product_id and positive quantity required" });
    }

    const [existing] = await pool.query(
      "SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?",
      [userId, product_id]
    );

    if (existing.length > 0) {
      const newQty = existing[0].quantity + Number(quantity);

      await pool.query(
        "UPDATE cart_items SET quantity = ? WHERE id = ?",
        [newQty, existing[0].id]
      );
    } else {
      await pool.query(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [userId, product_id, quantity]
      );
    }

    return res.json({ success: 1, message: "Cart updated in DB" });
  } catch (err) {
    console.error("Add to cart error:", err);
    return res
      .status(500)
      .json({ success: 0, message: "Server error while adding to cart" });
  }
});


//  creating endpoint to remove item from cart data

app.post("/api/removefromcart", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;     
    const { product_id } = req.body;

    if (!product_id) {
      return res
        .status(400)
        .json({ success: 0, message: "product_id is required" });
    }

    const [rows] = await pool.query(
      "SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?",
      [userId, product_id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: 0, message: "Item not found in cart" });
    }

    const item = rows[0];

    if (item.quantity > 1) {
   
      const newQty = item.quantity - 1;

      await pool.query(
        "UPDATE cart_items SET quantity = ? WHERE id = ?",
        [newQty, item.id]
      );

      return res.json({
        success: 1,
        message: "Cart item quantity decreased",
        quantity: newQty,
      });
    } else {
    
      await pool.query("DELETE FROM cart_items WHERE id = ?", [item.id]);

      return res.json({
        success: 1,
        message: "Item removed from cart",
        quantity: 0,
      });
    }
  } catch (err) {
    console.error("Remove from cart error:", err);
    return res
      .status(500)
      .json({ success: 0, message: "Server error while removing from cart" });
  }
});

// Creating end point for getting Cart data


app.get("/api/getcart", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;


    const [rows] = await pool.query(
      `SELECT 
         c.id            AS cart_item_id,
         c.product_id    AS product_id,
         c.quantity      AS quantity,
         p.name          AS name,
         p.new_price     AS new_price,
         p.old_price     AS old_price,
         p.category      AS category,
         p.image_url     AS image_url
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    return res.json({
      success: 1,
      items: rows,
    });
  } catch (err) {
    console.error("Fetch cart error:", err);
    return res
      .status(500)
      .json({ success: 0, message: "Database error while fetching cart" });
  }
});

// Get all users 

app.get("/api/users", fetchUser, async (req, res) => {
  try {

    const [rows] = await pool.query(
      "SELECT id, name, email FROM users ORDER BY id DESC"
    );

    return res.json({
      success: 1,
      users: rows,
    });
  } catch (err) {
    console.error("Users fetch error:", err);
    return res
      .status(500)
      .json({ success: 0, message: "Database error while fetching users" });
  }
});


// Route for Chatbot

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body

    if(! message){
      return res.status(400).json({
        success: 0,
        message: "Message is required"
      }) 
    }

    const aiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{
          role: "system",
          content:  "You are an AI assistant for an e-commerce site called GKA Shoppyy. Answer briefly and help with products and orders.",
        },
        {role: "user",
          content: message,
        }
      ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

    const botReply = aiResponse.data.choices[0].message.content || "Sorry i couldn't understand that."

    return res.json({
      success: 1,
      reply: botReply
    })

  } catch (error) {
    console.error("Chat API error", error.response.data || error)
    return res.status(500).json({
      success: 0,
      message: "Error While contacting AI service"
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
