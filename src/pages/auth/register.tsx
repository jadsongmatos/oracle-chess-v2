import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";

import { useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

import Layout from "@/components/layout";
import Select from "@/components/select";

export default function ProfileEdit(props: any) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const [select_counry, set_select_counry] = useState<any>(false);
  const [select_uf, set_select_uf] = useState<any>(false);
  const [select_city, set_select_city] = useState<any>(false);
  const [loading, set_loading] = useState<any>(false);
  const localisacao = useQuery(["localisacao"]);

  const uf_options = useQuery(["uf", select_counry.ISO], async () => {
    if (!select_counry) {
      return false;
    }
    console.log("uf useQuery", select_counry);
    const previousData: any = queryClient.getQueryData([
      "uf",
      select_counry.ISO,
    ]);

    if (previousData) {
      return previousData;
    }

    try {
      const res = await axios(
        `https://www.geonames.org/servlet/geonames?&srv=163&country=${select_counry.ISO}&featureCode=ADM1&lang=en&type=json`
      );
      const data = res.data.geonames.map((e: any) => {
        return { value: Number(e.adminCode1), label: e.name };
      });

      return data;
    } catch (err) {
      console.log("err", err);
      throw new Error("Network response was not ok");
    }
  });

  const city_options = useQuery(["city", select_uf.value], async () => {
    if (!select_uf) {
      return false;
    }

    console.log("city useQuery", select_uf);
    const previousData: any = queryClient.getQueryData([
      "city",
      select_uf.value,
    ]);

    if (previousData) {
      return previousData;
    }

    try {
      const res = await axios(
        `https://www.geonames.org/servlet/geonames?&srv=163&country=${
          select_counry.ISO
        }&adminCode1=${String(select_uf.value).padStart(
          2,
          "0"
        )}&featureCode=ADM2&lang=en&type=json`
      );

      const city = res.data.geonames.map((e: any) => {
        return { value: Number(e.adminCode2), label: e.name };
      });

      return city;
    } catch (err) {
      console.log("err", err);
      throw new Error("Network response was not ok");
    }
  });

  useEffect(() => {
    if (localisacao.data) {
      console.log("localisacao", localisacao.data);
      const tmp: any = localisacao.data;
      set_select_counry({
        value: Number(tmp.counry["ISO-Numeric"]),
        label: tmp.counry.Country,
        ISO: tmp.counry.ISO,
      });
      setValue("counry", {
        value: Number(tmp.counry["ISO-Numeric"]),
        label: tmp.counry.Country,
        ISO: tmp.counry.ISO,
      });
      set_select_uf(tmp.uf);
      setValue("uf", tmp.uf);
      set_select_city(tmp.city);
      setValue("city", tmp.city);
    }
  }, [localisacao.data]);

  const onSubmit = async (data: any) => {
    console.log("onSubmit", data);
    set_loading(true);

    let body = {
      username: data.name,
      email: data.email,
      password: data.password,
      birthday: data.birthday,
      state: data.uf.value,
      city: data.city.value,
      nation: data.counry.ISO,
      latitude: 0,
      longitude: 0,
    };
    if (localisacao.data) {
      const tmp: any = localisacao.data;
      body.latitude = tmp.latitude;
      body.longitude = tmp.longitude;
    }
    try {
      const res = await axios.post("/api/auth/register", body);
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
      <Head>
        <title>Perfil - Oracle Chess</title>
      </Head>

      <main className="mt-5 py-5">
        <section className="container mb-5">
          <h1>Criação de conta</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="g-3 needs-validation"
          >
            <div className="col-sm-6 mx-auto mt-4">
              <label className="form-label" htmlFor="name">
                Nome
              </label>
              <input
                type="text"
                id="name"
                className={`form-control ${
                  errors.username ? "is-invalid" : ""
                } rounded-5 shadow`}
                {...register("name", {
                  required: true,
                  minLength: 6,
                })}
              />
              {errors.name && (
                <div className="invalid-feedback">
                  Por favor ensira um nome válido!
                </div>
              )}
            </div>
            <div className="col-sm-6 mx-auto mt-4">
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
            <div className="col-sm-6 mx-auto mt-4">
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
            <div className="row mt-4">
              <div className="col-sm-6">
                <label>Selecione seu pais</label>
                <Controller
                  name="counry"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={props.countries}
                      onChange={(e: any) => {
                        set_select_counry(e);
                        set_select_uf(false);
                        set_select_city(false);

                        field.onChange(e); // make sure to keep this to update form state
                      }}
                      value={select_counry}
                      instanceId="countries-select"
                      placeholder="Paises"
                      className={errors.counry ? "is-invalid" : ""}
                      styles={{
                        control: (baseStyles: any, state: any) => ({
                          ...baseStyles,
                          borderRadius: "var(--bs-border-radius-xxl)!important",
                          margin: ".5rem!important",
                          border:
                            "var(--bs-border-width) var(--bs-border-style) var(--bs-border-color)!important",
                          boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)!important",
                        }),
                      }}
                    />
                  )}
                />
                {errors.counry && (
                  <div className="invalid-feedback">
                    Por favor escolha pais!
                  </div>
                )}
              </div>
              <div className="col-sm-6">
                <label className="w-100">Selecione seu estado</label>
                {uf_options.status == "loading" ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {uf_options.status == "error" ? (
                      <div>
                        An error has occurred: {JSON.stringify(uf_options)}
                      </div>
                    ) : (
                      <Controller
                        name="uf"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={uf_options.data}
                            onChange={(e: any) => {
                              set_select_uf(e);
                              set_select_city(false);
                              field.onChange(e);
                            }}
                            value={select_uf}
                            instanceId="uf-select"
                            placeholder="Estados"
                            className={errors.uf ? "is-invalid" : ""}
                            styles={{
                              control: (baseStyles: any, state: any) => ({
                                ...baseStyles,
                                borderRadius:
                                  "var(--bs-border-radius-xxl)!important",
                                margin: ".5rem!important",
                                border:
                                  "var(--bs-border-width) var(--bs-border-style) var(--bs-border-color)!important",
                                boxShadow:
                                  "0 .5rem 1rem rgba(0,0,0,.15)!important",
                              }),
                            }}
                          />
                        )}
                      />
                    )}
                  </>
                )}
                {errors.uf && (
                  <div className="invalid-feedback">
                    Por favor escolha estado!
                  </div>
                )}
              </div>
              <div className="col-sm-6">
                <label className="w-100">Selecione sua cidade</label>
                {city_options.status == "loading" ? (
                  <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {city_options.status == "error" ? (
                      <div>
                        An error has occurred: {JSON.stringify(city_options)}
                      </div>
                    ) : (
                      <Controller
                        name="city"
                        control={control}
                        defaultValue=""
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            options={city_options.data}
                            onChange={(e: any) => {
                              set_select_city(e);
                              field.onChange(e);
                            }}
                            value={select_city}
                            instanceId="city-select"
                            placeholder="Cidades"
                            className={errors.city ? "is-invalid" : ""}
                            styles={{
                              control: (baseStyles: any, state: any) => ({
                                ...baseStyles,
                                borderRadius:
                                  "var(--bs-border-radius-xxl)!important",
                                margin: ".5rem!important",
                                border:
                                  "var(--bs-border-width) var(--bs-border-style) var(--bs-border-color)!important",
                                boxShadow:
                                  "0 .5rem 1rem rgba(0,0,0,.15)!important",
                              }),
                            }}
                          />
                        )}
                      />
                    )}
                  </>
                )}
                {errors.city && (
                  <div className="invalid-feedback">
                    Por favor escolha cidade!
                  </div>
                )}
              </div>
              <div className="col-sm-6">
                <label htmlFor="birthday">Data aniversário</label>
                <input
                  type="date"
                  id="birthday"
                  className={`form-control px-2 pt-1 m-2 border ${
                    errors.birthday ? "is-invalid" : ""
                  } rounded-5 shadow`}
                  {...register("birthday", {
                    valueAsDate: true,
                    required: "required",
                  })}
                />
                {errors.birthday && (
                  <div className="invalid-feedback">
                    Por favor ensira uma data de aniversário valida!
                  </div>
                )}
              </div>
            </div>
            <div className="col-12 d-flex text-center  my-5">
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
                  Criar conta
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
        </section>
      </main>
    </Layout>
  );
}

export async function getStaticProps(context: any) {
  const countries_json = require("../../../public/countries.json");
  let countries: Array<any> = countries_json.map((e: any) => {
    return { value: Number(e["ISO-Numeric"]), label: e.Country, ISO: e.ISO };
  });

  countries.sort((a, b) => a.value - b.value);

  return {
    props: {
      countries,
    },
  };
}
