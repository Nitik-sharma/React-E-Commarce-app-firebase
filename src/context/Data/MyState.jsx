import React, { useEffect, useState } from "react";
import MyContext from "./Context";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { fireDB } from "../../firebase/FirebaseConfig";
function MyState({ children }) {
  const [mode, setmode] = useState("light");
  const toggleBtn = () => {
    if (mode === "light") {
      setmode("dark");
      document.body.style.backgroundColor = "rgb(17, 24, 39)";
      document.body.style.color = "#fff";
    } else {
      setmode("light");
      document.body.style.backgroundColor = "white";
      document.body.style.color = "#000";
    }
  };
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState({
    title: null,
    price: null,
    imageurl: null,
    category: null,
    discription: null,
    time: Timestamp.now(),
    date: new Date().toLocaleString("en-us", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  });
  const addproduct = async () => {
    if (
      products.title == null ||
      products.price == null ||
      products.imageurl == null ||
      products.category == null ||
      products.discription == null
    ) {
      return toast.error("All fields are required");
    }
    setLoading(true);
    try {
      const productRef = collection(fireDB, "products");
      await addDoc(productRef, products);
      getProduct();
      toast.success("Product add Sucessfully");
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 800);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [product, setProduct] = useState([]);
  const getProduct = async () => {
    try {
      const q = query(collection(fireDB, "products"), orderBy("time"));
      const data = onSnapshot(q, (querySnap) => {
        let productArray = [];
        querySnap.forEach((doc) => {
          productArray.push({ ...doc.data(), id: doc.id });
        });
        setProduct(productArray);
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  // for editable
  const ediatble = (item) => {
    setProducts(item);
  };

  // for upadate products -------------

  const updateproduct = async (item) => {
    setLoading(true);
    try {
      await setDoc(doc(fireDB, "products", products.id), products);
      toast.success("Update product sucessfully");
      getProduct();
      setLoading(false);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 800);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
    setProducts("");
  };

  // for delete porduct-----------
  const deleteProduct = async (item) => {
    setLoading(true);
    try {
      await deleteDoc(doc(fireDB, "products", item.id));
      toast.success("Delete product sucessfully");
      setLoading(false);
      getProduct();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // get Product in order

  const [order, setOrder] = useState([]);

  const getOrderData = async () => {
    setLoading(true);
    try {
      const result = await getDocs(collection(fireDB, "order"));
      const ordersArray = [];
      result.forEach((doc) => {
        ordersArray.push(doc.data());
        setLoading(false);
      });
      setOrder(ordersArray);
      console.log(ordersArray);
      setLoading(false);
    } catch (error) {
      console.log(error.massgae);
      setLoading(false);
    }
  };

  const [users, setUsers] = useState([]);
  const getUser = async () => {
    setLoading(true);
    try {
      const userData = await getDocs(collection(fireDB, "users"));
      const userArray = [];
      userData.forEach((doc) => {
        userArray.push(doc.data());
        setLoading(false);
      });
      setUsers(userArray);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
    getOrderData();
    getUser();
  }, []);
  const [searchkey, setSearchkey] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterPrice, setFilterPrice] = useState("");

  return (
    <MyContext.Provider
      value={{
        mode,
        toggleBtn,
        loading,
        setLoading,
        products,
        setProducts,
        addproduct,
        product,
        ediatble,
        deleteProduct,
        updateproduct,
        order,
        users,
        searchkey,
        setSearchkey,
        filterType,
        setFilterType,
        filterPrice,
        setFilterPrice,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export default MyState;
