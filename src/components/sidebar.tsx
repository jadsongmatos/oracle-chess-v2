import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import Offcanvas from "react-bootstrap/Offcanvas";
import Navbar from "react-bootstrap/Navbar";

export default function Sidebar() {
  const router = useRouter();

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
          <ul className="nav nav-pills mb-auto row text-center">
            <li className="col-sm-4">
              <Link
                href="/auth/login"
                className={`nav-link ${
                  router.route == "/auth/login" ? "active" : ""
                }`}
              >
                Login
              </Link>
            </li>
            <li className="col-sm-4">
              <Link
                href="#"
                className={`nav-link ${
                  router.route == "/friend" ? "active" : ""
                }`}
              >
                Amigos
              </Link>
            </li>
            <li className="col-sm-4">
              <Link
                href="#"
                className={`nav-link ${
                  router.route == "/store" ? "active" : ""
                }`}
              >
                Loja
              </Link>
            </li>
          </ul>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </>
  );
}
