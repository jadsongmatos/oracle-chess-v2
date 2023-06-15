import { useState } from "react";

import Link from "next/link";

import Offcanvas from "react-bootstrap/Offcanvas";
import Navbar from "react-bootstrap/Navbar";

export default function Sidebar() {
  const [show_sidebar, set_show_sidebar] = useState(false);

  return (
    <>
      <Navbar.Toggle aria-controls="offcanvasNavbar-expand-sm" />
      <Navbar.Offcanvas
        id="offcanvasNavbar-expand-sm"
        aria-labelledby="offcanvasNavbarLabel-expand-sm"
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title id="offcanvasNavbarLabel-expand-sm">
            Offcanvas
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="mx-auto">
          <ul className="nav nav-pills mb-auto row">
            <li className="nav-item col-sm-3">
              <Link href="#" className="nav-link active" aria-current="page">
                Home
              </Link>
            </li>
            <li className="col-sm-3">
              <Link href="/profile" className="nav-link">
                Perfil
              </Link>
            </li>
            <li className="col-sm-3">
              <Link href="#" className="nav-link">
                Amigos
              </Link>
            </li>
            <li className="col-sm-3">
              <Link href="#" className="nav-link">
                Loja
              </Link>
            </li>
          </ul>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </>
  );
}
