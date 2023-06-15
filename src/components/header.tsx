import Link from "next/link";
import Sidebar from "@/components/sidebar";
import Navbar from "react-bootstrap/Navbar";

export default function Header() {
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
