import Link from "next/link";
import Sidebar from "@/components/sidebar";
import Navbar from "react-bootstrap/Navbar";
import { useEffect, useState } from "react";

import { getCookie } from "cookies-next";

export default function Header() {
  const jwt_cookie = getCookie("jwt");
  const [user, set_user] = useState()
  useEffect(() => {

  },[jwt_cookie])

  return (
    <header className="sticky-top">
      <Navbar expand="sm" >
        <div className="container-fluid">
          <Link className="navbar-brand" href="/">
            Oracle Chess
          </Link>
          <Sidebar />
        </div>
      </Navbar>
    </header>
  );
}
