
import { useState, useEffect } from "react";
import Post from "./Post";
import Modal from "./Modal";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaPlus } from "react-icons/fa";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const postsCollectionRef = collection(db, "posts");
      const postsSnap = await getDocs(postsCollectionRef);
      setPosts(postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchPosts();
  }, []);

  return (
    <>
      {modalOpen && <Modal onClose={() => setModalOpen(false)} />}
      <button className="bg-purple-600 text-white py-2 px-4 rounded-lg flex items-center" onClick={() => setModalOpen(true)}><FaPlus className="mr-2" /> Enroll Your Dance School</button>
      <ul>{posts.map(post => <Post key={post.id} {...post} />)}</ul>
    </>
  );
}