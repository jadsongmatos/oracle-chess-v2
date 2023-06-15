import Head from "next/head";

import { useState, useEffect } from "react";

import Header from "@/components/header";

export default function ProfileEdit() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [nation, setNation] = useState("");

  useEffect(() => {
    // Get the current user's data from your server and set the state
    // Here you can use fetch or axios to get the data
    // For now, we will use placeholder data
    setUsername("JohnDoe");
    setEmail("john@doe.com");
    setCity("San Francisco");
    setState("CA");
    setNation("USA");
  }, []);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Here, you would make a request to your server to update the user's profile
  };

  return (
    <>
      <Head>
        <title>Perfil - Oracle Chess</title>
      </Head>
      <Header />
      <main>
        <h1>Edit Profile</h1>
        <form onSubmit={handleSubmit} className="row g-3 needs-validation" novalidate>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </label>
          <label>
            City:
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="form-control"
            />
          </label>
          <label>
            State:
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="form-control"
            />
          </label>
          <label>
            Nation:
            <input
              type="text"
              value={nation}
              onChange={(e) => setNation(e.target.value)}
              className="form-control"
            />
          </label>
          <button className="btn btn-primary" type="submit">Update Profile</button>
        </form>
      </main>
    </>
  );
}
