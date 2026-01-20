import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, RefreshCw, Star, ShoppingBag, Zap, Wind, Layers, Plus, Minus, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from "../services/axiosInstance";
import { motion } from 'framer-motion';

function Singleproduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('cyan'); // Mock color state

  const [currentUser, setCurrentUser] = useState(
    () => JSON.parse(localStorage.getItem("currentUser"))
  );
  const [cart, setCart] = useState(currentUser?.cart || []);

  // Mock Gallery Images (using main image for all for now)
  const galleryImages = product ? [product.image, product.image, product.image, product.image] : [];

  const updateUserData = async (updatedData) => {
    if (!currentUser) return;
    try {
      await axiosInstance.patch(`/users/${currentUser.id}`, updatedData);
    } catch (error) {
      console.error("Error updating user in DB:", error);
    }
  };

  const addToCart = async (product) => {
    if (!currentUser) {
      toast.error("Please login first to add products to cart!");
      navigate("/login");
      return;
    }

    if (product.stoke <= 0) {
      toast.error("This product is out of stock!");
      return;
    }

    const isAlreadyInCart = cart.some(
      (item) => item.id === product.id
    );
    if (isAlreadyInCart) {
      toast.info(`Product already in your cart!`);
      return;
    }

    // Default size to 'Standard' if none selected, or handle however backend expects. 
    // Since user asked to remove size requirement, we just pass null or don't check.
    const updatedCart = [...cart, { ...product, quantity: quantity, size: selectedSize || 'Standard' }];
    setCart(updatedCart);

    const updatedUser = { ...currentUser, cart: updatedCart };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);

    await updateUserData({ cart: updatedCart });

    toast.success(`Added to cart!`);
  };

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        setProduct(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Product not found.</div>;

  return (
    <div className="bg-[#050505] min-h-screen text-gray-200 font-sans selection:bg-cyan-500 selection:text-black pt-40 pb-20">

      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left Column: Product Details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Limited Edition
                </span>
                <span className="flex items-center text-yellow-500 text-sm font-medium gap-1">
                  <Star className="w-4 h-4 fill-yellow-500" /> 4.8 (120 Reviews)
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {product.name}
              </h1>
              <p className="mt-4 text-gray-400 text-lg leading-relaxed max-w-md">
                {product.discription || "Experience the ultimate fusion of style and performance. Engineered for those who dare to lead."}
              </p>
            </div>

            {/* Price section */}
            <div className="flex items-center gap-6">
              <span className="text-4xl font-bold text-white">₹{product.price}</span>
              <span className="text-sm text-green-400 font-semibold bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20">
                20% OFF
              </span>
            </div>

            {/* Selectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-white/10">

              {/* Size Selector (View Only) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                  Available Sizes (UK)
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['7', '8', '9', '10', '11'].map((size) => (
                    <div
                      key={size}
                      className="w-10 h-10 rounded-lg text-sm font-bold flex items-center justify-center border bg-white/5 border-white/10 text-gray-300"
                    >
                      {size}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {/* Quantity */}
              <div className="flex items-center bg-white/5 rounded-xl border border-white/10 px-4 h-14 w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-400 hover:text-white"><Minus className="w-4 h-4" /></button>
                <span className="w-12 text-center font-bold text-white">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-400 hover:text-white"><Plus className="w-4 h-4" /></button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => {
                  if (product.stoke > 0) addToCart(product);
                  else toast.error("Out of stock!");
                }}
                disabled={product.stoke <= 0}
                className={`flex-1 h-14 rounded-xl font-bold uppercase tracking-wide text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${product.stoke <= 0
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/20 hover:shadow-cyan-500/40'
                  }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {product.stoke <= 0 ? "Sold Out" : "Add to Cart"}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              {[
                { icon: Truck, text: "Free Delivery" },
                { icon: RefreshCw, text: "7 Days Return" },
                { icon: ShieldCheck, text: "Secure Payment" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 text-center gap-2 group hover:bg-white/10 transition-colors">
                  <item.icon className="w-6 h-6 text-cyan-500 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-gray-400">{item.text}</span>
                </div>
              ))}
            </div>

          </motion.div>

          {/* Right Column: Image & Gallery */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Main Image Card with 3D Float Effect */}
            <div className="relative z-10 rounded-[3rem] bg-gradient-to-br from-gray-800/50 to-black border border-white/10 p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

              <motion.img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)]"
              />

              {/* Floating Stock Card */}
              <div className="absolute -bottom-6 -left-6 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase">Stock Available</p>
                  <p className="text-sm font-bold text-white">{product.stoke} Items Left</p>
                </div>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex justify-center gap-4 mt-12">
              {galleryImages.map((img, index) => (
                <div key={index} className="w-20 h-20 rounded-xl border border-white/10 bg-white/5 p-2 cursor-pointer hover:border-cyan-500 transition-colors overflow-hidden">
                  <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Highlights Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 border-t border-white/10 pt-16"
        >
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Product Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Wind, title: "Ultra Lightweight", desc: "Engineered with aerospace-grade materials for zero drag." },
              { icon: Layers, title: "Breathable Mesh", desc: "Advanced airflow system keeps you cool under pressure." },
              { icon: Zap, title: "Energy Return", desc: "Responsive cushioning adds spring to every step." }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-cyan-500/30 transition-all hover:bg-zinc-900 group">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-black transition-colors text-cyan-500">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}

export default Singleproduct;
