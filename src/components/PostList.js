import { useState, useEffect } from "react";
import styles from "./PostList.module.css";
import Image from "next/image";
import Post from "./post";
import Link from "next/link";

export default function PostList() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  //   const [usersName, setUsersName] = useState("");

  const apiUrl = "http://localhost:5050";

  async function getAllPosts() {
    let response = null;

    try {
      response = await fetch(`${apiUrl}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    } catch (FetchError) {
      setMessage("Could not make a fetch");
      setUsers([]);
      return;
    }

    try {
      if (response.status === 400) {
        const error = await response.text();
        setMessage(error);
        setUsers([]);
        return;
      }
      if (response.status === 404) {
        const error = await response.text();
        setMessage(error);
        setUsers([]);
      }

      if (response.status === 200) {
        const users = await response.json();

        users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setUsers(users);
        setMessage("");
      }
    } catch (FetchError) {
      setMessage("Something went wrong!");
      setUsers([]);
    }
  }

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <>
      <div>
        {message ? <p>{message}</p> : null}
        <ul className={styles.listWrapper}>
          <p>Users to follow</p>
          {users.map((user) =>
            user.posts && user.posts.length > 0 ? (
              <div key={user._id} className={styles.listCard}>
                <div className={styles.header}>
                  <Image
                    src="/../public/images/test-user.png"
                    alt="My Image"
                    width={20}
                    height={20}
                  />
                  <h1>
                    <p>{user.username}</p>
                  </h1>
                  <Link
                    className={styles.profileButton}
                    href={`/profile/${user.username}`}
                  >
                    <button>View profile</button>
                  </Link>
                </div>

                <ul className={styles.post}>
                  <li key={user.posts[0]._id}>
                    <h2> {user.posts[0].content}</h2>
                  </li>
                </ul>
                {/* <Post author={user.username} post={user.posts[0]} /> */}
              </div>
            ) : null
          )}
        </ul>
      </div>
    </>
  );
}
