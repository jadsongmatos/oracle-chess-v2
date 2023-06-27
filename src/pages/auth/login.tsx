import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { Form, Button } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";

import Layout from "@/components/layout";

export default function Register() {
  const router = useRouter();
  const [visibility, setVisibility] = useState("password");
  const [modalShow, setModalShow] = useState(false);
  const [loading, set_loading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values: any) => {
    set_loading(true);

    console.log("onSubmit", values);

    try {
      const res = await axios.post("/api/auth/login",values);
      console.log(res);
      router.push("/");
    } catch (error: any) {
      if (error.response.data.code == "P2002") {
        toast.error(
          `Erro ja existe um usario com esse ${error.response.data.target[0]}`
        );
      } else {
        console.log("axios error", error);
      }
    }

    set_loading(false);
  };

  return (
    <Layout>
      <div className="container align-items-center mt-5">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="row g-3 needs-validation"
        >
          <div className="col-12">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`form-control ${
                errors.email ? "is-invalid" : ""
              } rounded-5 shadow`}
              {...register("email", {
                required: true,
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Entered value does not match email format",
                },
              })}
            />
            {errors.email && (
              <div className="invalid-feedback">
                Por favor ensira um email válido!
              </div>
            )}
          </div>
          <div className="col-12">
            <label htmlFor="password">password</label>
            <input
              id="password"
              className={`form-control ${
                errors.password ? "is-invalid" : ""
              } rounded-5 shadow`}
              {...register("password", {
                required: "required",
                minLength: 5,
              })}
              type="password"
            />
            {errors.password && (
              <div className="invalid-feedback">
                Por favor ensira uma senha maior que 5!
              </div>
            )}
          </div>
          <div className="col-12 d-flex text-center my-5">
            {loading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <button
                className="btn btn-primary mx-auto rounded-5 shadow"
                type="submit"
              >
                Entrar
              </button>
            )}
          </div>
        </form>
        <ul className="list-group list-group-flush text-center">
          <li className="list-group-item">
            <Link href="/auth/recover">Esqueceu seu a senha?</Link>
          </li>
          <li className="list-group-item">
            <Link href="/auth/register">Criar uma conta</Link>
          </li>
        </ul>
      </div>
    </Layout>
  );
}
