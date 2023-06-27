import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Layout from "../../components/layout";

import { Form, Button } from "react-bootstrap";

export default function Recover({ csrfToken }: any) {
  const router = useRouter();
  const { error } = router.query;

  const [initialValues, setInitialValues] = useState({
    email: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onSubmit",
    defaultValues: initialValues,
  });

  const onSubmit = async (values: any, e: any) => {
    e.preventDefault();
    values.csrfToken = csrfToken;
    console.log("Values:::", values);
    try {
      const response = await axios.post("/api/v1/auth/recover", values);
      console.log("response", response);
    } catch (err: any) {
      if (err.response.status == 404) {
        alert(err.response.data.msg);
      } else {
        console.log("Error:", err);
      }
      console.log("Error:", err);
    }
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log(">>", value, name, type);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const onError = (error: any) => {
    console.log("ERROR:::", error);
  };

  ///api/auth/callback/credential?test=1808

  return (
    <Layout dark={true}>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Digite o e-mail"
            {...register("email", { required: "O email é obrigatório" })}
          />
          {errors.email && (
            <Form.Text className="text-danger">
              {errors.email.message}
            </Form.Text>
          )}
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        {error == "CredentialsSignin" ? (
          <Form.Text className="text-danger">Email não cadastrado</Form.Text>
        ) : null}
      </Form>
    </Layout>
  );
}
