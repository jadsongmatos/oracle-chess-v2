import Head from "next/head";

import { useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";

import Layout from "@/components/layout";
import Select from "@/components/select";

export default function ProfileEdit(props: any) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [select_counry, set_select_counry] = useState<any>(false);
  const [select_uf, set_select_uf] = useState<any>(false);
  const [select_city, set_select_city] = useState<any>(false);

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

  const onSubmit = (data: any) => console.log(data);

  return (
    <Layout>
      <Head>
        <title>Perfil - Oracle Chess</title>
      </Head>

      <main className="mt-5 py-5">
        <section className="container mb-5">
          <h1>Edit Profile</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="row g-3 needs-validation"
          >
            <div className="col-12">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className={`form-control ${
                  errors.username ? "is-invalid" : ""
                } rounded-5 shadow`}
                {...register("username", {
                  required: true,
                  minLength: 6,
                })}
              />
              {errors.username && (
                <div className="invalid-feedback">
                  Por favor ensira um nome válido!
                </div>
              )}
            </div>
            <div className="col-sm-6">
              <label>Selecione seu pais</label>
              <Controller
                name="countries"
                control={control}
                defaultValue=""
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
                    styles={{
                      control: (baseStyles: any, state: any) => ({
                        ...baseStyles,
                        borderRadius: "var(--bs-border-radius-xxl)!important",
                        margin: ".5rem!important",
                        border: "var(--bs-border-width) var(--bs-border-style) var(--bs-border-color)!important",
                        boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)!important",
                      }),
                    }}
                  />
                )}
              />
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
                          styles={{
                            control: (baseStyles: any, state: any) => ({
                              ...baseStyles,
                              borderRadius:
                                "var(--bs-border-radius-xxl)!important",
                              margin: ".5rem!important",
                              border: "var(--bs-border-width) var(--bs-border-style) var(--bs-border-color)!important",
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
                          styles={{
                            control: (baseStyles: any, state: any) => ({
                              ...baseStyles,
                              borderRadius:
                                "var(--bs-border-radius-xxl)!important",
                              margin: ".5rem!important",
                              border: "var(--bs-border-width) var(--bs-border-style) var(--bs-border-color)!important",
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
            </div>
            <div className="col-sm-6">
              <label>Data aniversário</label>
              <input
                type="date"
                className="form-control rounded-5 shadow px-2 pt-1 m-2 w-100 border"
                {...register("date", {
                  valueAsDate: true,
                })}
              />
            </div>
            <div className="col-12 d-flex text-center">
              <button
                className="btn btn-primary mx-auto rounded-5 shadow"
                type="submit"
              >
                Criar conta
              </button>
              {}
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </form>
        </section>
      </main>
    </Layout>
  );
}

export async function getStaticProps(context: any) {
  const countries_json = require("../../public/countries.json");
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
